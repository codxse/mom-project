export interface IDrawingCoordinate {
  _id: string;
  x: number;
  y: number;
  color: string;
  thick: number;
}

export class DrawingCoordinate implements IDrawingCoordinate {
  private __id: string;
  private _x: number;
  private _y: number;
  private _color: string;
  private _thick: number;

  constructor(args: IDrawingCoordinate) {
    this.__id = args._id;
    this._x = args.x;
    this._y = args.y;
    this._color = args.color;
    this._thick = args.thick;
  }

  set _id(id: string) { this.__id = id }
  get _id(): string { return this.__id; }

  get x(): number { return this._x; }
  set x(x: number) { this._x = x; }

  get y(): number { return this._y; }
  set y(y: number) { this._y = y; }

  get color(): string { return this._color; }
  set color(c: string) { this._color = c; }

  get thick(): number { return this._thick; }
  set thick(t: number) { this._thick = t}
}
