import {Link} from 'react-router-dom';

function Navigation(props){
    return(
        <Link to={props.to}>{props.name}</Link>
    )
}

export default Navigation;