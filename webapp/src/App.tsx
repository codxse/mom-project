import React, { RefObject } from 'react';
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
  clearStateGetUserProfile,
  ClearStateGetUserProfile,
} from './domains/states/user/actions';
import { initiateMouse, InitiateMouse, clearStateDrawing, ClearStateDrawing, readCanvasDrawing, ReadCanvasDrawing } from './domains/states/canvas/actions';
import { RootReducer } from './domains/states/root-reducer';
import { UserReducer } from './domains/states/user/reducer';
import { User } from './models/user/User';

interface IPApp {
  userReducer: UserReducer;
  initiateLoginWithGoogleRequest: InitiateLoginWithGoogle;
  clearStateGoogleLogin: ClearStateGoogleLogin;
  listenOnUserChanges: ListenOnUserChanges;
  initiateGetUserProfile: InitiateGetUserProfile;
  clearStateGetUserProfile: ClearStateGetUserProfile;
  initiateMouse: InitiateMouse;
  readCanvasDrawing: ReadCanvasDrawing;
  clearStateDrawing: ClearStateDrawing;
}

export class App extends React.Component<IPApp, any> {
  private _canvasRef: RefObject<any>;

  constructor(props: IPApp) {
    super(props);
    this._canvasRef = React.createRef();
  }

  componentDidMount(): void {
    this.props.listenOnUserChanges();
    this.props.initiateMouse(this._canvasRef.current);
    this.props.readCanvasDrawing(this._canvasRef.current);
  }

  componentDidUpdate(prevProps: Readonly<IPApp>, prevState: Readonly<any>, snapshot?: any): void {
    const nextUid = this.props.userReducer.currentUser.data?._id;
    const prevUid = prevProps.userReducer.currentUser.data?._id;
    if (nextUid !== prevUid) {
      this.props.initiateGetUserProfile("VGpkGUvJOjgeSe7kncS4");
    }
  }

  componentWillUnmount(): void {
    this.props.clearStateGoogleLogin();
    this.props.clearStateGetUserProfile();
    this.props.clearStateDrawing();
  }

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    const user: User | null = this.props.userReducer.currentUser.data;

    return (
      <div className="App">
        <h1>{user?.firstName || "-"}</h1>
        <canvas
          ref={this._canvasRef}
          id="myCanvas"
          width="1000"
          height="800"
          style={{
            border: "1px solid #c3c3c3",
          }}>
          Your browser does not support the canvas element.
        </canvas>
      </div>
    )
  }
}

const mapStateToProps = (state: RootReducer) => ({ ...state, });
const mapDispatchToProps = {
  initiateLoginWithGoogleRequest, clearStateGoogleLogin, listenOnUserChanges, initiateGetUserProfile,
  clearStateGetUserProfile, initiateMouse, readCanvasDrawing, clearStateDrawing,
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
