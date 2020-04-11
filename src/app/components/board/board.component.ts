import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Subscription } from 'rxjs';
import { Card } from 'src/app/models/card';
import { Player } from 'src/app/models/user';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnDestroy  {

  subscriptions: Subscription = new Subscription();
  me: Player;

  players_order:any;
  playedCards:{player:Player,card:Card}[] = new Array();
  globalBets:{players:Player[],totalBets:number};
  hand_winner:{winner:Player,players:Player[]};

  constructor(private userService: UsersService) {}


  ngOnInit(): void {

    this.subscriptions.add(
      this.userService.started.subscribe(
        data => {

          //console.log("started", data);
          this.me = data;
        },
        error => {
          console.error("BoardComponent.ngOnInit.started", error);
        }
      )
    );


    this.subscriptions.add(
      this.userService.newCardSent.subscribe(
        data => {

          console.log("newCardSent", data);
          this.playedCards = data;

        },
        error => {
          console.error("BoardComponent.ngOnInit.newCardSent", error);
        }
      )
    );

    this.subscriptions.add(
      this.userService.new_bet_sent.subscribe(
        data => {


          this.globalBets = data;

          console.log("new_bet_sent", this.globalBets);

        },
        error => {
          console.error("BoardComponent.ngOnInit.newCardSent", error);
        }
      )
    );

    this.subscriptions.add(
      this.userService.players_order.subscribe(
        players_order => {

          console.log("players_order", players_order);

          this.players_order = players_order;

        },
        error => {
          console.error("BoardComponent.ngOnInit.players_order", error);
        }
      )
    );


    this.subscriptions.add(
      this.userService.hand_finished.subscribe(
        data => {

          console.log("hand_finished", data);
          this.hand_winner = data;

          this.globalBets.players = this.hand_winner.players;

          setTimeout( () => {

            this.playedCards = new Array();
            this.hand_winner = undefined;

          }, 3000 );


        },
        error => {
          console.error("BoardComponent.ngOnInit.hand_finished", error);
        }
      )
    );
  }

  ngOnDestroy(): void {
    throw new Error("Method not implemented.");
  }


  sendCard(card){

    //console.log(card);
    this.me.cards = this.me.cards.filter(obj => obj !== card);

    this.userService.sendCard(card);

  }

  sendBet(){

    this.userService.sendBet(this.me.bet);

  }
}
