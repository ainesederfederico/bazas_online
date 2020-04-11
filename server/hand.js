'use strict'

const internal = {};

module.exports = internal.Hand = class {

  constructor(io, players) {

    this.io = io;
    this.players = players;
    this.up = true;
    this.maxCardsXPlayer = parseInt(48 / this.players.length) > 6 ? 6 : parseInt(48 / this.players.length);

    this.currentPlayer;
    this.getNextPlayer();

    this.firstPlayerByHand =this.currentPlayer;
    this.lastPlayerByHand = this.getLastPlayerByHand();


    this.cardsXPlayer = 2;

    this.bets=0;

  }

  next() {

    console.log('Hand -> next');

    this.bets=0;
    this.getNextPlayer()

    this.firstPlayerByHand = this.currentPlayer;
    this.lastPlayerByHand = this.getLastPlayerByHand();

    if (this.cardsXPlayer === this.maxCardsXPlayer && this.up) {
      this.up = false;
    }


    if (this.up) {
      this.cardsXPlayer++;
    } else {
      this.cardsXPlayer--;
    }

    if (this.cardsXPlayer == 2) {

      console.log('FINISH');

    }

    console.log('Hand -> next :', this.cardsXPlayer, 'cards | fist player [', this.firstPlayerByHand.username, '] | last player [', this.lastPlayerByHand.username, ']');

  }

  getNextPlayer() {

    //if currentPlayer doesn't exist calculate one randomically
    if (this.currentPlayer === undefined)
      this.currentPlayer = this.players[Math.floor(Math.random() * this.players.length)];


    console.log('currentPlayer : ', this.currentPlayer.username);

    const currentPlayerIndex = this.players.findIndex(i => i.username === this.currentPlayer.username);

    const nextPlayerIndex = (currentPlayerIndex + 1) % this.players.length;


    this.currentPlayer = this.players[nextPlayerIndex];

    console.log('nextPlayer : ', this.currentPlayer.username);
  }

  setCurrentPlayer(player) {

      this.currentPlayer = player;
      this.firstPlayerByHand =this.currentPlayer;
      this.lastPlayerByHand = this.getLastPlayerByHand();

  }

  emitPlayersOrder() {
    this.io.sockets.emit('players_order', {
      'current': this.currentPlayer,
      'firstPlayerByHand': this.firstPlayerByHand,
      'lastPlayerByHand': this.lastPlayerByHand
    });

  }


  getLastPlayerByHand() {


    const lastPlayerIndex = this.players.indexOf(this.firstPlayerByHand) === 0 ? this.players.length - 1 : this.players.indexOf(this.firstPlayerByHand) - 1;


    return this.players[lastPlayerIndex];
  }

}
