import {Enum} from "../../Enum";

export class DirectionMove extends Enum {
    public static readonly RIGHT: DirectionMove = new DirectionMove(0);
    public static readonly UP: DirectionMove = new DirectionMove(1);
    public static readonly LEFT: DirectionMove = new DirectionMove(2);
    public static readonly DOWN: DirectionMove = new DirectionMove(3);

    private constructor(value: number) {
        super("DirectionMove", value);
    }
}
