import React,{useState,useEffect} from 'react';
import { useHistory } from 'react-router';
import queryString from 'query-string';

import ChatHeader from '../../components/block/chatHeader';

function Search(props){
    const [isLoggedIn,setIsLoggedIn] = useState(false); //統一もしくは名前を変える
    const [username,setUsername] = useState('');
    const [count,setCount] = useState('');
    const [channel,setChannel] = useState([]);

    const history  = useHistory();

    useEffect(() => {
        var search = props.location.search
        var query = queryString.parse(search);

        fetch(`/api/chat/search?q=${query.q}&sort=${query.sort}&page=${query.page}`)
        .then((res) => {
            if(!res.ok){
                console.error('res.ok:',res.ok);
                console.error('res.status:',res.status);
                console.error('res.statusText:',res.statusText);

                throw new Error();
            }
            return res.json();
        }).then((obj) => {  
            setIsLoggedIn(obj.isLoggedIn); //ここ冗長な感じがするな　mainともども統一するかも
            setUsername(obj.username);
            setCount(obj.count);
            setChannel(obj.channel);
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

    if(!channel){
        return null;
    }else{
        if(count === 0){
            return(
                <div>
                    <ChatHeader isLoggedIn={isLoggedIn} username={username} />
                    <p>検索結果　：　 {count}件</p>
                    <p>チャンネルが見つかりません。</p>
                    <p>検索し直してください。</p>
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
                    {/* <Guide />
                    <AddChannel /> */}
                </div>
            )
        }
    }
}

export default Search;