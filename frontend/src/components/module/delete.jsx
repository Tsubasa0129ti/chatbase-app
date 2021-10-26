import React from 'react';
import {withRouter} from 'react-router-dom';
import Modal from '../atoms/deleteModal';

class Delete extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            show : false,
            delete : false
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e){
        e.preventDefault();

        this.setState({
            show : true
        });
        
    }
    
    cancel(state){
        this.setState(state)
    }

    delete(){
        fetch(`/api/users/mypage/delete`,{
            method : 'DELETE',
            headers : {
                'Accept': 'application/json,text/plain, */*',
                'Content-Type': 'application/json'
            }
        })
        .then((res) => {
            if(!res.ok){
                console.log('サーバーエラー');
            }
            return res.json();
        })
        .then((obj) => {
            if(obj.result === 'success'){
                this.props.history.push({
                    pathname : obj.redirectPath,
                    msg : 'アカウントの削除が完了しました。'
                });
            }else if(obj.result === "error"){
                console.error(obj.error);
                this.props.history.push({
                    pathname : obj.redirectPath,
                    msg : obj.result
                });
            }
        }).catch((err) => {
            console.error(err.message);
        });
    }

    render(){
        return(
            <div>
                <button　onClick={this.handleClick}>アカウントの削除</button>
                <Modal show={this.state.show} clickButton={this.cancel.bind(this)} onEventCallback={this.delete.bind(this)} />
            </div>
            
        )
    }
}

export default withRouter(Delete);

//overrayも忘れないように