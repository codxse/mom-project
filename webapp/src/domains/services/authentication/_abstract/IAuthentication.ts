

export interface IAuthentication<L, O> {

  loginWithGoogle(): Promise<L>;

  signOut(): Promise<O>;
}
