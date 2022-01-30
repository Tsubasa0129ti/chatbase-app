import React,{useState,useEffect} from 'react';
import { useHistory,useLocation } from 'react-router';

import Header from '../../components/block/header';
import { Code401, Code500, HandleError } from '../../components/module/errorHandler';
import {isUpper,isAlpha,isLength} from '../../components/module/validation';
import { objCheck } from '../../components/module/objCheck';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

import '../../styles/layouts/users/edit.scss';

function Edit(props){
    const [formData,setFormData] = useState({
        first : '',
        last : ''
    });
    const [validation,setValidation] = useState({
        first_error : '',
        last_error : ''
    });

    const [message,setMessage] = useState('');

    const history = useHistory();
    const location  = useLocation();

    useEffect(() => {
        fetch('/api/users/mypage/edit')
        .then(HandleError)
        .then((obj) => {
            setFormData({
                first : obj.name.first,
                last : obj.name.last
            });
        }).catch((err) => {
            if(err.status === 401){
                Code401(err,history);
            }else if(err.status === 500){
                Code500(err,history);
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

        setFormData({...formData,hasChanged:true,[name]:value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if(objCheck(validation)){
            setMessage('エラーの修正をしてください。');
        }else{
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
            .then(HandleError)
            .then((obj) => {
                setMessage('');
                history.push({
                    pathname : obj.redirectPath,
                    state : {message : 'アカウント名の修正をしました。'}
                });
            }).catch((err) => {
                if(err.status === 400){
                    setMessage(`${err.status}_${err.type} : ${err.message}`);
                }else if(err.status === 401){
                    Code401(err,history);
                }else if(err.status === 422){
                    setMessage(`${err.status} : ${err.type}`);
                }else if(err.status  === 500){
                    Code500(err,history);
                }
            });
        }
    }

    return(
        <div>
            <Header loggedIn={true} />
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
                        <p className='error_message'>{validation.first_error}</p>
                    </div>
                    <div className='lastName_block'>
                        <label htmlFor="lastName" className='label'>Last Name</label>
                        <input type='text' name='last' className='edit_input' value={formData.last} onChange={handleChange} />
                        <p className='error_message'>{validation.last_error}</p>
                    </div>
                    <input type='submit' value='Edit Account' className='edit-submit' />
                </form>
                <div className='link'></div>
            </div>
        </div>
    )
}

export default Edit;