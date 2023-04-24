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
  const [image, setImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);


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
        if (response.data.image) {
          const imageResponse = await api.get(`/users/${id}/image`, { responseType: 'arraybuffer' });
          setProfileImage(`data:image/jpeg;base64,${btoa(new Uint8Array(imageResponse.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`);
        }
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
          className="login input"
          placeholder= {user.username}
          value={username}
          type={'text'}
          onChange={e => setUsername(e.target.value)}
          style={{ height: '2vw',width: '7vw',position: 'relative', top: '0vw', left: '1vw', "font-size":"0.85vw", marginRight:"1vw"}}
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
        </div>
      </div>
  );
}

export default ProfileEdit;