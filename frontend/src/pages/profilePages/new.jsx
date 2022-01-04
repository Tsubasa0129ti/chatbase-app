import React from 'react';
import Header from '../../components/block/header';

import '../../styles/layouts/profiles/new.scss';

class New extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username : '',
            intro : '',
            country : '',
            address : '',
            professional : '',
            belongings : '',
            site : '',
            gender : '',
            age : '',
            birthday : '',
            message : '',
            intro_error : '',
            age_error : '',
            address_error : ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        const error = new Error();

        fetch('/api/profile/new')
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
            if(obj.exist){
                this.props.history.push({
                    pathname : obj.redirectPath,
                    state : {message : 'Profileは作成済みです。'}
                });
            }else{
                this.setState({
                    username : obj.username
                });
            }
        }).catch((err) => {
            if(err.status === 401){
                this.props.history.push({
                    pathname : '/users/login',
                    state : {message : `${err.status} : ログインしてください。`}
                });
            }else if(err.status >= 500){
                this.props.history.push({
                    pathname : '/users/mypage',
                    state : {message : `${err.status} : ${err.message}`}
                });
            }else{
                this.props.history.push({
                    pathname : '/users/mypage',
                    state : {message : err.message}
                });
            }
        });

        if(this.props.location.state){
            this.setState({
                message : this.props.location.state.message
            });
        }
    }

    handleChange(e){
        const target = e.target;
        const name = target.name;
        const value = target.value;

        if(name === 'intro'){
            if(value.length > 100){
                this.setState({
                    intro_error : '*Intro　: ひとことは100文字以内に設定してください。'
                });
            }else{
                this.setState({
                    intro_error : ''
                });
            }
        }

        if(name === 'age'){
            if(value < 0 || value > 120){
                this.setState({
                    age_error : '*正しい年齢を記載してください。'
                });
            }else{
                this.setState({
                    age_error : ''
                });
            }
        }

        if(name === 'address'){
            if(addressChecker(value)){
                this.setState({
                    address_error : '*ハイフンを含めた、正しい郵便番号を記入してください。'
                });
            }else{
                this.setState({
                    address_error : ''
                });
            }
        }

        function addressChecker(str) {
            var checker = str.match(/^[0-9]{3}-[0-9]{4}$/);
            if(checker || str===""){
                return false;
            }else{
                return true;
            }
        };

        this.setState({
            [name] : value
        });

    }

    handleSubmit(e){
        e.preventDefault();

        if(this.state.intro_error || this.state.address_error || this.state.age_error){
            this.setState({
                message : '*エラーを修正してください。'
            });
        }else{
            const error = new Error();

            fetch('/api/profile/create',{
                method : 'POST',
                headers : {
                    'Accept': 'application/json,text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    intro : this.state.intro,
                    country : this.state.country,
                    address : this.state.address,
                    professional : this.state.professional,
                    belongings : this.state.belongings,
                    site : this.state.site,
                    gender : this.state.gender,
                    age : this.state.age,
                    birthday : this.state.birthday,
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
                if(obj.exist){
                    this.props.history.push({
                        pathname : obj.redirectPath,
                        state : {message : 'Profileは作成済みです。'}
                    });
                }else{
                    this.props.history.push({
                        pathname : obj.redirectPath,
                        state : {message : 'プロフィールの作成に成功しました。'}
                    });
                }
            }).catch((err) => {
                if(err.status === 401){
                    this.props.history.push({
                        pathname : '/users/login',
                        state : {message : `${err.status} : ログインしてください。`}
                    });
                }else if(err.status >= 500){
                    this.setState({
                        message : `${err.status} : ${err.message}`
                    });
                }else{
                    this.props.history.push({
                        pathname : '/users/mypage',
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

                <div className='main'>
                    <div className='main-top'>
                        <h1 className='main-title'>
                            <span className='page-title-main'>Create Profile</span>
                            <span className='page-title-sub'>プロフィールの作成</span>
                        </h1>
                        <div className='lowlayer-link'>
                            <ul className='breadcrumb'>
                                <li><a className='toHome' href="/">Home</a></li>
                                <li className='line'></li>
                                <li><span>Create Profile</span></li>
                            </ul>
                        </div>
                    </div>
                    

                    <div className='profile'>
                        <div className='profile-status'>
                            <div className='profile-status-inner'>
                                <p>プロフィール作成画面</p>
                            </div>
                        </div>

                        <div className='profile-form'>
                            <div className='profile-form-inner'>
                                <form onSubmit={this.handleSubmit} className='submit-form'>
                                    <div className='contact-information'>
                                        <p>Contact Information</p>
                                        <div className='content'>
                                            <label htmlFor="country" className='label'>Country　:</label>
                                            <input type="text" name='country' className='item' onChange={this.handleChange} />
                                        </div>
                                        <div className='content'>
                                            <label htmlFor="Address" className='label'>Address　:</label>
                                            <input type="text" name='address' className='item' onChange={this.handleChange} />
                                            <p className='error-message'>{this.state.address_error}</p>
                                        </div>
                                        <div className='content'>
                                            <label htmlFor="professional" className='label'>Professional　:</label>
                                            <input type="text" name='professional' className='item' onChange={this.handleChange} />
                                        </div>
                                        <div className='content'>
                                            <label htmlFor="belongings" className='label'>Belongings　:</label>
                                            <input type="text" name='belongings' className='item' onChange={this.handleChange} />
                                        </div>
                                        <div className='content'>
                                            <label htmlFor="site" className='label'>Site　:</label>
                                            <input type="text" name='site' className='item' onChange={this.handleChange} />
                                        </div>
                                    </div>

                                    <div className='basic-information'>
                                        <p>Basic Information</p>
                                        <div className='content'>
                                            <label htmlFor="gender" className='label'>Gender　:</label>
                                            <select name="gender" className='item'　onChange={this.handleChange}>
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="others"> Others</option>
                                                <option value="no-answer">No Answer</option>
                                            </select>
                                        </div>
                                        <div className='content'>
                                            <label htmlFor="age" className='label'>Age　:</label>
                                            <input type="number" name='age' className='item' onChange={this.handleChange} />
                                            <p className='error-message'>{this.state.age_error}</p>
                                        </div>
                                        <div className='content'>
                                            <label htmlFor="birthday" className='label'>Birthday　:</label>
                                            <input type="date" name='birthday' className='item' onChange={this.handleChange} />
                                        </div>
                                    </div>

                                    <div className='comment'>
                                        <p>Comment</p>
                                        <div className='content'>
                                            <label htmlFor="intro" className='label'>Introduction　:</label>
                                            <textarea name='intro' className='item' maxLength='100' onChange={this.handleChange} />
                                            <p className='error-message'>{this.state.intro_error}</p>
                                        </div>
                                    </div>

                                    <div className='error-code'>
                                        <p>{this.state.message}</p>
                                    </div>
                                    <input type='submit' value='Create Profile' className='toCreate' />
                                </form>
                            </div>
                        </div>

                    </div>
                </div>

                {/* ここでfooterを読み込む */}
            </div>
        )
    }
}

export default New;