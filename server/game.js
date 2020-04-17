'use strict'

const Util = require('./utils');
const Hand = require('./hand');


const internal = {};

module.exports = internal.Game = class {

  constructor(io) {

    this.io = io;
    this.cards = Util.loadCards();
    this.players = [];
    this.cardsPlayed = [];
    this.inner_hands = 0;
    this.hand;
    this.status;

  }

  init() {

    this.status ='started';

    this.cardsPlayed = [];
    this.hand = new Hand(this.io,this.players);

    console.log('Hand -> first :', this.hand.cardsXPlayer, 'cards | first player [', this.hand.firstPlayerByHand.username, '] | last player [', this.hand.lastPlayerByHand.username, ']');

    this.mixCards();
    this.distributeCards();


    this.hand.emitPlayersStatus();

  }

  nextHand() {

    this.cardsPlayed = [];

    this.hand.next();

    console.log('Hand -> first :', this.hand.cardsXPlayer, 'cards | first player [', this.hand.firstPlayerByHand.username, '] | last player [', this.hand.lastPlayerByHand.username, ']');

    this.players.forEach(p => {
      p.bet = undefined;
      p.handsWon = 0
    });

    this.io.sockets.emit('new_bet_sent', {
      players: this.players.filter(p => p.bet != undefined),
      totalBets: this.hand.bets
    });

    this.mixCards();

    this.distributeCards();
  }


  mixCards() {
    this.cards = Util.mixCards(this.cards);
  }

  distributeCards() {

    let index = 0;

    this.players.forEach((player) => {

      player.cleanCards();

      for (let i = 0; i < this.hand.cardsXPlayer; i++) {

        player.addCard(this.cards[index]);
        index++;
      }

      //console.log(player.username, player.cards);

      this.io.sockets.connected[player.id].emit('started', player);

    })

  }


  calculateGame(socket, card) {

      let card_played = {
        player: this.players.find(u => u.username === socket.username),
        card: card
      }

      this.cardsPlayed.push(card_played);

      this.io.sockets.emit('new_card_sent', this.cardsPlayed);

      //Termino la mano si las cartas jugadas es igual a la cantidad de jugadores
      if(this.cardsPlayed.length === this.players.length){ //mano terminada

        const winner = this.handWinnerIs();

        console.log('MANO TERMINADA WINNER :',winner.username);

        this.players.find(u=>u.username === winner.username).handsWon ++;

        //vacia las cartas jugadas
        this.cardsPlayed = [];

        this.io.sockets.emit('hand_finished', {winner:winner,players:this.players});


        //Suma la cantidad de manos
        this.inner_hands++;

        //Si las manos es igual a las cartas por jugador termino la ronda
        if(this.inner_hands === this.hand.cardsXPlayer){ //ronda terminada

          console.log('RONDA TERMINADA');

          this.players.forEach((p)=>{



            if(parseInt(p.bet) == p.handsWon){
              p.global_point+=(10 + p.handsWon);
            }else{
              p.global_point+= p.handsWon;
            }

          });

          this.hand.emitPlayersStatus();
          // this.io.sockets.emit('players_status', this.players);

          Util.sleep(5000).then(() => {

            //Vacia las manos
            this.inner_hands = 0;
            this.nextHand();
            this.hand.emitPlayersStatus();
          });




        }else{

          //El jugador al que le toca es el ganador de la mano
          this.hand.setCurrentPlayer(winner);
          this.hand.emitPlayersStatus();

        }


      }else{

        this.hand.setCurrentWithNext();
        this.hand.emitPlayersStatus();

      }

    }

  handWinnerIs(){

    let max_value = 0;
    let card_played_index = 0;


    this.cardsPlayed.forEach((cardPlayed,index)=>{

      let card_number = cardPlayed.card.number;

      //console.log(cardPlayed.player.username,card_number, index);

      if(card_number === 1){
        card_number = 13;
      }

      if(max_value < card_number){

        max_value = card_number;
        card_played_index = index;

      }

    });


    return this.cardsPlayed[card_played_index].player;
  }

  setBet(socket,bet){

      let player = this.players.find(u => u.username === socket.username);
      player.bet = bet;
      this.hand.bets += parseInt(bet);

      let nextPlayerBet = undefined;

      if(this.players.find(u => u.bet === undefined) != undefined)
      {
        nextPlayerBet = this.hand.getNextPlayer(player)
      }

      this.io.sockets.emit('new_bet_sent', {nextPlayer:nextPlayerBet,players:this.players.filter(p=>p.bet != undefined),totalBets:this.hand.bets});
  }

  //Player
  addPlayer(player) {
    this.players.push(player);

    //send signed up user data to his owner
    this.io.sockets.connected[player.id].emit('signedUp', player);

    //send new user notification to all player
    this.io.sockets.emit('usersUpdated', this.players)

  }

  getPlayers() {
    return this.players;
  }

  removePlayer(player) {
    this.players.splice(player, 1);
  }

}
