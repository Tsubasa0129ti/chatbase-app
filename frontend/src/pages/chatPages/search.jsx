import {useState,useEffect, useContext} from 'react';
import { useHistory,useLocation } from 'react-router';
import queryString from 'query-string';

import ChatHeader from '../../components/block/chatHeader';
import AddChannel from '../../components/ReactModal/addChannel';
import Pagination from '../../components/atoms/pagination';
import {HandleError,Code401,Code500} from '../../components/module/errorHandler';
import {AddChannelStore} from '../../components/module/store';

function Search(){
    const [count,setCount] = useState('');
    const [channel,setChannel] = useState([]);

    const {state,dispatch} = useContext(AddChannelStore);

    const history  = useHistory();
    const location = useLocation();

    var search = location.search;

    useEffect(() => {
        var query = queryString.parse(search);

        fetch(`/api/chat/search?q=${query.q}&sort=${query.sort}&page=${query.page}`)
        .then(HandleError)
        .then((obj) => {  
            setCount(obj.count);
            setChannel(obj.channel);
        }).catch((err) => {
            if(err.status === 401){
                Code401(err,history);
            }else if(err.status === 500){
                Code500(err,history);
            }
        });
    },[search]);

    const Content = (element) => {
        const items = [];

        element.forEach((channel) => {
            items.push(
                <div>
                    <a href={`/chat/page/${channel._id}`}>{channel.channelName}</a>
                    <p>更新日 : {channel.updatedAt}</p>
                    <p>チャンネル詳細 : {channel.channelDetail}</p>
                    <p>チャンネル作成者 : {channel.createdBy}</p>
                </div>
            )
        });
        return items;
    }

    const popup = (e) => {
        e.preventDefault();
        dispatch({type : 'popup'})
    }

    if(!channel){
        return null;
    }else{
        if(count === 0){
            return(
                <div>
                    <ChatHeader />
                    <p>検索結果 :  {count}件</p>
                    <p>チャンネルが見つかりません。</p>
                    <p>検索し直してください。</p>
                    <a href="/" onClick={popup}>+</a>
                    <AddChannel />
                </div>
            )
        }else{
            return(
                <div>
                    <ChatHeader />
                    <div className='new_channel'>
                        <p>チャンネル件数 : {count}件</p>
                        {Content(channel)}
                        <div className='paging'></div>
                    </div>
                    <a href="/" onClick={popup}>+</a>
                    <AddChannel />
                    <Pagination pageCount={Math.ceil(count/5)} />
                </div>
            )
        }
    }
}

export default Search;