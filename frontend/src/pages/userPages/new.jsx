import React,{useState,useEffect} from 'react';
import {useHistory} from 'react-router-dom';

import Header from '../../components/block/header';
import {isUpper,isAlpha,isLength,isEmail,isAscii,isContain} from '../../components/module/validation';
import {HandleError,Code303,Code500} from '../../components/module/errorHandler';
import { objCheck } from '../../components/module/objCheck';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import '../../styles/layouts/users/new.scss';


function New(props){
    const [message,setMessage] = useState('');
    const [formData,setFormData] = useState({
        first : '',
        last : '',
        email : '',
        password : '',
        passCheck : ''
    });
    const [validation,setValidation] = useState({
        first_error : '',
        last_error : '',
        email_error : '',
        password_error : '',
        passCheck_error : ''
    });

    const history = useHistory();

    useEffect(() => {
        fetch('/api/users/loginCheck')
        .then(HandleError)
        .then()
        .catch((err) => {
            if(err.status　=== 303){
                Code303(err,history);
            }else if(err.status === 500){
                Code500(err,history)
            }
        });
    },[]);

    const handleChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        /* バリデーションの設定 */
        //firstのエラー作成
        if(name === 'first'){
            if(isAlpha(value)){
                if(isUpper(value)){
                    if(isLength(value,{min:2,max:10})){
                        setValidation({...validation,hasChanged:true,first_error:''});
                    }else{
                        setValidation({...validation,hasChanged:true,first_error:'First Name : 2文字以上10文字以内で記入してください。'});
                    }
                }else{
                    setValidation({...validation,hasChanged:true,first_error:'First Name : 一文字目は大文字で記入してください。'});
                }
            }else{
                setValidation({...validation,hasChanged:true,first_error:'First Name : アルファベットで記入してください。'});
            }
        }

        //lastのエラー作成
        if(name === 'last'){
            if(isAlpha(value)){
                if(isUpper(value)){
                    if(isLength(value,{min:2,max:10})){
                        setValidation({...validation,hasChanged:true,last_error:''});
                    }else{
                        setValidation({...validation,hasChanged:true,last_error:'Last Name : 2文字以上10文字以内で記入してください。'})
                    }
                }else{
                    setValidation({...validation,hasChanged:true,last_error:'Last Name : 一文字目は大文字で記入してください。'})
                }
            }else{
                setValidation({...validation,hasChanged:true,last_error:'Last Name : アルファベットで記入してください。'})
            }
        }

        //emailのエラー作成
        if(name === 'email'){
            if(isEmail(value)){
                setValidation({...validation,hasChanged:true,email_error:''});
            }else{
                setValidation({...validation,hasChanged:true,email_error:'Email : 正しいメールアドレスを記入してください。'});
            }
        }

        //passwordのエラー作成
        if(name === 'password'){
            if(isAscii(value)){
                if(isContain(value,/[A-Za-z]/)){
                    if(isContain(value,/[0-9]/)){
                        if(isUpper(value)){
                            if(isLength(value,{min:8,max:16})){
                                setValidation({...validation,hasChanged:true,password_error:''});
                            }else{
                                setValidation({...validation,hasChanged:true,password_error:'Password : 8文字以上16字以内で記入してください。'});
                            }
                        }else{
                            setValidation({...validation,hasChanged:true,password_error:'Password : 1文字目は大文字で設定してください。'});
                        }
                    }else{
                        setValidation({...validation,hasChanged:true,password_error:'Password : 数字を使用してください。'});
                    }
                }else{
                    setValidation({...validation,hasChanged:true,password_error:'Password : アルファベットを使用してください。'});
                }
            }else{
                setValidation({...validation,hasChanged:true,password_error:'Password : パスワードに使用できない文字が含まれています。'});
            }
        }

        //passCheckのバリデーションの一時解除
        if(name === 'passCheck'){
            setValidation({...validation,hasChanged:true,passCheck_error:''});
        }

        setFormData({...formData,hasChanged:true,[name]:value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        var passCheck = formData.passCheck;
        var pass = formData.password;

        if(pass !== passCheck){
            setMessage('エラーの修正をしてください。');
            setValidation({...validation,hasChanged:true,passCheck_error:'Password Confirm : 確認の値が異なっています。'});
        }else if(objCheck(validation)){
            setMessage('エラーの修正をしてください。')
        }else{
            fetch('/api/users/create',{
                method : 'POST',
                headers : {
                    'Accept': 'application/json,text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    name : {
                        first : formData.first,
                        last : formData.last
                    },
                    email : formData.email,
                    password : formData.password
                })
            })
            .then(HandleError)
            .then(obj => {
                history.push({
                    pathname : obj.redirectPath,
                    state : {message : 'ユーザーの作成に成功しました。'}
                });
            }).catch((err) => {
                if(err.status === 400){
                    setMessage(`${err.status}_${err.type} : ${err.message}`);
                }else if(err.status === 422){
                    setMessage(`${err.status} : ${err.type}`); //まずはトップに状況を伝える

                    err.messages.forEach((e) => {
                        if(e.param === 'email'){
                            setValidation({...validation,hasChanged:true,email_error:e.msg});
                        }
                    });

                }else if(err.status === 500){
                    Code500(err,history);
                }
            });
        }        
    }


    return(
        <div className='user_new'>
            <Header loggedIn={false} />      
            <div className='create_page'>
                <div className='empty'></div>
                <div className='create-top'>
                    <p className='create-icon'>
                        <FontAwesomeIcon icon={faUserCircle} size='5x' />
                    </p>
                    <p className='create_title'>Create Account</p>
                    <p className='error_code'>{message}</p>
                </div>
                <form className='create_form' onSubmit={handleSubmit} method='POST'>
                    <div className='name_block block'>
                        <label htmlFor="name" className='label'>Name</label>
                        <input type="text" name='first' className='input-firstName input_box' placeholder='First Name' required autoFocus onChange={handleChange} />
                        <input type="text" name='last' className='input-lastName input_box' placeholder='Last Name' required  autoFocus onChange={handleChange} />
                        <p className='firstName-error error_message'>{validation.first_error}</p>
                        <p className='lastName-error error_message'>{validation.last_error}</p>
                    </div>

                    <div className='email_block block'>
                        <label htmlFor="email" className='label'>Email</label>
                        <input type="text" name='email' className='input-email input_box' placeholder='Email' required autoFocus onChange={handleChange} />
                        <p className='email-error error_message'>{validation.email_error}</p>
                    </div>

                    <div className='password_block block'>
                        <label htmlFor="password" className='label'>Password</label>
                        <input type="password" name='password' className='input-password input_box' placeholder='Password' required autoFocus onChange={handleChange} />
                        <p className='password-error error_message'>{validation.password_error}</p>
                    </div>

                    <div className='passCheck_block block'>
                        <label htmlFor="passCheck" className='label'>Password Confirm</label>
                        <input type="password" name='passCheck' className='input-passCheck input_box' placeholder='Password Confirm' required autoFocus onChange={handleChange} />
                        <p className='passCheck-error error_message'>{validation.passCheck_error}</p>
                    </div>
                    <input type="submit" className='create-submit' value='Sign Up' />
                </form>
                <div className='link'>
                    <a href="/users/login" className='user-login'>Already have an account?</a>
                </div>
            </div>
        </div>
    )
}

export default New;