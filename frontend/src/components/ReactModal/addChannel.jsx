import React,{useState,useContext} from 'react';
import {useHistory} from 'react-router-dom';
import {HandleError,Code401,Code500,AddChannelValidation} from '../module/errorHandler';
import {isLength} from '../../components/module/validation';
import {AddChannelStore} from '../../components/module/store';

import '../../styles/components/ReactModal/addChannel.scss';

function AddChannel() {
    const [newChannel,setNewChannel] = useState({
        channelName : '',
        channelDetail : ''
    });
    const [message,setMessage] = useState('');
    const [validation,setValidation] = useState({
        channelName_error : '',
        channelDetail_error : ''
    });
    const {state,dispatch} = useContext(AddChannelStore);
    const history = useHistory();

    const handleChange = (e) => {
        e.preventDefault();
        const target = e.target;
        const name = target.name;
        const value = target.value;

        /* バリデーションの実行 */
        if(name === 'channelName'){
            if(isLength(value,{min:1,max:30})){
                setValidation({...validation,hasChanged:true,channelName_error:''});
            }else{
                setValidation({...validation,hasChanged:true,channelName_error:'1文字以上30文字以内で設定してください。'});
            }
        }

        if(name === 'channelDetail'){
            if(isLength(value,{max:100})){
                setValidation({...validation,hasChanged:true,channelDetail_error:''});
            }else{
                setValidation({...validation,hasChanged:true,channelDetail_error:'100文字以内で設定してください。'});
            }
        }

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
            dispatch({type:'close'});
        }).catch((err) => {
            if(err.status === 401){
                Code401(err,history);
            }else if(err.status === 422){
                var error = AddChannelValidation(err);
                setMessage(`${err.status} : ${err.type}`);
                setValidation({
                    channelName_error : error[0],
                    channelDetail_error : error[1]
                });
            }else if(err.status === 500){
                Code500(err,history);
            }
        });
    }

    const Cancel = (e) => {
        e.preventDefault();
        setMessage('');
        setValidation('');

        dispatch({type : 'close'});
    }

    if(!state.show){
        return null;
    }else{
        return (
            <div className='overray'>
                <form className='addChannelModal' onSubmit={handleSubmit}>
                    <div className='description'>
                        <h3 className='description-title'>チャンネルを作成する</h3>
                        <p className='description-msg'>チャンネルとはコミュニケーションを取る場所です。</p>
                        <p className='description-msg'>特定のトピックに基づいてチャンネルを作ると良いでしょう。</p>
                    </div>
                    <div className='close'>
                        <a href="/" className='close_button' onClick={Cancel}>X</a>
                    </div>
                    <div className='error'>
                        <p>{message}</p>
                    </div>
                    <div className='channel_name'>
                        <label htmlFor="channelName">チャンネル名</label>
                        <input type="text" name='channelName' required onChange={handleChange} />
                        <p className='validation'>{validation.channelName_error}</p>
                        <p className='clear'></p>
                    </div>
                    <div className='channel_detail'>
                        <label htmlFor="channelDetail">チャンネル詳細</label>
                        <input type="text" className='channelDetail' name='channelDetail' onChange={handleChange} />
                        <p className='validation'>{validation.channelDetail_error}</p>
                    </div>
                    <input type="submit" className='create_button' value='作成' />
                </form>
            </div>
            
        )
    }
}

export default React.memo(AddChannel);