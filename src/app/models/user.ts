import { Card } from './card';

export interface User {

      id: number,
      username: string,
      color: string,
      cards:Card[]
}
