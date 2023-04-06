import { useEffect, useState } from 'react';
import { api, handleError } from 'helpers/api';
import { Spinner } from 'components/ui/Spinner';
import { Button } from 'components/ui/Button';
import { useHistory, useParams } from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import User from "../../models/User";

const ProfileEdit = () => {

  const history = useHistory();
  let id;
  id = localStorage.getItem('id')
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);

  const back = () => {
    history.push(`/profile/${id}`);
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/users/${id}`);
        setUser(response.data);
      } catch (error) {
        alert("Something went wrong while fetching the user! See the console for details.");
      }
    }
    fetchData();
  }, [id]);

  const doEdit = async () => {
    try {
      const requestBody = {username};
      const response = await api.put(`/users/` + id, requestBody);
      const updatedUser = new User(response.data);
      setUser(updatedUser);
      history.push(`/profile/${id}`)
    } catch (error) {
      alert(`Something went wrong during editing profile: \n${handleError(error)}`);
    }
  };

  let content = <Spinner />;

  if (user) {
    content = (
      <div className="game">
        <div>
          <label style={{color: 'white', fontWeight: 'bold'}}>
            USERNAME:
          </label>
          <div>
            <input
              className="login input"
              placeholder="enter here..."
              value={username}
              type={'text'}
              onChange={e => setUsername(e.target.value)}
            />
          </div>
        </div>
        <Button width={'40%'} onClick={() => doEdit()} > Submit </Button>
        <Button width={'40%'} onClick={() => back()} > Back </Button>
      </div>
    );
  }

  return (
    <div className="game">
      <div className="game container" style={{backgroundColor: "rgb(57, 115, 175)", position: 'absolute', top: '420px', left: '530px', transform: 'translate(-50%, -50%)', width: '450px', height: '600px'}}>
        <Button style={{"width": "80px", "height": "80px", "border-radius": "50px",
          "background-color": "rgb(214, 222, 235)",
          "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
          "position": "absolute", "top": "65px", "left": "80px", "transform": "translate(-50%, -50%)"}}>
          Image
        </Button>
        <div className="game-content" style={{position: 'absolute', top: '80px', left: '250px', transform: 'translate(-50%, -50%)'}}>
            {content}
        </div>
      </div>
    </div>
  );
}

export default ProfileEdit;
