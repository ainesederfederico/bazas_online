'use strict'

const internal = {};

module.exports = internal.Hand = class {

  constructor(io, players) {

    this.io = io;
    this.players = players;
    this.up = true;
    this.maxCardsXPlayer = parseInt(48 / this.players.length) > 7 ? 7 : parseInt(48 / this.players.length);
    this.currentPlayer;

    this.setCurrentWithNext();

    this.firstPlayerByHand = this.currentPlayer;
    this.lastPlayerByHand = this.getLastPlayerByHand();
    this.cardsXPlayer = 7;
    this.bets = 0;

  }

  next() {



    this.bets = 0;

    this.setFirstAndLast()

    this.currentPlayer = this.firstPlayerByHand;

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

    console.log('Hand -> next :', this.cardsXPlayer, 'cards | first player [', this.firstPlayerByHand.username, '] | last player [', this.lastPlayerByHand.username, ']');

  }

  setCurrentWithNext() {


    //if currentPlayer doesn't exist set first connected
    if (this.currentPlayer === undefined){

      this.currentPlayer = this.players[0];

    }else{

      const currentPlayerIndex = this.players.findIndex(i => i.username === this.currentPlayer.username);
      const nextPlayerIndex = (currentPlayerIndex + 1) % this.players.length;
      this.currentPlayer = this.players[nextPlayerIndex];

    }

    console.log('setCurrentWithNext : ', this.currentPlayer.username);

  }

  getNextPlayer(player){

      const currentPlayerIndex = this.players.findIndex(i => i.username === player.username);
      const nextPlayerIndex = (currentPlayerIndex + 1) % this.players.length;
      return this.players[nextPlayerIndex];
  }

  setFirstAndLast() {


      const currentPlayerIndex = this.players.findIndex(i => i.username === this.firstPlayerByHand.username);
      const nextPlayerIndex = (currentPlayerIndex + 1) % this.players.length;
      this.firstPlayerByHand = this.players[nextPlayerIndex];

      this.lastPlayerByHand = this.getLastPlayerByHand();

    console.log('setFirstAndLast : first player [', this.firstPlayerByHand.username, '] | last player [', this.lastPlayerByHand.username, ']');

  }

  setCurrentPlayer(player) {

    this.currentPlayer = player;
    // this.firstPlayerByHand = this.currentPlayer;
    // this.lastPlayerByHand = this.getLastPlayerByHand();

  }

  emitPlayersStatus() {
    this.io.sockets.emit('players_status', {
      'current': this.currentPlayer,
      'first': this.firstPlayerByHand,
      'last': this.lastPlayerByHand,
      'all': this.players
    });

  }


  getLastPlayerByHand() {

    const lastPlayerIndex = this.players.indexOf(this.firstPlayerByHand) === 0 ? this.players.length - 1 : this.players.indexOf(this.firstPlayerByHand) - 1;

    return this.players[lastPlayerIndex];
  }

}
