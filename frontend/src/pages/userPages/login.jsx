import React from 'react';
import Header from '../../components/block/header';

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
        fetch('/api/users/previousCheck')
        .then((res) => {
            if(!res.ok){
                console.error('サーバーエラー');
            }
            return res.json();
        })
        .then((obj) => {
            if(obj.result === 'Authenticated'){
                this.props.history.push({
                    pathname : '/users/mypage',
                    state : {message : 'You are already authenticated'}
                });
            }
        }).catch((err) => {
            console.error(err.message);
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
                console.error('サーバーエラー');
                if(res.status === 400){
                    this.setState({
                        message : `${res.status} : ユーザー名もしくはパスワードを記入してください。`
                    })
                }else if(res.status === 401){
                    this.setState({
                        message : `${res.status} : ユーザー名もしくはパスワードが異なります。`
                    });
                }
            }
            return res.json();
        })
        .then((obj) => {
            if(obj.result === 'success'){
                console.log(`data : ${obj.user}`);
                this.props.history.push(obj.redirectPath);
            }
        }).catch((err) => {
            console.error(`error : ${err.message}`);
        });
    }

    render(){
        return(
            <div>
                <Header message={this.state.message} />
                <form method='POST' onSubmit={this.handleSubmit}>
                    <p>Login Page</p>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <input type='email' name='email' onChange={this.handleChange} />
                    </div>
                    <div>
                        <label htmlFor='password'>Password</label>
                        <input type='password' name='password' onChange={this.handleChange} />
                    </div>
                    <input type='submit' value='ログイン' />
                </form>
            </div>
        )
    }
}

export default Login;

//これに関する不足点　エラー処理（①fetchのサーバーエラーのメッセージ②catchによるエラー処理）