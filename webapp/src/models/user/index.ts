interface IUser {
  _id: string;
  displayName: string;
  firstName: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

export class User implements IUser {
  _id: string;
  displayName: string;
  private _firstName: string;
  private _lastName?: string;
  email?: string;
  avatar?: string;

  constructor(args: IUser) {
    this._id = args._id;
    this.displayName = args.displayName;
    this._firstName = args.firstName;
    this._lastName = args.lastName;
    this.email = args.email;
    this.avatar = args.avatar;
  }

  get firstName(): string { return this._firstName; }
  set firstName(name: string) {
    this._firstName = name;
  }

  get lastName(): string | undefined { return  this._lastName; }
  set lastName(name: string | undefined) {
    this._lastName = name;
  }

}
