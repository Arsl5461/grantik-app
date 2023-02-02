var express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cors = require('cors'),
    path = require("path"),
    socketio = require('socket.io'),
    { addUser, removeUser, getUser, getUsersInRoom } = require('./socketUser'),
    errorhandler = require('errorhandler'),
    mongoose = require('mongoose'),
    http = require('http'),
    https = require('https'),
    fs = require('fs');
require('dotenv').config();

var isProduction = process.env.NODE_ENV === 'production';

// Create global app object
var app = express();

app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(path.join(__dirname, 'client/build')));

app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

if (!isProduction) {
    app.use(errorhandler());
}

if (isProduction) {
    mongoose.connect(process.env.MONGODB_URI);
} else {
    mongoose.connect('mongodb://localhost/conduit');
    mongoose.set('debug', true);
}

require('./models/User');
require('./models/Product');
require('./models/Photos');
require('./config/passport');
require('./models/Order');
require('./models/Chat');

app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
    app.use(function (err, req, res, next) {
        console.log(err.stack);

        res.status(err.status || 500);

        res.json({
            'errors': {
                message: err.message,
                error: err
            }
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
        'errors': {
            message: err.message,
            error: {}
        }
    });
});
var server;
if (process.env.APP_ENV === "production") {
    var privateKey = fs.readFileSync('/etc/letsencrypt/live/granitverk.is/privkey.pem', 'utf8');
    var certificate = fs.readFileSync('/etc/letsencrypt/live/granitverk.is/fullchain.pem', 'utf8');
    var credentials = { key: privateKey, cert: certificate };
    server = https.createServer(credentials, app);
} else {
    server = http.createServer(app);
}

const io = socketio(server);
var Chat = mongoose.model('Chat');

io.on('connect', (socket) => {
    let address = socket.request.connection.remoteAddress;
    socket.on('join', ({ name, room }, callback) => {
        if (room === undefined || room == null || room === '') {
            room = 'public' //Default
        }
        if (name && room) {
            console.log('New Join from ' + address + ' Socket Id: ' + socket.id);
            const { error, user } = addUser({ id: socket.id, name, room, ip: address });
            if (error) return callback(error);
            if (user.room) {
                socket.join(user.room);
                socket.emit('message', { user: 'admin', text: `Hi ${user.name}, welcome to ${user.room} chat room` });
                // pool.query('SELECT * FROM message,room WHERE room.name = $1 ORDER BY time DESC LIMIT 10', [user.room], (err, result) => {
                //     if (err) {
                //         console.log(err);
                //     } else {
                //         for (let i = result.rows.length - 1; i >= 0; i--) {
                //             let row = result.rows[i];
                //             socket.emit('message', { user: row.username, text: row.message, time: row.time, old: true });
                //         }
                //     }
                // })

                Chat.find().sort({time: 1}).limit(30).exec((err, chats) => {
                    chats.map((row) => {
                        socket.emit('message', { user: row.user, text: row.message, time: row.time, old: true });
                    })
                })
                 
                if (user) {
                    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined` });
                    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
                }
            }
        }
        callback();
    });

    socket.on('sendMessage', async (message, callback) => {
        const user = getUser(socket.id);
        if (user !== undefined) {
            await Chat.create({
                roomId: "1",
                message: message.text,
                time: message.time,
                user: user.name
            })
            // pool.query('INSERT INTO message (roomid,message,time,username) VALUES ($1,$2,$3,$4)', [1, message.text, message.time, user.name], (err, res) => {
            //     // console.log(err, res)
            // })
            io.to(user.room).emit('message', { user: user.name, text: message.text, time: message.time });
            socket.broadcast.emit('notification');
        }
        callback();
    });

    socket.on('deleteMessage', async (pw, callback) => {
        if (pw === '@granit') {
            await Chat.remove({})
        }
        callback()
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', { user: 'admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
    })
});
server.listen(process.env.PORT || 4000, function () {
    console.log('Listening on port ' + server.address().port);
});

// finally, let's start our server...
/*
var server = app.listen(process.env.PORT || 4000, function() {
    console.log('Listening on port ' + server.address().port);
});
*/