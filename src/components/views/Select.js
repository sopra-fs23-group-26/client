import "styles/views/Select.scss";
import { useState, useEffect } from 'react';
import {useHistory, useParams} from 'react-router-dom';
import Invitation from './Invitation';


const Select = () =>{
    const history = useHistory();
    const [text, setText] = useState('');

    useEffect(() => {
        fetch('/undercover.txt')
            .then(response => response.text())
            .then(text => setText(text))
            .catch(error => console.error(error));
    }, []);

    return(
        <div class="select">
            <h2 class="select title">Undercover</h2>

            <button class="select button" onClick={() => history.push('/room')}>Play!</button>

            <button class="select button" style={{"background-color": "rgb(57, 102, 161)",
                "color": "rgb(214, 222, 235)",
            }} onClick={() => history.push('/platform')}>Back</button>

            <p class="select box">
                Game rules:<br/><br/>
                1. Only the owner can start the game. The players to start the game are 3 - 8.
                <br/><br/>
                2. The game starts with each player receiving a word, but one player is the "undercover" and has a different word than the other players, who are the "detectives."
                <br/><br/>
                3. At the start of each round, every player describes their word using one sentence without saying the actual word.
                <br/><br/>
                4. After all players have described their word in a round, players must vote for who they think is the undercover, and the player who receives the most votes in this round is voted out.
                <br/><br/>
                5. If the undercover is correctly voted out, the detectives win the game and each get 2 points.
                <br/><br/>
                6. If the undercover is not voted out, the game continues until only two players are left and one of them is the undercover.
                <br/><br/>
                7. If the remaining players include the undercover and one detective, the undercover wins the game and gets 5 points.
            </p>


            <Invitation
            />

        </div>
    );
}

export default Select;