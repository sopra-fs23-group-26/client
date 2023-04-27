import "styles/views/Select.scss";
import { useState, useEffect } from 'react';
import {useHistory, useParams} from 'react-router-dom';

const Select = () =>{
    const history = useHistory();
    const [text, setText] = useState('');
    useEffect(() => {
        fetch('/undercover.txt')
            .then(response => response.text())
            .then(text => setText(text))
            .catch(error => console.error(error));
    }, []);

    console.log("---------rules     text ------")
    console.log(text)

    return(
        <div class="select">
            <h2 class="select title">Undercover</h2>

            <button class="select button" onClick={() => history.push('/room')}>Play!</button>

            <button class="select button" style={{"background-color": "rgb(57, 102, 161)",
                "color": "rgb(214, 222, 235)",
            }} onClick={() => history.push('/platform')}>Back</button>

            <p class="select box">{text}
            </p>


        </div>
    );

}

export default Select;