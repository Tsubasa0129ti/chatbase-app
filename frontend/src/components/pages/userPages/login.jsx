import React from "react"


//formの送信はできているけど、POST処理でのログインができない　（おそらく現状ストラテジーに対してデータの送信ができていないのではないか）　ストラテジーの設定についても再度練り直す必要がありそう
class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email : '',
            password : ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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
                <div className="error"></div>
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