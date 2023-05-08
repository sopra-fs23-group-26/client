import {useHistory} from 'react-router-dom';
import "styles/views/InvitationPopup.scss";
import React, {useState, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import {getDomain} from "../../helpers/getDomain";

function InvitationPopup(props) {
    const history = useHistory();

    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('ANewPlayerJoined');
    // 创建WebSocket连接
    useEffect(() => {
        const url = "ws"+getDomain().toString().substring(4, getDomain().toString().length)+"/websocket"
        const ws = new WebSocket(url);
        setSocket(ws);
        // 关闭WebSocket连接时清理副作用
        return () => {
            ws.close();
        };
    }, []);

    const sendMessage = async () => {
        if (socket) {
            // setMessage('start');
            socket.send(message);
        }
    };



    const onAccept = async () => {
        try {

            const response = await api.put("/undercover/rooms/"+props.roomId.toString()+ "/"+localStorage.getItem("id"));
            console.log(response.data);
            if (response.status==200){
                localStorage.setItem("roomId", props.roomId)
                localStorage.setItem("ownerId", response.data.ownerId)// fake owner id
                await sendMessage()
                history.push('/start')
            }else {
                alert("Error: joined a room failed");
            }

        } catch (error) {
            console.log(`Something went wrong entering a room through invitation: ${handleError(error)}`);
        }
    };

    const onReject = () =>{
        // 处理“拒绝”操作的逻辑
        props.onReject();
    }

    return (
        <div className="invitation-popup">
            <h2>{"Invitation"}</h2>
            {/*<p>{"message"}</p>*/}
            <div className="invitation-popup-buttons">
                <button className="accept" onClick={onAccept}>Yes</button>
                <button className="reject" onClick={onReject}>No</button>
            </div>
        </div>
    );
}

export default InvitationPopup;

