'use strict'

const internal = {};

module.exports = internal.Card = class {

  constructor(arg) {

    this.type= arg.type;
    this.text= arg.text;
    this.number= arg.number;
    this.image = arg.image;

  }
}
