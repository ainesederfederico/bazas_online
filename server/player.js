'use strict'

const internal = {};

module.exports = internal.Player = class {

  constructor(arg) {
    this.id = arg.id;
    this.username = arg.username;
    this.color = arg.color;
    this.cards = [];
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
}
