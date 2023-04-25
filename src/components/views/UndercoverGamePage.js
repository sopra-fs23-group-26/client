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
                type={props.type ? props.type : 'text'}
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
    let [players, setPlayers] = useState(null);
    const [me, setMe] = useState(null);


    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get('/undercover/'+gameId);
                await new Promise(resolve => setTimeout(resolve, 100));
                console.log(response);
                // Get the returned users and update the state.
                const game = new GameUndercover(response.data);
                setGame(game);
                //set the players
                setPlayers(game.users);
                players=game.users;
                console.log(players);
                // See here to get more data.
                const updatedPlayers = {};
                if(players) {
                    for (let i = 0; i <= 8; i++) {
                        if (players[i]&&(players[i].image!=null)) {
                            const imageResponse = await api.get(`/users/${players[i].id}/image`, {responseType: 'arraybuffer'});
                            players[i].profileImage = `data:image/jpeg;base64,${btoa(new Uint8Array(imageResponse.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`;

                        }
                        updatedPlayers[i] = players[i];
                    }
                    setPlayers(updatedPlayers);
                }

            }
            catch (error) {
                console.error(`Something went wrong while fetching the game: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the game! See the console for details.");
            }
            try {
                const id = localStorage.getItem("id");
                const response = await api.get('/users/' + id);

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

    let word, username;
    if (me) {
        word = me.word;
        username = me.username;
    }
    let currentPlayerUsername;
    if (game) {
        currentPlayerUsername = game.currentPlayerUsername;
    }


    const sendMessage = async () => {
        try {
            const id = localStorage.getItem("id")
            const requestBody = JSON.stringify(message);
            const response = await api.put('/undercover/' + gameId + '/users/' + id + '/description', requestBody);
            await new Promise(resolve => setTimeout(resolve, 1000));
            //check if the game status is voting
            setGame(new GameUndercover(response.data));
            if (game.gameStatus === "voting") {
                history.push(`/undercover/${gameId}/voting`);
            }
        } catch (error) {
            console.error(`Something went wrong while updating the description: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while updating the description! See the console for details.");
        }

    }

    const num = 8;
    const styles = [
        {left: "0vw", "top": "0vw",},
        {right: "0vw", "top": "0vw",},
        {left: "0vw", "top": "-1.5vw",},
        {left: "0vw", "top": "-1.5vw",},
        {left: "0vw", "top": "-3vw"},
        {left: "0vw", "top": "-3vw"},
        {left: "0vw", "top": "-4.5vw"},
        {left: "0vw", "top": "-4.5vw"},

    ]
    const elements = [];

    if (players) {
        for (let i = 0; i < 8; i += 2) {
            elements.push(
                <div>
                    <div className="undercovergame display" style={{
                        "left": styles[i].left,
                        "top": styles[i].top,
                        "display": "inline-block",
                    }}>
                        {players[i] && (
                            <img
                                style={{
                                    "width": "5.5vw",
                                    "height": "5.5vw",
                                    "border-radius": "50px",
                                    "position": "absolute",
                                    "top": "49%",
                                    "left": "50%",
                                    "transform": "translate(-50%, -50%)"
                                }}
                                src={players[i].profileImage}
                                alt={" "}
                            />
                        )}
                        <div className="undercovergame chat-bubble-left">
                            <div style={{"font-weight": "bold", "display": "inline-block"}}>
                                {players[i] != null ? players[i].username + " : " : ''}
                            </div>
                            {players[i] != null ? players[i].description : ''}
                        </div>
                    </div>

                    <div className="undercovergame display" style={{
                        "right": styles[i + 1].right,
                        "top": styles[i + 1].top,
                        "display": "inline-block",
                        "float": "right"
                    }}>
                        {players[i + 1] && (
                            <img
                                style={{
                                    "width": "5.5vw",
                                    "height": "5.5vw",
                                    "border-radius": "50px",
                                    "position": "absolute",
                                    "top": "49%",
                                    "left": "50%",
                                    "transform": "translate(-50%, -50%)"
                                }}
                                src={players[i + 1].profileImage}
                                alt={" "}
                            />
                        )}
                        <div className="undercovergame chat-bubble-right">
                            <div style={{"font-weight": "bold", "display": "inline-block"}}>
                                {players[i + 1] != null ? players[i + 1].username + " : " : ''}
                            </div>
                            {players[i + 1] != null ? players[i + 1].username : ''}
                        </div>
                    </div>
                </div>
            );
        }
    }

    return (
        <div className="chat-container">
            {elements}
            <div style={{display: "inline-block", fontWeight: "normal", margin: "-40vw 0 0 5vw", fontSize: "2vw"}}>
                Your Word:
            </div>
            <div style={{
                display: "inline-block",
                fontWeight: "bold",
                margin: "-40vw 0 0 1vw",
                fontSize: "2vw",
                color: "#123597"
            }}>
                {word}
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
                    disabled={currentPlayerUsername !== username}
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