import "styles/ui/RoomButton.scss"
import "styles/views/Select.scss";
import {useHistory} from 'react-router-dom';
import {api, handleError} from "../../helpers/api";
import GameUndercover from "../../models/GameUndercover";
import React, { useState, useEffect } from 'react';
import { getDomain } from 'helpers/getDomain';
import Room from "../../models/Room";


const Start = (url, config) => {
    const history = useHistory();
    const [gameId, setGameId] = useState(null);
    const [profileImageList, setProfileImageList] = useState([]);
    const [roomName, setRoomName] = useState(null);
    const [generalMessage, setGeneralMessage] = useState(null);
    const [roomRemoved] = useState("roomNotExist");
    const [userName, setUserName] = useState("")// invited user name
    const [playersLen, setPlayersLen] = useState(null)
    const [isClicked, setIsClicked] = useState(false);

    const [text, setText] = useState('');
    useEffect(() => {
        fetch('/undercover.txt')
            .then(response => response.text())
            .then(text => setText(text))
            .catch(error => console.error(error));
    }, []);

    const sendRoomRemovedMessage = async (msg) => {
        if (socket) {
            try{socket.send(msg);}
            catch(error){
                alert(`${error.response.data.message} You cannot send the message.`);
            }
        }
    }

    const sendLeaveRoomMessage = async (msg) => {
        if (socket) {
            try{socket.send(msg);}
            catch(error){
                alert(`${error.response.data.message} You cannot send the message.`);
            }
        }
    }

    const doBack = async() =>{

        if(localStorage.getItem("id")==localStorage.getItem("ownerId")){
            const url = "/undercover/rooms/" + localStorage.getItem("roomId")
            const response = await api.delete(url)
            const msg = "roomNotExist"+localStorage.getItem("roomId")
            await sendRoomRemovedMessage(msg)
            history.push("/room")

        }
        else {

            const url = "/undercover/rooms/" + localStorage.getItem("roomId") + "/" + localStorage.getItem("id")
            const response = await api.delete(url)

            if (response.status == 200) {
                const msg = "APlayerLeft" + localStorage.getItem("roomId")
                await sendLeaveRoomMessage(msg)
                localStorage.removeItem("roomId")
                localStorage.removeItem("ownerId")
                history.push('/room')
            } else {
                alert("Error: joined a room failed");
            }
        }
    }

    const elements = []
    useEffect(() => {
        async function fetchData() {
                const response = await api.get(`/undercover/rooms/`+localStorage.getItem("roomId"))
                setRoomName(response.data.name)//获取房间名称，get room's name
                let images = []
                setPlayersLen(response.data.players.length)
                for(let i = 0; i<response.data.players.length; i++){
                    if (response.data.players[i].image) {
                        let url = "/users/" + response.data.players[i].id + "/image"
                        // await new Promise(resolve => setTimeout(resolve, 200)); // 延迟1秒钟
                        try{ const imageResponse = await api.get(url, {responseType: 'arraybuffer'});
                            images.push(`data:image/jpeg;base64,${btoa(new Uint8Array(imageResponse.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`);
                        } catch (error){
                            images.push(null)
                        }
                                        }
                    else {
                        images.push(null)
                    }
                }
                setProfileImageList(images)
        }

        fetchData();
    }, []);

    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('start'+localStorage.getItem("ownerId"));

    // 创建WebSocket连接
    useEffect(() => {
        const url = "ws"+getDomain().toString().substring(4, getDomain().toString().length)+"/websocket"
        const ws = new WebSocket(url);
        setSocket(ws);

        // 关闭WebSocket连接时清理副作用
        return () => {
            ws.close();
        };
    }, []);

    // 发送消息
    const sendMessage = async () => {

        try{
            const response_room = await api.get("/undercover/rooms/"+localStorage.getItem("roomId"))
            const room = new Room(response_room.data)
            const players = room.players

            if(players.length<3){
                alert("There need to be at least 3 players to start the game")
            }
            else {
                if (socket) {
                    // setMessage('start');

                    // socket.send(message);
                    try {
                        const roomId = localStorage.getItem("roomId")
                        const response = await api.post('/undercover/rooms/' + roomId);

                        // store the gameId to the local storage
                        const game = new GameUndercover(response.data);
                        localStorage.setItem("gameId", game.id);
                        setGameId(game.id);
                        socket.send(message);

                        setIsClicked(true);//点击开始后，设置为true，不能再点击

                        // Login successfully worked --> navigate to the route /undercover/${gameId}
                        history.push(`/undercover/${game.id}`);
                    } catch (error) {
                        alert(`${error.response.data.message} You cannot start the game.`);
                    }
                }
            }
        }
        catch (error){
            alert("please try START again")
        }

    };

    const invite = async () => {
        let invitedId;
        try{
        const response = await api.get("/users/invite/"+userName)
            invitedId = response.data//被邀请人的id
        }
        catch (error) {
            alert(`${error.response.data.message}`);
        }

        try{
            const response_room = await api.get("/undercover/rooms/"+localStorage.getItem("roomId"))
            const room = new Room(response_room.data)
            const players = room.players
            if(players.length>=8){
                alert("The maximum players of a game are 8")
            }
            else {
                if (socket) {
                    try{socket.send("invite,"+localStorage.getItem("roomId").toString()+","+invitedId);}
                    catch(error){
                        alert(`${error.response.data.message} You cannot send the message.`);
                    }
                }
            }
        }
        catch (error){
            alert(`${error.response.data.message}`);
        }
    }

    // 处理消息接收
    useEffect(() => {
        if (socket) {
            socket.onmessage = async (event) => {
                if (event.data.startsWith("start") && event.data.substring(5)==localStorage.getItem("ownerId")) {
                    // Check if gameId exists in localStorage
                    if (gameId) {
                        // If gameId exists, navigate to the route /undercover/${gameId}
                        history.push(`/undercover/${gameId}`);
                    } else {
                        // If gameId doesn't exist, create a new game and store the gameId in localStorage
                        const roomId = localStorage.getItem('roomId');
                        await new Promise(resolve => setTimeout(resolve, 2000));
                        //alert(roomId);
                        api.get(`/undercover/getGameId/${roomId}`).then((response) => {
                            const gameId=response.data;
                            localStorage.setItem('gameId', gameId);
                            history.push(`/undercover/${gameId}`);
                        }).catch((error) => {
                            alert(`${error.response.data.message} You cannot start the game.`);
                        });
                    }
                }

                if (event.data.substring(0, 12) == "roomNotExist" && event.data.substring(12)==localStorage.getItem("roomId")){
                    localStorage.removeItem("roomId")
                    localStorage.removeItem("ownerId")
                    history.push('/room')
                }

                if(event.data.substring(0, 16)=="ANewPlayerJoined"&& event.data.substring(16)==localStorage.getItem("roomId")){
                    window.location.reload();
                }

                if (event.data.substring(0,11)=="APlayerLeft"&& event.data.substring(11)==localStorage.getItem("roomId")){
                    window.location.reload();
                }
            };
        }
    }, [socket, history]);

    return (
        <div className="select">
            <h2 className="select title">Undercover</h2>

            <button className="select button"
                    style={{"top": "9.5em"}}
                    onClick={() => sendMessage()}
                    disabled={localStorage.getItem("id")!=localStorage.getItem("ownerId")||isClicked}

            >Start!
            </button>

            <button className="select button" style={{
                "background-color": "rgb(57, 102, 161)",
                "color": "rgb(214, 222, 235)",
                "top": "9.5em"

            }}
                    onClick={() =>doBack()}
            >Back
            </button>

            <p className="select box" style={{
                "top": "1.5em",
                "left": "50em",
                "height": "24vw"
            }}>  Game rules:<br/><br/>
                1. Only the owner can start the game. The players to start the game are 3 - 8.
                <br/><br/>
                2. The game starts with each player receiving a word, but one player is the "undercover" and has a different word than the other players, who are the "detectives."
                <br/><br/>
                3. At the start of each round, every player describes their word using one sentence without saying the actual word.
                <br/><br/>
                4. After all players have described their word in a round, players must vote for who they think is the undercover, and the player who receives the most votes in this round is voted out.
                <br/><br/>
                5. If the undercover is correctly voted out, the detectives win the game and each get 2 points.
                <br/><br/>
                6. If the undercover is not voted out, the game continues until only two players are left and one of them is the undercover.
                <br/><br/>
                7. If the remaining players include the undercover and one detective, the undercover wins the game and gets 5 points.
            </p>

            <button className="select button" style={{
                "height": "3vw",
                "width": "7vw",
                "font-size": "1.2vw",
                "top": "-13.5em",
                "left": "31.5em",
                "text-transform": "capitalize",
                "background": "rgb(19, 40, 67)",
                "color": "white"
            }}
                    disabled={userName==""}
                    onClick={() => invite()}
            >
                invite
            </button>
            <div><input className="select input"
                        value={userName}
                        placeholder={"player name"}
                        onChange={(event) => setUserName(event.target.value)}
            /></div>

            {/*<div className="select container">*/}
            {/*    /!*{elements}*!/*/}
            {/*    {profileImageList && <img className="select display"  src={profileImageList} alt="Profile"/>}*/}
            {/*    /!*{profileImageList && <img className="select display"  src={profileImageList} alt="Profile"/>}*!/*/}
            {/*</div>*/}

            <div className="select container">
                {profileImageList && profileImageList.map((image, index) => (
                    <img key={index}
                         className={`select display ${image ? "" : "select display"}`}
                         src={image} alt={""} />
                ))}
            </div>

            <div><input className="select input"
                        style={{
                            "top": "-40.5vw",
                            "left": "50vw",
                            "width": "16vw",
                            "height": "3.5vw",
                            "font-size": "2em",
                            "border-color": "rgb(214, 222, 235)",
                            "font-weight": "bold",
                            "color": "rgb(19, 40, 67)",
                            "border-radius": "1.3vw",
                            "caret-color": "transparent",
                            "cursor": "auto",
                        }}

                        value={roomName}
            /></div>

            <button className="select button" style={{
                "height": "3vw",
                "width": "9.5vw",
                "font-size": "1.2vw",
                "top": "-35.8em",
                "left": "56em",
                "text-transform": "capitalize",
                "background": "rgb(19, 40, 67)",
                "color": "white",
                "cursor": "auto"
            }}>
                Room name
            </button>
        </div>
    );
}

export default Start