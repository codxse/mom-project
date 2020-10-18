interface IUser {
  _id: string;
  displayName: string;
  firstName: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}

export class User implements IUser {
  private __id: string;
  private _displayName: string;
  private _firstName: string;
  private _lastName?: string;
  private _email?: string;
  private _avatar?: string;

  constructor(args: IUser) {
    this.__id = args._id;
    this._displayName = args.displayName;
    this._firstName = args.firstName;
    this._lastName = args.lastName;
    this._email = args.email;
    this._avatar = args.avatar;
  }

  get firstName(): string { return this._firstName; }
  set firstName(name: string) {
    this._firstName = name;
  }

  get lastName(): string | undefined { return  this._lastName; }
  set lastName(name: string | undefined) {
    this._lastName = name;
  }

  get _id(): string { return this.__id; }

  get displayName(): string { return this._displayName; }
  set displayName(s: string) { this._displayName = s; }

  get email(): string | undefined { return this._email; }
  set email(e: string | undefined) { this._email = e; }

  get avatar(): string | undefined { return this._avatar; }
  set avatar(a: string | undefined) { this._avatar = a; }

}
