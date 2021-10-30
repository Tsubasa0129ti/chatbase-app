import React from 'react';
import Header from '../../components/block/header';

class Id extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username : '',
            intro : '未設定',
            age : '未設定',
            prefecture : '未設定',
            birthday : '未設定',
            belongings : '未設定',
            message : ''
        } 
    }

    componentDidMount(){
        //ここではログインチェックは必要？一応他のユーザーへ向けた公開を想定している。
        const pathname = this.props.location.pathname;
        var id = pathname.split('/')[3];
        console.log(id);

        fetch(`/api/profile/${id}`)
        .then((res) => {
            if(!res.ok){
                console.error('server error');
            }
            return res.json();
        })
        .then((obj) => {
            if(obj.result === 'success'){
                this.setState({
                    username : obj.user.name.first + ' ' + obj.user.name.last,
                    intro : obj.user.profile.intro,
                    age : obj.user.profile.age,
                    prefecture : obj.user.profile.prefecture,
                    birthday : obj.user.profile.birthday,
                    belongings : obj.user.profile.belongings
                });
            }else if(obj.result === 'Authentication Error'){
                this.props.history.push({
                    pathname : obj.redirectPath,
                    state : {message : obj.result}
                });
            }else if(obj.result === 'Profile Not Exist'){
                this.setState({
                    username : obj.username
                });
            }
        }).catch((err) => {
            console.error(err.message);
        });
    }

    render(){
        return(
            <div>
                <Header message={this.state.message} />
                <div>
                    <h3>{this.state.username}さんのプロフィール</h3>
                    <div className='icon'>

                    </div>
                    <div className='name'>
                        <label htmlFor='name'>名前</label>
                        <p>{this.state.username}</p>
                    </div>
                    <div className='intro'>
                        <label htmlFor='intro'>ひとこと</label>
                        <p>{this.state.intro}</p>
                    </div>
                    <div>
                        <label htmlFor="age">年齢</label>
                        <p>{this.state.age}</p>
                    </div>
                    <div className='prefecture'>
                        <label htmlFor='prefecture'>都道府県</label>
                        <p>{this.state.prefecture}</p>
                    </div>
                    <div className='birthday'>
                        <label htmlFor='birthday'>誕生日</label>
                        <p>{this.state.birthday}</p>
                    </div>
                    <div className='belongings'>
                        <label htmlFor='belongings'>所属</label>
                        <p>{this.state.belongings}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default Id;