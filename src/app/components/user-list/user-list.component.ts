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
  username: any;
  userData: any;
  started: boolean = false;

  connectedUsers: Player[] = new Array();
  currentPlayer:Player;

  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.subscriptions.add(
      this.userService.usersUpdated.subscribe(
        users => {
          //console.log("user added", users);
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
          //console.log("started", data);

          this.started = true;

        },
        error => {
          console.error("UserListComponent.ngOnInit.started", error);
        }
      )
    );

    this.subscriptions.add(
      this.userService.players_order.subscribe(
        players_order => {

          //console.log("players_order", players_order);

          this.currentPlayer = players_order.current;

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
    //console.log("join user ", this.username);

    this.userService.signUp(this.username.toUpperCase());
  }

  start() {
    //console.log("start ");

    this.userService.start(this.username);
  }
}
