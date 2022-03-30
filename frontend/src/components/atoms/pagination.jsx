import React,{useState,useEffect} from 'react';
import {useHistory,useLocation} from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import queryString from 'query-string';

import '../../styles/components/atoms/pagination.scss';

function Pagination(props){
    const [page,setPage] = useState(0);

    const history = useHistory();
    const location = useLocation();

    var pathname = location.pathname;
    var search = location.search;

    useEffect(() => {
        var query = queryString.parse(search);
        if(query.page){
            setPage(query.page -1);
        }
    },[search]);

    const handlePageChange = (page) => {
        var destination = page['selected'] + 1;
        var query = queryString.parse(search);
        
        history.push({
            pathname : pathname,
            search : `?q=${query.q}&sort=${query.sort}&page=${destination}`
        });
        history.go();
    }; //あとhistory.goの場合戻るをクリックしてもurlの変更に留まってしまうのも修正したい。


    return(
        <ReactPaginate
            forcePage={page}
            pageCount={props.pageCount}
            onPageChange={handlePageChange}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            previousLabel='前へ'
            nextLabel='次へ'
            breakLabel='...'
            containerClassName='pagination'
            pageClassName='page-item'
            pageLinkClassName='page-link'
            activeClassName='active'
            previousClassName='previous-page'
            nextClassName='next-page'
            previousLinkClassName='previous-link'
            nextLinkClassName='next-link'
            disabledClassName='disabled'
            breakClassName='break'
        />
    )
}

export default React.memo(Pagination);