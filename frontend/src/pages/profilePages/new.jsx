import React from 'react';
import Header from '../../components/block/header';

class New extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            username : '',
            intro : '',
            age : '',
            prefecture : '',
            address : '',
            birthday : '',
            belongings : '',
            message : '',
            intro_error : '',
            age_error : '',
            address_error : ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount(){
        //すでに作成されている場合には、detailへとリダイレクト
        fetch('/api/profile/new')
        .then((res) => {
            if(!res.ok){
                console.error('server error');
            }
            return res.json();
        })
        .then((obj) => {
            if(obj.result === 'success'){
                //ページの続行
                this.setState({
                    username : obj.username
                });
            }else if(obj.result === 'Authentication Error'){
                this.props.history.push({
                    pathname : obj.redirectPath,
                    state : {message : obj.result}
                });
            }else if(obj.result === 'Profile Exist'){
                this.props.history.push({
                    pathname : obj.redirectPath,
                    state : {message : obj.result}
                });
            }else{
                //ここにエラー処理を追加するかも（多分来ないけど）
            }
        }).catch((err) => {
            console.error(err.message);
        });

        if(this.props.location.state){
            this.setState({
                message : this.props.location.state.message
            });
        }
    }

    handleChange(e){
        const target = e.target;
        const name = target.name;
        const value = target.value;

        if(name === 'intro'){
            if(value.length > 50){
                this.setState({
                    intro_error : 'Intro　: ひとことは50文字以内に設定してください。'
                });
            }else{
                this.setState({
                    intro_error : ''
                });
            }
        }

        if(name === 'age'){
            if(value < 0 || value > 120){
                this.setState({
                    age_error : '正しい年齢を記載してください。'
                });
            }else{
                this.setState({
                    age_error : ''
                });
            }
        }

        if(name === 'address'){
            if(addressChecker(value)){
                this.setState({
                    address_error : 'ハイフンを含めた、正しい郵便番号を記入してください。'
                });
            }else{
                this.setState({
                    address_error : ''
                });
            }
        }

        function addressChecker(str) {
            var checker = str.match(/^[0-9]{3}-[0-9]{4}$/);
            if(checker || str===""){
                return false;
            }else{
                return true;
            }
        };

        this.setState({
            [name] : value
        });

    }

    handleSubmit(e){
        e.preventDefault();

        if(this.state.intro_error || this.state.address_error || this.state.age_error){
            this.setState({
                message : 'エラーを修正してください。'
            });
        }else{
            fetch('/api/profile/create',{
                method : 'POST',
                headers : {
                    'Accept': 'application/json,text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body : JSON.stringify({
                    intro : this.state.intro,
                    age : this.state.age,
                    prefecture : this.state.prefecture,
                    address : this.state.address,
                    birthday : this.state.birthday,
                    belongings : this.state.belongings
                })
            })
            .then((res) => {
                if(!res.ok){
                    console.error('server error'); //サーバー側のエラーに関してはここに流される
                }
                return res.json();
            })
            .then((obj) => {//ここでのエラーは定義したエラーに関してのはず
                if(obj.result === 'success'){
                    this.props.history.push({
                        pathname : obj.redirectPath,
                        state : {message : 'プロフィールの作成に成功しました。'}
                    });
                }else if(obj.result === 'Authentication Error'){
                    this.props.history.push({
                        pathname : obj.redirectPath,
                        state : {message : obj.result}
                    });
                }else if(obj.result === 'Profile Create Error'){//これに関しては、res.okでの受け取りかもしれない
                    this.props.history.push({
                        pathname : obj.redirectPath,
                        state : {message : obj.result}
                    });
                }
            }).catch((err) => {
                console.error(err.message);
            });
        }

        
    }

    render(){
        return(
            <div>
                <Header message={this.state.message} />
                <form onSubmit={this.handleSubmit}>
                    <p>{this.state.username}さんのプロフィール作成画面</p>
                    <div className='errorMsg'>
                        <p>{this.state.intro_error}</p>
                        <p>{this.state.address_error}</p>
                        <p>{this.state.age_error}</p>
                    </div>
                    <div>
                        <label htmlFor='intro'>ひとこと</label>
                        <textarea name='intro' cols='40' rows='3' maxLength='60' onChange={this.handleChange} />
                    </div>
                    <div>
                        <label htmlFor="age">年齢</label>
                        <input type="number" name='age' onChange={this.handleChange} />
                    </div>
                    <div>
                        <label htmlFor='prefecture'>都道府県</label>
                        <select name='prefecture' onChange={this.handleChange}>
                            <option value='' defaultValue>都道府県</option>
                            <option value='北海道'>北海道</option>
                            <option value='青森県'>青森県</option>
                            <option value='岩手県'>岩手県</option>
                            <option value='宮城県'>宮城県</option>
                            <option value='秋田県'>秋田県</option>
                            <option value='山形県'>山形県</option>
                            <option value='福島県'>福島県</option>
                            <option value='茨城県'>茨城県</option>
                            <option value='栃木県'>栃木県</option>
                            <option value='群馬県'>群馬県</option>
                            <option value='埼玉県'>埼玉県</option>
                            <option value='千葉県'>千葉県</option>
                            <option value='東京都'>東京都</option>
                            <option value='神奈川県'>神奈川県</option>
                            <option value='新潟県'>新潟県</option>
                            <option value='富山県'>富山県</option>
                            <option value='石川県'>石川県</option>
                            <option value='福井県'>福井県</option>
                            <option value='山梨県'>山梨県</option>
                            <option value='長野県'>長野県</option>
                            <option value='岐阜県'>岐阜県</option>
                            <option value='静岡県'>静岡県</option>
                            <option value='愛知県'>愛知県</option>
                            <option value='三重県'>三重県</option>
                            <option value='滋賀県'>滋賀県</option>
                            <option value='京都府'>京都府</option>
                            <option value='大阪府'>大阪府</option>
                            <option value='兵庫県'>兵庫県</option>
                            <option value='奈良県'>奈良県</option>
                            <option value='和歌山県'>和歌山県</option>
                            <option value='鳥取県'>鳥取県</option>
                            <option value='島根県'>島根県</option>
                            <option value='岡山県'>岡山県</option>
                            <option value='広島県'>広島県</option>
                            <option value='山口県'>山口県</option>
                            <option value='徳島県'>徳島県</option>
                            <option value='香川県'>香川県</option>
                            <option value='愛媛県'>愛媛県</option>
                            <option value='高知県'>高知県</option>
                            <option value='福岡県'>福岡県</option>
                            <option value='佐賀県'>佐賀県</option>
                            <option value='長崎県'>長崎県</option>
                            <option value='熊本県'>熊本県</option>
                            <option value='大分県'>大分県</option>
                            <option value='宮崎県'>宮崎県</option>
                            <option value='鹿児島県'>鹿児島県</option>
                            <option value='沖縄県'>沖縄県</option>
                            </select>
                    </div>
                    <div>
                        <label htmlFor='address'>住所</label>
                        <input type='text' name='address' onChange={this.handleChange} />
                    </div>
                    <div>
                        <label htmlFor='birthday'>生年月日</label>
                        <input type='date' name='birthday' onChange={this.handleChange} />
                    </div>
                    <div>
                        <label htmlFor='belongings'>所属</label>
                        <input type='radio' name='belongings' value='会社員' onChange={this.handleChange} />会社員
                        <input type='radio' name='belongings' value='公務員' onChange={this.handleChange} />公務員
                        <input type='radio' name='belongings' value='自営業' onChange={this.handleChange} />自営業
                        <input type='radio' name='belongings' value='会社役員' onChange={this.handleChange} />会社役員
                        <input type='radio' name='belongings' value='自由業' onChange={this.handleChange} />自由業
                        <input type='radio' name='belongings' value='専業主婦' onChange={this.handleChange} />専業主婦
                        <input type='radio' name='belongings' value='学生' onChange={this.handleChange} />学生
                        <input type='radio' name='belongings' value='パート・アルバイト' onChange={this.handleChange} />パート・アルバイト
                        <input type='radio' name='belongings' value='無職' onChange={this.handleChange} />無職
                        <input type='radio' name='belongings' value='その他' onChange={this.handleChange} />その他
                    </div>
                    <input type='submit' value='送信' />
                </form>
            </div>
        )
    }
}

export default New;