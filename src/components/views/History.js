import "styles/views/History.scss";
import React, { useState, useEffect } from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {api} from "../../helpers/api";
import 'styles/views/GameResults.scss';
import "styles/views/Game.scss";
import {Button} from "../ui/Button";

const History = () =>{
    const history = useHistory();
    const id = localStorage.getItem('id')


    const [gamehistory, setHistory] = useState([]);


    useEffect(() => {
        async function fetchHistory() {
            const userId = localStorage.getItem("id");
            const response = await api.get(`/gameHistory/${userId}`);
            console.log(response.data)
            setHistory(response.data);
        }
        fetchHistory();
    }, []);



    const goback = () => {
        history.push('/platform')
    }

    return(
        <div className="game">
                <Button style={{ marginLeft: '70vw', marginTop: '5vw',backgroundColor: "rgb(16, 46, 78)", color: 'white',fontWeight: 'bold',
                    width: '11vw', height: '4vw', "font-size": "1.9vw"}}
                        onClick={() => goback()}
                >
                    back
                </Button>
            <div className="room-button-background-txt"
                 style={{top: '4vw', left: '17.5vw', "font-size": "4.5vw", color: "rgb(57, 115, 175)"}}>
                HISTORY
            </div>

            <div
                className="game container"
                style={{
                    backgroundColor: "rgb(218, 227, 238)",
                    position: 'relative',
                    top: '22vw',
                    left:'35vw',
                    paddingBottom:'2vw',
                    margin: 'auto',
                    transform: 'translate(-50%, -50%)',
                    width: '70vw',
                    height: '35vw',
                    "word-break": "break-all",
                    "overflow-y": "auto",
                    "overflow-x": "auto"
                }}
            >

            <div className="result container">

            <div>
                <ul className="game user-list">
                {gamehistory.map((game) => (
                    <div className="result history">
                        <Button style={{
                            "width": "80px", "height": "80px", "border-radius": "10px",
                            "color": "white",
                            "background-color": "rgb(57,102, 161)",
                            "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                            "position": "relative", "left": "3.5vw","top":"10px",
                            "font-size": "10px",
                            "text-align": "center",
                        }}>
                            {game.gameName === "undercover" ? "Undercover" : "Sudoku"}
                        </Button>
                        <div className="result time">
                            {game.time.substring(0,19).replace("T",' ')}
                        </div>
                        <div className="result r">
                            {game.winOrLose}
                        </div>
                        <div className="result score">
                            {game.earnedPoint}
                        </div>
                    </div>
                ))}
                </ul>

            </div>
            </div>
        </div>
        </div>

    );

}

export default History;