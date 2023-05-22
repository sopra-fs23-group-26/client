import React, {useEffect, useState} from 'react';
import InvitationPopup from './InvitationPopup';
import {getDomain} from "../../helpers/getDomain";
import {api, handleError} from "../../helpers/api";
import {useHistory} from 'react-router-dom';

function Invitation() {
    const history = useHistory();
    const [showInvitationPopup, setShowInvitationPopup] = useState(false);
    const [roomId, setRoomId] = useState(null);

    const handleShowInvitationPopup = () => {
        setShowInvitationPopup(true);
    }

    const handleHideInvitationPopup = () => {
        setShowInvitationPopup(false);
    }

    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('start');
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

    useEffect(() => {
        if (socket) {
            socket.onmessage = async (event) => {
                console.log('WebSocket message received:', event.data);
                if (event.data.slice(0, 6) === 'invite') {
                    const msg = event.data.split(",")
                    console.log("msg")
                    console.log(msg)
                    if(msg[2]==localStorage.getItem("id")){
                        console.log("invite message")
                        console.log(event.data)
                        setRoomId(Number(msg[1]))
                        handleShowInvitationPopup();

                    }
                    // console.log("invite message")
                    // console.log(event.data)
                    // setRoomId(Number(event.data.slice(6)))
                    //
                    // handleShowInvitationPopup();
                    // history.push('/room')
                }
            };
        }
    }, [socket, roomId]);

    console.log(roomId)






    return (
        <div>
            {/*<button onClick={handleShowInvitationPopup}>显示邀请弹窗</button>*/}
            {showInvitationPopup && <InvitationPopup roomId={roomId} onReject={handleHideInvitationPopup} />}
        </div>
    );
}

export default Invitation;
