import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import { useRef } from 'react';

import User from 'models/User';
import {useHistory, useParams} from 'react-router-dom';
import 'styles/views/UndercoverGame.scss';
import PropTypes from "prop-types";
import Room from "../../models/Room";
import GameUndercover from "../../models/GameUndercover";
import {getDomain} from "../../helpers/getDomain";

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
    const [players, setPlayers] = useState(null);
    const [me, setMe] = useState(null);
    const [socket, setSocket] = useState(null);
    const [wsmessage, setwsMessage] = useState('update');
    const [profileImageList, setProfileImageList] = useState([]);

    useEffect(() => {
        async function fetchDataAndImage() {
            await fetchData();
            await fetchImage();
        }
        fetchDataAndImage();
    }, []);

    async function fetchData(retry = 0) {
        try {
            const response = await api.get(`/undercover/${gameId}`);
            setGame(response.data);
            if (response.data.gameStatus === "voting") {
                history.push(`/undercover/${gameId}/voting`);
            }
            const sortedPlayers = response.data.users.sort((a, b) => a.id - b.id);
            let images = []
            setPlayers(sortedPlayers.map(player => ({ ...player, description: player.description })));
            for(let i = 0; i<response.data.users.length; i++){
                if (response.data.users[i].image) {
                    let url = "/users/" + response.data.users[i].id + "/image"
                    const imageResponse = await api.get(url, {responseType: 'arraybuffer'});
                    images.push(`data:image/jpeg;base64,${btoa(new Uint8Array(imageResponse.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`);
                }
                else images.push(null);
            }
            setProfileImageList(images)
        } catch (error) {
            console.error(`Something went wrong while fetching the game: \n${handleError(error)}`);
            console.error("Details:", error);
            // alert("Something went wrong while fetching the game! See the console for details.");
            if (retry < 3) {
                // 最多重试3次
                fetchData(retry + 1);
            } else {
                console.error("Max retry limit reached. Unable to fetch game data.");
            }
        }

        try {
            const id = localStorage.getItem("id");
            const response = await api.get('/users/' + id);
            // Get the returned users and update the state.
            const me = new User(response.data);
            //set the local player
            setMe(me);
        } catch (error) {
            console.error(`Something went wrong while fetching the local player: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching the local player! See the console for details.");
        }
    }

    const fetchedPlayers = useRef([]);
    async function fetchImage() {
        if (players) {
            const updatedPlayers = [];
            for (let i = 0; i < players.length; i++) {
                const player = players[i];
                if (player.image && !player.profileImage) {
                    try {
                        const imageResponse = await api.get(`/users/${player.id}/image`, { responseType: 'arraybuffer' });
                        const profileImage = `data:image/jpeg;base64,${btoa(new Uint8Array(imageResponse.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`;
                        const updatedPlayer = { ...player, profileImage };
                        updatedPlayers.push(updatedPlayer);
                        fetchedPlayers.current.push(updatedPlayer);
                    } catch (error) {
                        console.error(`Something went wrong while fetching the player image: \n${handleError(error)}`);
                        console.error("Details:", error);
                        fetchImage();
                    }
                } else {
                    updatedPlayers.push(player);
                }
            }
            setPlayers(updatedPlayers);
        }
    }

    useEffect(() => {
        const url = `ws${getDomain().substring(4)}/websocket`;
        const ws = new WebSocket(url);
        setSocket(ws);
    }, []);

    useEffect(() => {
        const url = `ws${getDomain().substring(4)}/websocket`;
        const ws = new WebSocket(url);
        setSocket(ws);
        const retry=0;

        // Add event listener for incoming messages
        ws.addEventListener('message', async (event) => {
            if (event.data === 'update') {
                try {
                    const response = await api.get(`/undercover/${gameId}`);
                    setGame(response.data);
                    if (response.data.gameStatus === "voting") {
                        history.push(`/undercover/${gameId}/voting`);
                    }
                    const sortedPlayers = response.data.users.sort((a, b) => a.id - b.id);
                    setPlayers(sortedPlayers.map(player => ({ ...player, description: player.description })));
                } catch (error) {
                    console.error(`Something went wrong while fetching the game: \n${handleError(error)}`);
                    console.error("Details:", error);
                    // alert("Something went wrong while fetching the game! See the console for details.");
                    if (retry < 3) {
                        // 最多重试3次
                        fetchData(retry + 1);
                    } else {
                        console.error("Max retry limit reached. Unable to fetch game data.");
                    }
                }
            }
        });

        return () => ws.close();
    }, [gameId,game,players]);


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
        if (socket) {

            try {
                const id = localStorage.getItem("id")
                const requestBody = JSON.stringify(message);
                const response = await api.put('/undercover/' + gameId + '/users/' + id + '/description', requestBody);
                socket.send(wsmessage);
                if (response.data.gameStatus === "voting") {
                    history.push(`/undercover/${gameId}/voting`);
                }
            } catch (error) {
                console.error(`Something went wrong while updating the description: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while updating the description! See the console for details.");
            }
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
                                src={profileImageList[i]}
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
                                src={profileImageList[i+1]}
                                alt={" "}
                            />
                        )}
                        <div className="undercovergame chat-bubble-right">
                            <div style={{"font-weight": "bold", "display": "inline-block"}}>
                                {players[i + 1] != null ? players[i + 1].username + " : " : ''}
                            </div>
                            {players[i + 1] != null ? players[i + 1].description : ''}
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
                It's
            </div>
            <div style={{
                display: "inline-block",
                fontWeight: "bold",
                margin: "-40vw 0 0 0.5vw",
                fontSize: "2vw",
                color: "#123597"
            }}>
                {currentPlayerUsername}
            </div>
            <div style={{display: "inline-block", fontWeight: "normal", margin: "-40vw 0 0 0vw", fontSize: "2vw"}}>
                's turn to describe...
            </div>
            <br/>
            <br/>

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

export default UndercoverGamePage;