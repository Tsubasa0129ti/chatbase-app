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
        case 'error':
            return {
                ...state,
                show : false,
                message : '410 : 現在そのユーザーは使われておりません。'
            }
        default:
            return state
    }
}

const reducer_addChannelModal = (state={},action) => {
    switch(action.type){
        case 'popup':
            return {
                ...state,
                show : true
            }
        case 'close':
            return {
                ...state,
                show : false
            }
        default :
            return state
    }
}

const reducer_userDeleteModal = (state={},action) => {
    switch(action.type){
        case 'popup':
            return {
                ...state,
                show : true
            }
        case 'close':
            return {
                ...state,
                show : false
            }
    }
}
 
export {reducer_deleteModal,reducer_profileModal,reducer_addChannelModal,reducer_userDeleteModal};