import {useState,useEffect} from 'react';

function Guide(props){
    useEffect(() => {
        console.log('pass');
    },[]);

    return(
        <div>
            <p>Guide Page</p>
        </div>
    )
}

export default Guide;