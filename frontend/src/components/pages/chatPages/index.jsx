import {Route,Switch} from 'react-router-dom';

import ChatIndex from './main';

function Chat(props) {
    return(
        <Switch>
            <Route path={props.url} exact component={ChatIndex} />
            {/* <Route path={`${props.url}/guide`} exact component={} />
            <Route path={`${props.url}/create`} exact component={} />
            <Route path={`${props.url}/channel`} exact component={} />
            <Route path={`${props.url}/:id`} exact component={} /> */}
        </Switch> 
    )
}

export default Chat;