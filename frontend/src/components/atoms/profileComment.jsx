import {useState} from 'react';
import {useHistory} from 'react-router-dom';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faComment,faEdit} from '@fortawesome/free-solid-svg-icons';

import '../../styles/components/atoms/profileComment.scss';

function ProfileComment(props){

    const [edit,setEdit] = useState(false);
    const [intro,setIntro] = useState(props.intro);//初期値に関しては、とりあえずこれにしておくけど後々かえるかもしれない
    const [message,setMessage] = useState('');

    const history = useHistory();

    const onFieldChange = (e) => {
        e.preventDefault();
        setEdit(true);
    };

    const handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        if(name === 'intro'){
            if(value.length > 100){
                setMessage('コメントは100字以内に設定してください。');
            }else{
                setMessage('');
            }
        }

        setIntro(value);
    }

    const cancel = (e) => {
        e.preventDefault();
        setEdit(false);
    }

    const update = (e) => {
        e.preventDefault();

        if(message){
            setMessage('エラーの修正をしてください。');
        }else{
            const error = new Error();

            fetch('/api/profile/introUpdate',{
                method : 'PUT',
                headers : {
                    'Accept': 'application/json,text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    intro : intro
                })
            }).then((res) => {
                if(!res.ok){
                    console.error('res.ok:',res.ok);
                    console.error('res.status',res.status);
                    console.error('res.statusText:',res.statusText);

                    error.status = res.status;
                    error.message = res.statusText;
                    throw error;
                }
                return res.json();
            }).then((obj) => {
                setEdit(false);
                history.push({
                    pathname : obj.redirectPath,
                    state : {message : 'プロフィールの更新に成功しました。'}
                });
            }).catch((err) => {
                if(err.status === 401){
                    history.push({
                        pathname : '/users/login',
                        state : {message : `${err.status} : ログインしてください。`}
                    });
                }else if(err.status >= 500){
                    setMessage(`${err.status} : ${err.message}`)
                }else{
                    history.push({
                        pathname : '/users/mypage',
                        stete : {message : err.message}
                    });
                }
            });
        }
    }
    

    if(!edit){
        console.log("aaa")
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
        console.log('abc')
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
                    <textarea name="intro" className='intro-form' value={intro} onChange={handleChange}></textarea>
                    <input type="submit" className='toCancel' value='Cancel' onClick={cancel}  />
                    <input type="submit" className='toUpdate' value='Update' onClick={update} />
                </div>
            </div>
        )

    }
}

export default ProfileComment;