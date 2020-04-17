// https://devcenter.heroku.com/articles/node-websockets#option-2-socket-io

const express = require('express');
const app = express();
const http = require('http').Server(app);
const socketIO = require('socket.io');
const path = require('path');
const randomColor = require('randomcolor');

//Disable x-powered-by header
app.disable('x-powered-by')

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

// Send all other requests to the Angular app
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

var server = app.listen(process.env.PORT || 4444, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});

const io = socketIO(server);

//###########################################################


const Game = require('./server/game');
const Player = require('./server/player');

const connnections = [];
const game = new Game(io);

//listen on every connection
io.on('connection', (socket) => {

  connnections.push(socket)

  socket.on('sign_up', data => {

    console.log(' game.status',
      game.status
    );

    if(game.status == undefined){

      if (game.players.filter(u => u.username === data.username).length === 0 && data.username) {

        socket.username = data.username;

        const player = new Player({
          id: socket.id,
          username: socket.username,
          color: randomColor(),
          cards: []
        });

        game.addPlayer(player);

      } else {

        console.log('username already exists');
        //io.sockets.connected[socket.id].emit('error', 'username already exists');

      }


    }else {

      console.log('EL JUEGO ESTA INCIADO');
      //io.sockets.connected[socket.id].emit('error', 'username already exists');

    }

  })

  socket.on('start', username => {
    //Load -> mix -> give -> and send cards to each user
    game.init();

  });

  socket.on('next_hand', () => {

    game.nextHand();

  });

  socket.on('send_card', data => {

    game.calculateGame(socket, data);

  });

  socket.on('send_bet', data => {

    game.setBet(socket, data);

  });

  //Disconnect
  socket.on('disconnect', data => {

    if (!socket.username)
      return;
    //find the user and delete from the users list
    let player = undefined;

    for (let i = 0; i < game.players.length; i++) {

      if (game.players[i].id === socket.id) {
        player = game.players[i];
        break;
      }
    }

    console.log('disconnect player : ', player);

    game.players.splice(player, 1);
    //Update the users list
    //send new user notification to all player
    io.sockets.emit('usersUpdated', game.players)

    connnections.splice(connnections.indexOf(socket), 1);
  })
})
