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
app.use(express.static(path.join(__dirname, 'dist/bazas')));

// Send all other requests to the Angular app
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/bazas/index.html'));
});

http.listen(process.env.PORT || 4444, () => {
  console.log('Listening on port 4444');
});

//###########################################################

const users = [];
const connnections = [];


// const documents = {};

// io.on('connection', socket => {
//     let previousId;
//     const safeJoin = currentId => {
//         socket.leave(previousId);
//         socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
//         previousId = currentId;
//     }

//     socket.on('getDoc', docId => {
//         safeJoin(docId);
//         socket.emit('document', documents[docId]);
//     });

//     socket.on('addDoc', doc => {
//         documents[doc.id] = doc;
//         safeJoin(doc.id);
//         io.emit('documents', Object.keys(documents));
//         socket.emit('document', doc);
//     });

//     socket.on('editDoc', doc => {
//         documents[doc.id] = doc;
//         socket.to(doc.id).emit('document', doc);
//     });

//     io.emit('documents', Object.keys(documents));

//     console.log(`Socket ${socket.id} has connected`);
// });

//listen on every connection
io.on('connection', (socket) => {

  console.log(`Socket ${socket.id} has connected`);
  connnections.push(socket)

  socket.on('signUp', data => {

    if (users.filter(u => u.username === data.username).length === 0 && data.username) {

      socket.id = uuid.v4(); // create a random id for the user
      socket.username = data.username;

      const user = {
        id: socket.id,
        username: socket.username,
        color: randomColor()
      };

      users.push(user);

      io.sockets.emit('signedUp', user);

      updateUsernames();

    } else {

      console.log('username already exists');

    }


  })

  //update Usernames in the client
  const updateUsernames = () => {
    io.sockets.emit('usersAdded', users)
  }

  // //listen on new_message
  // socket.on('new_message', (data) => {
  //     //broadcast the new message
  //     io.sockets.emit('new_message', {message : data.message, username : socket.username,color: socket.color});
  // })

  // //listen on typing
  // socket.on('typing', data => {
  //     socket.broadcast.emit('typing',{username: socket.username})
  // })

  //Disconnect
  socket.on('disconnect', data => {

    console.log('disconnect', socket.username);

    if (!socket.username)
      return;
    //find the user and delete from the users list
    let user = undefined;
    for (let i = 0; i < users.length; i++) {
      if (users[i].id === socket.id) {
        user = users[i];
        break;
      }
    }
    users.splice(user, 1);
    //Update the users list
    updateUsernames();
    connnections.splice(connnections.indexOf(socket), 1);
  })
})
