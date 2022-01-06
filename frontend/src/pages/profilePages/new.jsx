import React,{useState,useEffect} from 'react';
import { useHistory,useLocation } from 'react-router';
import Header from '../../components/block/header';

import '../../styles/layouts/profiles/new.scss';

function New(props){
    const [formData,setFormData] = useState({
        intro : '',
        country : '',
        address : '',
        professional : '',
        belongings : '',
        site : '',
        gender : '',
        age : '',
        birthday : ''
    });
    const [message,setMessage] = useState('');
    const [validation,setValidation] = useState({
        intro_error : '',
        age_error : '',
        address_error : ''
    });

    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        const error = new Error();

        fetch('/api/profile/new')
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
            if(obj.exist){
                history.push({
                    pathname : obj.redirectPath,
                    state : {message : 'Profileは作成済みです。'}
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
                    pathname : '/users/mypage',
                    state : {message : err.message}
                });
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

        if(name === 'intro'){
            if(value.length > 100){
                setValidation({...validation,hasChanged:true,intro_error:'*Intro　: ひとことは100文字以内に設定してください。'});
            }else{
                setValidation({...validation,hasChanged:true,intro_error:''});
            }
        }

        if(name === 'age'){
            if(value < 0 || value > 120){
                setValidation({...validation,hasChanged:true,age_error:'*正しい年齢を記載してください。'});
            }else{
                setValidation({...validation,hasChanged:true,age_error:''});
            }
        }

        if(name === 'address'){
            if(addressChecker(value)){
                setValidation({...validation,hasChanged:true,address_error:'*ハイフンを含めた、正しい郵便番号を記入してください。'});
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
        console.log(formData);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if(validation.intro_error || validation.address_error || validation.age_error){
            setMessage('*エラーを修正してください。');
        }else{
            const error = new Error();

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
                    belongings : formData.belongings,
                    site : formData.site,
                    gender : formData.gender,
                    age : formData.age,
                    birthday : formData.birthday,
                })
            })
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
                if(obj.exist){
                    history.push({
                        pathname : obj.redirectPath,
                        state : {message : 'Profileは作成済みです。'}
                    });
                }else{
                    history.push({
                        pathname : obj.redirectPath,
                        state : {message : 'プロフィールの作成に成功しました。'}
                    });
                }
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
    };

    return(
        <div>
            <Header />

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
                                        <label htmlFor="belongings" className='label'>Belongings　:</label>
                                        <input type="text" name='belongings' className='item' onChange={handleChange} />
                                    </div>
                                    <div className='content'>
                                        <label htmlFor="site" className='label'>Site　:</label>
                                        <input type="text" name='site' className='item' onChange={handleChange} />
                                    </div>
                                </div>

                                <div className='basic-information'>
                                    <p>Basic Information</p>
                                    <div className='content'>
                                        <label htmlFor="gender" className='label'>Gender　:</label>
                                        <select name="gender" className='item'　onChange={handleChange}>
                                            <option hidden>選択してください</option>
                                            <option value="male">Male</option>
                                            <option value="female">Female</option>
                                            <option value="others"> Others</option>
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

//②usernameを無くしたので、サーバー側からも削除する