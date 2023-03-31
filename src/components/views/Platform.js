import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Game.scss";

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
    <BaseContainer className="game container">
        <h2>Game Platform</h2>
        <Button
          width="100%"
          onClick={() => gotoProfile()}
        >
          Profile
        </Button>

        <Button
          width="100%"
          onClick={() => logout()}
          style={{ marginTop: "20px"}}
        >
          Logout
        </Button>
    </BaseContainer>
  );
}

export default Platform;
