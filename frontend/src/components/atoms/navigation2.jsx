import {Link} from 'react-router-dom';
import '../../styles/components/atoms/navigation2.scss';

function Navigation(props){
    return(
        <Link className='navigation_link' to={props.to}>{props.name}</Link>
    )
}

export default Navigation;