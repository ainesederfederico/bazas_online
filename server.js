const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const path = require('path');
const randomColor = require('randomcolor');
const uuid = require('uuid');



//Disable x-powered-by header
app.disable('x-powered-by')

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

// Send all other requests to the Angular app
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

var server = app.listen(process.env.PORT || 8080, function () {
  var port = server.address().port;
  console.log("App now running on port", port);
});


//###########################################################


const Game = require('./server/game');
const Player = require('./server/player');

// const player = new Player({
//   id: 111,
//   username: 'fede',
//   color: randomColor(),
//   cards:[]
// });
// const player1 = new Player({
//   id: 222,
//   username: 'mariana',
//   color: randomColor(),
//   cards:[]
// });
// const player2 = new Player({
//   id: 333,
//   username: 'maxi',
//   color: randomColor(),
//   cards:[]
// });

// const game = new Game();

// game.addPlayer(player);
// game.addPlayer(player1);
// game.addPlayer(player2);

// game.init();

// game.nextHand();
// game.nextHand();
// game.nextHand();
// game.nextHand();
// game.nextHand();
// game.nextHand();
// game.nextHand();
// game.nextHand();

// console.log(game.players);









const connnections = [];
const game = new Game(io);

//listen on every connection
io.on('connection', (socket) => {

  // console.log(`Socket ${socket.id} has connected`);
  connnections.push(socket)

  socket.on('sign_up', data => {

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

  //Disconnect
  socket.on('disconnect', data => {

    //console.log('disconnect', socket.username);

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

    console.log('disconnect player : ',player);

    game.players.splice(player, 1);
    //Update the users list
    //send new user notification to all player
    io.sockets.emit('usersUpdated', game.players)

    connnections.splice(connnections.indexOf(socket), 1);

    //console.log('CONNECTED USERS', users)
  })
})
