import RoomListContainer from "components/ui/RoomListContainer";
import "styles/ui/RoomButton.scss"
import {useHistory} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import Room from 'models/Room';
import {getDomain} from "../../helpers/getDomain";

const Rooms = () =>{

    const history = useHistory();

    const [username, setUsername] = useState(null);
    const [uerId, setUserId] = useState(null);
    const [ownerId, setOwnerId] = useState(localStorage.getItem("id"));
    const [gameName, setGameName] = useState("undercover");
    const [name, setName] = useState("");// room name





    const createRoom = async () =>{
        try{
            // setOwnerId(localStorage.getItem("id"))
            // setGameName("undercover")
            console.log("OwnerId: "+String(ownerId))
            console.log("gameName: "+String(gameName))


            const requestBody = JSON.stringify({ownerId, gameName, name});
            const response = await api.post('/undercover/rooms', requestBody);

            // store the roomId to the local storage
            const room = new Room(response.data);
            // localStorage.setItem("roomId", room.id);

            if (response.data){
                const room = new Room(response.data)
                localStorage.setItem("roomId", room.id)
                localStorage.setItem("ownerId", ownerId)


                console.log("response.data: "+room)
                console.log("roomId: "+String(room.id))
                console.log("roomName: "+room.name)
                console.log("roomPlayers: "+room.players)

                history.push('/start')


            }else {
                alert("Error: Creating a room failed");
            }


        }
        catch (error) {
            alert(`${error.response.data.message} You cannot create the game.`);
        }

    }

    const joinRoom = async (userId, roomId) =>{
        try{
            const response = await api.put(`/undercover/rooms/${roomId}/${userId}`);

            if (response.status==200){
                localStorage.setItem("roomId", roomId)
                localStorage.setItem("ownerId", response.data.ownerId)
                await sendMessage()
                history.push('/start')
            }else {
                alert("Error: joined a room failed");
            }

        }
        catch (error) {
            alert(`${error.response.data.message} You cannot join the game.`);
        }
    }



    function RoomList() {
        const [roomList, setRoomList] = useState([]);

        useEffect(() => {
            async function fetchRoomList() {
                const response = await api.get('/undercover/rooms');
                console.log("room list")
                console.log(response.data)
                setRoomList(response.data);
            }
            fetchRoomList();
        }, []);

        return (
            <div>
                {roomList.map((room) => (
                    <div className="room-button-background" key={room.id}>
                        <div className="room-button button" onClick={()=>joinRoom(localStorage.getItem("id"), room.id)}>join</div>
                        <div className="room-button-background-txt">{room.name}</div>
                    </div>
                ))}
            </div>
        );
    }
    const room_list = RoomList();



    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('ANewPlayerJoined');
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


    const sendMessage = async () => {
        if (socket) {
            // setMessage('start');
            socket.send(message);
        }
    };







    return(
        <div>
            <h2 className="select title">Undercover</h2>


            <div><input className="select input"
                        style={{
                            "top": "19vw",
                            "left": "26.7vw",
                            "width": "16vw",
                            "height": "3.5vw",
                            "font-size": "2em",
                            "border-color": "rgb(214, 222, 235)",
                            "font-weight": "bold",
                            "color": "rgb(19, 40, 67)",
                            "border-radius": "1.3vw"
                        }}

                        value={name}
                        placeholder={"room name"}
                        onChange={(event) => setName(event.target.value)}
            /></div>


            <button className="select button"
                    style={{
                        "font-size": "1.8vw",
                        "text-transform": "none",
                        "font-weight": "bold",
                        "width": "16vw",
                        "left": "14.8em",
                        "top": "12em"

                    }}
                    onClick={() => createRoom()}
                    disabled={name==""}
            >Create a Room</button>
            <button className="select button"
                    style={{
                        "font-size": "1.8vw",
                        "text-transform": "none",
                        "font-weight": "bold",
                        "width": "16vw",
                        "left": "14.8em",
                        "top": "12em",
                        "background-color": "rgb(57, 102, 161)",
                        "color": "rgb(214, 222, 235)",

                    }}
                    onClick={() => history.push('/select')}
            >Back</button>

            <RoomListContainer>
                {room_list}
            </RoomListContainer>

        </div>

    );
}

export default Rooms