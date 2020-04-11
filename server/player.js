'use strict'

const internal = {};

module.exports = internal.Player = class {

  constructor(arg) {
    this.id = arg.id;
    this.username = arg.username;
    this.color = arg.color;
    this.cards = [];
    this.bet ;
    this.handsWon=0;
    this.global_point=0;
  }


  getCards(){
    return this.cards;
  }

  addCard(card) {
    this.cards.push(card);
  }

  cleanCards(){
    this.cards =[];
  }

  getUserAndBet(){

    return {username:this.username,bet:this.bet};
  }
}
