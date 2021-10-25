import React from "react";
import {withRouter} from 'react-router-dom'; //ここら辺変更しているけど、詳細は不明

//formの送信はできているけど、POST処理でのログインができない　（おそらく現状ストラテジーに対してデータの送信ができていないのではないか）　ストラテジーの設定についても再度練り直す必要がありそう
class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email : '',
            password : '',
            error : ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){ //ここで現在のログインステータスの確認を行う
        fetch("/api/users/previousCheck")
        .then((res) => res.json())
        .then((obj) => {
            if(obj.result === "Authenticated"){
                this.props.history.push({
                    pathname : "/users/mypage",
                    state : {error : "You are already authenticated"}
                });
            }
        }).catch((err) => {
            console.log(err.message);
        });

        if(this.props.location.state){ //これを全てのリダイレクトで有効にする
            this.setState({
                error : this.props.location.state.error
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
            method : "POST",
            headers : {
                'Accept': 'application/json,text/plain, */*',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                email : this.state.email,
                password : this.state.password
            })
        })
        .then((res) => res.json())
        .then((data) => {
            //この中に分岐を置く
            console.log(`data : ${data}`);
            if(data.result === "success"){
                console.log(`data : ${data.user}`);
                this.props.history.push(data.redirectPath);
            }
        }).catch((err) => {
            console.log(`error : ${err.message}`); //このときにエラーの出力をさせる（render内部に）
        });
    }

    render(){
        return(
            <form method="POST" onSubmit={this.handleSubmit}>
                <p>Login Page</p>
                <div className="error">{this.state.error}</div>
                <div className="">
                    <label htmlFor="email">Email</label>
                    <input type="email" name="email" onChange={this.handleChange} />
                </div>
                <div className="">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" onChange={this.handleChange} />
                </div>
                <input type="submit" value="ログイン" />
            </form>
        )
    }
}

export default withRouter(Login);