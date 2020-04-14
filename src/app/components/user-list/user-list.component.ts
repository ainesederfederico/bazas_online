import { Component, OnInit, OnDestroy } from "@angular/core";
import { UsersService } from "src/app/services/users.service";
import { Subscription } from "rxjs";
import { Player } from 'src/app/models/user';

@Component({
  selector: "app-user-list",
  templateUrl: "./user-list.component.html",
  styleUrls: ["./user-list.component.scss"]
})
export class UserListComponent implements OnInit, OnDestroy {

  subscriptions: Subscription = new Subscription();

  me: Player;

  username: any;
  userData: any;
  started: boolean = false;

  connectedUsers: Player[] = new Array();

  players_status: {
    current: Player;
    first: Player;
    last: Player;
    all: Player[];
  };

  constructor(private userService: UsersService) {}

  ngOnInit(): void {

    this.subscriptions.add(
      this.userService.players_status.subscribe(
        data => {
          this.players_status = data;
        },
        error => {
          console.error("BoardComponent.ngOnInit.players_status", error);
        }
      )
    );

    this.subscriptions.add(
      this.userService.usersUpdated.subscribe(
        users => {
          console.log("user added", users);
          this.connectedUsers = users;
        },
        error => {
          console.error("UserListComponent.ngOnInit.usersUpdated", error);
        }
      )
    );

    this.subscriptions.add(
      this.userService.signedUpData.subscribe(
        data => {
          //console.log("signedUpData", data);

          this.userData = data;
        },
        error => {
          console.error("UserListComponent.ngOnInit.signedUpData", error);
        }
      )
    );

    this.subscriptions.add(
      this.userService.started.subscribe(
        data => {

          this.me = data;
          this.started = true;

        },
        error => {
          console.error("UserListComponent.ngOnInit.started", error);
        }
      )
    );

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  join() {

    this.userService.signUp(this.username.toUpperCase());
  }

  start() {

    this.userService.start(this.username);
  }
}
