export const getBlock = (data) => {
    var result;
    var oneDayMessage = document.querySelectorAll('.oneDayMessage')

    oneDayMessage.forEach((ele) => {
        var children = ele.childNodes;
        children.forEach((block) => {
            if(block.tagName === 'DIV'){
                var customId = block.children[3].value;
                if(customId === data.customId){
                    result = block;
                }
            }
        });
    });
    return result;
}

export const getSocketBlock = (data) => {
    var result;
    var socketMessage = document.querySelectorAll('.msgFromSocket');
    socketMessage.forEach((block) => {
        var customId = block.children[3].value
        if(customId === data.customId){
            result = block;
        }
    });
    return result;
}