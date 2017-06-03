import {Enum} from "./Enum";

export class RpsMove extends Enum {
    public static readonly ROCK: RpsMove = new RpsMove(0);
    public static readonly PAPER: RpsMove = new RpsMove(1);
    public static readonly SCISSORS: RpsMove = new RpsMove(2);

    private constructor(value: number) {
        super("RpsMove", value);
    }
}
