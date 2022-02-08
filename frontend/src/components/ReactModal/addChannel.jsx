import {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {HandleError,Code401,Code500} from '../module/errorHandler';

import '../../styles/components/ReactModal/addChannel.scss';

function AddChannel(props) {
    const [newChannel,setNewChannel] = useState({
        channelName : '',
        channelDetail : ''
    });
    const [message,setMessage] = useState('');
    const history = useHistory();

    const handleChange = (e) => {
        e.preventDefault();
        const target = e.target;
        const name = target.name;
        const value = target.value;

        setNewChannel({...newChannel,hasChanged:true,[name]:value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('/api/chat/create',{
            method : 'POST',
            headers : {
                'Accept': 'application/json,text/plain, */*',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                channelName : newChannel.channelName,
                channelDetail : newChannel.channelDetail,
            })
        })
        .then(HandleError)
        .then((obj) => {
            history.push({
                pathname : obj.redirectPath,
                state : {message : 'チャンネル作成に成功しました。'}
            });
        }).catch((err) => {
            if(err.status === 401){
                Code401(err,history);
            }else if(err.status === 422){
                setMessage(`${err.status} : ${err.type}`);
                console.log(err);
            }else if(err.status === 500){
                Code500(err,history);
            }
        });
    }

    if(!props.show){
        return null;
    }else{
        return (
            <div className='overray'>
                <form className='addChannelModal' onSubmit={handleSubmit}>
                    <div className='description'>
                        <h3>チャンネルを作成する</h3>
                        <p>チャンネルとはコミュニケーションを取る場所です。</p>
                        <p>特定のトピックに基づいてチャンネルを作ると良いでしょう。</p>
                    </div>
                    <div className='close'>
                        <a href="/" className='close_button' onClick={props.cancel}>X</a>
                    </div>
                    <div className='error'>
                        <p>{message}</p>
                    </div>
                    <div className='channel_name'>
                        <label htmlFor="channelName">チャンネル名</label>
                        <input type="text" className='channelName' name='channelName' required onChange={handleChange} />
                    </div>
                    <div className='detail'>
                        <label htmlFor="channel_detail">
                            <label htmlFor="channelDetail">チャンネル詳細</label>
                            <input type="text" className='channelDetail' name='channelDetail' required onChange={handleChange} />
                        </label>
                    </div>
                    <input type="submit" value='作成' />
                </form>
            </div>
            
        )
    }
}

export default AddChannel;