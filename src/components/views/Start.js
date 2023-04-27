import "styles/ui/RoomButton.scss"
import "styles/views/Select.scss";
import {useHistory} from 'react-router-dom';
import {api, handleError} from "../../helpers/api";
import GameUndercover from "../../models/GameUndercover";
import React, { useState, useEffect } from 'react';
import { getDomain } from 'helpers/getDomain';

const Start = (url, config) => {
    const history = useHistory();
    const [gameId, setGameId] = useState(null);
    const [profileImageList, setProfileImageList] = useState([]);
    const [roomName, setRoomName] = useState(null);
    const [generalMessage, setGeneralMessage] = useState(null);
    const [roomRemoved] = useState("roomNotExist");

/*    const handleStartGame = async () => {
        try {
            const roomId = localStorage.getItem("roomId")
            const response = await api.post('/undercover/rooms/'+ roomId);

            // store the gameId to the local storage
            const game = new GameUndercover(response.data);
            localStorage.setItem("gameId", game.id);

            // Login successfully worked --> navigate to the route /undercover/${gameId}
            history.push(`/undercover/${game.id}`);
        } catch (error) {
            alert(`Something went wrong during start the undercover game: \n${handleError(error)}`);
        }
    };*/

    const [text, setText] = useState('');
    useEffect(() => {
        fetch('/undercover.txt')
            .then(response => response.text())
            .then(text => setText(text))
            .catch(error => console.error(error));
    }, []);





    const sendRoomRemovedMessage = async () => {
        if (socket) {
            try{socket.send(roomRemoved);}
            catch(error){
                alert(`Something went wrong during sending message: \n${handleError(error)}`);
            }
        }
    }






    const doBack = async() =>{



        if(localStorage.getItem("id")==localStorage.getItem("ownerId")){
            console.log("room id")
            console.log(localStorage.getItem("roomId"))
            const url = "/undercover/rooms/" + localStorage.getItem("roomId")
            const response = await api.delete(url)
            await sendRoomRemovedMessage()
            history.push("/room")

        }
        else {
            const url = "/undercover/rooms/" + localStorage.getItem("roomId") + "/" + localStorage.getItem("id")
            const response = await api.delete(url)

            if (response.status == 200) {
                console.log("leave a room")
                localStorage.removeItem("roomId")
                localStorage.removeItem("ownerId")
                history.push('/room')
            } else {
                console.log("leave a room failed")
                alert("Error: joined a room failed");
            }
        }
    }


    const elements = []
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(`/undercover/rooms/`+localStorage.getItem("roomId"))
                setRoomName(response.data.name)//获取房间名称，get room's name
                let images = []
                for(let i = 0; i<response.data.players.length; i++){
                    if (response.data.players[i].image) {
                        let url = "/users/" + response.data.players[i].id + "/image"
                        console.log("image info")
                        const imageResponse = await api.get(url, {responseType: 'arraybuffer'});
                        console.log("imageResponse")
                        console.log(imageResponse)
                        images.push(`data:image/jpeg;base64,${btoa(new Uint8Array(imageResponse.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`);
                    }
                }
                setProfileImageList(images)

            } catch (error) {
                alert("Something went wrong while fetching the user! See the console for details.");
            }
        }

        fetchData();
    }, []);


    console.log("image list")
    console.log(profileImageList)


    // const num = 8;
    // const styles = [
    //     {left: "0vw", "top": "0em"},
    //     {left: "5vw", "top": "0em"},
    //     {left: "10vw", "top": "0em"},
    //     {left: "15vw", "top": "0em"},
    //     {left: "0vw", "top": "2.3em"},
    //     {left: "5vw", "top": "2.3em"},
    //     {left: "10vw", "top": "2.3em"},
    //     {left: "15vw", "top": "2.3em"},
    //
    // ]
    //
    // for (let i = elements.length; i < num; i++) {
    //
    //     elements.push(<div className="select display" style={{
    //         "left": styles[i].left,
    //         "top": styles[i].top
    //     }}></div>)
    // }


    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('start');

    // 创建WebSocket连接
    useEffect(() => {
        const url = "ws"+getDomain().toString().substring(4, getDomain().toString().length)+"/websocket"
        console.log("ws url");
        console.log(url);
        const ws = new WebSocket(url);
        console.log("ws masssss");
        console.log(ws);
        setSocket(ws);

        // 关闭WebSocket连接时清理副作用
        return () => {
            ws.close();
        };
    }, []);

    // 发送消息
    const sendMessage = async () => {
        if (socket) {
            // setMessage('start');
            socket.send(message);
            try {
                const roomId = localStorage.getItem("roomId")
                const response = await api.post('/undercover/rooms/' + roomId);

                // store the gameId to the local storage
                const game = new GameUndercover(response.data);
                localStorage.setItem("gameId", game.id);
                setGameId(game.id);

                // Login successfully worked --> navigate to the route /undercover/${gameId}
                history.push(`/undercover/${game.id}`);
            } catch (error) {
                alert(`Something went wrong during start the undercover game: \n${handleError(error)}`);
            }
        }
    };




    // 处理消息接收
// 处理消息接收
    useEffect(() => {
        if (socket) {
            socket.onmessage = async (event) => {
                console.log('WebSocket message received:', event.data);
                if (event.data === 'start') {
                    // Check if gameId exists in localStorage
                    if (gameId) {
                        // If gameId exists, navigate to the route /undercover/${gameId}
                        history.push(`/undercover/${gameId}`);
                    } else {
                        // If gameId doesn't exist, create a new game and store the gameId in localStorage
                        const roomId = localStorage.getItem('roomId');
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        //alert(roomId);
                        api.post(`/undercover/rooms/${roomId}`).then((response) => {
                            const game = new GameUndercover(response.data);
                            localStorage.setItem('gameId', game.id);
                            history.push(`/undercover/${game.id}`);
                        }).catch((error) => {
                            alert(`Something went wrong during start the undercover game: \n${handleError(error)}`);
                        });
                    }
                }


                if (event.data == "roomNotExist"){
                    console.log("leave a room because the room is not existed")
                    localStorage.removeItem("roomId")
                    localStorage.removeItem("ownerId")
                    history.push('/room')
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
            }}> Game rules:<br/><br/>
                1. The game starts with each player receiving a word, but one player is the "undercover" and has a different word than the other players, who are the "detectives."
                <br/><br/>
                2. At the start of each round, every player describes their word using one sentence without saying the actual word.
                <br/><br/>
                3. After all players have described their word in a round, players must vote for who they think is the undercover, and the player who receives the most votes in this round is voted out.
                <br/><br/>
                4. If the undercover is correctly voted out, the detectives win the game and each get 2 points.
                <br/><br/>
                5. If the undercover is not voted out, the game continues until only two players are left and one of them is the undercover.
                <br/><br/>
                6. If the remaining players include the undercover and one detective, the undercover wins the game and gets 5 points.
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
            }}>
                invite
            </button>
            <div><input className="select input"
            /></div>

            {/*<div className="select container">*/}
            {/*    /!*{elements}*!/*/}
            {/*    {profileImageList && <img className="select display"  src={profileImageList} alt="Profile"/>}*/}
            {/*    /!*{profileImageList && <img className="select display"  src={profileImageList} alt="Profile"/>}*!/*/}
            {/*</div>*/}

            <div className="select container">
                {profileImageList && profileImageList.map((image, index) => (
                    <img key={index} className="select display" src={image} alt={`Profile ${index}`} />
                ))}
            </div>



            <div><input className="select input"
                        style={{
                            "top": "-40.5vw",
                            "left": "50vw",
                            "width": "20vw",
                            "height": "3.5vw",
                            "font-size": "2em",
                            "border-color": "rgb(214, 222, 235)",
                            "font-weight": "bold",
                            "color": "rgb(19, 40, 67)",
                            "border-radius": "1.3vw"
                        }}

                        value={roomName}
            /></div>

            <button className="select button" style={{
                "height": "3vw",
                "width": "6vw",
                "font-size": "1.2vw",
                "top": "-35.8em",
                "left": "59em",
                "text-transform": "capitalize",
                "background": "rgb(19, 40, 67)",
                "color": "white"
            }}>
                do edit
            </button>


        </div>

    );
}

export default Start