import { useState,useEffect, useContext} from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import uuid from 'react-uuid';

import ChatHeader from '../../components/block/chatHeader'; //ここに関しては、header単体の修正をする。
import DatabaseMessage from '../../components/module/databaseMessage';
import SocketMessage from '../../components/module/SocketMessage';
import MessageDelete from '../../components/ReactModal/messageDelete';
import UserProfile from '../../components/ReactModal/userProfile';

import {ProfileStore} from '../../components/module/store'; //ここからstoreのアクセスをする。
import {HandleError,Code401,Code500} from '../../components/module/errorHandler';
import SocketContext from '../../components/module/socket.io';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faPaperPlane} from '@fortawesome/free-regular-svg-icons'

import '../../styles/layouts/chats/channel.scss';

function Channel(){
    const [userId,setUserId] = useState(''); //これに関してはsessionでの機能以外にもchatPopupの自分のメッセージかどうかの分岐に！
    const [text,setText] = useState('');
    const [channel,setChannel] = useState({});
    const [chatData,setChatData] = useState([]); //chatのメッセージ管理を行
    const [socket,setSocket] = useState(''); //socketのメッセージ管理を行う

    const {state} = useContext(ProfileStore); //stat.messageでuserProfileのユーザーがいない場合のエラーを取得できるようにした。

    const history = useHistory();
    const location = useLocation();

    const socketIO = useContext(SocketContext);

    useEffect(() => {//ここではサーバーへのアクセスをしている。
        var path = location.pathname;
        var id = path.split("/")[3];

        fetch(`/api/chat/${id}`)
        .then(HandleError)
        .then((obj) => {
            setUserId(obj.userId);
            setChannel(obj.channel);
            setChatData(obj.channel.chatData)
        })
        .catch((err) => {
            if(err.status === 401){
                Code401(err,history);
            }else if(err.status === 500){
                Code500(err,history);
            }
        });
    },[]);

    useEffect(() => { //ページを変更した際に発生する。
        const path = location.pathname;
        const id = path.split('/')[3];
        socketIO.emit('join',id);
    },[location.pathname]);

    const handleChange = (e) => { //例えば、送信機能を故コンポーネントに委ねてしまうという手段。これを行うと、可読性の向上にはつながると思うが、
        const target = e.target;
        const value = target.value;

        setText(value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        var date = new Date();
        var dayGetter = ["日","月","火","水","木","金","土"]; 
        var customId = uuid();
    
        if(text){
            if(socketIO !== undefined){
                const message = {
                    text : text,
                    date : `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日(${dayGetter[date.getDay()]})`,
                    time : `${date.getHours()}:${date.getMinutes()}`,
                    customId : customId,
                }

                socketIO.emit('message',message);
            }
        }

        const target = e.target;
        target['text'].value = '';
        setText('');
    }

    useEffect(() => { //一つ疑問点として、useEffectの第二引数が指定している人が結構いるが、実装してみると一度のみしか読まれなくなってしまう。
        socketIO.once("accepter",(data) => {
            var newSocket = {
                userId : data.userId,
                username : data.username,
                date : data.date,
                time : data.time,
                text : data.text,
                customId : data.customId
            }
    
            setSocket([...socket,newSocket]);
        });
        return () => { //これがクリーンアップ関数の役割を果たす。何をしているのかというとこれ無しであると、、レンダリングのたびに何重にもsetSocketが実行されてしまうが、それを打ち消している。
            socketIO.off("accepter");
        }
    });

    return(
        <div className='channel_container'>
            <ChatHeader isLoggedIn={true} />

            <div className='chat_main'>
                <div className='channel_information'>
                    
                    <p className='channelName'>#{channel.channelName}</p>
                    <div className='channelDetail'>
                        <p className='description'>このチャンネルについて</p>
                        <input type="text" className='content' value={channel.channelDetail} disabled />
                    </div>
                    <div className='createdBy'>
                        <p className='description'>チャンネル作成者ID</p>
                        <p className='content'>{channel.createdBy}</p>
                    </div>

                    <p>{state.message}</p>
                </div>
                <DatabaseMessage
                    chatData={chatData} 
                    userId={userId}
                />
                <SocketMessage
                    socket={socket}
                    userId={userId}
                />
                <form className='message_form' onSubmit={handleSubmit}>
                    <input type="text" name='text' className='message_input' onChange={handleChange} />
                    <button className='message_submit' ><FontAwesomeIcon icon={faPaperPlane} size={'2x'} /></button>
                </form>
                <MessageDelete />
                <UserProfile />
            </div>
        </div>
    )
}

export default Channel;

//今後としては、socketへのアクセスはcontextですぐに取り次ぐことができるので、一旦他のコンポーネントに移行してみるのもありかもしれない。