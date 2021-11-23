import React from 'react'; 
import {withRouter} from 'react-router-dom';

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

    search(e){//検索ボタンクリックで発火
        e.preventDefault();
        this.props.history.push({
            pathname : '/chat/search',//飛ばした後に何かしらのアクションを取る必要がある
            search : `?q=${this.state.q}&sort=${this.state.sort}&page=${this.state.page}`
        });
    }

    render(){  
        if(!this.props.search){
            return null
        }else{
            return(
                <form onSubmit={this.search}>
                    <input type="text" name='q' onChange={this.handleChange} />
                    <select name="sort" name='sort' onChange={this.handleChange} value={this.state.sort}>
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

export default withRouter(SearchPopup);

//検索は検索ボタンがクリックされた際に、popupとして出力される。検索システムとしては、クエリパラメータを用いた検索システムにする（q,page,sort）