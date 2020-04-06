import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Card } from '../models/card';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  usersUpdated = this.socket.fromEvent<User[]>('usersUpdated');
  signedUpData = this.socket.fromEvent<{}>('signedUp');
  started = this.socket.fromEvent<User>('started');

  players_order = this.socket.fromEvent<any>('players_order');

  newCardSent = this.socket.fromEvent<{player:User,card:Card}[]>('new_card_sent');

  hand_finished = this.socket.fromEvent<User>('hand_finished');

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

  next_hand(){

    this.socket.emit('next_hand');
  }

}
