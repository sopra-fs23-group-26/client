import { useEffect, useState } from 'react';
import { api } from 'helpers/api';
import { Spinner } from 'components/ui/Spinner';
import { Button } from 'components/ui/Button';
import { useHistory } from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";

const Profile = () => {
  let userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [score, setScore] = useState(null);
  const [communityranking, setCommunityranking] = useState(null);
  const [globalranking, setGlobalranking] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const back = () => {
    history.push('/platform');
  }
  const edit = () => {
    history.push('/profile-edit?userinfo=' + JSON.stringify(user));
  }

  const gotoCommunityRanking = () => {
    history.push('/communityranking')
  }

  const gotoGlobalRanking = () => {
    history.push('/globalranking')
  }

  const ResetPassword = () => {
    history.push('/resetpassword')
  }

  let username = history.location.search
  username = username.slice(username.indexOf('=') + 1)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/user/' + username);
        await new Promise(resolve => setTimeout(resolve, 500));
        setUser(response.data);
        const response2 = await api.get('/score/' + username);
        await new Promise(resolve => setTimeout(resolve, 500));
        setScore(response2.data);
        const response3 = await api.get('/communityranking/' + username);
        await new Promise(resolve => setTimeout(resolve, 500));
        setCommunityranking(response3.data);
        const response4 = await api.get('/globalranking/' + username);
        await new Promise(resolve => setTimeout(resolve, 500));
        setGlobalranking(response4.data);
      } catch (error) {
        history.push('/');
      }
    }
    fetchData();
  }, []);

  let content = <Spinner />;

  if (user) {
    content = (
      <div className="game">
        <ul className="game user-list" style={{color: 'white'}}>
          USERNAME: {user.username}
        </ul>
        <ul className="game user-list" style={{color: 'white'}}>
          EMAIL: {user.email}
        </ul>
        {(user&&user.id==userinfo.id)?<Button width="40%" onClick={() => edit()} style={{color: 'darkblue'}}>Edit</Button>:null}
        <Button width={(user&&user.id==userinfo.id)?'80%':'100%'}
          onClick={() => ResetPassword()}
          style={{ marginTop: "20px", color: 'darkblue'}}
        >
          RESET PASSWORD
        </Button>
      </div>
    );
  }

  let content2 = <Spinner />;

  if (user) {
    content2 = (
      <div className="game" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{display: 'flex'}}>
          <Button width="40%" style={{ marginRight: '10px', backgroundColor: 'lightblue', border:'none', color: 'darkblue', fontWeight: 'bold'}}
            onClick={() => gotoCommunityRanking()}
          >
            COMMUNITY RANKING
          </Button>
          <Button width="40%" style={{  backgroundColor: 'lightblue', border:'none', color: 'darkblue', fontWeight: 'bold'}}
            onClick={() => gotoGlobalRanking()}
          >
            GLOBAL RANKING
          </Button>
        </div>
        <div style={{display: 'flex'}}>
          <ul className="game user-list" style={{color: 'darkblue', margin: '0', marginRight: "45px",marginTop: "20px"}}>
            {communityranking}
          </ul>
          <ul className="game user-list" style={{color: 'darkblue', margin: '0 0 0 70px', padding: '0', marginTop: "20px"}}>
            {globalranking}
          </ul>
        </div>
      </div>
    );
  }



  return (
    <div className="game">
      <div className="game container" style={{backgroundColor: 'blue', position: 'absolute', top: '35%', left: '30%', transform: 'translate(-50%, -50%)', width: '380px', height: '500px'}}>
        <div className="game-content" style={{position: 'absolute', top: '20%', left: '55%', transform: 'translate(-50%, -50%)'}}>
            {content}
        </div>
        <div style={{ backgroundColor: 'white', width: '300px', height: '2px', position: 'absolute', top: '200px', left: '50px' }}></div>
        <div style={{ backgroundColor: 'white', width: '300px', height: '2px', position: 'absolute', top: '400px', left: '50px' }}></div>
        <ul className="game user-list" style={{color: 'white', position: 'absolute', top: '420px', left: '50px' }}>
          SCORE: {score}
        </ul>
      </div>

      <div className="game container" style={{ backgroundColor: 'lightblue', position: 'absolute', top: '25%', left: '60%', transform: 'translate(-50%, -50%)' }}>
        <div className="button-container">
          {content2}
        </div>
      </div>

      <div className="button-container" style={{ position: 'absolute', top: '50%', left: '60%', transform: 'translate(-50%, -50%)' }}>
        <Button style={{ marginRight: '10px', backgroundColor: 'darkblue', color: 'white',fontWeight: 'bold', width: '100px' }}
          onClick={() => history.push(`/platform`)}
        >
          BACK
        </Button>
      </div>

    </div>
  );


}

export default Profile;
