import React from 'react';

class Modal extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show : false
        }
    }

    render(){
        if(this.props.show){
            return(
                <div　id='overlay'>
                    <div id='content'>
                        <h3>本当に削除しますか？</h3>
                        <p>一度削除すると、元に戻すことはできません。</p>
                        <button onClick={() => {
                            this.props.clickButton(this.state)
                        }}>キャンセル</button>
                        <button onClick={this.props.onEventCallback}>削除する</button>
                    </div>
                </div>
            )
        }else{
            return null
        }
    }
}

export default Modal;