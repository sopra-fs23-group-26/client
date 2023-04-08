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
            <label style={{color: 'white', fontWeight: 'bold'}}>
              USERNAME:
            </label>
              <input
                  className="login input"
                  placeholder="enter here..."
                  value={username}
                  type={'text'}
                  onChange={e => setUsername(e.target.value)}
                  style={{width: '130px'}}
              />
          <div>
          <input type="file" id="file" accept="image/*" style={{width: '230px'}}
                 onChange={handleChange}/>
          </div>
          <br/>
          <Button width={'40%'} onClick={() => doEdit()} > Submit </Button>
          <Button width={'40%'} onClick={() => back()} > Back </Button>
        </div>
    );
  }

  return (
      <div className="game">
        <div className="game container" style={{backgroundColor: "rgb(57, 115, 175)", position: 'absolute', top: '420px', left: '530px', transform: 'translate(-50%, -50%)', width: '450px', height: '600px'}}>
          {profileImage && <img style={{"width": "80px", "height": "80px", "border-radius": "50px",
            "background-color": "rgb(214, 222, 235)",
            "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
            "position": "absolute", "top": "65px", "left": "80px", "transform": "translate(-50%, -50%)"}} src={profileImage} alt="Profile" />}
          <div className="game-content" style={{position: 'absolute', top: '80px', left: '250px', transform: 'translate(-50%, -50%)'}}>
            {content}
          </div>
        </div>
      </div>
  );
}

export default ProfileEdit;