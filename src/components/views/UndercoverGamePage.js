import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import 'styles/views/UndercoverGame.scss';
import PropTypes from "prop-types";
import Room from "../../models/Room";

const FormField = props => {
    return (
        <div className="undercovergame field">
            <input
                className="undercovergame input"
                placeholder={props.placeholder}
                value={props.value}
                type={props.type?props.type:'text'}
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
    const [message, setMessage] = useState(null);

    const sendMessage = async () =>{
        try{


        }
        catch (error) {
        }

    }



    const num = 8;
    const styles = [
        {left: "0vw", "top": "0vw",},
        {right: "0vw", "top": "0vw",},
        {left: "0vw", "top": "-6vw",},
        {left: "0vw", "top": "-6vw",},
        {left: "0vw", "top": "-12vw"},
        {left: "0vw", "top": "-12vw"},
        {left: "0vw", "top": "-18vw"},
        {left: "0vw", "top": "-18vw"},

    ]
    const elements = []
    for (let i = 0; i < num; i=i+2) {
        elements.push(
            <div>
            <div className="undercovergame display" style={{
            "left": styles[i].left,
            "top": styles[i].top,
            "display":"inline-block",

        }}>
                <div className="undercovergame chat-bubble-left">
                    <div style={{"font-weight":"bold","display":"inline-block"}}>
                        PLAYER{i+1}:
                    </div>
                    samplecontentsamplecontentsamplecontentsamplecontentsamplecontentsamplecontentsamplecontentsamplecontentsample</div>

        </div>
        <div className="undercovergame display" style={{
            "right": styles[i+1].right,
            "top": styles[i+1].top,
            "display":"inline-block",
            "float": "right"
        }}>
            <div className="undercovergame chat-bubble-right">
                <div style={{"font-weight":"bold","display":"inline-block"}}>
                    PLAYER{i+2}:
                </div>
                samplecontentsamplecontentsamplecontentsamplecontentsamplecontentsamplecontentsamplecontentsamplecontentsample</div>

        </div>
            </div>





        )
    }



  return (
      <div className="chat-container">
          {elements}
          <div style={{"font-weight":"normal",
          "margin-top":"-36vw",
              "margin-left":"5vw",
              "display":"inline-block",
              "font-size":"2vw",
          }}>
              Your Word:
          </div>
          <div style={{"font-weight":"bold", "margin-top":"-36vw",
              "margin-left":"1vw",
              "display":"inline-block",
              "font-size":"2vw",
          "color":"#123597"}}>
              MILK
          </div>
          <div style={{display: "inline-block"}}>
              <FormField
                  value={message}
                  onChange={un => setMessage(un)}
                  placeholder="type..."
                  type="text"
              />
              <div style={{ justifyContent: "center" }}>
                  <button className="undercovergame button"
                          // style={{
                          //     "display":"inline-block",
                          //     "font-size": "20px",
                          //     "text-transform": "none",
                          //     "font-weight": "bold",
                          //     "width": "100px",
                          //     "background-color": "rgb(57, 102, 161)",
                          //     "color": "rgb(1000,1000,1000)",
                          // }}
                          onClick={() => sendMessage()}
                  >Send</button>
              </div>
          </div>

      </div>
  );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default UndercoverGamePage;