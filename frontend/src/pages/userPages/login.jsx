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