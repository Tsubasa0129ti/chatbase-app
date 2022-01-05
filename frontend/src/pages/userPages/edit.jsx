import React,{useState,useEffect} from 'react';
import { useHistory,useLocation } from 'react-router';

import Header from '../../components/block/header';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import '../../styles/layouts/users/edit.scss';

function Edit(props){
    const [formData,setFormData] = useState({
        first : '',
        last : ''
    });
    const [first_error,setFirst_error] = useState('');
    const [last_error,setLast_error] = useState('');
    const [message,setMessage] = useState('');

    const history = useHistory();
    const location  = useLocation();

    useEffect(() => {
        const error = new Error();

        fetch('/api/users/mypage/edit')
        .then((res) => {
            if(!res.ok){
                console.error('res.ok:',res.ok);
                console.error('res.status:',res.status);
                console.error('res.statusText:',res.statusText);

                error.status = res.status;
                error.message = res.statusText;
                throw error;
            }
            return res.json();
        })
        .then((obj) => {
            setFormData({
                first : obj.name.first,
                last : obj.name.last
            });
        }).catch((err) => {
            if(err.status === 401){
                history.push({
                    pathname : '/users/login',
                    state : {message : `${err.status} : ログインしてください。`}
                });
            }else if(err.status >= 500){
                history.push({
                    pathname : '/users/mypage',
                    state : {message : `${err.status} : ${err.message}`}
                });
            }else{
                history.push({
                    pathname : '/users',
                    state : {message : err.message}
                });
            }
        });
    },[]);

    useEffect(() => {
        if(location.state){
            setMessage(location.state);
        }
    },[]);

    const handleChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        //first_errorの出力
        if(name === 'first'){
            if(nameChecker(value)){
                setFirst_error('First Name : 1文字目は、大文字で設定してください。')
            }else{
                if(value.length <= 3 || value.length >= 8){
                    setFirst_error('First Name : 名前は4~7文字で記入してください。')
                }else{
                    setFirst_error('')
                }
            }
        }

        //last_errorの出力
        if(name === 'last'){
            if(nameChecker(value)){
                setLast_error('Last Name : 1文字目は、大文字で設定してください。');
            }else{
                if(value.length <= 3 || value.length >= 8){
                    setLast_error('Last Name : 名前は4~7文字で記入してください。');
                }else{
                    setLast_error('');
                }
            }
        }

        function nameChecker(str){
            var checker = str.match(/[A-Z]{1}[A-Za-z]*/);
            if(!checker){
                return true;
            }
        };

        setFormData({...formData,hasChanged:true,[name]:value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(first_error || last_error){
            setMessage('エラーの修正をしてください。');
        }else{
            const error = new Error();

            fetch('/api/users/mypage/update',{　
                method : 'PUT',
                headers : {
                    'Accept': 'application/json,text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    name : {
                        first : formData.first,
                        last : formData.last
                    }
                })
            })
            .then((res) => {
                if(!res.ok){
                    console.error('res.ok:',res.ok);
                    console.error('res.status:',res.status);
                    console.error('res.statusText:',res.statusText);

                    error.message = res.statusText;
                    error.status = res.status;
                    throw error;
                }
                return res.json();
            })
            .then((obj) => {
                setMessage('');
                history.push({
                    pathname : obj.redirectPath,
                    state : {message : 'アカウントの変更をしました。'}
                });
            }).catch((err) => {
                if(err.status === 401){
                    history.push({
                        pathname : '/users/login',
                        state : {message : `${err.status} : ログインしてください。`}
                    });
                }else if(err.status >= 500){
                    setMessage(`${err.status} : ${err.message}`);
                }else{
                    history.push({
                        pathname : '/users/mypage',
                        state : {message : err.message}
                    });
                }
            });
        }
    }

    return(
        <div>
            <Header />
            <div className='userEdit_page'>
                <div className='edit-top'>
                    <p className='edit-icon'>
                        <FontAwesomeIcon icon={faPen} size='5x' />
                    </p>
                    <p className='edit-title'>Edit Account</p>
                    <p className='error_code'>{message}</p>
                </div>
                <form className='edit_form' onSubmit={handleSubmit}>
                    <div className='firstName_block'>
                        <label htmlFor="firstName" className='label'>First Name</label>
                        <input type="text" name='first' className='edit_input' value={formData.first} onChange={handleChange} />
                        <p className='error_message'>{first_error}</p>
                    </div>
                    <div className='lastName_block'>
                        <label htmlFor="lastName" className='label'>Last Name</label>
                        <input type='text' name='last' className='edit_input' value={formData.last} onChange={handleChange} />
                        <p className='error_message'>{last_error}</p>
                    </div>
                    <input type='submit' value='Edit Account' className='edit-submit' />
                </form>
                <div className='link'></div>
            </div>
        </div>
    )
}

export default Edit;
//これに関する不足点　①サーバー全般　②バリデーション機能(フロント部分は完了)