import React,{useState,useEffect} from 'react';
import { useHistory,useLocation } from 'react-router';

import Header from '../../components/block/header';
import { Code303, Code401, Code500, HandleError } from '../../components/module/errorHandler';
import {isEmpty,isAddress,isURL,isInt,isLength} from '../../components/module/validation';
import { objCheck } from '../../components/module/objCheck';

import '../../styles/layouts/profiles/new.scss';

function New(props){
    const [formData,setFormData] = useState({
        intro : '',
        country : '',
        address : '',
        professional : '',
        site : '',
        gender : '',
        age : '',
        birthday : ''
    });
    const [message,setMessage] = useState('');
    const [validation,setValidation] = useState({
        address_error : '',
        site_error : '',
        age_error : '',
        intro_error : '',
    });

    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        fetch('/api/profile/new')
        .then(HandleError)
        .then()
        .catch((err) => {
            if(err.status === 303){
                Code303(err,history);
            }else if(err.status === 401){
                Code401(err,history);
            }else if(err.status === 500){
                Code500(err,history);
            }
        });
    },[]);

    useEffect(() => {
        if(location.state){
            setMessage(location.state.message);
        }
    },[]);

    const handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        if(name === 'address'){
            if(isEmpty(value)){
                setValidation({...validation,hasChanged:true,address_error:''});
            }else{
                if(isAddress(value)){
                    setValidation({...validation,hasChanged:true,address_error:''});
                }else{
                    setValidation({...validation,hasChanged:true,address_error:'*ハイフンを含めた、正しい郵便番号を記入してください。'});
                }
            }
        }

        if(name === 'site'){
            if(isEmpty(value)){
                setValidation({...validation,hasChanged:true,site_error:''});
            }else{
                if(isURL(value)){
                    setValidation({...validation,hasChanged:true,site_error:''});
                }else{
                    setValidation({...validation,hasChanged:true,site_error:'正しいURLを記入してください。'});
                }
            }
        }

        if(name === 'age'){
            if(isEmpty(value)){
                setValidation({...validation,hasChanged:true,age_error:''});
            }else{
                if(isInt(value,{min:0,max:120})){
                    setValidation({...validation,hasChanged:true,age_error:''});
                }else{
                    setValidation({...validation,hasChanged:true,age_error:'*正しい年齢を記載してください。'});
                }
            }
        }
        
        if(name === 'intro'){
            if(isLength(value,{min:0,max:100})){
                setValidation({...validation,hasChanged:true,intro_error:''});
            }else{
                setValidation({...validation,hasChanged:true,intro_error:'*Intro　: ひとことは100文字以内に設定してください。'});
            }
        }
        
        setFormData({...formData,hasChanged:true,[name]:value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(!objCheck(formData)){
            setMessage('*Formを記入してください。');
        }else if(objCheck(validation)){
            setMessage('*エラーを修正してください。');
        }else{
            fetch('/api/profile/create',{
                method : 'POST',
                headers : {
                    'Accept': 'application/json,text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    intro : formData.intro,
                    country : formData.country,
                    address : formData.address,
                    professional : formData.professional,
                    site : formData.site,
                    gender : formData.gender,
                    age : formData.age,
                    birthday : formData.birthday,
                })
            })
            .then(HandleError)
            .then((obj) => { //ここでは成功時の処理しか扱わない
                history.push({
                    pathname : obj.redirectPath,
                    state : {message : 'プロフィールの作成に成功しました。'}
                });
            }).catch((err) => {
                if(err.status === 303){
                    Code303(err,history);
                }else if(err.status === 401){
                    Code401(err,history);
                }else if(err.status === 500){
                    Code500(err,history);
                }
            });
        }
    };

    return(
        <div>
            <Header loggedIn={true} />

            <div className='main'>
                <div className='main-top'>
                    <h1 className='main-title'>
                        <span className='page-title-main'>Create Profile</span>
                        <span className='page-title-sub'>プロフィールの作成</span>
                    </h1>
                    <div className='lowlayer-link'>
                        <ul className='breadcrumb'>
                            <li><a className='toHome' href="/">Home</a></li>
                            <li className='line'></li>
                            <li><span>Create Profile</span></li>
                        </ul>
                    </div>
                </div>
                

                <div className='profile'>
                    <div className='profile-status'>
                        <div className='profile-status-inner'>
                            <p>プロフィール作成画面</p>
                        </div>
                    </div>

                    <div className='profile-form'>
                        <div className='profile-form-inner'>
                            <form onSubmit={handleSubmit} className='submit-form'>
                                <div className='contact-information'>
                                    <p>Contact Information</p>
                                    <div className='content'>
                                        <label htmlFor="country" className='label'>Country　:</label>
                                        <input type="text" name='country' className='item' onChange={handleChange} />
                                    </div>
                                    <div className='content'>
                                        <label htmlFor="Address" className='label'>Address　:</label>
                                        <input type="text" name='address' className='item' onChange={handleChange} />
                                        <p className='error-message'>{validation.address_error}</p>
                                    </div>
                                    <div className='content'>
                                        <label htmlFor="professional" className='label'>Professional　:</label>
                                        <input type="text" name='professional' className='item' onChange={handleChange} />
                                    </div>
                                    <div className='content'>
                                        <label htmlFor="site" className='label'>Site　:</label>
                                        <input type="text" name='site' className='item' onChange={handleChange} />
                                        <p className='error-message'>{validation.site_error}</p>
                                    </div>
                                </div>

                                <div className='basic-information'>
                                    <p>Basic Information</p>
                                    <div className='content'>
                                        <label htmlFor="gender" className='label'>Gender　:</label>
                                        <select name="gender" className='item'　onChange={handleChange}>
                                            <option hidden value="">選択してください</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="no-answer">No Answer</option>
                                        </select>
                                    </div>
                                    <div className='content'>
                                        <label htmlFor="age" className='label'>Age　:</label>
                                        <input type="number" name='age' className='item' onChange={handleChange} />
                                        <p className='error-message'>{validation.age_error}</p>
                                    </div>
                                    <div className='content'>
                                        <label htmlFor="birthday" className='label'>Birthday　:</label>
                                        <input type="date" name='birthday' className='item' onChange={handleChange} />
                                    </div>
                                </div>

                                <div className='comment'>
                                    <p>Comment</p>
                                    <div className='content'>
                                        <label htmlFor="intro" className='label'>Introduction　:</label>
                                        <textarea name='intro' className='item' maxLength='100' onChange={handleChange} />
                                        <p className='error-message'>{validation.intro_error}</p>
                                    </div>
                                </div>

                                <div className='error-code'>
                                    <p>{message}</p>
                                </div>
                                <input type='submit' value='Create Profile' className='toCreate' />
                            </form>
                        </div>
                    </div>

                </div>
            </div>
                {/* ここでfooterを読み込む */}
        </div>
    )
}

export default New;