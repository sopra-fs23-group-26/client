import { useEffect, useState } from 'react';
import { api, handleError } from 'helpers/api';
import { Spinner } from 'components/ui/Spinner';
import { Button } from 'components/ui/Button';
import { useHistory, useParams } from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import PropTypes from "prop-types";
import RoomListContainer from "components/ui/RoomListContainer";

const Profile = () => {
  let id, username2;
  id = localStorage.getItem('id')
  let userinfo = JSON.parse(localStorage.getItem('userinfo'))
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [friend, setFriend] = useState(null);
  const [waitFriends, setWaitFriends] = useState(null);
  const [realFriends, setRealFriends] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [friendName, setFriendName] = useState(null);

  const WaitList = ({friend}) => {
    return (
      <div class="room-button-background" style={{width: '320px', height:'40px'}}>
        <div class="room-button button" style={{width: '80px', height:'30px',position: 'absolute', top: '-30px', left: '110px'}} onClick={() => {acceptFriend(friend); window.location.reload();}}>Accept</div>
        <div class="room-button button" style={{width: '80px', height:'30px',position: 'absolute', top: '-30px', left: '195px'}} onClick={() => {rejectFriend(friend); window.location.reload();}}>Reject</div>
        <div class="room-button-background-txt"  style={{top:'5px'}}>{friend.username}</div>
      </div>
    )
  };

  const FriendList = ({friend}) => {
    const [tempImage, setTempImage] = useState(null);
    useEffect(() => {
        async function fetchData() {
          try {
              const imageResponse = await api.get(`/users/${friend.id}/image`, { responseType: 'arraybuffer' });
              setTempImage(`data:image/jpeg;base64,${btoa(new Uint8Array(imageResponse.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`);
          } catch (error) {
            alert("Something went wrong while fetching the user! See the console for details.");
          }
        }
        fetchData();
    }, [friend.id]);

    return (
      <div class="room-button-background" style={{width: '320px', height:'60px'}}>
        <div class="room-button-background-txt"  style={{top:'15px', left: '50px'}}>{friend.username}</div>
        {tempImage && <img style={{
            "width": "50px", "height": "50px", "border-radius": "50px",
            "background-color": "rgb(214, 222, 235)",
            "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
            "position": "absolute", "top": "28px", "left": "270px", "transform": "translate(-50%, -50%)"
        }} src={tempImage} alt="Profile"/>}
      </div>
    )
  };

  WaitList.propTypes = {
    user: PropTypes.object
  };

  FriendList.propTypes = {
    user: PropTypes.object
  };

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

  const sendFriendRequest  = async () => {
    console.log(friendName)
    try {
      const formData = new FormData();
      formData.append("friendName", friendName);
      formData.append("addFriendStatus", 1);
      const response = await api.put(`/users/${id}/friends`, formData);
      console.log(response.data);
      alert(`You hava sent the friend request!`);
    } catch (error) {
      alert(`Something went wrong during adding friends: \n${handleError(error)}`);
    }
  }

  const acceptFriend = async (friend) => {
    try {
      const formData = new FormData();
      formData.append("friendName", friend.username);
      formData.append("addFriendStatus", 2);
      const response = await api.put(`/users/${user.id}/friends`, formData);
      alert(`You hava accepted the friend!`);
    } catch (error) {
      alert(`Something went wrong during accepting friends: \n${handleError(error)}`);
    }
  }

  const rejectFriend = async (friend) => {
    try {
      const formData = new FormData();
      formData.append("friendName", friend.username);
      formData.append("addFriendStatus", 3);
      const response = await api.put(`/users/${user.id}/friends`, formData);
      console.log(response.data);
      alert(`You hava rejected the friend request!`);
    } catch (error) {
      alert(`Something went wrong during deleting friends: \n${handleError(error)}`);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/users/${id}`);
        setUser(response.data);
        if (response.data.image) {
          const imageResponse = await api.get(`/users/${id}/image`, { responseType: 'arraybuffer' });
          setProfileImage(`data:image/jpeg;base64,${btoa(new Uint8Array(imageResponse.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`);
        }
        const response2 = await api.get(`/users/${id}/waitlist`);
        setWaitFriends(response2.data);
        const response3 = await api.get(`/users/${id}/friends`);
        setRealFriends(response3.data);
      } catch (error) {
        alert("Something went wrong while fetching the user! See the console for details.");
      }
    }
    fetchData();
  }, [id]);

  let content = <Spinner />;
  let score;

  if (user) {
    username2 = user.username;
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

  let content3 = <Spinner />;
  if (user) {
    content3 = (
      <div className="game">
        <div>
          <label style={{color: 'white', fontWeight: 'bold', position: 'absolute', top: '5px', left: '20px'}}>
            friend:
          </label>
          <input
            className="login input"
            placeholder={"username"}
            value={friendName}
            type={'text'}
            style={{ width: '100px',position: 'absolute', top: '0px', left: '90px'}}
            onChange={e => setFriendName(e.target.value)}
          />
          <Button style={{width: '200px', position: 'absolute', top: '0px', left: '200px', color: "rgb(57, 115, 175)", backgroundColor: "white"}}
            onClick={() => sendFriendRequest()} > Send Friend Request
          </Button>
        </div>
      </div>
    );
  }

  let content4 = <Spinner />;
  if (waitFriends) {
    content4 = (
      <div className="game">
        <ul className="game user-list">
          {waitFriends.map(friend => (
            <WaitList friend={friend} key={friend.id}/>
          ))}
        </ul>
      </div>

    )
  }

  let content5 = <Spinner />;
  if (realFriends) {
    content5 = (
      <div className="game">
        <ul className="game user-list">
          {realFriends.map(friend => (
            <FriendList friend={friend} key={friend.id}/>
          ))}
        </ul>
      </div>
    )
  }

  return (
    <div className="game">
      <div className="game container" style={{backgroundColor: "rgb(57, 115, 175)", position: 'absolute', top: '420px', left: '530px', transform: 'translate(-50%, -50%)', width: '450px', height: '650px'}}>
        {profileImage && <img style={{"width": "80px", "height": "80px", "border-radius": "50px",
          "background-color": "rgb(214, 222, 235)",
          "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
          "position": "absolute", "top": "65px", "left": "80px", "transform": "translate(-50%, -50%)"}} src={profileImage} alt="Profile" />}

        <div className="game-content" style={{position: 'absolute', top: '60px', left: '250px', transform: 'translate(-50%, -50%)'}}>
          {content}
        </div>
        <div style={{ backgroundColor: 'white', width: '410px', height: '2px', position: 'absolute', top: '140px', left: '20px' }}></div>

        <div className="game-content" style={{position: 'absolute', top: '160px', left: '10px', transform: 'translate(-50%, -50%)'}}>
          {content3}
        </div>

        <ul className="game user-list" style={{color: 'white', position: 'absolute', top: '198px', left: '30px', fontWeight: 'bold'}}>
           Adding-Friend Request from other users:
        </ul>

        <RoomListContainer style={{position: 'absolute', top: '320px', left: '227px', width: '420px', height: '150px', transform: 'translate(-50%, -50%)'}}>
          {content4}
        </RoomListContainer>

        <ul className="game user-list" style={{color: 'white', position: 'absolute', top: '390px', left: '30px', fontWeight: 'bold'}}>
           Friend List:
        </ul>

        <RoomListContainer style={{position: 'absolute', top: '510px', left: '227px', width: '420px', height: '150px', transform: 'translate(-50%, -50%)'}}>
          {content5}
        </RoomListContainer>

        <div style={{ backgroundColor: 'white', width: '410px', height: '2px', position: 'absolute', top: '600px', left: '20px' }}></div>
        <ul className="game user-list" style={{color: 'white', position: 'absolute', top: '600px', left: '30px', fontWeight: 'bold'}}>
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