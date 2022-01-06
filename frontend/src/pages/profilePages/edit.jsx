import React,{useState,useEffect} from 'react';
import { useHistory } from 'react-router';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faUser} from '@fortawesome/free-solid-svg-icons';

import Header from '../../components/block/header';

function Edit(props){
    const [email,setEmail] = useState('');
    const [formData,setFormData] = useState({
        country : '',
        address : '',
        professional : '',
        belongings : '',
        site : '',
        gender : '',
        age : '',
        birthday : '',
        intro : ''
    });
    const [message,setMessage] = useState('');
    const [validation,setValidation] = useState({
        age_error : '',
        address_error : ''
    });

    const history = useHistory();

    useEffect(() => {
        const error = new Error();

        fetch('/api/profile/edit')
        .then((res) => {
            if(!res.ok){
                console.error('res.ok:',res.ok);
                console.error('res.status:',res.status);
                console.error('res.statusText',res.statusText);

                error.status = res.status;
                error.statusText = res.statusText;
                throw error;
            }
            return res.json();
        })
        .then((obj) => {
            if(obj.notExist){
                history.push({
                    pathname : obj.redirectPath,
                    state : {message : obj.result}
                });
            }else{
                setEmail(obj.email);
                setFormData({
                    country :  obj.profile.country,
                    address : obj.profile.address,
                    professional : obj.profile.professional,
                    belongings : obj.profile.belongings,
                    site : obj.profile.site,
                    gender : obj.profile.gender,
                    age : obj.profile.age,
                    birthday : obj.profile.birthday,
                    intro : obj.profile.intro
                });
            }
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
    
    const handleChange = (e) => {
        const target = e.target;
        const name = target.name;
        const value = target.value;

        if(name === 'age'){
            if(value < 0 || value > 120){
                setValidation({...validation,hasChanged:true,age_error:'正しい年齢を記載してください。'});
            }else{
                setValidation({...validation,hasChanged:true,age_error:''});
            }
        }

        if(name === 'address'){
            if(addressChecker(value)){
                setValidation({...validation,hasChanged:true,address_error:'ハイフンを含めた、正しい郵便番号を記入してください。'});
            }else{
                setValidation({...validation,hasChanged:true,address_error:''});
            }
        }

        function addressChecker(str) {
            var checker = str.match(/^[0-9]{3}-[0-9]{4}$/);
            if(checker || str===""){
                return false;
            }else{
                return true;
            }
        };

        setFormData({...formData,hasChanged:true,[name]:value});
        console.log(`name : ${name}/ value : ${value}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(validation.address_error || validation.age_error){
            setMessage('エラーの修正をしてください。');
        }else{
            const error = new Error();

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
                    belongings : formData.belongings,
                    site : formData.site,
                    gender : formData.gender,
                    age : formData.age,
                    birthday : formData.birthday,
                    intro : formData.intro
                })
            }).then((res) =>{
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
    };

    return(
        <div>
            <Header />
            <div>
                <div className='profile-detail'>
                    <form onSubmit={handleSubmit} className='about'>
                        <p className='about-top'><FontAwesomeIcon icon={faUser} /> About</p>
                        <p className='error_code'>{message}</p>
                        <div className='contact-info'>
                            <p>Contact Information</p>
                            <div className='content'>
                                <label htmlFor="email" className='label'>Email　:</label>
                                <input type="text" className='item' value={email} disabled />
                            </div>
                            <div className='content'>
                                <label htmlFor="country" className='label'>Country　:</label>
                                <input type="text" name='country' className='item' value={formData.country} onChange={handleChange} />
                            </div>
                            <div className='content'>
                                <label htmlFor="Address" className='label'>Address　:</label>
                                <input type="text" name='address' className='item' value={formData.address} onChange={handleChange} />
                                <p className='error_message'>{validation.address_error}</p>
                            </div>
                            <div className='content'>
                                <label htmlFor="professional" className='label'>Professional</label>
                                <input type="text" name='professional' className='item' value={formData.professional} onChange={handleChange} />
                            </div>
                            <div className='content'>
                                <label htmlFor="belongings" className='label'>Belongings　:</label>
                                <input type="text" name='belongings' className='item' value={formData.belongings} onChange={handleChange} />
                            </div>
                            <div className='content'>
                                <label htmlFor="site" className='label'>Site　:</label>
                                <input type="text" name='site' className='item' value={formData.site} onChange={handleChange} />
                            </div>
                        </div>
                        <div className='basic-info'>
                            <p>Basic Information</p>
                            <div className='content'>
                                <label htmlFor="gender" className='label'>Gender　:</label>
                                <input type="text" name='gender' className='item' value={formData.gender} onChange={handleChange} />
                            </div>
                            <div className='content'>
                                <label htmlFor="age" className='label'>Age　:</label>
                                <input type="text" name='age' className='item' value={formData.age} onChange={handleChange} />
                                <p className='error_message'>{validation.age_error}</p>
                            </div>
                            <div className='content'>
                                <label htmlFor="birthday" name='birthday' className='label'>Birthday　:</label>
                                <input type="text" className='item' value={formData.birthday} onChange={handleChange} />
                            </div>
                        </div>
                        <input type="submit" value='編集' />
                    </form> 
                </div>
            </div>

        </div>
    )
}

export default Edit;