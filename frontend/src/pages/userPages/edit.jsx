import React from 'react';
import Header from '../../components/block/header';

class Edit extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            first : '',
            last : '',
            message : '',
            first_error : '',
            last_error : ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        fetch('/api/users/mypage/edit')
        .then((res) => {
            if(!res.ok){
                console.error('サーバーエラ〜');
            }
            return res.json();
        })
        .then((obj) => {
            if(obj.result === 'success'){
                this.setState({
                    first : obj.name.first,
                    last : obj.name.last
                });
            }else if(obj.result === 'Authentication Error'){ //これredirectPathは？
                this.props.history.push({
                    pathname : '/users/login',
                    state : {message : obj.result}
                });
            }else if(obj.result === 'Error'){
                console.error(obj.error);
                this.props.history.push({
                    pathname : obj.redirectPath,
                    state : {message : obj.result}
                });
            }
        }).catch((err) => {
            console.error(err.message);
            this.props.history.push({
                pathname : '/users/mypage',
                state : {message : 'fetch error at /users/mypage/edit'}
            });
        });

        if(this.props.location.state){
            this.setState({
                message : this.props.location.state.message
            });
        }
    }

    handleChange(e){
        const target = e.target;
        const value = target.value;
        const name = target.name;

        //first_errorの出力
        if(name === 'first'){
            if(nameChecker(value)){
                this.setState({
                    first_error : 'First Name : 1文字目は、大文字で設定してください。'
                });
            }else{
                if(value.length <= 3 || value.length >= 8){
                    this.setState({
                        first_error : 'First Name : 名前は4~7文字で記入してください'
                    });
                }else{
                    this.setState({
                        first_error : ''
                    });
                }
            }
        }

        //last_errorの出力
        if(name === 'last'){
            if(nameChecker(value)){
                this.setState({
                    last_error : 'Last Name : 1文字目は、大文字で設定してください。'
                });
            }else{
                if(value.length <= 3 || value.length >= 8){
                    this.setState({
                        last_error : 'Last Name : 名前は4~7文字で記入してください'
                    });
                }else{
                    this.setState({
                        last_error : ''
                    });
                }
            }
        }

        function nameChecker(str){
            var checker = str.match(/[A-Z]{1}[A-Za-z]*/);
            if(!checker){
                return true;
            }
        };

        this.setState({
            [name] : value
        });
    }

    handleSubmit(e){
        e.preventDefault();
        if(this.state.first_error || this.state.last_error){
            this.setState({
                message : 'エラーの修正をしてください。'
            })
        }else{
            fetch('/api/users/mypage/update',{　
                method : 'PUT',
                headers : {
                    'Accept': 'application/json,text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    name : {
                        first : this.state.first,
                        last : this.state.last
                    }
                })
            })
            .then((res) => {
                if(!res.ok){
                    console.error('サーバーエラー');
                }
                return res.json();
            })
            .then((obj) => {
                if(obj.result === 'success'){
                    this.setState({
                        message : ''
                    });
                    this.props.history.push({
                        pathname : '/users/mypage',
                        state : {message : 'アカウントの変更をしました。'}
                    });
                }else if(obj.result === 'Authentication Error'){
                    this.props.history.push({
                        pathname : '/users/login',
                        state : {message : obj.result}
                    });
                }else if(obj.result === 'Update Error'){
                    console.error(obj.error);
                    this.props.history.push({
                        pathname : '/users/mypage/edit',
                        state : {message : 'User Update Error'}
                    });
                }
            }).catch((err) => {
                console.error(err.message); //このエラー処理に関しては未定
                this.props.history.push({
                    pathname : '/users/mypage/edit',
                    state : {message : 'Error'}
                });
            });
        }

        
    }
    
    render(){
        return(  
            <div>
                <Header message={this.state.message} />
                <form onSubmit={this.handleSubmit}>
                    <h3>User Edit</h3>
                    <div className='errorMsg'>
                        <p>{this.state.first_error}</p>
                        <p>{this.state.last_error}</p>    
                    </div>
                    <div>
                        <label htmlFor='firstName'>First Name</label>
                        <input type='text' name='first' value={this.state.first} onChange={this.handleChange} />
                    </div>
                    <div>
                        <label htmlFor='lastName'>Last Name</label>
                        <input type='text' name='last' value={this.state.last} onChange={this.handleChange} />
                    </div>
                    <input type='submit' value='送信' />
                </form>
            </div>
        )
    }
}

export default Edit;

//これに関する不足点　①サーバー全般　②バリデーション機能(フロント部分は完了)　③その他のエラーに関するチェックがまだ
//追記　①fetch関係のエラー処理