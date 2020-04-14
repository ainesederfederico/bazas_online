import { Component, OnInit, OnDestroy } from "@angular/core";
import { UsersService } from "src/app/services/users.service";
import { Subscription } from "rxjs";
import { Card } from "src/app/models/card";
import { Player } from "src/app/models/user";

@Component({
  selector: "app-board",
  templateUrl: "./board.component.html",
  styleUrls: ["./board.component.scss"],
})
export class BoardComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();
  me: Player;

  playedCards: { player: Player; card: Card }[] = new Array();
  globalBets: { players: Player[]; totalBets: number };
  hand_winner: { winner: Player; players: Player[] };
  players_status: {
    current: Player;
    first: Player;
    last: Player;
    all: Player[];
  };

  can_last_player_bet: boolean = false;
  all_bets_ready: boolean = false;

  constructor(private userService: UsersService) {}

  ngOnInit(): void {

    this.subscriptions.add(
      this.userService.players_status.subscribe(
        (data) => {
          this.players_status = data;

          console.log("players_status", this.players_status);
        },
        (error) => {
          console.error("BoardComponent.ngOnInit.players_status", error);
        }
      )
    );

    this.subscriptions.add(
      this.userService.started.subscribe(
        (data) => {
          //console.log("started", data);
          this.me = data;
        },
        (error) => {
          console.error("BoardComponent.ngOnInit.started", error);
        }
      )
    );

    this.subscriptions.add(
      this.userService.newCardSent.subscribe(
        (data) => {
          console.log("newCardSent", data);
          this.playedCards = data;
        },
        (error) => {
          console.error("BoardComponent.ngOnInit.newCardSent", error);
        }
      )
    );

    this.subscriptions.add(
      this.userService.new_bet_sent.subscribe(
        (data) => {
          this.globalBets = data;

          this.can_last_player_bet = false;
          this.all_bets_ready = false;

          if (
            this.globalBets.players.filter((p) => p.bet !== undefined)
              .length ===
            this.players_status.all.length - 1
          ) {
            this.can_last_player_bet = true;
          }

          if (
            this.globalBets.players.filter((p) => p.bet !== undefined)
              .length === this.players_status.all.length
          ) {
            this.all_bets_ready = true;
          }
          console.log("new_bet_sent", this.globalBets);
        },
        (error) => {
          console.error("BoardComponent.ngOnInit.new_bet_sent", error);
        }
      )
    );

    this.subscriptions.add(
      this.userService.hand_finished.subscribe(
        (data) => {
          console.log("hand_finished", data);
          this.hand_winner = data;

          this.globalBets.players = this.hand_winner.players;

          setTimeout(() => {
            this.playedCards = new Array();
            this.hand_winner = undefined;

          }, 3000);
        },
        (error) => {
          console.error("BoardComponent.ngOnInit.hand_finished", error);
        }
      )
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  getAvailableBets() {
    let available_bets = [];

    for (let index = 0; index < this.me.cards.length + 1; index++) {
      available_bets.push(index);
    }

    if (
      this.players_status != undefined &&
      this.me.username === this.players_status.last.username &&
      this.globalBets &&
      this.globalBets.totalBets > 0
    ) {
      let not_available = this.me.cards.length - this.globalBets.totalBets;
      available_bets = available_bets.filter((value) => value != not_available);
    }

    return available_bets;
  }

  sendCard(card) {

    this.me.cards = this.me.cards.filter((obj) => obj !== card);

    this.userService.sendCard(card);
  }

  sendBet() {
    this.userService.sendBet(this.me.bet);
  }
}
