import {MaxesGame, RpsMove} from "../MaxesGame";
import {RpsInput} from "./RpsInput";

export class MaxesState extends Phaser.State {

    private maxes: MaxesGame;

    public preload(): void {
        this.load.spritesheet("rps", "assets/rps.png", 289, 275);
    }

    public init(): void {
        this.maxes = new MaxesGame();

        super.init();
    }

    public create(): void {
        const rps: RpsInput = new RpsInput(this.game);
        rps.width = this.game.width * 0.5;
        rps.scale.y = rps.scale.x;
        rps.centerX = this.game.width * 0.5;
        rps.centerY = this.game.height * 0.5;
        rps.visible = false;
        rps.onMoveSelected.add((move: RpsMove) => {
            const p2Move: RpsMove = this.game.rnd.pick([RpsMove.ROCK, RpsMove.PAPER, RpsMove.SCISSORS]);
            this.maxes.submitRpsRound(move, p2Move);
            rps.visible = false;
            rpsSelector.visible = true;
        });
        this.add.existing(rps);

        const rpsSelector: Phaser.Image = new Phaser.Image(this.game, 0, 0, "rps-select");
        rpsSelector.width = this.game.width * 0.15;
        rpsSelector.scale.y = rpsSelector.scale.x;
        rpsSelector.centerX = this.game.width * 0.5;
        rpsSelector.centerY = this.game.height * 0.5;
        rpsSelector.inputEnabled = true;
        rpsSelector.events.onInputUp.add(() => {
            rpsSelector.visible = false;
            rps.visible = true;
        });
        this.add.existing(rpsSelector);
    }
}
