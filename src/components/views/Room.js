import RoomListContainer from "components/ui/RoomListContainer";
import "styles/ui/RoomButton.scss"
import {useHistory} from 'react-router-dom';
import React, {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import Room from 'models/Room';

const Rooms = () =>{

    const history = useHistory();

    const [username, setUsername] = useState(null);
    const [uerId, setUserId] = useState(null);
    const [ownerId, setOwnerId] = useState(localStorage.getItem("id"));
    const [gameName, setGameName] = useState("undercover");


    // const roomList = getAllRoom();
    //
    // const num = length(roomList);
    // const room_list = []
    // for (let i=0;i<num; i++){
    //     room_list.push(<div className="room-button-background">
    //         <div className="room-button button">join</div>
    //         <div className="room-button-background-txt">game 222222</div>
    //     </div>)
    // }


    const createRoom = async () =>{
        try{
            // setOwnerId(localStorage.getItem("id"))
            // setGameName("undercover")
            console.log("OwnerId: "+String(ownerId))
            console.log("gameName: "+String(gameName))


            const requestBody = JSON.stringify({ownerId, gameName});
            const response = await api.post('/undercover/rooms', requestBody);

            // store the roomId to the local storage
            const room = new Room(response.data);
            localStorage.setItem("roomId", room.id);

            if (response.data){
                const room = new Room(response.data)
                localStorage.setItem("roomId", room.id)
                localStorage.setItem("roomName", room.name)
                console.log("roomId: "+String(room.id))
                console.log("roomName: "+room.name)
                console.log("roomPlayers: "+room.players)

                history.push('/start')


            }else {
                alert("Error: Creating a room failed");
            }


        }
        catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }

    }

    const joinRoom = async (userId, id) =>{
        try{
            // setOwnerId(localStorage.getItem("id"))
            // setGameName("undercover")
            console.log("OwnerId: "+String(ownerId))
            console.log("gameName: "+String(gameName))

            const formData = new FormData();
            formData.append("userId", userId)

            const config = { headers: { "Content-Type": "multipart/form-data" } };



            const requestBody = JSON.stringify({userId});
            const response = await api.put('/undercover/rooms/'+String(id), formData, config);
            console.log("new room information 11111 ------------------------")
            console.log(response)
            const response_2 = await api.get('/undercover/rooms/');
            console.log("new room information ------------------------")
            console.log(response_2)

            if (response.status==200){
                history.push('/start')
            }else {
                alert("Error: joined a room failed");
            }

        }
        catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    }



    function RoomList() {
        const [roomList, setRoomList] = useState([]);

        useEffect(() => {
            async function fetchRoomList() {
                const response = await api.get('/undercover/rooms');
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







    return(
        <div>
            <h2 className="select title">Undercover</h2>
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