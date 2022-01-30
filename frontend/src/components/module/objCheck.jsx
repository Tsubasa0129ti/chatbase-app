export function objCheck(obj){ //オブジェクトの中身が存在するのかの確認用関数
    if(obj.hasChanged){
        delete obj.hasChanged
    }
    console.log(obj)
    var array = Object.values(obj);
    for(var i=0;i<array.length;i++){
        var value = array[i];
        if(value){
            return true;
        }else{
            if(i === array.length -1){
                return false;
            }
        }
    }
};