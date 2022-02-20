module.exports = (io) => { //ここがなぜか接続後3回も読み込まれてしまっている。
    io.on("connection",(socket) => {
        /* if(socket.request.user) {
            console.log(`接続済み from ${socket.request.user.email}`); //そっか、これログインしていない時にはサーバーが止まるようになってしまうのか　回避のための手段を講じる必要もあるか
            console.log(socket.request)
        } */
    
        socket.on("join",(id) => {
            socket.join(id);
            console.log(socket.rooms); //同時に稼働していないかもしれないな。色々と検証をする必要性はありそう。
    
            socket.on("message",async(message) => { //ここでもroomが地続きとなっていなければならない
                try {
                    var obj = {
                        userId : message.userId, //これはsession
                        username : message.username, //これもsession
                        date : message.date,
                        text : message.text,
                        time : message.time,
                        customId : message.customId //少なくともこれ要らなくね？
                    }
    
                    var newMessage = new Message(obj);
    
                    var chat = await Chat.findById(id);
                    var newMsg = await Message.create(newMessage);
    
                    var leng = chat.chatData.length;
    
                    if(leng !== 0) {
                        var latestDate = chat.chatData.slice(-1)[0].date;
                    }
    
                    if(leng === 0 || obj.date!==latestDate){
                        var promise = await Chat.findByIdAndUpdate(id,{
                            $push : {
                                chatData : {
                                    date : message.date,
                                    messages : newMsg._id
                                }
                            }
                        }).exec();
                        io.to(id).emit("accepter",obj);
                    }else{
                        var promise = await Chat.updateOne(
                            {_id : id,"chatData.date":latestDate},
                            {
                                $push : {
                                    "chatData.$.messages" : newMsg._id
                                }
                            }
                        ).exec();
                        delete obj.date;
                        io.to(id).emit("accepter",obj);
                    }
                }catch(err){
                    console.log(err.message);//next関数がないので、エラー処理が不十分になってしまっている。sessionと同時に使用可能にする。
                }
            });
    
            socket.on("update",async(message) => { //ここに関してはおそらくOK（エラー処理以外については）
                try{
                    var promise = await Message.updateOne(
                        {customId : message.customId},
                        {
                            $set : {
                                text : message.newMsg
                            }
                        }
                    ).exec();
                    io.to(id).emit("update",{
                        text : message.newMsg,
                        customId : message.customId
                    });
                }catch(err){
                    console.log(err.message);
                }
            });
    
            socket.on("delete",async(message) => {
                try {
                    var msg = await Message.findOne({customId:message.customId}).exec();
                    var chat = await Chat.findById(message.chatId).exec();
        
                    chat.chatData.forEach(async(element) => {
                        if(element.date === msg.date){
                            var leng = element.messages.length;
        
                            if(leng === 1){ //書き込みが一つしかない場合
                                console.log('書き込み件数一件');
                                var promise = await Chat.updateOne(
                                    {_id : message.chatId},
                                    {
                                        $pull : {
                                            chatData : {
                                                date : msg.date
                                            }
                                        }
                                    }
                                ).exec();
                            }else{
                                console.log(`書き込み件数${leng}件`);
                                var promise = await Chat.updateOne(
                                    {_id : message.chatId,"chatData.date" : msg.date},
                                    {
                                        $pull : {
                                            "chatData.$.messages" : msg._id
                                        }
                                    }
                                ).exec(); //ここでは従属されているidが消されるはず
                            }
                            var promiseDel = await Message.findByIdAndDelete(msg._id).exec();
                            io.to(id).emit("delete");
                        }
                    });
                }catch(err){
                    console.log(err);
                }
            });
        });
        
        socket.on("disconnect",(room) => { //これに関しては、切断処理を行う（これを前に指定しまうと、送信前に切断されてしまうことに注意）
            socket.leave(room.id);
            console.log("user disconnected");
        }); 
    });
}