import {MaxesState} from "./state/MaxesState";

export class Game extends Phaser.Game {
    constructor() {
        super("100", "100", Phaser.AUTO);

        this.state.add("maxes", MaxesState);

        this.state.start("maxes");
    }
}
