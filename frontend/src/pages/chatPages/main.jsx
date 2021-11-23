import React from 'react';
import queryString from 'query-string';

import ChatHeader from '../../components/block/chatHeader';
import AddChannel from '../../components/module/addChannel';

class ChatPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            message : '',
            isLoggedIn : false,
            username : '',
            search : false,
            add : false,
            count : '',
            channel : []
        }
        this.popup = this.popup.bind(this);
    }
    
    componentDidMount(){
        //初期のページの表示をする
        const error = new Error();
        var search = this.props.location.search;
        var query = queryString.parse(search);
        console.log(query.page);

        fetch(`/api/chat?page=${query.page}`)
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
                channel : obj.channel,
                count : obj.count,
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

    popup(e){
        e.preventDefault();
        this.setState({
            add : true
        });
        console.log(this.state.add);
    }

    cancel(e){
        e.preventDefault();
        this.setState({
            add : false
        });
    }

    render(){
        const {channel} = this.state;     
        if(!channel){
            return null
        }else{
            if(this.state.count === 0){
                return(
                    <div>
                        <ChatHeader isLoggedIn={this.state.isLoggedIn} username={this.state.username} />
                        <p>チャンネルが存在しません。</p>
                        <p>作成ページより、チャンネルの作成をしてください。</p>
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
                        {/* <Guide /> */}
                        <a href="/" onClick={this.popup}>+</a>
                        <AddChannel add={this.state.add} onEventCallback={this.cancel.bind(this)} />
                    </div>
                )
            }    
        }  
    }
}

export default ChatPage;

//この後やること、、、　③ページングの適用(ページのリンクにクエリ情報の付与/ 存在しないページの場合の分岐も考える）　④ページ変換ごとに、サーバーへの接続　⑤addpopupとそのほかのUI