import React from 'react';
import {Link} from 'react-router-dom';
import Header from '../../components/block/header';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog , faAddressCard , faEdit , faTrashAlt ,faIdCard ,faUser , faChartLine , faBlog} from "@fortawesome/free-solid-svg-icons";
import {faComments} from '@fortawesome/free-regular-svg-icons'

import '../../styles/layouts/users/mypage.scss';

class Mypage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user : {},
            username : '',
            profile : false,
            message : ''
        }
    }

    componentDidMount(){
        const error = new Error(); //前もってエラーを呼び出す

        fetch('/api/users/mypage')
        .then((res) => {
            if(!res.ok){
                console.error('res.ok:',res.ok);
                console.error('res.status:',res.status);
                console.error('res.statusText:',res.statusText);

                error.message = res.statusText;
                error.status = res.status;
                throw error;
            }
            return res.json();
        })
        .then((obj) => {
            this.setState({
                username : obj.user.name.first + ' ' + obj.user.name.last
            });

            if(!obj.profile){
                this.setState({
                    user : obj.user
                });
                console.log(this.state.user);
            }else{
                this.setState({
                    profile : true,
                    user : obj.user
                });
                console.log(this.state.user);
            }

        }).catch((err) => {//全てのエラーをここで受け取る　ただエラーメッセージが少し微妙そうなのでそこについて考える（もしくは自身で定義する）
            if(err.status === 401){
                this.props.history.push({
                    pathname : '/users/login',
                    state : {message : `${err.status} : ログインしてください。`}
                });
            }else if(err.status >= 500){
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

        if(this.props.location.state){
            this.setState({
                message : this.props.location.state.message
            });
        }
    }

    render(){
        if(!this.state.profile) {
            return(
                <div className='mypage'>
                    <Header />
                    <div className='users_mypage'>
                        <div className='mypage-top'>
                            <p　className='mypage-title'>My Page</p>
                            <div className='mypage-menu'>
                                <button 
                                    className='menu-button'
                                    onClick={(e) => {
                                        e.preventDefault();
                                        var popup = e.currentTarget.nextElementSibling;
                                        if(popup.className === 'prevPopup'){
                                            popup.classList.replace('prevPopup','popup-menu');
                                        }else{
                                            popup.classList.replace('popup-menu','prevPopup');
                                        }
                                    }}
                                >
                                    <FontAwesomeIcon icon={faCog} size='3x' className='cog-icon' />
                                </button>
                                <div className='prevPopup'>
                                    <button 
                                        className='toEdit'
                                        onClick={(e) => this.props.history.push('/users/mypage/edit')}
                                    >
                                        <FontAwesomeIcon icon={faEdit} /> Edit Account
                                    </button>
                                    <button
                                        className='toDelete'
                                        onClick={() => console.log('A')}
                                    >
                                        <FontAwesomeIcon icon={faTrashAlt} /> Delete Account
                                    </button>
                                </div>
                            </div>
                            
                            <p className='welcome-msg'>Welcome back {this.state.username}</p>
                        </div>
                        <div className='user-info'>
                            <div className='userInfo-title'>
                                <p className='title-content'>ユーザー情報</p>
                            </div>
                            <div className='username-record user-record'>
                                <label htmlFor="username" className='label'>username:</label>
                                <input type="text" className='username-value user-value' value={this.state.username} readOnly />
                            </div>
                            <div className='email-record user-record'>
                                <label htmlFor="email" className='label'>Email:</label>
                                <input type="text" className='email-value user-value' value={this.state.user.email} readOnly />
                            </div>
                        </div>
                        <div className='toCreateProfile'>
                            <p className='profileDesc'>プロフィールを作成すると、自身の自己紹介などを設定することができます。</p>
                            <button
                                className='toProfile' 
                                onClick={
                                    (e) => {
                                        e.preventDefault();
                                        this.props.history.push('/profile/new');
                                    }
                                }
                            >
                                <FontAwesomeIcon icon={faAddressCard} /> Create Profile
                            </button>
                        </div>
                    </div>
                </div>
            )
        }else{
            return(
                <div className='mypage'>
                    <Header />
                    <div class='container'>
                        <div className='aside'>
                            <div className='user-icon'>
                                <FontAwesomeIcon icon={faUser} size='10x' className='icon' />
                            </div>
                            <div className='setting'>
                                <div className='text-line'>
                                    <p><FontAwesomeIcon icon={faCog} /> Setting</p>
                                </div>
                                <a href="/users/edit"><FontAwesomeIcon icon={faEdit} /> Edit Account</a>
                                <a href="/profile/edit"><FontAwesomeIcon icon={faIdCard} /> Edit Profile</a>
                                <a href="/users/delete"><FontAwesomeIcon icon={faTrashAlt} /> Delete</a>
                            </div>
                            <div className='application'>
                                <div className='text-line'>
                                  <p><FontAwesomeIcon icon={faChartLine} /> Application</p>  
                                </div>
                                <a href="/chat"><FontAwesomeIcon icon={faComments} /> Chat Page</a>
                                <a href="/blog"><FontAwesomeIcon icon={faBlog} /> Blog Page</a>
                            </div>
                        </div>
                        <div className='main'>
                            <div className='profile-header'>
                                <p className='username'>{this.state.username}</p>
                                <div className='intro'>
                                    <p className='intro-text'>{this.state.user.profile.intro}</p>
                                </div>
                            </div>
                            <div className='profile-detail'>
                                <div className='about'>
                                    <p className='about-top'><FontAwesomeIcon icon={faUser} /> About</p>
                                    <div className='contact-info'>
                                        <p>Contact Information</p>
                                        <div className='content'>
                                            <label htmlFor="email" className='label'>Email　:</label>
                                            <input type="text" className='item' value={this.state.user.email} disabled />
                                        </div>
                                        <div className='content'>
                                            <label htmlFor="country" className='label'>Country　:</label>
                                            <input type="text" className='item' value='国籍' disabled />
                                        </div>
                                        <div className='content'>
                                            <label htmlFor="Address" className='label'>Address　:</label>
                                            <input type="text" className='item' value={this.state.user.profile.address} disabled />
                                        </div>
                                        <div className='content'>
                                            <label htmlFor="professional" className='label'>Professional</label>
                                            <input type="text" className='item' value= '職業' disabled />
                                        </div>
                                        <div className='content'>
                                            <label htmlFor="belongings" className='label'>Belongings　:</label>
                                            <input type="text" className='item' value={this.state.user.profile.belongings} disabled />
                                        </div>
                                        <div className='content'>
                                            <label htmlFor="site" className='label'>Site　:</label>
                                            <input type="text" className='item' value='site URL' disabled />
                                        </div>
                                    </div>
                                    <div className='basic-info'>
                                        <p>Basic Information</p>
                                        <div className='content'>
                                            <label htmlFor="gender" className='label'>Gender　:</label>
                                            <input type="text" className='item' value='male' disabled />
                                        </div>
                                        <div className='content'>
                                            <label htmlFor="age" className='label'>Age　:</label>
                                            <input type="text" className='item' value={this.state.user.profile.age} disabled />
                                        </div>
                                        <div className='content'>
                                            <label htmlFor="birthday" className='label'>Birthday　:</label>
                                            <input type="text" className='item' value={this.state.user.profile.birthday} disabled />
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default Mypage;

//このページに関する詳細。ログイン後にリダイレクトされる場所　全体画面　リンクなどがある予定　そのほかのuserに関する情報を入れるページにする予定　そのため、fetchでuserデータを受け取る必要がある


//ここでやらなければならないこと　profileの有無の分岐
//追記　fetchの２パターンのエラー処理の作成

/* 構想　条件付きレンダー（profileの有無による）を行い、条件によってUIを変化させる。このため、サーバーからprofileが存在するかどうかの情報を取得する。
    profileが存在しない場合、①アカウントの編集②profileの作成③アカウントの削除④アカウントの閲覧
    profileが存在する場合、①アカウントの編集②profileの編集③アカウントの削除④アカウントの閲覧
    ただ、mypageがこれだけだと物足りないので何かを付随させたい
    後に入れる候補としては
    ①写真（プロフ画、）
    ②後は、投稿系統（ブログなど）を作成した場合にそれに付随したもの


    追記　レンダリングの層を分岐していくなら、関数ごとの分岐をすることはできないのか
*/
