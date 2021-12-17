import React from 'react'
import Header from '../../components/block/header';

import '../../styles/layouts/users/new.scss';

class New extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            first : '',
            last : '',
            email : '',
            password : '',
            passCheck : '',
            message : '',
            first_error : '',
            last_error : '',
            email_error : '',
            password_error : '',
            passCheck_error : ''
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
    }

    //formのステートの設定
    handleChange(e){
        const target = e.target;
        const value = target.value;
        const name = target.name;

        /* バリデーションの設定 */
        //first_errorの出力
        if(name === 'first'){
            if(nameChecker(value)){
                this.setState({
                    first_error : 'First Name : 1文字目は、大文字で設定してください。'
                });
            }else{
                if(value.length <= 3 || value.length >= 8){
                    this.setState({
                        first_error : 'First Name : 名前は4~7文字で記入してください'
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
                message : 'エラーの修正をしてください。',
                passCheck_error : 'Password Confirm : 確認の値が異なっています。'
            });
        }else if(this.state.first_error || this.state.last_error || this.state.email_error || this.state.password_error){
            this.setState({
                message : 'エラーの修正をしてください。'
            });
        }else{
            const error = new Error();

            fetch('/api/users/create',{
                method : 'POST',
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
                    console.error('res.ok:',res.ok);
                    console.error('res.status:',res.status);
                    console.error('res.statusText:',res.statusText);

                    error.status = res.status;
                    error.message = res.statusText;
                    throw new Error();
                }
                return res.json();
            })
            .then(obj => {
                this.props.history.push({
                    pathname : obj.redirectPath,
                    state : {message : 'ユーザーの作成に成功しました。'}
                });
            }).catch(err => {
                if(err.status >= 500){
                    this.setState({
                        message : `${err.status} : ユーザーの作成に失敗しました。`
                    });
                }else{
                    this.props.history.push({
                        pathname : '/users',
                        state : {message : err.message}
                    });
                }
            });
        }        
    }

    render(){
        return(
            <div>
                <Header message={this.state.message} />
                <form　className='create_form' onSubmit={this.handleSubmit} method='POST'>
                    <h3>ユーザー作成ページ</h3>
                    <div className='errorMsg'>
                        <p>{this.state.first_error}</p>
                        <p>{this.state.last_error}</p>
                        <p>{this.state.email_error}</p>
                        <p>{this.state.password_error}</p>
                        <p>{this.state.passCheck_error}</p>
                    </div>
                    <div className='firstName'>
                        <label htmlFor='firstName'>First Name</label>
                        <input type='text' name='first' required onChange={this.handleChange} />
                    </div>
                    <div className='lastName'>
                        <label htmlFor='lastName'>Last Name</label>
                        <input type='text' name='last' required onChange={this.handleChange} />
                    </div>
                    <div className='email'>
                        <label htmlFor='email'>Email</label> 
                        <input type='email' name='email' required onChange={this.handleChange} />               
                    </div>
                    <div className='password'>
                        <label htmlFor='password'>Password</label>
                        <input type='password' name='password' required onChange={this.handleChange} />
                    </div>
                    <div className='passCheck'>
                        <label htmlFor='passCheck'>Password Confirm</label>
                        <input type='password' name='passCheck' onChange={this.handleChange} />
                    </div>
                    <input type='submit' className='submit' value='送信' />
                </form>
            </div>
        )
    }
}

export default New;