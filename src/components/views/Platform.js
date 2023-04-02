import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import PlatformContainer from "components/ui/PlatformContainer";
import PropTypes from "prop-types";
import "styles/views/Platform.scss";

const Platform = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  const [user, setUser] = useState(null);

  const logout = () => {
    let userinfo = JSON.parse(localStorage.getItem('userinfo'))
    api.post('/logout/' + userinfo.username);
    localStorage.removeItem('token');
    history.push('/');
  }

  const gotoProfile = async () => {
    try {
      const userinfo = JSON.parse(localStorage.getItem('userinfo'))
      const response = await api.get('/user/' + userinfo.username);
      await new Promise(resolve => setTimeout(resolve, 500));
      setUser(response.data);
      history.push(`/profile?username=${response.data.username}`); // modified line
    } catch (error) {
      history.push('/');
    }
  }


  return (
      <div style={{ display: 'flex' }}>
          <h1 style={{"position": "absolute", "top": "30px", "left": "48%",
              "color": "rgb(57,102, 161)",
              "font-size": "85px"
          }}>
              WeGame
          </h1>

          <PlatformContainer className="single game container" style={{"top": "300px", "left": "650px",
            "background-color": "rgb(214, 222, 235)",
              "box-shadow": "0 5px 5px -5px rgba(0, 0, 0, 1)"}}>
              <h2 style={{"position": "absolute", "top": "-80px", "left": "50%",
                  "transform": "translateX(-50%)",
                  "text-align": "center",
                  "text-transform": "capitalize",
                  "font-size": "20px",
                  "color": "rgb(19,40, 67)"
              }}>single-player games</h2>
              <Button style={{"width": "120px", "height": "120px", "border-radius": "10px",
                  "color": "rgb(57,102, 161)",
                  "background-color": "white",
                  "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                  "position": "absolute", "top": "50px", "left": "50px"}}>
                  Sudoku
              </Button>
          </PlatformContainer>
          <PlatformContainer className="multi game container" style={{
              "background-color": "rgb(19, 40, 67)",
              "box-shadow": "0 5px 5px -5px rgba(0, 0, 0, 1)"}}>
              <h2 style={{"position": "absolute", "top": "-80px", "left": "50%",
                  "transform": "translateX(-50%)",
                  "text-align": "center",
                  "text-transform": "capitalize",
                  "font-size": "20px",
                  "color": "rgb(57,102, 161)"
              }}>multi-player games</h2>
              <Button style={{"width": "120px", "height": "120px", "border-radius": "10px",
                  "color": "white",
                  "background-color": "rgb(57,102, 161)",
                  "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                  "position": "absolute", "top": "50px", "left": "50px"}}>
                  Draw&   <br />Guess
              </Button>
              <Button style={{"width": "120px", "height": "120px", "border-radius": "10px",
                  "color": "white",
                  "background-color": "rgb(57,102, 161)",
                  "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                  "position": "absolute", "top": "50px", "left": "220px"}}>
                  Undercover
              </Button>
          </PlatformContainer>
        <PlatformContainer className="user information" style={{"top": "100px", "left": "400px",
          "width": "200px", "height": "650px",
          "background-color": "rgb(57, 102, 161)",
            "box-shadow": "4px 4px 4px rgba(0, 0, 0, 1)"}}>
            <Button style={{"width": "100px", "height": "100px", "border-radius": "50px",
                "background-color": "rgb(214, 222, 235)",
                "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                "position": "absolute", "top": "12%", "left": "50%", "transform": "translate(-50%, -50%)"}}>
                Image
            </Button>
            <Button style={{"width": "140px", "height": "40px", "border-radius": "10px",
                "color": "rgb(19,40, 67)",
                "text-transform": "uppercase",
                "background-color": "rgb(214, 222, 235)",
                "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                "position": "absolute", "top": "32%", "left": "50%", "transform": "translate(-50%, -50%)"}}>
                Profile
            </Button>
            <Button style={{"width": "140px", "height": "40px", "border-radius": "10px",
                "color": "rgb(19,40, 67)",
                "text-transform": "uppercase",
                "background-color": "rgb(214, 222, 235)",
                "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                "position": "absolute", "top": "47%", "left": "50%", "transform": "translate(-50%, -50%)"}}>
                Chatroom
            </Button>
            <Button style={{"width": "140px", "height": "40px", "border-radius": "10px",
                "color": "rgb(19,40, 67)",
                "text-transform": "uppercase",
                "background-color": "rgb(214, 222, 235)",
                "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                "position": "absolute", "top": "62%", "left": "50%", "transform": "translate(-50%, -50%)"}}>
                Ranking
            </Button>
            <Button style={{"width": "140px", "height": "40px", "border-radius": "10px",
                "color": "rgb(19,40, 67)",
                "text-transform": "uppercase",
                "background-color": "rgb(214, 222, 235)",
                "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                "position": "absolute", "top": "77%", "left": "50%", "transform": "translate(-50%, -50%)"}}>
                History
            </Button>
            <Button style={{"width": "140px", "height": "40px", "border-radius": "10px",
                "color": "white",
                "text-transform": "uppercase",
                "background-color": "rgb(19, 40, 67)",
                "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                "position": "absolute", "top": "92%", "left": "50%", "transform": "translate(-50%, -50%)"}}>
                logout
            </Button>
        </PlatformContainer>
</div>

  );
}

export default Platform;
