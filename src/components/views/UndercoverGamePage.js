import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory, useParams} from 'react-router-dom';
import 'styles/views/UndercoverGame.scss';
import PropTypes from "prop-types";
import Room from "../../models/Room";
import GameUndercover from "../../models/GameUndercover";

const FormField = props => {
    return (
        <div className="undercovergame field">
            <input
                className="undercovergame input"
                placeholder={props.placeholder}
                value={props.value}
                type={props.type?props.type:'text'}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};


FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    type: PropTypes.string.isRequired
};
const UndercoverGamePage = props => {
  const history = useHistory();
  const {gameId} = useParams();
  const [game, setGame] = useState(null);
  const [message, setMessage] = useState(null);
  const [players, setPlayers] = useState(null);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [player3, setPlayer3] = useState(null);
  const [player4, setPlayer4] = useState(null);
  const [player5, setPlayer5] = useState(null);
  const [player6, setPlayer6] = useState(null);
  const [player7, setPlayer7] = useState(null);
  const [player8, setPlayer8] = useState(null);
  const [me, setMe] = useState(null);


    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get('/undercover/'+gameId);

                // Get the returned users and update the state.
                const game = new GameUndercover(response.data);
                setGame(game);

                //set the players
                setPlayers(game.users);
                const iterator = players.values(); // Get an iterator over the elements
                for (let i = 1; i <= 8; i++) {
                    if (players.has(i)) {
                        const player = new User(iterator.next().value);
                        window["setPlayer" + i](player); // Call the appropriate setPlayer function dynamically
                    }
                }

                // See here to get more data.
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the game: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the game! See the console for details.");
            }

            try {
                const id = localStorage.getItem("id");
                const response = await api.get('/users/'+id);

                // Get the returned users and update the state.
                const me = new User(response.data);

                //set the local player
                setMe(me);

                // See here to get more data.
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the local player: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the local player! See the console for details.");
            }


        }

        fetchData();
    }, [gameId]);


  const sendMessage = async () =>{
        try{
            const id = localStorage.getItem("id")
            const requestBody = JSON.stringify(message);
            const response = await api.put('/undercover/'+ gameId +'/users/'+ id + '/description', requestBody);

            //check if the game status is voting
            setGame(new GameUndercover(response.data));
            if (game.gameStatus === "voting"){
                history.push(`/undercover/${gameId}/voting`);
            }
        }
        catch (error) {
            console.error(`Something went wrong while updating the description: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while updating the description! See the console for details.");
        }

    }

    const num = 8;
    const styles = [
        {left: "0vw", "top": "0vw",},
        {right: "0vw", "top": "0vw",},
        {left: "0vw", "top": "-6vw",},
        {left: "0vw", "top": "-6vw",},
        {left: "0vw", "top": "-12vw"},
        {left: "0vw", "top": "-12vw"},
        {left: "0vw", "top": "-18vw"},
        {left: "0vw", "top": "-18vw"},

    ]
    const elements = [];

    for (let i = 0; i < 8; i += 2) {
        elements.push(
            <div>
                <div className="undercovergame display" style={{
                    "left": styles[i].left,
                    "top": styles[i].top,
                    "display":"inline-block",
                }}>
                    <div className="undercovergame chat-bubble-left">
                        <div style={{"font-weight":"bold","display":"inline-block"}}>
                            {`player${i+1}.username`}:
                        </div>
                        {`player${i+1}.description`}
                    </div>
                </div>

                <div className="undercovergame display" style={{
                    "right": styles[i+1].right,
                    "top": styles[i+1].top,
                    "display":"inline-block",
                    "float": "right"
                }}>
                    <div className="undercovergame chat-bubble-right">
                        <div style={{"font-weight":"bold","display":"inline-block"}}>
                            {`player${i+2}.username`}:
                        </div>
                        {`player${i+2}.description`}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-container">
            {elements}
            <div style={{display: "inline-block",fontWeight: "normal", margin: "-20vw 0 0 5vw", fontSize: "2vw"}}>
                Your Word:
            </div>
            <div style={{display: "inline-block",fontWeight: "bold", margin: "-20vw 0 0 1vw", fontSize: "2vw", color: "#123597"}}>
                {me.word}
            </div>
            <div style={{display: "inline-block"}}>
                <FormField
                    value={message}
                    onChange={un => setMessage(un)}
                    placeholder="type..."
                    type="text"
                />
            </div>
            <div style={{display: "inline-block", marginLeft: "10px"}}>
                <button
                    className="undercovergame button"
                    style={{
                        fontSize: "20px",
                        textTransform: "none",
                        fontWeight: "bold",
                        width: "100px",
                        backgroundColor: "rgb(57, 102, 161)",
                        color: "rgb(255, 255, 255)"
                    }}
                    onClick={() => sendMessage()}
                    disabled={game.currentPlayerUsername !== me.username}
                >
                    Send
                </button>
            </div>
        </div>
    );

};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default UndercoverGamePage;