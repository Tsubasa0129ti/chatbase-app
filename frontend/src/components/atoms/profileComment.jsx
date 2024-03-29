import React,{useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faComment,faEdit} from '@fortawesome/free-solid-svg-icons';

import { HandleError, Code401, Code500 } from '../module/errorHandler';
import { isLength } from '../module/validation';

import '../../styles/components/atoms/profileComment.scss';

function ProfileComment(props){

    const [edit,setEdit] = useState(false);
    const [intro,setIntro] = useState(props.intro);
    const [message,setMessage] = useState('');

    const history = useHistory();

    const onFieldChange = (e) => {
        e.preventDefault();
        setEdit(true);
    };

    const cancel = (e) => {
        e.preventDefault();
        setMessage('');
        setEdit(false);
    }

    const update = (e) => {
        e.preventDefault();
        var input = document.getElementById('intro-form-inner').textContent;

        if(props.intro === input){
            cancel(e);
        }else if(isLength(input,{min:0,max:100})){
            setIntro(input);
        }else{
            setMessage('コメントは100字以内に設定してください。');
        }
    }

    useEffect(() => {
        if(edit){
            fetch('/api/profile/introUpdate',{
                method : 'PUT',
                headers : {
                    'Accept': 'application/json,text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    intro : intro
                })
            })
            .then(HandleError)
            .then(() => setEdit(false)
            ).catch((err) => {
                if(err.status === 401){
                    Code401(err,history);
                }else if(err.status === 500){
                    Code500(err,history);
                }
            });
        } 
    },[intro])
    
    if(!edit){
        return(
            <div className='comment'>
                <div className='comment-top'>
                    <p className='comment-title'><FontAwesomeIcon icon={faComment} /> Comment</p>
                    <a 
                        href="/"
                        className='changeField'
                        onClick={onFieldChange}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </a>
                </div>
                <div className='intro'>
                    <p className='intro-text'>{intro}</p>
                </div>
            </div>
        )  
    }else{
        return(
            <div className='comment'>
                <div className='comment-top'>
                    <p className='comment-title'><FontAwesomeIcon icon={faComment} /> Comment</p>
                    <a 
                        href="/"
                        className='changeField'
                        onClick={onFieldChange}
                    >
                        <FontAwesomeIcon icon={faEdit} />
                    </a>
                </div>

                <div className='change-intro'>
                    <p className='error_code'>{message}</p>
                    <div className='intro-form'>
                        <p name="intro" id='intro-form-inner' className='intro-form-inner' contenteditable="true">{intro}</p>
                    </div>
                    <div className='button'>
                        <input type="submit" className='toCancel' value='Cancel' onClick={cancel}  />
                        <input type="submit" className='toUpdate' value='Update' onClick={update} />
                    </div>
                </div>
            </div>
        )

    }
}

export default React.memo(ProfileComment);