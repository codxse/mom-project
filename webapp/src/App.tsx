import React from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux';
import {
  ClearStateGoogleLogin,
  clearStateGoogleLogin,
  InitiateLoginWithGoogle,
  initiateLoginWithGoogleRequest,
  listenOnUserChanges,
  ListenOnUserChanges,
  initiateGetUserProfile,
  InitiateGetUserProfile,
} from './domains/states/user/actions';
import { RootReducer } from './domains/states/root-reducer';
import { UserReducer } from './domains/states/user/reducer';
import { User } from './models/user';


interface IPApp {
  userReducer: UserReducer;
  initiateLoginWithGoogleRequest: InitiateLoginWithGoogle;
  clearStateGoogleLogin: ClearStateGoogleLogin;
  listenOnUserChanges: ListenOnUserChanges;
  initiateGetUserProfile: InitiateGetUserProfile;
}

export class App extends React.Component<IPApp, any> {

  componentDidMount(): void {
    this.props.listenOnUserChanges();
  }

  componentDidUpdate(prevProps: Readonly<IPApp>, prevState: Readonly<any>, snapshot?: any): void {
    const nextUid = this.props.userReducer.currentUser.data?._id;
    const prevUid = prevProps.userReducer.currentUser.data?._id;
    if (nextUid !== prevUid) {
      console.log("A");
      this.props.initiateGetUserProfile("VGpkGUvJOjgeSe7kncS4");
    }
  }

  componentWillUnmount(): void {
    this.props.clearStateGoogleLogin();
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const user: User | null = this.props.userReducer.currentUser.data;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            onClick={this.props.initiateLoginWithGoogleRequest}
            rel="noopener noreferrer"
          >
            Login with Google
          </a>
          <h3>{user?.firstName || "-"}</h3>
          <img src={user?.avatar || ""} alt={user?.firstName} />
        </header>
      </div>
    )
  }
}

const mapStateToProps = (state: RootReducer) => ({ ...state, });
const mapDispatchToProps = { initiateLoginWithGoogleRequest, clearStateGoogleLogin, listenOnUserChanges, initiateGetUserProfile };
export default connect(mapStateToProps, mapDispatchToProps)(App);
