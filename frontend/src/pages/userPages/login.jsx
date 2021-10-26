import React from 'react';

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
        .then((res) => {
            if(!res.ok){
                console.error("サーバーエラー");
            }
            return res.json();
        })
        .then((obj) => {
            if(obj.result === "Authenticated"){
                this.props.history.push({
                    pathname : "/users/mypage",
                    state : {error : "You are already authenticated"}
                });
            }
        }).catch((err) => {
            console.error(err.message);
        });

        if(this.props.location.state){
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
        .then((res) => {
            if(!res.ok){
                console.error("サーバーエラー");

                if(res.status === 401){
                    this.setState({
                        error : `${res.status} : ユーザー名もしくはパスワードが異なります。`
                    });
                }
            }
            return res.json();
        })
        .then((obj) => {
            //この中に分岐を置く
            if(obj.result === "success"){
                console.log(`data : ${obj.user}`);
                this.props.history.push(obj.redirectPath);
            }
        }).catch((err) => {
            console.error(`error : ${err.message}`); //このときにエラーの出力をさせる（render内部に）
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

export default Login;

//これに関する不足点　エラー処理（①fetchのサーバーエラーのメッセージ②catchによるエラー処理）