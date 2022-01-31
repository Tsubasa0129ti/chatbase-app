import React from 'react';

class MessageEdit extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            edit : '',
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){
        const target = e.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name] : value
        });
    }

    render(){
        return(
            <div className='message_edit'>
                <input type="text" name='edit' onChange={this.handleChange} value={this.state.edit} />
                <input type="submit" value='キャンセル' onClick={this.props.onCancelCallback} />
                <input type="submit" value='編集する' onClick={this.props.onEditCallback} />
            </div>
        )
    }
}

export default MessageEdit;

//これについては、場所はメッセージのブロックの要素の内部に格納する。もし、全てにおいてクリックされた場合、popupは消失する
//イメージとしては、text部分を代替させその部分をinputボックスと編集ボタン、そしてキャンセルのボタンを設置する

//これonChangeを実行する必要があるからedit自体はここで行わなければかな？

/* 
    手順　①popup内部のeditボタンをクリック②messageEditが出現する
        →編集するを押した場合
        ③a 編集が起動し、mouseoverのpopupを消失しmessageEditも消失する
        ③b 編集の起動がなされず、messageEdit popupが消える

        これも全体の要素の中ではなく、メッセージブロックの中に挿入する形で置き換える予定となっているので、displayを用いて分岐する
    
    */