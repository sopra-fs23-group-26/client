import { useEffect, useState } from 'react';
import { api, handleError } from 'helpers/api';
import { Spinner } from 'components/ui/Spinner';
import { Button } from 'components/ui/Button';
import PropTypes from "prop-types";
import { useHistory, useParams } from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Game.scss";
import User from "../../models/User";
import RoomListContainer from "components/ui/RoomListContainer";

const ProfileEdit = () => {

  const history = useHistory();
  let id;
  id = localStorage.getItem('id')
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [image, setImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [friend, setFriend] = useState(null);
  const [waitFriends, setWaitFriends] = useState(null);
  const [realFriends, setRealFriends] = useState(null);
  const [friendName, setFriendName] = useState(null);
  const [score, setScore] = useState(null);

  const back = () => {
    history.push(`/profile/${id}`);
  }

  const handleChange = (e) => {
    const selectedImage = e.target.files[0];
    if (selectedImage) {
      setImage(selectedImage);
      const reader = new FileReader();
      reader.onload = () => {
        //setPreview(reader.result);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await api.get(`/users/${id}`);
        setUser(response.data);
        setUsername(response.data.username);
        setScore(response.data.score);
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

  const doEdit = async () => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      if (image) {
        formData.append("image", image);
      }
      const config = { headers: { "Content-Type": "multipart/form-data" } };
      await api.put(`/users/${id}`, formData, config);
      history.push(`/profile/${id}`)
    } catch (error) {
      alert(`Something went wrong during editing profile: \n${handleError(error)}`);
    }
  };

  let content = <Spinner />;

  if (user) {
    content = (
      <div className="game">
        <label style={{color: 'white', fontWeight: 'bold', "font-size":"0.85vw"}}>
          USERNAME:
        </label>
        <input
          style={{ height: '2vw',width: '7vw',position: 'relative', top: '0vw', left: '1vw', "font-size":"0.85vw", marginRight:"1vw"}}
          className="login input"
          placeholder="enter here..."
          value={username}
          type="text"
          onChange={e => setUsername(e.target.value)}
        />
        <div>
          <input type="file" id="file" accept="image/*" style={{width: '12vw'}}
          onChange={handleChange}/>
        </div>
        <Button width={'40%'} style={{ marginTop: '1vw', color: "rgb(57, 115, 175)", backgroundColor: "white", border:'none',
          fontWeight: 'bold', "font-size":"0.85vw", height:"2vw"}}
          onClick={() => doEdit()} > Submit </Button>
        <Button width={'40%'} style={{ marginTop: '1vw', color: "rgb(57, 115, 175)", backgroundColor: "white", border:'none',
          fontWeight: 'bold', "font-size":"0.85vw", height:"2vw"}}
          onClick={() => back()} > Back </Button>
      </div>
    );
  }

const WaitList = ({friend}) => {
    return (
      <div class="room-button-background" style={{width: '17vw', height:'3.5vw', top: '-3vw'}}>
        <div class="room-button button"
          style={{width: '5vw', height:'1.6vw',position: 'relative', top: '0vw', left: '5vw', "font-size":"0.85vw"}}
            onClick={() => alert("please operate on the profile page!")}
          >Accept</div>
        <div class="room-button button"
          style={{width: '5vw', height:'1.6vw',position: 'relative', top: '0vw', left: '1.5vw', "font-size":"0.85vw"}}
            onClick={() => alert("please operate on the profile page!")}
          >Reject</div>
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
  const gotoRanking = () => {
    try {
      history.push(`/ranking/${id}`);
    } catch (error) {
      history.push('/');
    }
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
        <div className="game container" style={{backgroundColor: "rgb(57, 115, 175)", position: 'relative', top: '19vw', left: '28vw', width: '24.5vw', height: '35vw', transform: 'translate(-50%, -50%)'}}>
          {profileImage && <img style={{"width": "4vw", "height": "4vw", "border-radius": "4vw",
            "background-color": "rgb(214, 222, 235)",
            "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
            "position": "absolute", "top": "3.2vw", "left": "5vw", "transform": "translate(-50%, -50%)"}} src={profileImage} alt="Profile" />}
          <div className="game-content" style={{position: 'relative', top: '3vw', left: '10vw', transform: 'translate(-50%, -50%)'}}>
            {content}
          </div>

          <div style={{ backgroundColor: 'white', width: '23vw', height: '0.14vw', position: 'relative', top: '0vw', left: '0.2vw' }}></div>

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

      </div>
  );
}

export default ProfileEdit;