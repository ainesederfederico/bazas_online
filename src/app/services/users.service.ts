import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  usersAdded = this.socket.fromEvent<string[]>('usersAdded');

  signedUpData = this.socket.fromEvent<{}>('signedUp');

  constructor(private socket: Socket) { }

  signUp(username) {

    this.socket.emit('signUp', {username : username});
  }
}
