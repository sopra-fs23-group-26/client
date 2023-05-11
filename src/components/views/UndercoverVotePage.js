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


    useEffect(() => {
        async function fetchDataAndImage() {
            await fetchData();
            await fetchImage();
        }
        fetchDataAndImage();

        const timeoutId = setTimeout(async () => {
            await fetchData();
        }, 122000);

        //
        return () => clearTimeout(timeoutId);
    }, []);

    async function fetchData() {
        try {
            const response = await api.get(`/undercover/${gameId}`);
            setGame(response.data);
            if (response.data.gameStatus === "voting") {
                history.push(`/undercover/${gameId}/voting`);
            }
            if (response.data.gameStatus === "gameEnd") {
                history.push(`/UndercoverGameWinPage`);
            }
            const sortedPlayers = response.data.users.sort((a, b) => a.id - b.id);
            let images = []
            setPlayers(sortedPlayers.map(player => ({ ...player, description: player.description })));
            for(let i = 0; i<response.data.users.length; i++){
                if (response.data.users[i].image) {
                    let url = "/users/" + response.data.users[i].id + "/image"
                    console.log("image info")
                    const imageResponse = await api.get(url, {responseType: 'arraybuffer'});
                    console.log("imageResponse")
                    console.log(imageResponse)
                    images.push(`data:image/jpeg;base64,${btoa(new Uint8Array(imageResponse.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`);
                }
            }
            setProfileImageList(images)
        } catch (error) {
            console.error(`Something went wrong while fetching the game: \n${handleError(error)}`);
            console.error("Details:", error);
            // alert("Something went wrong while fetching the game! See the console for details.");
            fetchData();
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


    const isImageClickHandled = useRef(false);

    const handleImageClick = async (player) => {
        if (!isImageClickHandled.current) {
            isImageClickHandled.current = true;
            if (socket) {
                try {
                    const response = await api.put('/undercover/' + gameId + '/votes/' + me.id + '/' + player.id);
                    alert("You voted for " + player.username);
                    //check if the game status is voting
                    const gameresponse = await api.get('/undercover/' + gameId);
                    console.log(gameresponse);
                    setGame(gameresponse.data);
                    if (gameresponse.data.gameStatus === "describing") {
                        history.push(`/undercover/${gameId}`);
                    } else if (gameresponse.data.gameStatus === "gameEnd") {
                        socket.send(message);
                        history.push(`/UndercoverGameWinPage`);
                    }
                } catch (error) {
                    console.error(`Something went wrong while voting: \n${handleError(error)}`);
                    console.error("Details:", error);
                    alert("Something went wrong while voting! See the console for details.");
                }
            }
        }
    }


    useEffect(() => {
        if (socket) {
            socket.onmessage = async (event) => {
                console.log('WebSocket message received:', event.data);
                if (event.data === 'start') {
                    const response = await api.get('/undercover/' + gameId);
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    console.log(response);
                    // Get the returned users and update the state.
                    const game = new GameUndercover(response.data);
                    setGame(game);
                    // Check if gameId exists in localStorage
                    if (game.gameStatus === "describing") {
                        history.push(`/undercover/${gameId}`);
                    } else if (game.gameStatus === "gameEnd") {
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
            <div style={{display: "inline-block", fontWeight: "normal", margin: "-40vw 0 0 3vw", fontSize: "2vw"}}>
                Your Word:
            </div>
            <div style={{
                display: "inline-block",
                fontWeight: "bold",
                margin: "-40vw 0 0 0.3vw",
                fontSize: "2vw",
                color: "#123597"
            }}>
                {word}
            </div>
            <div style={{display: "inline-block", fontWeight: "normal", margin: "-40vw 0 0 1vw", fontSize: "2vw"}}>
                Click on the profile picture to select who you think is the undercover agent.
            </div>

            <div style={{ fontWeight: "normal", margin: "2vw 0 0 3vw", fontSize: "2vw",color: "#123597"}}>
                You have two minutes.
            </div>

        </div>
    );

};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default UndercoverVotePage;