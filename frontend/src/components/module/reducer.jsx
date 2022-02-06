const reducer = (state={},action) => {
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

export default reducer;