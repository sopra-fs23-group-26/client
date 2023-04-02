import { useEffect, useState } from 'react';
import { api } from 'helpers/api';
import { Spinner } from 'components/ui/Spinner';
import { Button } from 'components/ui/Button';
import { useHistory } from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";

const ProfileEdit = () => {

  const history = useHistory();

  const back = () => {
    history.push('/platform');
  }

  let userObj = null;
  let userinfo = history.location.search
  if (userinfo) {
    userObj = JSON.parse(decodeURI(userinfo.slice(userinfo.indexOf('=') + 1)))
  }

  const [user, setUser] = useState(userObj);
  const [username, setUsername] = useState(user.username);


  const doEdit = async () => {
    try {
      user.username = username
      const requestBody = JSON.stringify(user);
      const response = await api.post('/user', requestBody);
      if(response.data.code == 200){
        history.push(`/profile?username=${username}`)
      }else{
        alert(response.data.msg);
      }
    } catch (error) {
      alert(`edit error`);
    }
  };

  let content = <Spinner />;

  if (user) {
    content = (
      <div className="game">
        <div>
          <label style={{color: 'white'}}>
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
      <div className="game container" style={{backgroundColor: 'blue', position: 'absolute', top: '35%', left: '30%', transform: 'translate(-50%, -50%)', width: '380px', height: '500px'}}>
        <div className="game-content" style={{position: 'absolute', top: '20%', left: '55%', transform: 'translate(-50%, -50%)'}}>
            {content}
        </div>
      </div>
    </div>
  );


}

export default ProfileEdit;
