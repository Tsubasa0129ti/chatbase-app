import {Route,Switch} from "react-router-dom";

//ファイルimport層
import ProfileIndex from './main';

function Profile(props) {
    return(
        <Switch>
            <Route path={props.url} exact component={ProfileIndex} />
            {/* <Route path={`${props.url}/create`} exact component={} />
            <Route path={`${props.url}/edit`} exact component={} />
            <Route path={`${props.url}/update`} exact component={} /> */}
        </Switch>
    )
}

export default Profile;