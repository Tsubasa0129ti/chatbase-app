import {useState,useEffect} from 'react';
import { useHistory } from 'react-router';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';

import Header from '../../components/block/header';
import {Code303, Code401, Code500, ProfileValidation, HandleError} from '../../components/module/errorHandler';
import {isEmpty,isAddress,isURL,isInt} from '../../components/module/validation';
import {objCheck} from '../../components/module/objCheck';

import '../../styles/layouts/profiles/edit.scss';

function Edit(props){
    const [email,setEmail] = useState('');
    const [formData,setFormData] = useState({
        country : '',
        address : '',
        professional : '',
        site : '',
        gender : '',
        age : '',
        birthday : '',
        intro : ''
    });
    const [message,setMessage] = useState('');
    const [validation,setValidation] = useState({
        address_error : '',
        site_error : '',
        age_error : ''
    });

    const history = useHistory();

    useEffect(() => {
        fetch('/api/profile/edit')
        .then(HandleError)
        .then((obj) => {
            setEmail(obj.email);
            setFormData({
                country :  obj.profile.country,
                address : obj.profile.address,
                professional : obj.profile.professional,
                site : obj.profile.site,
                gender : obj.profile.gender,
                age : obj.profile.age,
                birthday : obj.profile.birthday,
                intro : obj.profile.intro
            });
        }).catch((err) => {
            if(err.status === 303){
                Code303(err,history);
            }else if(err.status === 401){
                Code401(err,history);
            }else if(err.status >= 500){
                Code500(err,history);
            }
        });
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

        setFormData({...formData,hasChanged:true,[name]:value});
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(objCheck(validation)){
            setMessage('エラーの修正をしてください。');
        }else{
            fetch('/api/profile/update',{
                method : 'PUT',
                headers : {
                    'Accept': 'application/json,text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    country : formData.country,
                    address : formData.address,
                    professional : formData.professional,
                    site : formData.site,
                    gender : formData.gender,
                    age : formData.age,
                    birthday : formData.birthday,
                    intro : formData.intro
                })
            })
            .then(HandleError)
            .then((obj) => {
                history.push({
                    pathname : obj.redirectPath,
                    state : {message : 'プロフィールの更新に成功しました。'}
                });
            }).catch((err) => {
                if(err.status === 401){
                    Code401(err,history);
                }else if(err.status === 422){
                    var error = ProfileValidation(err);
                    setMessage(`${err.type} : ${err.type}`);
                    setValidation({
                        age_error : error[0],
                        site_error : error[1]
                    });
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
                <div className='page-top'>  
                    <h1 className='page-title'>
                        <p className='page-title-main'>Edit Profile</p>
                        <p className='page-title-sub'>プロフィールの編集</p>
                    </h1>
                    <div className='lowlayer-link'>
                        <ul className='breadcrumb'>
                            <li><a className='toHome' href="/">Home</a></li>
                            <li className='line'></li>
                            <li><span>プロフィールの編集</span></li>
                        </ul>    
                    </div> 
                </div>
                <div className='container'>
                    <form className='edit-form' onSubmit={handleSubmit}>
                        <div className='form-top'>
                            <p className='form-top-title'><FontAwesomeIcon icon={faUser} /> About</p>
                            <p className='form-top-detail'>以下のフォームからプロフィール情報の更新をしてください。</p>
                            <p className='error_code'>{message}</p>
                        </div>
                        <div className='contact-info'>
                            <p className='information-title'>Contact Information</p>
                            <div className='content'>
                                <label htmlFor="email" className='label'>Email</label>
                                <div className='item'>
                                    <input type="text" className='input-item' value={email} disabled />
                                </div>
                            </div>
                            <div className='content'>
                                <label htmlFor="country" className='label'>Country</label>
                                <div className='item'>
                                    <input type="text" name='country' className='input-item' value={formData.country} onChange={handleChange} />
                                </div>
                            </div>
                            <div className='content'>
                                <label htmlFor="Address" className='label'>Address</label>                                
                                <div className='item'>
                                    <input type="text" name='address' className='input-item' value={formData.address} onChange={handleChange} />
                                    <p className='error_message'>{validation.address_error}</p>
                                </div>
                            </div>
                            <div className='content'>
                                <label htmlFor="professional" className='label'>Professional</label>
                                <div className='item'>
                                    <input type="text" name='professional' className='input-item' value={formData.professional} onChange={handleChange} />
                                </div>
                            </div>
                            <div className='content'>
                                <label htmlFor="site" className='label'>Site</label>
                                <div className='item'>
                                    <input type="text" name='site' className='input-item' value={formData.site} onChange={handleChange} />
                                    <p className='error_message'>{validation.site_error}</p>
                                </div>
                            </div>
                        </div>
                        <div className='basic-info'>
                            <p className='information-title'>Basic Information</p>
                            <div className='content'>
                                <label htmlFor="gender" className='label'>Gender</label>
                                <div className='item'>
                                    <select name="gender" className='input-item' value={formData.gender} onChange={handleChange}>
                                        <option hidden vale="">選択してください</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="no-answer">No Answer</option>
                                    </select>
                                </div>
                            </div>
                            <div className='content'>
                                <label htmlFor="age" className='label'>Age</label>
                                <div className='item'>
                                    <input type="number" name='age' className='input-item' value={formData.age} onChange={handleChange} />
                                    <p className='error_message'>{validation.age_error}</p>
                                </div>
                            </div>
                            <div className='content'>
                                <label htmlFor="birthday" name='birthday' className='label'>Birthday</label>
                                <div className='item'>
                                    <input type="date" name='birthday' className='input-item' value={formData.birthday} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <input type='submit' className='edit-btn' value='Edit' />
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Edit;