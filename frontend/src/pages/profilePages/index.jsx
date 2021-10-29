import {Route,Switch} from "react-router-dom";

//ファイルimport層
//import Id from './:id'
import New from './new';
import Edit from './edit';
import Id from './id';

import NotFound from '../errorPages/notFound';

function Profile(props) {
    return(
        <Switch>
            <Route path={`${props.url}/:id`} exact={true} component={Id} />
            <Route path={`${props.url}/new`} exact={true} component={New} />
            <Route path={`${props.url}/edit`} exact={true} component={Edit} />
            <Route component={NotFound} />
        </Switch>
    )
}
/* もし、プロフがの適用をするのであれば、mypageに委ねる */

export default Profile;