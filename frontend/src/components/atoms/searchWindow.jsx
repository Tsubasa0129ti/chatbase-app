import {useState} from 'react';
import {useHistory} from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSearch} from '@fortawesome/free-solid-svg-icons';

import '../../styles/components/atoms/searchWindow.scss';
 
function SearchWindow(){
    const [q,setQ] = useState('');
    const history = useHistory();

    const handleChange = (e) => {
       e.preventDefault();

       const target = e.target;
       const value = target.value;

       setQ(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        history.push({
            pathname : '/chat/search',
            search : `?q=${q}`
        });
        history.go();
    };

    return(
        <form className='search-window' onSubmit={handleSubmit}>
            <input type="text" className='search-form' placeholder='Search...' onChange={handleChange} required />
            <button className='submit'><FontAwesomeIcon icon={faSearch} /></button>
        </form>
    )
}

export default SearchWindow;