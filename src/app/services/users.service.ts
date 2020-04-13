import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Card } from '../models/card';
import { Player } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  usersUpdated = this.socket.fromEvent<Player[]>('usersUpdated');
  signedUpData = this.socket.fromEvent<{}>('signedUp');
  started = this.socket.fromEvent<Player>('started');

  //players_order = this.socket.fromEvent<any>('players_order');

  newCardSent = this.socket.fromEvent<{player:Player,card:Card}[]>('new_card_sent');

  new_bet_sent = this.socket.fromEvent<{players:Player[],totalBets:number}>('new_bet_sent');

  hand_finished = this.socket.fromEvent<{winner:Player,players:Player[]}>('hand_finished');

  players_status = this.socket.fromEvent<{current:Player,first:Player,last:Player,all:Player[]}>('players_status');

  constructor(private socket: Socket) { }

  signUp(username) {

    this.socket.emit('sign_up', {username : username});
  }


  start(username) {

    this.socket.emit('start',  username);
  }


  sendCard(card:Card) {

    this.socket.emit('send_card', card);
  }

  sendBet(bet:number) {

    this.socket.emit('send_bet', bet);
  }

  next_hand(){

    this.socket.emit('next_hand');
  }

}
