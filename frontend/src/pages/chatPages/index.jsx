import {Route,Switch} from 'react-router-dom';

import ChatPage from './main';
import Search from './search';
import Guide from './guide';
import Channel from './channel';
import NotFound from '../errorPages/notFound';

function Chat(props) {
    return(
        <Switch>
            <Route path={`${props.url}`} exact component={ChatPage} />
            <Route path={`${props.url}/search`} exact={true} component={Search} />
            <Route path={`${props.url}/guide`} exact component={Guide} />
            <Route path={`${props.url}/page/:id`} exact component={Channel} />
            <Route component={NotFound} />
        </Switch>  
    )
}

export default Chat;