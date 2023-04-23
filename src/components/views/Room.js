import RoomListContainer from "components/ui/RoomListContainer";
import {RoomButton} from "components/ui/RoomButton";
import {LoginButton} from 'components/ui/LoginButton';
import "styles/ui/RoomButton.scss"
import {useHistory, useParams} from 'react-router-dom';
import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import Room from 'models/Room';

const Rooms = () =>{

    const history = useHistory();

    const [username, setUsername] = useState(null);
    const [ownerId, setOwnerId] = useState(localStorage.getItem("id"));
    const [gameName, setGameName] = useState("undercover");

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

                history.push('/start')


            }else {
                alert("Error: Creating a room failed");
            }


        }
        catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }

    }




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
                <div class="room-button-background">
                    <div class="room-button button">join</div>
                    <div class="room-button-background-txt">game 222222</div>
                </div>
                <div className="room-button-background">
                    <div className="room-button button">join</div>
                    <div className="room-button-background-txt">game 1234</div>
                </div>
                <div className="room-button-background">
                    <div className="room-button button">join</div>
                    <div className="room-button-background-txt">game 1234</div>
                </div>
                <div className="room-button-background">
                    <div className="room-button button">join</div>
                    <div className="room-button-background-txt">game 1234</div>
                </div>
                <div className="room-button-background">
                    <div className="room-button button">join</div>
                    <div className="room-button-background-txt">game 1234</div>
                </div>
                <div className="room-button-background">
                    <div className="room-button button">join</div>
                    <div className="room-button-background-txt">game 1234</div>
                </div>
                <div className="room-button-background">
                    <div className="room-button button">join</div>
                    <div className="room-button-background-txt">game 1234</div>
                </div>
                <div className="room-button-background">
                    <div className="room-button button">join</div>
                    <div className="room-button-background-txt">game 1234</div>
                </div>
                <div className="room-button-background">
                    <div className="room-button button">join</div>
                    <div className="room-button-background-txt">game 1234</div>
                </div>
                <div className="room-button-background">
                    <div className="room-button button">join</div>
                    <div className="room-button-background-txt">game 123412341</div>
                </div>
                <div className="room-button-background">
                    <div className="room-button button">join</div>
                    <div className="room-button-background-txt">game 1234</div>
                </div>



            </RoomListContainer>

        </div>

    );
}

export default Rooms