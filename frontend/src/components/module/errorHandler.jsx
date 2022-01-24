//想定としては、完全なexport用のファイルとして、fetchが行われたときに呼び出されるもの　
import {useHistory} from 'react-router-dom';

//①に関しては、各ページで行い、②はまとめてしまう、③はまとめてしまう、④は各ページに委ね、⑤はある程度まとめてしまう。（特別なものは、各ページにし、該当がなければここで行う）

//基礎処理 ここに関しては問題なく動作しているが、その他の処理に関してはいまいち　エラーの処理の方法を見直す必要があり、app.jsの修正をした。
export function HandleError(res){ //関数１　ここに関する問題点　①サーバー側のエラーを適切に受け取ること（全てinternal server errorになってしまうのを防ぐ）
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


//成功時の処理
export function OnLoggedIn(obj){ //LoginCheckの成功時の処理　（new.jsxとlogin.jsx） 問題発生　historyを使用してはいけないらしい
    const history = useHistory();
    console.log('onLoggedIn')
    history.push({
        pathname : '/users',
        state : {message : 'You are already authenticated!'}
    });
    //こんな感じでページの遷移を行いたいけど、history.pushは使用できないかも
}



//失敗時の処理
export function OnRejected(err,next){　//ここに関する課題　①遷移を行うためのhistoryなどが読み込むことができないこと　②実際にエラーを複数個用意すること
    //ここで行うのは結果的にはページの遷移＋messageの付与もしくはページの移動なしのmessageの付与の２パターン
    console.log('1')
    if(err.status === 500){
        console.log(2)
        return(
            console.error(err.status)
        );
    }else{
        //ある程度共通化したエラー処理に関しては、関数内部において行うが、一般的でないエラーについては、ページに引き戻す予定
        console.log(3)
        //多分ここにnext関数を置くことができればいける
        return 'next';
    }
}

//上記二つのエラーハンドラーを煮詰めれば、全体に適用することができそうだ　多分users や　porfileなどでエラーの遷移先を変える必要がある　とすると、これに分離する

/* 分析
    遷移先を今から決める

    とりあえず、サーバー側のエラーの設定は完了した。なので、fetchのコンポーネント化に移行する。一応、エラー処理がだいぶ変わってしまうので、
    users.profile.chatでそれぞれ処理を変えることを検討する。ちなみに、users mypageと分岐するかもしれない
    そして、headerなどのコンポーネントもハンドラーを使用するので、そこも柔軟に対応できるようにする必要がある。
*/

/* 取得されうるステータスコードとそれに応じた対処を決めておく

    fetchが存在する場所
    ①new.jsx 
        /api/users/loginCheck OK
        /api/users/create POST OK

    ②login.jsx
        /api/users/loginCheck OK
        /api/users/auth OK
    
    ③mypage.jsx
        /api/users/mypage OK
        /api/users/mypage/delete DELETE (これに関してはイベントにしてしまう)
    
    ④edit.jsx
        /api/users/mypage/edit
        /api/users/mypage/update

    ⑤header.jsx 一応これも入れておく
        /api/users/loginCheck OK
        /api/users/logout

    もう一つの手段として、apiのパスで決定してしまうというものもある。
    →/api/users/createの時のエラー処理みたいな形で... 割とありだな

    ①/loginCheck　（login と　newのdidMount）
    →これで取得されうるエラーは401もしくは500　そして、それ以外ということにする。（timeoutやgoneなどもあるが一旦無視する。）
    401の時は、loginへのリダイレクト + エラーの取得
    →少なくともusersに関しては、loginCheckを行った時には、エラーが出るのが通常状態らしいので、ページごとに決めるのが良さそう
    500の時は、500への遷移でいいのではないか
    その他のエラー時には、、、

    ②/api/users/create OK
    →これで取得されうるエラーは400 422 500
    400の時は、ページの遷移はなしにできる。→そのままエラーメッセージの取得
    422の時はバリデーションエラーなので上記と同様の扱い。（若干変える予定ではあるが）
    500の時は、500に飛ばす

    ③/api/users/auth
    400の時はエラーメッセージの取得
    401の時は上記と同様
    500の時は、500へ

    ④/api/users/mypage OK
    401の時は、リダイレクト　/users/loginへ
    500 は500へ

    ⑤/api/users/mypage/edit
    401のときは、リダイレクト　/users/loginへ
    500の時は　500

    ⑥/api/users/mypage/update
    400の時は、エラーメッセージの創出
    401の時はリダイレクト　/users/loginへ
    422の時は、エラーメッセージの創出
    500の時は500へ

    ⑦/api/users/mypage/delete OK
    401　リダイレクト 
    500 

    ⑧/api/users/logout
    500

    401に関しては二つのパターンに分けるのもありかもしれない。
    500に関しては統一が可能。
    400も同様
    422に関しては、各ページに任せるのが現実的

    なるほど、全てステータスコードのみでの分岐をしたかった。しかし、401の時は少なくとも全てページ遷移というわけにはいかない。500に関しては統一することは可能だとしても
    422もアル程度統一することはかのうかも　400はどちらも遷移なしなので、エラーを受け取り、これを返すという形がベスト500は統一
*/

/* 一旦飛ばす　hookがイベント関数で使用することができないかも　あまり、まとめることに向いていないかもしれない */