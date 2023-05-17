import { useEffect, useState } from 'react';
import { api, handleError } from 'helpers/api';
import { Spinner } from 'components/ui/Spinner';
import { Button } from 'components/ui/Button';
import { useHistory, useParams } from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import PropTypes from "prop-types";
import RoomListContainer from "components/ui/RoomListContainer";
import Invitation from './Invitation';

const Ranking = () => {
  let id, username2;
  id = localStorage.getItem('id')
  let userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [globalRankingList, setGlobalRankingList] = useState(null);
  const [communityRankingList, setCommunityRankingList] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  const GetGlobalRankingList = ({player}) => {
    const [tempImage, setTempImage] = useState(null);
    useEffect(() => {
        async function fetchData() {
          try {
            const tempResponse = await api.get(`/users/${player.id}`);
            if (tempResponse.data.image) {
              const imageResponse = await api.get(`/users/${player.id}/image`, { responseType: 'arraybuffer' });
              setTempImage(`data:image/jpeg;base64,${btoa(new Uint8Array(imageResponse.data).reduce((data, byte) =>
                data + String.fromCharCode(byte), ''))}`);
            }
          } catch (error) {
            alert("Something went wrong while fetching the user! See the console for details.");
          }
        }
        fetchData();
    }, [player.id]);

    let tempColor = 'white';
    let tempBorder = null;
    if (player.id === parseInt(id)) {
      tempColor = 'rgb(218, 227, 238)';
      tempBorder = '0.2vw solid rgb(16, 46, 78)';
    }

    return (
      <div class="room-button-background" style={{width: '23vw', height:'4.5vw', left:'-2vw', top:"-3vw", backgroundColor:`${tempColor}`, border: `${tempBorder}`}}>
        <div class="room-button-background-txt"  style={{top:'1.3vw', left: '1.3vw', "font-size": "1vw", color: "rgb(57, 115, 175)"}}>
          No.{player.globalRanking}</div>
        <div class="room-button-background-txt"  style={{top:'1.3vw', left: '11vw', "font-size": "1vw", color: "rgb(57, 115, 175)"}}>
          {player.username}</div>
        <div class="room-button-background-txt"  style={{top:'1.3vw', left: '20vw', "font-size": "1vw", color: "rgb(16, 46, 78)"}}>
          {player.score}</div>
        {tempImage && <img style={{
            "width": "3.2vw", "height": "3.2vw", "border-radius": "3.2vw",
            "background-color": "rgb(214, 222, 235)",
            "box-shadow": "0vw 0.1vw 0.1vw rgba(0, 0, 0, 0.2), 0.1vw 0.1vw 1vw rgba(0, 0, 0, 0.2)",
            "position": "relative", "top": "1.45vw", "left": "8vw", "transform": "translate(-50%, -50%)"
        }} src={tempImage} alt="Ranking"/>}
      </div>
    )
  };

  GetGlobalRankingList.propTypes = {
    user: PropTypes.object
  };

  const back = () => {
    window.history.back();
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/globalranking`);
        setGlobalRankingList(response.data);
        const response2 = await api.get(`/communityranking/${id}`);
        setCommunityRankingList(response2.data);
      } catch (error) {
        alert("Something went wrong while fetching the user! See the console for details.");
      }
    }
    fetchData();
  }, [id]);

  let content = <Spinner />;
  if (globalRankingList) {
    content = (
      <div className="game">
        <ul className="game user-list">
          {globalRankingList.map(player => (
            <GetGlobalRankingList player={player} key={player.id}/>
          ))}
        </ul>
      </div>
    )
  }

  let content2 = <Spinner />;
  if (communityRankingList) {
    content2 = (
      <div className="game">
        <ul className="game user-list">
          {communityRankingList.map(player => (
            <GetGlobalRankingList player={player} key={player.id}/>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="game">
      <div class="room-button-background-txt"  style={{top:'2vw', left: '17.5vw', "font-size": "4.5vw", color: "rgb(57, 115, 175)"}}>
        RANKING</div>

      <div className="game container"
        style={{backgroundColor: "rgb(218, 227, 238)", position: 'relative', top: '28vw', left: '31vw',
        transform: 'translate(-50%, -50%)', width: '27vw', height: '35vw'}}
      >
        <div class="room-button-background-txt"  style={{top:'2vw', left: '4.5vw', "font-size": "1.7vw", color: "rgb(16, 46, 78)"}}>
          COMMUNITY RANKING</div>
        <RoomListContainer style={{backgroundColor: "rgb(230, 228, 223)", position: 'relative', top: '19vw', left: '12.6vw', width: '25vw', height: '27vw',
          transform: 'translate(-50%, -50%)'}}>
          {content2}
        </RoomListContainer>
      </div>

      <div className="game container"
        style={{backgroundColor: "rgb(218, 227, 238)", position: 'relative', top: '-6.95vw', left: '68vw',
        transform: 'translate(-50%, -50%)', width: '27vw', height: '35vw'}}
      >
        <div class="room-button-background-txt"  style={{top:'2vw', left: '6.5vw', "font-size": "1.7vw", color: "rgb(16, 46, 78)"}}>
          GLOBAL RANKING</div>
        <RoomListContainer style={{backgroundColor: "rgb(230, 228, 223)", position: 'relative', top: '19vw', left: '12.6vw', width: '25vw', height: '27vw',
          transform: 'translate(-50%, -50%)'}}>
          {content}
        </RoomListContainer>
      </div>

      <div className="button-container" style={{ position: 'relative', top: '-64vw', left: '120.8vw', transform: 'translate(-50%, -50%)' }}>
        <Button style={{ marginRight: '1vw', backgroundColor: "rgb(16, 46, 78)", color: 'white',fontWeight: 'bold',
          width: '11vw', height: '4vw', "font-size": "1.9vw"}}
          onClick={() => back()}
        >
          back
        </Button>
      </div>
      <Invitation
      />
    </div>
  );
}

export default Ranking;