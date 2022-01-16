//想定としては、完全なexport用のファイルとして、fetchが行われたときに呼び出されるもの　

//①に関しては、各ページで行い、②はまとめてしまう、③はまとめてしまう、④は各ページに委ね、⑤はある程度まとめてしまう。（特別なものは、各ページにし、該当がなければここで行う）

export function HandleError(res){ //関数１　ここに関する問題点　①サーバー側のエラーを適切に受け取ること（全てinternal server errorになってしまうのを防ぐ）
    if(!res.ok){
        const error = new Error();

        console.error('res.ok:',res.ok);
        console.error('res.status:',res.status);
        console.error('res.statusText:',res.statusText);

        error.message = res.statusText;
        error.status = res.status;
        throw error;
    }
    return res.json();
};

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
*/