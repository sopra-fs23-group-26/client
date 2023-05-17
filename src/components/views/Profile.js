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
      <div class="room-button-background" style={{width: '17vw', height:'3.5vw', top: '-3vw'}}>
        <div class="room-button button"
          style={{width: '5vw', height:'1.6vw',position: 'relative', top: '0vw', left: '5vw', "font-size":"0.85vw"}}
          onClick={() => {acceptFriend(friend); window.location.reload();}}>Accept</div>
        <div class="room-button button"
          style={{width: '5vw', height:'1.6vw',position: 'relative', top: '0vw', left: '1.5vw', "font-size":"0.85vw"}}
          onClick={() => {rejectFriend(friend); window.location.reload();}}>Reject</div>
        <div class="room-button-background-txt"  style={{top:'0.3vw', "font-size":"0.85vw"}}>{friend.username}</div>
      </div>
    )
  };

  const FriendList = ({friend}) => {
    const [tempImage, setTempImage] = useState(null);
    useEffect(() => {
        async function fetchData() {
          try {
              const imageResponse = await api.get(`/users/${friend.id}/image`, { responseType: 'arraybuffer' });
              setTempImage(`data:image/jpeg;base64,${btoa(new Uint8Array(imageResponse.data).reduce((data, byte) =>
                data + String.fromCharCode(byte), ''))}`);
          } catch (error) {
            alert("Something went wrong while fetching the user! See the console for details.");
          }
        }
        fetchData();
    }, [friend.id]);

    return (
      <div class="room-button-background" style={{width: '17vw', height:'3.5vw', top:'-3vw'}}>
        <div class="room-button-background-txt"  style={{top:'1vw', left: '2.6vw', "font-size": "0.85vw"}}>
          {friend.username}</div>
        {tempImage && <img style={{
            "width": "2.7vw", "height": "2.7vw", "border-radius": "2.7vw",
            "background-color": "rgb(214, 222, 235)",
            "box-shadow": "0vw 0.1vw 0.1vw rgba(0, 0, 0, 0.2), 0.1vw 0.1vw 1vw rgba(0, 0, 0, 0.2)",
            "position": "relative", "top": "1.45vw", "left": "14vw", "transform": "translate(-50%, -50%)"
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

  const gotoRanking = () => {
    try {
      history.push(`/ranking/${id}`);
    } catch (error) {
      history.push('/');
    }
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
      alert(`${error.response.data.message} You cannot add friends.`);
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
      alert(`${error.response.data.message} You cannot accept friends.`);
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
      alert(`${error.response.data.message} You cannot delete friends.`);
    }
  }

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/users/${id}`);
        setUser(response.data);
        if (response.data.image) {
          const imageResponse = await api.get(`/users/${id}/image`, { responseType: 'arraybuffer' });
          setProfileImage(`data:image/jpeg;base64,${btoa(new Uint8Array(imageResponse.data).reduce((data, byte) =>
            data + String.fromCharCode(byte), ''))}`);
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
    content = (
      <div className="game" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginTop: '0vw', width: '20vw', justifyContent: 'space-between'}}>
        <ul className="game user-list" style={{color: 'white', fontWeight: 'bold', "font-size": "0.85vw"}}>
          USER:  {user.username}
        </ul>
        {(user&&user.id==userinfo.id)?<Button width="55%" onClick={() => edit()}
          style={{color: "rgb(57, 115, 175)", backgroundColor: "white", "font-size": "0.85vw", width:"4vw", height:"2vw"}}>
          EDIT</Button>:null}
      </div>
    );
    username2 = user.username;
    score = user.score;
  }

  let content2 = <Spinner />;

  if (user) {
    content2 = (
      <div className="game" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div style={{display: 'flex'}}>
          <Button width="50%" style={{ marginRight: '0.5vw', backgroundColor: "rgb(218, 227, 238)", border:'none',
            color: 'darkblue', fontWeight: 'bold', "font-size":"0.9vw"}}
            onClick={() => gotoRanking()}
          >
            COMMUNITY RANKING
          </Button>
          <Button width="40%" style={{  backgroundColor: "rgb(218, 227, 238)", border:'none',
            color: 'darkblue', fontWeight: 'bold', "font-size":"0.9vw"}}
            onClick={() => gotoRanking()}
          >
            GLOBAL RANKING
          </Button>
          <ul className="game user-list" style={{marginRight: '0.5vw', color: "rgb(16, 46, 78)", fontWeight: 'bold',
            position: 'relative', top:'4vw', left:'-14vw', "font-size":"0.9vw"}}>
            {user.communityRanking}
          </ul>
          <ul className="game user-list" style={{color: "rgb(16, 46, 78)", fontWeight: 'bold', position: 'relative',
            top:'4vw', left:'-5vw', "font-size":"0.9vw"}}>
            {user.globalRanking}
          </ul>
        </div>
      </div>
    );
  }

  let content3 = <Spinner />;
  if (user) {
    content3 = (
      <div className="game" style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
        <div>
          <label style={{color: 'white', fontWeight: 'bold', "font-size":"0.85vw", position: 'relative',
            top: '0vw', left: '10.5vw', marginRight:"1vw"}}>
            Add friend:
          </label>
          <input
            className="login input"
            placeholder={"username"}
            value={friendName}
            type={'text'}
            style={{ height: '2.2vw',width: '7vw',position: 'relative', top: '0vw', left: '10.5vw',
              "font-size":"0.85vw", marginRight:"1vw"}}
              onChange={e => setFriendName(e.target.value)}
          />
          <Button style={{height: '2.2vw', width: '5vw', position: 'relative', top: '0vw', left: '12vw',
            color: "rgb(57, 115, 175)", backgroundColor: "white", "font-size":"0.85vw"}}
            onClick={() => sendFriendRequest()} > Request
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
      <div className="game container"
        style={{backgroundColor: "rgb(57, 115, 175)", position: 'relative', top: '19vw', left: '28vw',
        transform: 'translate(-50%, -50%)', width: '24.5vw', height: '35vw'}}
      >
        {profileImage && <img style={{"width": "4vw", "height": "4vw", "border-radius": "4vw",
          "background-color": "rgb(214, 222, 235)",
          "box-shadow": "0.1vw 0.1vw 0.1vw rgba(0, 0, 0, 0.2), 0vw 0.2vw 0.3vw rgba(0, 0, 0, 0.2)",
          "position": "absolute", "top": "3.2vw", "left": "5vw", "transform": "translate(-50%, -50%)"}}
          src={profileImage} alt="Profile" />}

        <div className="game-content" style={{position: 'relative', top: '1vw', left: '19vw', transform: 'translate(-50%, -50%)'}}>
          {content}
        </div>
        <div style={{ backgroundColor: 'white', width: '23vw', height: '0.14vw', position: 'relative', top: '0vw', left: '0.2vw' }}></div>

        <div className="game-content" style={{position: 'relative', top: '2.5vw', left: '-2vw', transform: 'translate(-50%, -50%)'}}>
          {content3}
        </div>

        <ul className="game user-list" style={{color: 'white', position: 'relative', top: '0vw', left: '-2vw',
          fontWeight: 'bold', "font-size": "0.85vw"}}>
          Adding-Friend Request from other users:
        </ul>

        <RoomListContainer style={{position: 'relative', top: '3.5vw', left: '11.5vw', width: '22.5vw', height: '8vw',
          transform: 'translate(-50%, -50%)'}}>
          {content4}
        </RoomListContainer>

        <ul className="game user-list" style={{color: 'white', position: 'relative', top: '3.5vw', left: '-8vw',
          fontWeight: 'bold', "font-size": "0.85vw"}}>
          Friend List:
        </ul>

        <RoomListContainer style={{position: 'relative', top: '7vw', left: '11.5vw', width: '22.5vw', height: '8vw',
          transform: 'translate(-50%, -50%)'}}>
          {content5}
        </RoomListContainer>

        <div style={{ backgroundColor: 'white', width: '23vw', height: '0.14vw', position: 'relative', top: '7.8vw',
          left: '0.2vw' }}></div>

        <ul className="game user-list" style={{color: 'white', position: 'relative', top: '7.3vw', left: '-8.6vw',
          fontWeight: 'bold', "font-size": "0.85vw"}}>
          SCORE: {score}
        </ul>
      </div>

      <div className="game container"
        style={{ backgroundColor: "rgb(218, 227, 238)", position: 'relative', top: '-22vw', left: '60vw',
        transform: 'translate(-50%, -50%)', width: '24vw', height: '10vw'}}
      >
        <div className="button-container">
          {content2}
        </div>
      </div>

      <div className="button-container" style={{ position: 'relative', top: '-21vw', left: '108vw', transform: 'translate(-50%, -50%)' }}>
        <Button style={{ marginRight: '1vw', backgroundColor: "rgb(16, 46, 78)", color: 'white',fontWeight: 'bold',
          width: '5vw', height: '2vw', "font-size": "0.85vw"}}
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

export default Profile;