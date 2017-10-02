// module.exports = function (server, app) {
//     var m = {};
//     var sockets=[];
//     // var sockets = {};
//
//
//     m.notify = function (user) {
//         //console.dir(users);
//         console.log('IO Notify:'+user);
//     };
//
//     function initWS(){
//         io = require('socket.io').listen(server);
//         io.sockets.on('connection',function(socket){
//             console.log('connected');
//             console.dir(socket);
//             sockets.push(socket);
//             socket.emit('Got connection request, sending back: \'node!\'',{text:"node!"});
//         });
//         app.use('/api/notify/:email/:message',function(req,res,next){
//             console.log('Notify');
//             if (sockets.length>0){
//                 sockets[0].broadcast.emit("notify!",{email: req.params.email,msg: req.params.message});
//                 res.sendStatus(200);
//             }else{
//                 res.sendStatus(400);
//             }
//         });
//     }
//     initWS();
//     return m;
// };

 sockets = [];
 io = null;
function _log(message){
    console.log('['+new Date().toISOString()+']' + message);
}

function _notify(user, count){
    if (sockets.length > 0) {
        _log('Notify:'+user+','+count);
        sockets[0].broadcast.emit("notify!", {email: user, msg: count});
    }
}

function _init(server, app){
    io = require('socket.io').listen(server);
    io.sockets.on('connection',function(socket){
        _log('User connected...');
        sockets.push(socket);
        _log('Online Users:'+sockets.length);
        socket.emit('Got connection request, sending back: \'node!\'',{text:"node!"});

        socket.on('disconnect', function() {
            console.log('Got disconnect!');
            var i = sockets.indexOf(socket);
            if (i !== -1) {
                sockets.splice(i, 1);
            }
            _log('Online Users:'+sockets.length);
        });
    });
    app.use('/api/notify/:email/:message',function(req,res,next){
        _log('Notify');
        if (sockets.length>0){
            sockets[0].broadcast.emit("notify!",{email: req.params.email,msg: req.params.message});
            res.sendStatus(200);
        }else{
            res.sendStatus(400);
        }
    });
}
var self = module.exports = {
    notify: _notify,
    init: _init
};