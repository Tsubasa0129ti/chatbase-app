import React, {useState,useEffect} from 'react';
import { useHistory } from 'react-router';

import Header from '../../components/block/header';
import { HandleError, Code303 , Code500 } from '../../components/module/errorHandler';

import 'font-awesome/css/font-awesome.min.css';
import '../../styles/layouts/users/login.scss';

function Login(props) {
    const [formData,setFormData] = useState({
        email : '',
        password : ''
    });
    const [message,setMessage] = useState('');
    console.log(props)

    const history = useHistory();

    useEffect(() => {
        fetch('/api/users/loginCheck')
        .then(HandleError)
        .then()
        .catch((err) => {
            if(err.status　=== 303){
                Code303(err,history);
            }else if(err.status === 500){ //ここも同様　function 500
                Code500(err,history);
            }
        }); 
    },[]);

    const handleChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        setFormData({...formData,hasChanged:true,[name]:value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('/api/users/auth',{
            method : 'POST',
            headers : {
                'Accept': 'application/json,text/plain, */*',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                email : formData.email,
                password : formData.password
            })
        })
        .then(HandleError)
        .then((obj) => { //createも同様にリダイレクトがあるな　これに関しては303だけど、返還されるのは201 サーバー側での指示ではなく、クライアント側からの指示ということか
            history.push({
                pathname : obj.redirectPath,
                state : {message : 'ログイン成功しました。'}
            });
        }).catch((err) => {
            if(err.status === 401){
                setMessage(`${err.status} : ユーザー名もしくはパスワードが異なります。`);
            }else if(err.status === 500){
                Code500(err,history);
            }
        });
    }

    return(
        <div>
            <Header loggedIn={false} />
            <div className='login_page'>
                <form className='login-form' method='POST' onSubmit={handleSubmit}>
                    <p className="login-icon">
                        <span className="fa-stack fa-3x">
                            <i className="fa fa-circle fa-stack-2x"></i>
                            <i className="fa fa-lock fa-stack-1x color"></i>
                        </span>
                    </p>
                    <p className='error_code'>{message}</p>
                    <input type='email' name='email' className='login-username' placeholder='Email' required autoFocus onChange={handleChange} />
                    <input type='password' name='password' className='login-password' placeholder='Password' required autoFocus onChange={handleChange} />
                    <input type='submit' className='login-submit' value='Login' />
                </form>
                <div className='link'>
                    <a href="/users/new" className='user-register'>register?</a>
                    {/* <a href="#" className="login-forgot-pass">forgot password?</a> */}
                </div>
                
                <div class="underlay-photo"></div>
                <div class="underlay-black"></div> 
            </div>
        </div>
    )
}

export default Login;

//line54と60でReact Hook useEffect has a missing dependency: 'props.history'. Either include it or remove the dependency array