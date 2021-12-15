import React from 'react';

import '../../styles/components/ReactModal/messageDelete.scss';

class MessageDelete extends React.Component{
    constructor(props){
        super(props); //showを孫コンポーネントから親コンポーネントの兄弟コンポーネントへと伝える術がわからない
    }

    //初期値はともかく、イベントが発火されたときに、ここでもfalseからtrueに変更する必要がある

/*     componentDidUpdate(prev){
        if(prev.show !== this.props.show){
            this.setState({
                show : this.props.show
            })
        }
    }

    cancel(e){
        e.preventDefault();
        this.setState({
            show : false
        });
    }
 */
    
    render(){
        if(!this.props.show){
            return null;
        }else{
            return(
                <div className='overlay'>
                    <div className='delete_modal'>
                        <h3>メッセージを削除する</h3>
                        <a href="/" onClick={this.props.onCancelCallback}>×</a>
                        <p>このメッセージを本当に削除しますか？削除後は元に戻すことはできません。</p>
                        <div className='preDelete_message'>
                            <p>{this.props.deleteData.username}</p>
                            <p>{this.props.deleteData.date} {this.props.deleteData.time}</p>
                            <p>{this.props.deleteData.text}</p>
                            <input type="hidden" value={this.props.deleteData.customId} />
                        </div>
                        <input type="submit" value='キャンセル'　onClick={this.props.onCancelCallback} />
                        <input type="submit" value='削除する'　onClick={this.props.onDeleteCallback} />
                    </div>   
                </div>
            )
        }
    }
}

export default MessageDelete;

//一応、showがtrueになった場合のみ、modalの発生がするようには設定した
/* この後やること
①イベントの発生
②データの受け渡し
③UIの修正 

ぱっと思いついたこと、ここの中でstateを使う必要性ないかも　上位層のstate(props)を換えていけばいいのでは？

*/