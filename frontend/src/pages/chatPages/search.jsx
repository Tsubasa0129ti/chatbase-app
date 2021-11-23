import React from 'react';
import queryString from 'query-string';

import ChatHeader from '../../components/block/chatHeader';

class Search extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isLoggedIn : false,
            username : '',
            count : '',
            channel : [],
            message : ''
        }
    }

    componentDidMount(){
        console.log('MountOK')
        //ここで検索を実行する
        var search = this.props.location.search
        var query = queryString.parse(search);

        const error = new Error();

        fetch(`/api/chat/search?q=${query.q}&sort=${query.sort}&page=${query.page}`)
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
        }).then((obj) => {  
            this.setState({
                isLoggedIn : obj.isLoggedIn,
                username : obj.username,
                count : obj.count,
                channel : obj.channel
            });
        }).catch((err) => {
            if(err.status === 401){
                this.props.history.push({
                    pathname : '/users/login',
                    state : {message : `${err.status} : ログインしてください。`}
                });
            }else if(err.status >= 500){
                console.error(`${err.status} : ${err.message}`);
            }else{
                console.error(err.message);
            }
        });

    }

    render(){
        const {channel} = this.state;
        if(!channel){
            return null;
        }else{
            if(this.state.count === 0){
                return(
                    <div>
                        <ChatHeader isLoggedIn={this.state.isLoggedIn} username={this.state.username} />
                        <p>検索結果　：　 {this.state.count}件</p>
                        <p>チャンネルが見つかりません。</p>
                        <p>検索し直してください。</p>
                        {/* <Guide />
                        <AddChannel /> */}
                    </div>
                )
            }else{
                const channel = this.state.channel;
                const items = [];
                for(var i=0;i<channel.length;i++){
                    items.push(
                        <div>
                            <a href={'/chat/page/' + channel[i]._id}>{channel[i].channelName}</a>
                            <p>更新日　：　{channel[i].updatedAt}</p>
                            <p>チャンネル詳細　：　{channel[i].channelDetail}</p>
                            <p>チャンネル作成者　：　{channel[i].createdBy}</p>
                        </div>
                    )
                }

                return(
                    <div>
                        <ChatHeader isLoggedIn={this.state.isLoggedIn} username={this.state.username} />
                        <div className='new_channel'>
                            <p>チャンネル件数　：　{this.state.count}件</p>
                            {items}
                            <div className='paging'></div>
                        </div>
                        {/* <Guide />
                        <AddChannel /> */}
                    </div>
                )
            }
        }
    }
}

export default Search;