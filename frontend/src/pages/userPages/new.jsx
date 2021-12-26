import React from 'react'
import Header from '../../components/block/header';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
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
                    console.log(err.message);
                    this.props.history.push({
                        pathname : '/users',
                        state : {message : err.message}
                    });
                }
            });//usernameが存在する場合のエラーが取得できていない。err.messageが空になっているのが原因のようだ
        }        
    }

    render(){
        return(
            <div className='user_new'>
                <Header />      
                <div className='create_page'>
                    <div className='empty'></div>
                    <div className='create-top'>
                        <p className='create-icon'>
                            <FontAwesomeIcon icon={faUserCircle} size='5x' />
                        </p>
                        <p className='create_title'>Create Account</p>
                        <p className='error_code'>{this.state.message}</p>
                    </div>
                    <form className='create_form' onSubmit={this.handleSubmit} method='POST'>
                        <div className='name_block block'>
                            <label htmlFor="name" className='label'>Name</label>
                            <input type="text" name='first' className='input-firstName input_box' placeholder='First Name' required autoFocus onChange={this.handleChange} />
                            <input type="text" name='last' className='input-lastName input_box' placeholder='Last Name' required  autoFocus onChange={this.handleChange} />
                            <p className='firstName-error error_message'>{this.state.first_error}</p>
                            <p className='lastName-error error_message'>{this.state.last_error}</p>
                        </div>

                        <div className='email_block block'>
                            <label htmlFor="email" className='label'>Email</label>
                            <input type="text" name='email' className='input-email input_box' placeholder='Email' required autoFocus onChange={this.handleChange} />
                            <p className='email-error error_message'>{this.state.email_error}</p>
                        </div>

                        <div className='password_block block'>
                            <label htmlFor="password" className='label'>Password</label>
                            <input type="password" name='password' className='input-password input_box' placeholder='Password' required autoFocus onChange={this.handleChange} />
                            <p className='password-error error_message'>{this.state.password_error}</p>
                        </div>

                        <div className='passCheck_block block'>
                            <label htmlFor="passCheck" className='label'>Password Confirm</label>
                            <input type="password" name='passCheck' className='input-passCheck input_box' placeholder='Password Confirm' required autoFocus onChange={this.handleChange} />
                            <p className='passCheck-error error_message'>{this.state.passCheck_error}</p>
                        </div>
                        <input type="submit" className='create-submit' value='Sign Up' />
                    </form>
                    <div className='link'>
                        <a href="/users/login" className='user-login'>Already have an account?</a>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default New;