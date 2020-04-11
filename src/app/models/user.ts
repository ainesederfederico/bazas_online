import { Card } from './card';

export interface Player {

      id: number,
      username: string,
      color: string,
      cards:Card[],
      bet:number,
      handsWon:number,
      global_point:number
}
