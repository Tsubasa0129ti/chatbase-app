import {Route,Switch} from 'react-router-dom';

import ChatPage from './main';
import Search from './search';
import Guide from './guide';
import Channel from './channel2';
import ChatHeader from '../../components/block/chatHeader';

function Chat(props) {
    return(
        <Switch>
            <Route path={`${props.url}`} exact component={ChatPage} />
            <Route path={`${props.url}/search`} exact={true} component={Search} />
            <Route path={`${props.url}/guide`} exact component={Guide} />
            <Route path={`${props.url}/page/:id`} exact component={Channel} />
            <Route path={`${props.url}/header`} exact component={ChatHeader} />
        </Switch> 
    )
}

export default Chat;