//基礎処理
export function HandleError(res){
    if(!res.ok){
        console.error('res.ok:',res.ok);
        console.error('res.status:',res.status);
        console.error('res.statusText:',res.statusText);

        return res.json().then(response => {
            console.log(response)
            throw response;
        });
    }
    return res.json();
};

//失敗時の処理
export function Code303(err,history) {
    history.push({
        pathname : err.redirectPath,
        state : {message : `${err.status} : Redirect to ${err.redirectPath}`}
    });
};

export function Code401(err,history){
    console.log('err401');
    history.push({
        pathname : '/users/login',
        state : {message : `${err.status} : ログインしてください。`}
    });
}

export function Code500(err,history){
    history.push({
        pathname : '/error/internalServerError',
        state : {message : `${err.status}_${err.type} : ${err.message}`}
    });
};


//若干冗長な気がするので、ここは最善主が見つかれば修正をする予定
export function UserValidation(err){
    var params = [];
    var error = [];

    err.messages.forEach((e) => { //これで注意しなければいけないことは再利用が可能かどうかということ。2回目バリデーションにかかった時に配列が空になってなければ、、、
        switch(e.param){
            case 'name.first' :
                if(!params[0]){
                    error[0] = e.msg;
                    params[0] = true;
                }
                break;
            case 'name.last' :
                if(!params[1]){
                    error[1] = e.msg;
                    params[1] = true;
                }
                break;
            case 'email' :
                if(!params[2]){
                    error[2] = e.msg
                    params[2] = true
                }
                break;
            case 'password' : 
                if(!params[3]){
                    error[3] = e.msg;
                    params[3] = true
                }
                break;
            default : 
                console.log('');
        }
    });
    return error;
}

export function ProfileValidation(err){
    var error = [];

    err.messages.forEach((e) => {
        switch(e.param){
            case 'age' :
                error[0] = e.msg;
                break;
            case 'site' :
                error[1] = e.msg;
                break;
            default :
                console.log('');
        }
    });
    return error;
}

export function AddChannelValidation(err){
    var error = [];
    var params = [];

    err.messages.forEach((e) => {
        switch(e.param){
            case 'channelName' : 
                if(!params[0]){
                    error[0] = e.msg;
                    params[0] = true;
                }
                break;
            case 'channelDetail' : 
                if(!params[1]){
                    error[1] = e.msg;
                    params[1] = true;
                }
                break;
            default :
                console.log('');
        }
    });
    return error;
}