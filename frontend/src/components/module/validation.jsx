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

//今回のケースでは、validationを通過する場合はreturn true、逆にエラーを取得するときはfalseを返す　
//ちなみにprofileにおいては、or条件を使ってみたい