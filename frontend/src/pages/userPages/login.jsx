import React from 'react';
import Header from '../../components/block/header';

import 'font-awesome/css/font-awesome.min.css';
import '../../styles/layouts/users/login.scss';

class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email : '',
            password : '',
            message : ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        const error = new Error();

        fetch('/api/users/previousCheck')
        .then((res) => {
            if(!res.ok){
                console.error('res.ok:',res.ok);
                console.error('res. status:',res.status);
                console.error('res.statusText:',res.statusText);

                error.status = res.status;
                error.message = res.statusText;
                throw error;
            }
            return res.json();
        })
        .then((obj) => {
            if(obj.result === 'Authenticated'){
                this.props.history.push({
                    pathname : obj.redirectPath,
                    state : {message : 'You are already authenticated'}
                });
            }
        }).catch((err) => {
            if(err.status){
                this.props.history.push({
                    pathname : '/users',
                    state : {message : `${err.status} : ${err.message}`}
                });
            }else{
                this.props.history.push({
                    pathname : '/users',
                    state : {message : err.message}
                });
            }
        });

        if(this.props.location.state){ //他のページからもらったエラーを取得
            this.setState({
                message : this.props.location.state.message
            });
        }

    }

    handleChange(e){
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name] : value
        });
    }

    handleSubmit(e){
        e.preventDefault();

        const error = new Error();

        fetch('/api/users/auth',{
            method : 'POST',
            headers : {
                'Accept': 'application/json,text/plain, */*',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                email : this.state.email,
                password : this.state.password
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
            this.props.history.push({
                pathname : obj.redirectPath,
                state : {message : 'ログイン成功しました。'}
            });  
        }).catch((err) => {
            if(err.status === 400){
                this.setState({
                    message : `${err.status} : ユーザー名もしくはパスワードを記入してください。`
                });
            }else if(err.status === 401){
                this.setState({
                    message : `${err.status} : ユーザー名もしくはパスワードが異なります。`
                });
            }else if(err.status >= 500){
                this.setState({
                    message : `${err.status} : ${err.message}`
                });
            }else{
                this.props.history.push({
                    pathname : '/users',
                    state : {message : err.message}
                });
            }
        });
    }

    render(){
        return(
            <div>
                <Header />
                <div className='login_page'>
                    <form className='login-form' method='POST' onSubmit={this.handleSubmit}>
                        <p className="login-icon">
                            <span className="fa-stack fa-3x">
                                <i className="fa fa-circle fa-stack-2x"></i>
                                <i className="fa fa-lock fa-stack-1x color"></i>
                            </span>
                        </p>
                        <p className='error_code'>{this.state.message}</p>
                        <input type='email' name='email' className='login-username' placeholder='Email' required autoFocus onChange={this.handleChange} />
                        <input type='password' name='password' className='login-password' placeholder='Password' required autoFocus onChange={this.handleChange} />
                        <input type='submit' className='login-submit' value='Login' />
                    </form>
                    <div className='link'>
                        <a href="/users/new" className='user-register'>register?</a>
                        <a href="#" className="login-forgot-pass">forgot password?</a>
                    </div>
                    
                    <div class="underlay-photo"></div>
                    <div class="underlay-black"></div> 
                </div>
            </div>
        )
    }
}

export default Login;