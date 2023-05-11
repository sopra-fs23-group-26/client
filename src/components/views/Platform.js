import {useEffect, useState} from 'react';
import {api} from 'helpers/api';
import {Button} from 'components/ui/Button';
import {useHistory} from 'react-router-dom';
import PlatformContainer from "components/ui/PlatformContainer";
import "styles/views/Platform.scss";

const Platform = () => {
    // use react-router-dom's hook to access the history
    let id;
    id = localStorage.getItem('id')
    const history = useHistory();
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);


    const logout = () => {
        // let userinfo = JSON.parse(localStorage.getItem('userinfo'))
        // api.post('/logout/' + userinfo.username);
        // ToDo 这里还没确定logout的时候是否要修改数据库中的信息。
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('status')

        history.push('/login');
    }

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await api.get(`/users/${id}`);
                setUser(response.data);
                if (response.data.image) {
                    const imageResponse = await api.get(`/users/${id}/image`, {responseType: 'arraybuffer'});
                    setProfileImage(`data:image/jpeg;base64,${btoa(new Uint8Array(imageResponse.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))}`);
                }
            } catch (error) {
                alert("Something went wrong while fetching the user! See the console for details.");
            }
        }

        fetchData();
    }, [id]);


    const gotoProfile = () => {
        try {
            let id;
            id = localStorage.getItem('id')
            history.push(`/profile/${id}`);
        } catch (error) {
            history.push('/');
        }
    }

    const gotoHistory = () => {
        try {
            let id;
            id = localStorage.getItem('id')
            history.push(`/history/${id}`);
        } catch (error) {
            history.push('/');
        }
    }


    return (
        <div style={{display: 'flex'}}>
            <h1 style={{
                "position": "relative", "top": "-3vw", "left": "47vw",
                "color": "rgb(57,102, 161)",
                "font-size": "4.5vw"
            }}>
                WeGame
            </h1>

            <PlatformContainer  style={{
                "top": "13vw", "left": "19vw", "height": "23vw", "width": "20vw",
                "background-color": "rgb(214, 222, 235)",
                "box-shadow": "0 5px 5px -5px rgba(0, 0, 0, 1)"
            }}>
                <h2 style={{
                    "position": "relative", "top": "-4vw", "left": "10vw",
                    "transform": "translateX(-50%)",
                    "text-align": "center",
                    "text-transform": "capitalize",
                    "font-size": "1vw",
                    "color": "rgb(19,40, 67)"
                }}>single-player games</h2>
                <Button style={{
                    "width": "7vw", "height": "7vw", "border-radius": "10px",
                    "color": "rgb(57,102, 161)",
                    "background-color": "white",
                    "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                    "position": "relative", "top": "-1vw", "left": "2vw",
                    "font-size": "1vw",
                    "text-align": "center"
                }} onClick={() => history.push('/SudokuGame')}>
                    Sudoku
                </Button>
            </PlatformContainer>
            <PlatformContainer style={{
                "background-color": "rgb(19, 40, 67)",
                "box-shadow": "0 5px 5px -5px rgba(0, 0, 0, 1)",
                "top": "13vw", "left": "20vw", "height": "23vw", "width": "20vw",
            }}>
                <h2 style={{
                    "position": "relative", "top": "-4vw", "left": "10vw",
                    "transform": "translateX(-50%)",
                    "text-align": "center",
                    "text-transform": "capitalize",
                    "font-size": "1vw",
                    "color": "rgb(57,102, 161)"
                }}>multi-player games</h2>
                <Button style={{
                    "width": "7vw", "height": "7vw", "border-radius": "10px",
                    "color": "white",
                    "background-color": "rgb(57,102, 161)",
                    "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                    "position": "relative", "top": "-1.5vw", "left": "2vw",
                    "font-size": "1vw",
                    "text-align": "center"
                }}>
                    Draw& <br/>Guess
                </Button>
                <Button style={{
                    "width": "7vw", "height": "7vw", "border-radius": "10px",
                    "color": "white",
                    "background-color": "rgb(57,102, 161)",
                    "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                    "position": "relative", "top": "-0.8vw", "left": "4.5vw",
                    "font-size": "1vw",
                    "text-align": "center"
                }} onClick={() => history.push('/select')}>
                    Undercover
                </Button>
            </PlatformContainer>
            <PlatformContainer className="user information" style={{
                "position": "relative",
                "top": "0vw", "left": "-32vw",
                "width": "10vw", "height": "36vw",
                "background-color": "rgb(57, 102, 161)",
                "box-shadow": "4px 4px 4px rgba(0, 0, 0, 1)"
            }}>
                {profileImage && <img style={{
                    "width": "80px", "height": "80px", "border-radius": "50px",
                    "background-color": "rgb(214, 222, 235)",
                    "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                    "position": "absolute", "top": "12%", "left": "50%", "transform": "translate(-50%, -50%)"
                }} src={profileImage} alt="Profile"  onClick={() => history.push(`/profile/${id}`)}/>
                }

                <Button style={{

                    "color": "rgb(19,40, 67)",
                    "text-transform": "uppercase",
                    "background-color": "rgb(214, 222, 235)",
                    "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                    "position": "relative", "top": "11vw", "left": "50%", "transform": "translate(-50%, -50%)",
                    "font-size": "1vw",
                    "width": "7.5vw", "height": "2.5vw", "border-radius": "10px",
                }}
                        onClick={() => gotoProfile()}
                >
                    Profile
                </Button>
                <Button style={{

                    "color": "rgb(19,40, 67)",
                    "text-transform": "uppercase",
                    "background-color": "rgb(214, 222, 235)",
                    "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                    "position": "relative", "top": "14vw", "left": "50%", "transform": "translate(-50%, -50%)",
                    "font-size": "1vw",
                    "width": "7.5vw", "height": "2.5vw", "border-radius": "10px",
                    "text-items": "center"
                }}>
                    Chatroom
                </Button>
                <Button style={{

                    "color": "rgb(19,40, 67)",
                    "text-transform": "uppercase",
                    "background-color": "rgb(214, 222, 235)",
                    "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                    "position": "relative", "top": "17vw", "left": "50%", "transform": "translate(-50%, -50%)",
                    "font-size": "1vw",
                    "width": "7.5vw", "height": "2.5vw", "border-radius": "10px",
                    "text-items": "center"
                }}
                onClick={() => history.push(`/ranking/${id}`)}
                >
                    Ranking
                </Button>
                <Button style={{

                    "color": "rgb(19,40, 67)",
                    "text-transform": "uppercase",
                    "background-color": "rgb(214, 222, 235)",
                    "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                    "position": "relative", "top": "20vw", "left": "50%", "transform": "translate(-50%, -50%)",
                    "font-size": "1vw",
                    "width": "7.5vw", "height": "2.5vw", "border-radius": "10px",
                    "text-items": "center",
                }}
                        onClick={() => gotoHistory()}
                >
                    History
                </Button>
                <Button style={{

                    "color": "white",
                    "text-transform": "uppercase",
                    "background-color": "rgb(19, 40, 67)",
                    "box-shadow": "0px 3px 0px rgba(0, 0, 0, 0.2), 0px 5px 10px rgba(0, 0, 0, 0.2)",
                    "position": "relative", "top": "23vw", "left": "50%", "transform": "translate(-50%, -50%)",
                    "font-size": "1vw",
                    "width": "7.5vw", "height": "2.5vw", "border-radius": "10px",
                    "text-items": "center"
                }}
                        onClick={() => logout()}
                >
                    logout
                </Button>
            </PlatformContainer>
        </div>

    );
}

export default Platform;