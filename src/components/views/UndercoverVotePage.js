import React, {useEffect, useState} from 'react';
import { useRef } from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory, useParams} from 'react-router-dom';
import 'styles/views/UndercoverGame.scss';
import PropTypes from "prop-types";
import Room from "../../models/Room";
import GameUndercover from "../../models/GameUndercover";
import {getDomain} from "../../helpers/getDomain";

const UndercoverVotePage = props => {
    const history = useHistory();
    const {gameId} = useParams();
    const [game, setGame] = useState(null);
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('start');
    let [players, setPlayers] = useState(null);
    const [me, setMe] = useState(null);
    const [profileImageList, setProfileImageList] = useState([]);
    const [isClicked, setIsClicked] = useState(false);

    useEffect(() => {
        async function fetchDataAndImage() {
            await fetchData();
            await fetchImage();
        }
        fetchDataAndImage();
    }, []);

    async function fetchData(retry=0) {
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

    async function fetchImage(retry=0) {
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
                        console.error(`Something went wrong while fetching the game: \n${handleError(error)}`);
                        console.error("Details:", error);
                        // alert("Something went wrong while fetching the game! See the console for details.");
                        if (retry < 3) {
                            // 最多重试3次
                            fetchImage(retry + 1);
                        } else {
                            console.error("Max retry limit reached. Unable to fetch game data.");
                        }
                    }

                } else {
                    updatedPlayers.push(player);
                }
            }
            setPlayers(updatedPlayers);
        }
    }

    let word, username;
    if (me) {
        word = me.word;
        username = me.username;
    }
    let currentPlayerUsername;
    if (game) {
        currentPlayerUsername = game.currentPlayerUsername;
    }

    useEffect(() => {
        const url = "ws" + getDomain().toString().substring(4, getDomain().toString().length) + "/websocket"
        const ws = new WebSocket(url);
        setSocket(ws);

        // 关闭WebSocket连接时清理副作用
        return () => {
            ws.close();
        };
    }, []);

    // const isImageClickHandled = localStorage.getItem("clicked");
    // console.log("isImageClickHandled 1")
    // console.log(localStorage.getItem("clicked"))

    const handleImageClick = async (player) => {
        if (isClicked!==true) {
            // localStorage.setItem("clicked","true");
            setIsClicked(true)
            if (socket) {
                try {
                    const response = await api.put('/undercover/' + gameId + '/votes/' + me.id + '/' + player.id);
                    alert("You voted for " + player.username);
                    //check if the game status is voting
                    const gameresponse = await api.get('/undercover/' + gameId);
                    setGame(gameresponse.data);
                    // localStorage.setItem("clicked","true");
                    if (gameresponse.data.gameStatus === "describing") {
                        // localStorage.setItem("clicked","false");
                        setIsClicked(false)
                        socket.send(message);
                        history.push(`/undercover/${gameId}`);
                    } else if (gameresponse.data.gameStatus === "gameEnd") {
                        // localStorage.setItem("clicked","false");
                        setIsClicked(false)
                        socket.send(message);
                        history.push(`/UndercoverGameWinPage`);
                    }
                } catch (error) {
                    console.error(`Something went wrong while voting: \n${handleError(error)}`);
                    console.error("Details:", error);
                    setIsClicked(false)
                    alert(`${error.response.data.message} You cannot vote.`);
                }
            }
        }
        else alert("You have already voted for this round!");
    }

    useEffect(() => {
        if (socket) {
            socket.onmessage = async (event) => {
                if (event.data === 'start') {
                    const response = await api.get('/undercover/' + gameId);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    // Get the returned users and update the state.
                    const game = new GameUndercover(response.data);
                    setGame(game);
                    // Check if gameId exists in localStorage
                    if (game.gameStatus === "describing") {
                        // localStorage.setItem("clicked","false");
                        setIsClicked(false)

                        socket.send(message);
                        history.push(`/undercover/${gameId}`);
                    } else if (game.gameStatus === "gameEnd") {
                        // localStorage.setItem("clicked","false");
                        setIsClicked(false)

                        socket.send(message);
                        history.push(`/UndercoverGameWinPage`);
                    }

                }
            };
        }
    }, [socket, history]);

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
                                onClick={() => handleImageClick(players[i])}
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
                                onClick={() => handleImageClick(players[i + 1])}
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
            <div style={{display: "inline-block", fontWeight: "normal", margin: "-40vw 0 0 2vw", fontSize: "2vw"}}>
                Click on the profile picture to select who you think is the undercover agent.
            </div>

            <div style={{display: "inline-block", fontWeight: "normal", margin: "-37vw 0 0 5vw", fontSize: "2vw"}}>
                Please wait for the images to load before voting.
            </div>
        </div>
    );

};

export default UndercoverVotePage;