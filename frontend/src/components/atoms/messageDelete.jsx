import React from 'react';

class MessageDelete extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <div>
                <h3>メッセージを削除する</h3>
                <a href="/" onClicK={this.props.onCancelCallback}>×</a>
                <p>このメッセージを本当に削除しますか？削除後は元に戻すことはできません。</p>
                {/* <div className='preDelete_message'>
                    <p>{this.props.username}</p>
                    <p>{this.props.time}</p>
                    <p>{this.props.text}</p>
                </div> */}
                <input type="submit" value='キャンセル'　onClick={this.props.onCancelCallback} />
                <input type="submit" value='削除する'　onClick={this.props.onDeleteCallback} />
            </div>
        )
    }
}

export default MessageDelete;


/* 残りのやること
    ①一応ブロックを取得して全体に表示させる予定のため、このページと上位ページを少し改変
    →正確には、ここでブロックを表示する、親でブロックをpropsとして送る
    ②削除依頼までのsocketの作成
    ③削除完了後、データベースを書き換えたのち、ブロックを消失する
    ④このpopupの全画面化の実行
    　注　現状のcancelはそのまま行けないかも（新イベントにするかもしれない）
    ⑤×ボタン
*/