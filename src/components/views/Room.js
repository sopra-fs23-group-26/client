import RoomListContainer from "components/ui/RoomListContainer";
import {RoomButton} from "components/ui/RoomButton";
import {LoginButton} from 'components/ui/LoginButton';
import "styles/ui/RoomButton.scss"

const Room = () =>{
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

export default Room