import {useContext} from 'react';
import { UserDeleteStore } from '../module/store';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";


function DeleteButton(props){
    const {dispatch} = useContext(UserDeleteStore);

    const popup = (e) => {
        e.preventDefault();
        dispatch({type:'popup'});
    }

    return(
        <a href='/' onClick={popup}>
            <FontAwesomeIcon icon={faTrashAlt} /> Delete
        </a>
    )
}

export default DeleteButton;