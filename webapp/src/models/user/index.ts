interface IUser {
  _id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  avatar: string | null;
}

export class User implements IUser {
  _id: string;
  firstName: string;
  lastName: string | null;
  email: string | null;
  avatar: string | null;

  constructor(_id: string, firstName: string, lastName: string | null, email: string | null, avatar: string | null) {
    this._id = _id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.avatar = avatar;
  }
}
