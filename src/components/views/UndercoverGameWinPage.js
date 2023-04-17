import React, {useState} from 'react';
import styles from 'styles/views/GameResults.scss';
import 'styles/views/GameResults.scss';
import BaseContainer from "../ui/BaseContainer";
import {LoginButton} from "../ui/LoginButton";
import {Button} from "../ui/Button";
import {useHistory} from "react-router-dom";

const UndercoverGameWinPage = props => {
    const history = useHistory();




    return (
        <BaseContainer>
            <div className="result container">
                <h1 className="result title">YOU WIN!</h1>
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
                        15/05/2023 23:00:00
                    </div>
                    <div className="result r">
                        WIN
                    </div>
                    <div className="result score">
                        +30
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