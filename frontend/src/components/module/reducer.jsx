const reducer_deleteModal = (state={},action) => {
    switch(action.type){
        case 'popup':
            return {
                ...state,
                show : true,
                deleteData : action.deleteData,
                block : action.block
            }
        case 'close':
            return {
                ...state,
                show : false,
                deleteData : '',
                block : ''
            }
        default:
            return state
    }
}

const reducer_profileModal = (state={},action) => {
    switch(action.type){
        case 'popup':
            return {
                ...state,
                show : true,
                id : action.id
            }
        case 'close':
            return {
                ...state,
                show :false,
                id : ''
            }
        default:
            return state
    }
}
 
export {reducer_deleteModal,reducer_profileModal};