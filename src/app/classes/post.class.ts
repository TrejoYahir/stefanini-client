import {User} from './user.class';

export class Post {
  constructor(
    public id: number,
    public userId: number,
    public title: string,
    public description: string,
    public date: string,
    public user?: User) {}

}
