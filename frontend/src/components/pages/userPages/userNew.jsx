import React from 'react'

class UserNew extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            message : '',
            firstName : '',
            lastName : '',
            email : '',
            password : '',
            passCheck : ''
        }
        this.handleSubmit = this.handleSubmit.bind(this); //bindについてはよく理解していない
        this.handleChange = this.handleChange.bind(this);
    }

    //DOMロード時の処理(ぶっちゃけこれいらないかも)　レンダリングに関しては、reactのみで作成してしまって、post処理に関してやデータが必要なものに関してのみサーバーを使う
    componentDidMount() {
        fetch('/api/users/new')
        .then((res) => res.json())
        .then((data) => this.setState({message : data.message}));
    }

    //formのステートの設定
    handleChange(e){
        const target = e.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name] : value
        })
    }

    handleSubmit(e){
        e.preventDefault();
        //おそらくここでバリデーションを実行する（一旦スキップ）

        fetch('/api/users/create',{
            method : "POST",
            headers : {
                'Accept': 'application/json,text/plain, */*',
                'Content-Type': 'application/json'
            },
            body : JSON.stringify({
                name : {
                    first : this.state.firstName,
                    last : this.state.lastName
                },
                email : this.state.email,
                password : this.state.password
            })
        })
        .then(res => res.json())
        .then(data => {
            //このとき送信formの初期化 いやこの時もエラーの時はある。エラー情報の取得など
            if(data.result === "success"){
                this.props.history.push(data.redirectPath); //空白化処理必要ないかも
            }else{
                console.log(data.result);
                //ここはユーザー作成エラー（validationなども含まれるはず）
            }

        }).catch(err => {
            console.log(err.message);
            //form情報の保持（自動かも）
        });
    }

    render(){
        return(
            <form　onSubmit={this.handleSubmit} method="POST">
            <p>{this.state.message}</p>
            <div className="errorMsg"></div>
            <div className="">
                <label htmlFor="firstName">First Name</label>
                <input type="text" name="firstName" required onChange={this.handleChange} />
            </div>
            <div className="">
                <label htmlFor="lastName">Last Name</label>
                <input type="text" name="lastName" required onChange={this.handleChange} />
            </div>
            <div className="">
                <label htmlFor="email">Email</label> 
                <input type="email" name="email" required onChange={this.handleChange} />               
            </div>
            <div className="">
                <label htmlFor="password">Password</label>
                <input type="password" name="password" required onChange={this.handleChange} />
            </div>
            <div className="">
                <label htmlFor="passCheck">Password Confirm</label>
                <input type="password" name="passCheck" onChange={this.handleChange} />
            </div>
            <input type="submit" value="送信" />
        </form> 
        )
    }
}

export default UserNew;

//この後やること　①validation(サーバーも)　②cookie ③エラー処理　④メッセージ機能