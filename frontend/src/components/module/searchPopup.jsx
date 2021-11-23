import React from 'react'; 
import history from './history';

class SearchPopup extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            q : '',
            sort : '',
            message  : '',
        }
        this.handleChange = this.handleChange.bind(this);
        this.search = this.search.bind(this);
    }

    handleChange(e){
        e.preventDefault();

        const target = e.target;
        const name = target.name;
        const value = target.value;

        this.setState({
            [name] :value
        });
    } 

    search(e){//これに関しては、検索結果へのリダイレクトを行うのみ（詳細はsearchのpageで行う）
        e.preventDefault();
        history.push({
            pathname : '/chat/search',
            search : `?q=${this.state.q}&sort=${this.state.sort}&page=${this.state.page}`,
            state : {message : '変化'}
        });

    }

    render(){  
        if(!this.props.search){
            return null
        }else{
            return(
                <form onSubmit={this.search}>
                    <input type="text" name='q' onChange={this.handleChange} />
                    <select name="sort" onChange={this.handleChange} value={this.state.sort}>
                        <option value={0}>更新順（新）</option>
                        <option value={1}>更新順（古）</option>
                        <option value={2}>作成順（新）</option>
                        <option value={3}>作成順（古）</option>
                    </select>
                    <input type="submit" value='送信' />
                </form>
            )
        }
    }
}

export default SearchPopup;