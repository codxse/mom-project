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
import { initiateMouse, InitiateMouse, clearStateDrawing, ClearStateDrawing, readCanvasDrawing, ReadCanvasDrawing,
  changePenColor, ChangePenColor, changePenSize, ChangePenSize,
} from './domains/states/canvas/actions';
import { RootReducer } from './domains/states/root-reducer';
import { UserReducer } from './domains/states/user/reducer';
import { User } from './models/User';
import { SketchPicker } from 'react-color';
import { CanvasReducer } from './domains/states/canvas/reducer';


interface IPApp {
  userReducer: UserReducer;
  canvasReducer: CanvasReducer;
  initiateLoginWithGoogleRequest: InitiateLoginWithGoogle;
  clearStateGoogleLogin: ClearStateGoogleLogin;
  listenOnUserChanges: ListenOnUserChanges;
  initiateGetUserProfile: InitiateGetUserProfile;
  clearStateGetUserProfile: ClearStateGetUserProfile;
  initiateMouse: InitiateMouse;
  readCanvasDrawing: ReadCanvasDrawing;
  clearStateDrawing: ClearStateDrawing;
  changePenColor: ChangePenColor;
  changePenSize: ChangePenSize;
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
    const canvasSetting = this.props.canvasReducer.setting;
    return (
      <div className="App">
        <h1 className={"text-6xl font-sans"}>Lets Drawing</h1>
        <div className={"flex justify-center"}>
          <canvas
            ref={this._canvasRef}
            id="myCanvas"
            width="1000"
            height="800"
            style={{
              backgroundColor: "white",
              border: "1px solid #c3c3c3",
            }}>
            Your browser does not support the canvas element.
          </canvas>
          <div className={"ml-3"}>
            {
              user ?
                <div
                  style={{border: "1px solid #c3c3c3",}}
                  className="flex flex-col bg-white rounded-lg p-6 shadow-lg mb-3 justify-center"
                >
                  <div className={"flex justify-center"}>
                    <img className="h-16 w-16 md:h-24 md:w-24 rounded-full mx-auto md:mx-0 mb-3" src={user?.avatar} alt={user?.displayName}/>
                  </div>
                  <span>Hi, <b>{user?.displayName || user?.email}</b></span>
                </div> :
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full mb-3"
                  onClick={this.props.initiateLoginWithGoogleRequest}
                >Login with Google</button>
            }
            <SketchPicker
              className={"mb-3"}
              color={canvasSetting.penColor}
              disableAlpha
              onChange={(color, event) => {
                this.props.changePenColor(color.hex);
              }}
              onChangeComplete={(color) => this.props.changePenColor(color.hex)}
            />
            <div className={"w-full h-8 mb-3 shadow-lg rounded"} style={{backgroundColor: canvasSetting.penColor, border: "1px solid #c3c3c3"}}/>
            <div className={"w-full"}>
              <input
                type="range" min="1" max="100" value={canvasSetting.penSize} className={"w-full mb-3"}
                onChange={(event) => {
                  const size = parseInt(event.target.value);
                  this.props.changePenSize(size);
                }}
              />
              <span>Pen Size:</span>
              <h2 className={"text-6xl font-sans"}>{canvasSetting.penSize}</h2>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state: RootReducer) => ({ ...state, });
const mapDispatchToProps = {
  initiateLoginWithGoogleRequest, clearStateGoogleLogin, listenOnUserChanges, initiateGetUserProfile,
  clearStateGetUserProfile, initiateMouse, readCanvasDrawing, clearStateDrawing, changePenSize, changePenColor,
};
export default connect(mapStateToProps, mapDispatchToProps)(App);
