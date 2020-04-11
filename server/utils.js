'use strict'
const Card = require('./card');

function loadCards() {

  let cards = [];

  const types = {
    "b": "basto",
    "e": "espada",
    "o": "oro",
    "c": "copa"
  }

  Object.keys(types).forEach((value, index) => {

    for (let i = 1; i <= 12; i++) {
      let card = new Card({
        type: value,
        text: types[value],
        number: i,
        image: (types[value]+ '_'+ (i < 10 ? '0' + i : i))

      });

      cards.push(card);
    }

  });

  return cards;

};


function mixCards(cards) {

  for (let i = 0; i < cards.length; i++) {

    let posicion1 = parseInt(Math.random() * cards.length);
    let tmp = cards[i];
    cards[i] = cards[posicion1];
    cards[posicion1] = tmp;
  }

  return cards;
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


module.exports = {
  loadCards,
  mixCards,
  sleep
}
