import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  username:any;

  userData:any;


  connectedUsers:any;

  constructor(private userService:UsersService) { }

  ngOnInit(): void {

    this.userService.usersAdded.subscribe(users=>{
      console.log('user added',users);
      this.connectedUsers = users;

    },error=>{

      console.error('UserListComponent.ngOnInit',error);

    });

    this.userService.signedUpData.subscribe(data=>{

      console.log('signedUpData',data);

      this.userData = data;

    },error=>{

      console.error('UserListComponent.ngOnInit',error);

    });





  }

  startGame(){

    console.log('start game for user ',this.username);

    this.userService.signUp(this.username);

  }

}
