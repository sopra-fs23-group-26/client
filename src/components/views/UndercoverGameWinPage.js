import React, {useEffect, useState} from 'react';
import 'styles/views/GameResults.scss';
import BaseContainer from "../ui/BaseContainer";
import {Button} from "../ui/Button";
import {useHistory} from "react-router-dom";
import {api} from "../../helpers/api";

const UndercoverGameWinPage = props => {
    const history = useHistory();
    const [gameHistory, setGameHistory] = useState(null);



    useEffect(() => {
        async function fetchData() {
            try {
                const userId = localStorage.getItem("id");
                const response = await api.get(`/gameHistory/${userId}/latestRecord`);
                setGameHistory(response.data);
            } catch (error) {
                alert("Something went wrong while fetching the game history! See the console for details.");
            }
        }
        fetchData();
    }, []);

    let winOrLose, time, earnedPoint
    if(gameHistory){
        winOrLose = gameHistory.winOrLose;
        time = gameHistory.time.toLocaleString().replace(',', '');
        earnedPoint = gameHistory.earnedPoint;
    }


    return (
        <BaseContainer>
            <div className="result container">
                <h1 className="result title">YOU {winOrLose}!</h1>
                <br/>
                <br/>
                <div className="result rectangle">
                    <Button style={{
                        "width": "80px", "height": "80px", "border-radius": "10px",
                        "color": "white",
                        "background-color": "rgb(57,102, 161)",
                        "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                        "position": "relative", "left": "3.5vw","top":"10px",
                        "font-size": "10px",
                        "text-align": "center",
                    }} onClick={() => history.push('/select')}>
                        Undercover
                    </Button>
                    <div className="result time">
                        {time}
                    </div>
                    <div className="result r">
                        {winOrLose}
                    </div>
                    <div className="result score">
                        {earnedPoint}
                    </div>
                </div>

            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <button className="select button"
                        style={{
                            "font-size": "30px",
                            "text-transform": "none",
                            "font-weight": "bold",
                            "width": "200px",
                            "background-color": "rgb(57, 102, 161)",
                            "color": "rgb(1000,1000,1000)",
                            "position": "relative", "left": "0vw","top":"100px",
                        }}
                        onClick={() => history.push('/select')}
                >Back</button>
            </div>
        </BaseContainer>
    );

}

export default UndercoverGameWinPage;