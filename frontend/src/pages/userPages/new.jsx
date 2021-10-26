import React from 'react'

class New extends React.Component {　//一旦これで実行するが、stateが多いのでそこについて後で変更を加えるかも
    constructor(props){
        super(props);
        this.state = {
            first : '',
            last : '',
            email : '',
            password : '',
            passCheck : '',
            error : '',
            first_error : '',
            last_error : '',
            email_error : '',
            password_error : '',
            passCheck_error : ''
        }
        this.handleSubmit = this.handleSubmit.bind(this); //bindについてはよく理解していない　おそらく、コンストラクタで読み込んでいるので、これは最初に読み込まれるものの中に、これらの関数を入れている。純粋に関数をここで読み込んでいるみたいなことでは？
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount(){
        fetch("/api/users/previousCheck")
        .then((res) => {
            if(!res.ok){
                console.error('サーバーエラー');
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
    }

    //formのステートの設定
    handleChange(e){
        const target = e.target;
        const value = target.value;
        const name = target.name;

        //var group = {[name] : value}; これで値の取得ができる

        /* バリデーションの設定 */
        //first_errorの出力
        if(name === 'first'){
            //firstのエラー作成
            if(nameChecker(value)){
                this.setState({
                    first_error : 'First Name : 1文字目は、大文字で設定してください。'
                });
            }else{
                if(value.length <= 3 || value.length >= 8){
                    this.setState({
                        first_error : "First Name : 名前は4~7文字で記入してください"
                    });
                }else{
                    this.setState({
                        first_error : ''
                    });
                }
            }
        }

        //lastのエラー作成
        if(name === 'last'){
            //lastのエラー作成
            if(nameChecker(value)){
                this.setState({
                    last_error : 'Last Name : 1文字目は、大文字で設定してください。'
                });
            }else{
                if(value.length <= 3 || value.length >= 8){
                    this.setState({
                        last_error : 'Last Name : 名前は4~7文字で記入してください'
                    });
                }else{
                    this.setState({
                        last_error : ''
                    });
                }
            }
        }

        //emailのエラー作成
        if(name === 'email'){
            if(emailChecker(value)){
                this.setState({
                    email_error : 'Email : 正しいメールアドレスを記入してください。'
                });
            }else{
                this.setState({
                    email_error : ''
                });
            }
        }

        //passwordのエラー作成
        if(name === 'password'){
            if(value.length>=8&&value.length<=16){
                if(isUpper(value)){
                    if(numIncluder(value)){
                        if(strChecker(value)){
                            this.setState({
                                password_error : ''
                            });
                        }else{
                            this.setState({
                                password_error : 'Password : 半角英数字で設定してください。'
                            });
                        }
                    }else{
                        this.setState({
                            password_error : 'Password : 数値も含めてください。'
                        });
                    }
                }else{
                    this.setState({
                        password_error : 'Password : 最初の文字は大文字に設定してください。'
                    });
                }
            }else{
                this.setState({
                    password_error : 'Password : 文字数は8文字以上16文字以内に設定してください。'
                });
            }
        }

        /* functionの設定 */
        //name確認用関数
        function nameChecker(str){
            var checker = str.match(/[A-Z]{1}[A-Za-z]*/);
            if(!checker){
                return true;
            }
        };

        //email確認用関数
        function emailChecker(str){
            var checker = str.match(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/);
            if(!checker){
                return true;
            }
        };

        function isUpper(str){
            var checker = str.match(/^[A-Z]/);
            if(checker){
                return true; 
            }
        };

        function numIncluder(str){
            var checker = str.search(/[0-9]/);
            if(checker !== -1){
                return true;
            }
        };

        function strChecker(str){
            var checker = str.match(/^[A-Za-z0-9]+$/);
            if(checker){
                return true;
            }
        };

        this.setState({
            [name] : value
        })
    }

    handleSubmit(e){
        e.preventDefault();
        var passCheck = this.state.passCheck;
        var pass = this.state.password;

        if(pass !== passCheck){
            this.setState({
                error : 'エラーの修正をしてください。',
                passCheck_error : 'Password Confirm : 確認の値が異なっています。'
            });
        }else if(this.state.first_error || this.state.last_error || this.state.email_error || this.state.password_error){
            this.setState({
                error : 'エラーの修正をしてください。'
            });
        }else{
            fetch('/api/users/create',{
                method : "POST",
                headers : {
                    'Accept': 'application/json,text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    name : {
                        first : this.state.first,
                        last : this.state.last
                    },
                    email : this.state.email,
                    password : this.state.password
                })
            })
            .then(res => {
                if(!res.ok){
                    console.error('サーバーエラー');
                }
                return res.json();
            })
            .then(obj => {
                //このとき送信formの初期化 いやこの時もエラーの時はある。エラー情報の取得など
                if(obj.result === "success"){
                    this.props.history.push(obj.redirectPath); //空白化処理必要ないかも
                }else{
                    console.error(obj.result);
                    //ここはユーザー作成エラー（validationなども含まれるはず）
                }

            }).catch(err => {
                console.error(err.message);
                //form情報の保持（自動かも）
            });
        }        
    }

    render(){
        return(
            <form　onSubmit={this.handleSubmit} method="POST">
                <h3>ユーザー作成ページ</h3>
                <div className="errorMsg">
                    <h3>{this.state.error}</h3>
                    <p>{this.state.first_error}</p>
                    <p>{this.state.last_error}</p>
                    <p>{this.state.email_error}</p>
                    <p>{this.state.password_error}</p>
                    <p>{this.state.passCheck_error}</p>
                </div>
                <div className="">
                    <label htmlFor="firstName">First Name</label>
                    <input type="text" name="first" required onChange={this.handleChange} />
                </div>
                <div className="">
                    <label htmlFor="lastName">Last Name</label>
                    <input type="text" name="last" required onChange={this.handleChange} />
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

export default New;

//この後やること　①validation(サーバーのみ)　②cookie ③エラー処理　④メッセージ機能
//fetchのエラー分岐について