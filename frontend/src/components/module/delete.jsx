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
        const error = new Error();

        fetch(`/api/users/mypage/delete`,{
            method : 'DELETE',
            headers : {
                'Accept': 'application/json,text/plain, */*',
                'Content-Type': 'application/json'
            }
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
            this.props.history.push({
                pathname : obj.redirectPath,
                state : {message : 'アカウントの削除に成功しました。'}
            });
        }).catch((err) => {
            if(err.status >= 500){
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