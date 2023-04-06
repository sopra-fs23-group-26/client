import { useEffect, useState } from 'react';
import { api } from 'helpers/api';
import { Spinner } from 'components/ui/Spinner';
import { Button } from 'components/ui/Button';
import { useHistory, useParams } from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";

const Profile = () => {
  let id;
  id = localStorage.getItem('id')
  let userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const back = () => {
    history.push('/platform');
  }
  const edit = () => {
    history.push(`/profile-edit/${id}`);
  }

  const gotoCommunityRanking = () => {
    history.push('/communityranking')
  }

  const gotoGlobalRanking = () => {
    history.push('/globalranking')
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get('/users/' + id);
        await new Promise(resolve => setTimeout(resolve, 500));
        setUser(response.data);
      } catch (error) {
        history.push('/');
      }
    }
    fetchData();
  }, [id]);

  let content = <Spinner />;
  let score;

  if (user) {
    score = user.score;
    content = (
      <div className="game">
        <ul className="game user-list" style={{color: 'white', fontWeight: 'bold'}}>
          USERNAME: {user.username}
        </ul>
        {(user&&user.id==userinfo.id)?<Button width="55%" onClick={() => edit()} style={{color: "rgb(57, 115, 175)", backgroundColor: "white"}}>EDIT</Button>:null}
      </div>
    );
  }

  let content2 = <Spinner />;

  if (user) {
    content2 = (
      <div className="game" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{display: 'flex'}}>
          <Button width="50%" style={{ marginRight: '10px', backgroundColor: "rgb(218, 227, 238)", border:'none', color: 'darkblue', fontWeight: 'bold'}}
            onClick={() => gotoCommunityRanking()}
          >
            COMMUNITY RANKING
          </Button>
          <Button width="40%" style={{  backgroundColor: "rgb(218, 227, 238)", border:'none', color: 'darkblue', fontWeight: 'bold'}}
            onClick={() => gotoGlobalRanking()}
          >
            GLOBAL RANKING
          </Button>
        </div>
        <div style={{display: 'flex'}}>
          <ul className="game user-list" style={{color: "rgb(16, 46, 78)", fontWeight: 'bold', position: 'absolute', top:'105px', left:'140px'}}>
            {user.communityRanking}
          </ul>
          <ul className="game user-list" style={{color: "rgb(16, 46, 78)", margin: '0 0 0 70', fontWeight: 'bold', position: 'absolute', top:'105px', left:'320px'}}>
            {user.globalRanking}
          </ul>
        </div>
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
        <div className="game-content" style={{position: 'absolute', top: '60px', left: '250px', transform: 'translate(-50%, -50%)'}}>
            {content}
        </div>
        <div style={{ backgroundColor: 'white', width: '410px', height: '2px', position: 'absolute', top: '140px', left: '20px' }}></div>
        <div style={{ backgroundColor: 'white', width: '410px', height: '2px', position: 'absolute', top: '510px', left: '20px' }}></div>
        <ul className="game user-list" style={{color: 'white', position: 'absolute', top: '530px', left: '30px', fontWeight: 'bold'}}>
           SCORE: {score}
        </ul>
      </div>

      <div className="game container" style={{ backgroundColor: "rgb(218, 227, 238)", position: 'absolute', top: '330px', left: '1100px', transform: 'translate(-50%, -50%)', width: '450px', height: '200px'}}>
        <div className="button-container">
          {content2}
        </div>
      </div>

      <div className="button-container" style={{ position: 'absolute', top: '550px', left: '1120px', transform: 'translate(-50%, -50%)' }}>
        <Button style={{ marginRight: '10px', backgroundColor: "rgb(16, 46, 78)", color: 'white',fontWeight: 'bold', width: '100px' }}
          onClick={() => history.push(`/platform`)}
        >
          BACK
        </Button>
      </div>

    </div>
  );


}

export default Profile;
