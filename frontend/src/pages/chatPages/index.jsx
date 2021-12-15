import {Route,Switch} from 'react-router-dom';

import ChatPage from './main';
import Search from './search';
import Guide from './guide';
import Channel from './channel2';

function Chat(props) {
    return(
        <Switch>
            <Route path={`${props.url}`} exact component={ChatPage} />
            <Route path={`${props.url}/search`} exact={true} component={Search} />
            <Route path={`${props.url}/guide`} exact component={Guide} />
            <Route path={`${props.url}/page/:id`} exact component={Channel} />
        </Switch>  
    )
}

export default Chat;


/* 現状の問題点としては、そもそもchannel以外にはpopupは不要であるということもある。他のpopupが同様に読み込むことができるのであれば別なのだが、
    読み込むことのできるコンポーネントが一種類だけなのであれば、これを実行する意味がない。だったらチャンネルの直下にこれを持ってくる方がいいのではないか
    ただ、ヘッダーやフッターなどの共通するものに関しては、これを用いてもいいと思う（データの受け渡し層の変更が必要なのでしないけど）
*/