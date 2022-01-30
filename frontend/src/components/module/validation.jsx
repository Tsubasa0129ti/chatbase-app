export function isUpper(val){//１文字目が大文字かどうか
    var checker = val.match(/^[A-Z]/);
    if(!checker){
        return false;
    }
    return true;
};

export function isAlpha(val){//全てがアルファベットかどうか
    var checker = val.match(/^[a-zA-Z]*$/);
    if(!checker){
        return false;
    }
    return true;
};

export function isLength(value,{min,max}){//文字数の判定を行う　isLength("a",{min:2,max:10})
    var leng = value.length;
    if(min>leng || max<leng){
        return false
    }
    return true
};


export function isEmail(val){ //emailの判別を行う
    var checker = val.match(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9]{1,}$/);
    if(!checker){
        return false;
    }
    return true;
};

export function isAscii(val){//アスキー文字かどうかの判別を行う
    var checker = val.match(/^[\x20-\x7e]*$/);
    if(!checker){
        return false;
    }
    return true;
};

export function isContain(val,pattern){//特定のpatternが含まれるかどうか　isContain("asas",/[A-Za-z]/) みたいな感じで使用する
    var checker = val.match(pattern);
    if(!checker){
        return false;
    }
    return true;
};

export function isAddress(val){//アドレスかどうかの判定
    var checker = val.match(/^\d{3}-\d{4}$/);
    if(!checker){
        return false;
    }
    return true; 
};

export function isURL(val) { //URLの判定を行う .なしでも判定を通ってしまう（サーバーサイドのバリデーションにはかかるが。。。）
    console.log(val);
    let pattern = /^(https?|ftp)(:\/\/[\w/:%#$&?()~.=+-]+)/;
    const checker = val.match(pattern);
    if(!checker){
        return false;
    }
    return true;
}

export function isInt(val,{min,max}){ //数値のチェックを行う　小数点のチェックと値の範囲の決定
    var int = Number.isInteger(parseFloat(val));
    if(int){
        if(val>=min && max>=val){
            return true;
        }else{
            return false;
        }
    }else{
        return false;
    }
};

export function isEmpty(val){ //profile用に、、空の時にはエラーとならないように
    if(val){
        return false;
    }
    return true;
}

//今回のケースでは、validationを通過する場合はreturn true、逆にエラーを取得するときはfalseを返す　