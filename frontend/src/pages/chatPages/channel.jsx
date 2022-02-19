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

//現状root上にsocketがないため、エンドポイントを設定しても読み取れられることは無くなってしまう。とすると最終的には/chatのルート上にこれを設定すれば余計なロードは減るかもしれない
//socketの接続場所を作成する。そして、ここにいる限りは接続されるようにする。そこに作成、編集、削除の全ての機能を委ねる。

function Channel(){
    const [userId,setUserId] = useState(''); //これはsessionが適用され次第削除したい。
    const [username,setUsername] = useState(''); //同様
    const [text,setText] = useState('');
    const [channel,setChannel] = useState({});
    const [chatData,setChatData] = useState([]); //chatのメッセージ管理を行
    const [socket,setSocket] = useState(''); //socketのメッセージ管理を行う

    const {state} = useContext(ProfileStore); //stat.messageでuserProfileのユーザーがいない場合のエラーを取得できるようにした。

    const history = useHistory();
    const location = useLocation();

    const socketIO = useContext(SocketContext); //これをロードすることによって、socketのロード回数を減らすことには成功した。

    useEffect(() => {//初期ロード時に読み込むもの
        var path = location.pathname;
        var id = path.split("/")[3];

        fetch(`/api/chat/${id}`)
        .then(HandleError)
        .then((obj) => {
            setUserId(obj.userId);
            setUsername(obj.username);
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
                    userId : userId,
                    username : username,
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

    useEffect(() => { //これがsocketの内容の変化に応じて取得されるもの
        socketIO.once("accepter",(data) => {
            console.log('effect')
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
            console.log('cleanup')
            socketIO.off("accepter");
        }
    });

    console.log('render')

    return(
        <div>
            <ChatHeader isLoggedIn={true} />

            <div className='chat_main'>
                <div className='channel_information'>
                    <p>チャンネル名 : {channel.channelName}</p>
                    <p>チャンネル詳細 : {channel.channelDetail}</p>
                    <p>作成者 : {channel.createdBy}</p>
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
                <form className='message_submit' onSubmit={handleSubmit}>
                    <input type="text" name='text' onChange={handleChange} />
                    <input type="submit" value='送信' />
                </form>
                <MessageDelete />
                <UserProfile />
            </div>
        </div>
    )
}

export default Channel;