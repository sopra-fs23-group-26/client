import RoomListContainer from "components/ui/RoomListContainer";
import {RoomButton} from "components/ui/RoomButton";
import {LoginButton} from 'components/ui/LoginButton';
import "styles/ui/RoomButton.scss"
import "styles/views/Select.scss";
import {useHistory, useParams} from 'react-router-dom';

const Start = () =>{


    const history = useHistory();



    const num = 8;
    const styles = [
        {left: "0vw", "top": "0em"},
        {left: "5vw", "top": "0em"},
        {left: "10vw", "top": "0em"},
        {left: "15vw", "top": "0em"},
        {left: "0vw", "top": "2.3em"},
        {left: "5vw", "top": "2.3em"},
        {left: "10vw", "top": "2.3em"},
        {left: "15vw", "top": "2.3em"},

    ]
    const elements = []
    for(let i = 0; i<num; i++){

        elements.push(<div className="select display" style={{
            "left": styles[i].left,
            "top": styles[i].top
        }}></div>)
    }






    return(
        <div className="select" >
            <h2 className="select title">Undercover</h2>

            <button className="select button"
            style={{"top": "8em"}}
            >Start!</button>

            <button className="select button" style={{
                "background-color": "rgb(57, 102, 161)",
                "color": "rgb(214, 222, 235)",
                "top": "8em"

            }}
                    onClick={() => history.push('/room')}
            >Back
            </button>

            <p className="select box" style={{"top": "-1em",
            "height": "24vw"}}>game rules:<br/>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx<br/><br/>
                score rules:<br/>xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
            </p>



            <button className="select button" style={{
                "height": "3vw",
                "width": "7vw",
                "font-size": "1.2vw",
                "top": "-13.5em",
                "left": "31.5em",
                "text-transform": "capitalize",
                "background": "rgb(19, 40, 67)",
                "color": "white"
            }}>
                invite
            </button>
            <div> <input className="select input"
            /></div>

            <div className="select container">
                {elements}
                {/*<div className="select display" >111111</div>*/}
            </div>

            <div> <input className="select input"
                         style={{
                             "top":"-40.5vw",
                             "left": "50vw",
                             "width": "20vw",
                             "height": "3.5vw",
                             "font-size": "2em" ,
                             "border-color": "rgb(214, 222, 235)",
                             "font-weight": "bold",
                             "color": "rgb(19, 40, 67)",
                             "border-radius": "1.3vw"

            }}
            /></div>

            <button className="select button" style={{
                "height": "3vw",
                "width": "6vw",
                "font-size": "1.2vw",
                "top": "-35.8em",
                "left": "59em",
                "text-transform": "capitalize",
                "background": "rgb(19, 40, 67)",
                "color": "white"
            }}>
                do edit
            </button>








        </div>

    );
}

export default Start