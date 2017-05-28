import {MaxesGame, RpsMove} from "../MaxesGame";
import {RpsInput} from "./RpsInput";

export class MaxesState extends Phaser.State {

    private maxes: MaxesGame;

    private p1Moves: Phaser.Group;
    private p2Moves: Phaser.Group;

    public preload(): void {
        this.load.spritesheet("rps", "assets/rps.png", 289, 275);
        this.load.image("rps-select", "assets/rps-combined.png");
    }

    public init(): void {
        this.maxes = new MaxesGame();

        super.init();
    }

    public create(): void {
        this.p1Moves = this.add.group();
        this.p1Moves.top = this.game.height * 0.1;
        this.p1Moves.right = this.game.width * 0.45;

        this.p2Moves = this.add.group();
        this.p2Moves.top = this.game.height * 0.1;
        this.p2Moves.left = this.game.width * 0.55;

        const rps: RpsInput = new RpsInput(this.game);
        rps.width = this.game.width * 0.5;
        rps.scale.y = rps.scale.x;
        rps.centerX = this.game.width * 0.5;
        rps.centerY = this.game.height * 0.5;
        rps.visible = false;
        rps.onMoveSelected.add((move: RpsMove) => {
            const p2Move: RpsMove = this.game.rnd.pick([RpsMove.ROCK, RpsMove.PAPER, RpsMove.SCISSORS]);
            if (this.maxes.submitRpsRound(move, p2Move)) {
                this.addMoveToUi(move, p2Move);
            }
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

    private addMoveToUi(p1Move: RpsMove, p2Move: RpsMove): void {
        if (p1Move !== null) {
            const newMove: Phaser.Image = new Phaser.Image(this.game, 0, 0, "rps", p1Move);
            newMove.width = this.game.width * 0.05;
            newMove.scale.y = newMove.scale.x;
            newMove.left = this.p1Moves.width;
            newMove.events.onOutOfBounds.add(newMove.destroy, newMove);
            this.p1Moves.add(newMove);
            this.p1Moves.right = this.game.width * 0.45;
        }

        if (p2Move !== null) {
            const newMove: Phaser.Image = new Phaser.Image(this.game, 0, 0, "rps", p2Move);
            newMove.width = this.game.width * 0.05;
            newMove.scale.y = newMove.scale.x;
            newMove.events.onOutOfBounds.add(newMove.destroy, newMove);
            this.p2Moves.children.forEach((child) => {
                child.x += newMove.width;
            });
            this.p2Moves.add(newMove);
            this.p2Moves.left = this.game.width * 0.55;
        }
    }
}
