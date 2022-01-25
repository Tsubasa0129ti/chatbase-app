import {useState,useEffect} from 'react';
import {useHistory} from 'react-router';
import queryString from 'query-string';

import ChatHeader from '../../components/block/chatHeader';
import AddChannel from '../../components/module/addChannel';

function ChatPage(props){
    const [isLoggedIn,setIsLoggedIn] = useState(false); //chatHeaderに送っているが、もしかしたら分離するかも
    const [username,setUsername] = useState('');
    const [add,setAdd] = useState(false);
    const [count,setCount] = useState('');
    const [channel,setChannel] = useState([]);

    const history = useHistory();

    useEffect(() => {
        var search = props.location.search;
        var query = queryString.parse(search);

        fetch(`/api/chat?page=${query.page}`) //fetch内部の処理については、今は後回し。
        .then((res) => {
            if(!res.ok){
                console.error('res.ok:',res.ok);
                console.error('res.status:',res.status);
                console.error('res.statusText:',res.statusText);
                
                throw new Error();
            }
            return res.json();
        }).then((obj) => {
            setIsLoggedIn(obj.isLoggedIn);
            setUsername(obj.username);
            setChannel(obj.channel);
            setCount(obj.count);

        }).catch((err) => {
            if(err.status === 401){
                history.push({
                    pathname : '/users/login',
                    state : {message : `${err.status} : ログインしてください。`}
                });
            }else if(err.status >= 500){
                console.error(`${err.status} : ${err.message}`);
            }else{
                console.error(err.message);
            }
        });
    },[]);

    const popup = (e) => {
        e.preventDefault();
        setAdd(true);
    };

    const cancel = (e) => {
        e.preventDefault();
        setAdd(false);
    };

    if(!channel){
        return null;
    }else{
        if(count === 0){
            return(
                <div>
                    <ChatHeader isLoggedIn={isLoggedIn} username={username} />
                    <p>チャンネルが存在しません。</p>
                    <p>作成ページより、チャンネルの作成をしてください。</p>
                    {/* <Guide />
                    <AddChannel /> */}
                </div>
            )
        }else{
            const items = [];
            for(var i=0;i<channel.length;i++){
                items.push(
                    <div>
                        <a href={'/chat/page/' + channel[i]._id}>{channel[i].channelName}</a>
                        <p>更新日　：　{channel[i].updatedAt}</p>
                        <p>チャンネル詳細　：　{channel[i].channelDetail}</p>
                        <p>チャンネル作成者　：　{channel[i].createdBy}</p>
                    </div>
                )
            }

            return(
                <div>
                    <ChatHeader isLoggedIn={isLoggedIn} username={username} />
                    <div className='new_channel'>
                        <p>チャンネル件数　：　{count}件</p>
                        {items}
                        <div className='paging'></div>
                    </div>
                    {/* <Guide /> */}
                    <a href="/" onClick={popup}>+</a>
                    <AddChannel add={add} onEventCallback={(e) => {cancel(e)}} />
                </div>
            )
        }
    }
}

export default ChatPage;

//この後やること、、、　③ページングの適用(ページのリンクにクエリ情報の付与/ 存在しないページの場合の分岐も考える）　④ページ変換ごとに、サーバーへの接続　⑤addpopupとそのほかのUI