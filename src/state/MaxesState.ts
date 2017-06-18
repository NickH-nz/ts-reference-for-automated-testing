import { DirectionMove } from "../enums/DirectionMove";
import { RpsMove } from "../enums/RpsMove";
import { MaxesGame, MaxesGameState } from "../MaxesGame";
import { InputOption } from "./InputOption";
import { RadialInput } from "./RadialInput";

export class MaxesState extends Phaser.State {

    private maxes: MaxesGame;

    private p1Moves: Phaser.Group;
    private p2Moves: Phaser.Group;

    public preload(): void {
        this.load.spritesheet("rps", "assets/rps.png", 289, 275);
        this.load.image("rps-select", "assets/rps-combined.png");
        this.load.spritesheet("directions", "assets/directions.png", 275, 275);
        this.load.image("direction-select", "assets/directions-combined.png");
    }

    public init(): void {
        super.init();
    }

    public create(): void {
        this.p1Moves = this.add.group();
        this.p2Moves = this.add.group();

        const rps: RadialInput<RpsMove> = new RadialInput<RpsMove>(this.game, [
            new InputOption(RpsMove.ROCK, "rps", 0),
            new InputOption(RpsMove.PAPER, "rps", 1),
            new InputOption(RpsMove.SCISSORS, "rps", 2),
        ]);
        rps.width = this.game.width * 0.5;
        rps.height = this.game.height * 0.5;
        rps.scale.set(Math.min(rps.scale.x, rps.scale.y));
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
            directionSelector.visible = true;
        });
        this.add.existing(rps);

        const directions: RadialInput<DirectionMove> = new RadialInput<DirectionMove>(this.game, [
            new InputOption(DirectionMove.RIGHT, "directions", 0),
            new InputOption(DirectionMove.UP, "directions", 1),
            new InputOption(DirectionMove.LEFT, "directions", 2),
            new InputOption(DirectionMove.DOWN, "directions", 3),
        ]);
        directions.width = this.game.width * 0.5;
        directions.height = this.game.height * 0.5;
        directions.scale.set(Math.min(directions.scale.x, directions.scale.y));
        directions.centerX = this.game.width * 0.5;
        directions.centerY = this.game.height * 0.5;
        directions.visible = false;
        directions.onMoveSelected.add((move: DirectionMove) => {
            const p2Move: DirectionMove = this.game.rnd.pick([
                DirectionMove.UP,
                DirectionMove.DOWN,
                DirectionMove.LEFT,
                DirectionMove.RIGHT,
            ]);
            if (this.maxes.submitDirectionRound(move, p2Move)) {
                this.addMoveToUi(move, p2Move);

                const state: MaxesGameState = this.maxes.getState();
                if (state === MaxesGameState.WIN_P1
                    || state === MaxesGameState.WIN_P2) {
                    this.game.time.events.add(3000, () => {
                        this.setupNewGame();
                    });
                }
            }
            directions.visible = false;
            rpsSelector.visible = true;
            directionSelector.visible = true;
        });
        this.add.existing(rps);

        const rpsSelector: Phaser.Image = new Phaser.Image(this.game, 0, 0, "rps-select");
        rpsSelector.width = this.game.width * 0.15;
        rpsSelector.height = this.game.height * 0.15;
        rpsSelector.scale.set(Math.min(rpsSelector.scale.x, rpsSelector.scale.y));
        rpsSelector.centerX = this.game.width * 0.3;
        rpsSelector.centerY = this.game.height * 0.5;
        rpsSelector.inputEnabled = true;
        rpsSelector.events.onInputUp.add(() => {
            if (this.isGameInProgress()) {
                rpsSelector.visible = false;
                directionSelector.visible = false;
                rps.visible = true;
            }
        });
        this.add.existing(rpsSelector);

        const directionSelector: Phaser.Image = new Phaser.Image(this.game, 0, 0, "direction-select");
        directionSelector.width = this.game.width * 0.15;
        directionSelector.height = this.game.height * 0.15;
        directionSelector.scale.set(Math.min(directionSelector.scale.x, directionSelector.scale.y));
        directionSelector.centerX = this.game.width * 0.7;
        directionSelector.centerY = this.game.height * 0.5;
        directionSelector.inputEnabled = true;
        directionSelector.events.onInputUp.add(() => {
            if (this.isGameInProgress()) {
                rpsSelector.visible = false;
                directionSelector.visible = false;
                directions.visible = true;
            }
        });
        this.add.existing(directionSelector);

        this.setupNewGame();
    }

    private addMoveToUi(p1Move: RpsMove | DirectionMove, p2Move: RpsMove | DirectionMove): void {
        if (p1Move !== null) {
            let asset: string = "";
            switch (p1Move.type) {
                case "RpsMove":
                    asset = "rps";
                    break;

                case "DirectionMove":
                    asset = "directions";
                    break;
            }
            const newMove: Phaser.Image = new Phaser.Image(this.game, 0, 0, asset, p1Move.value);
            newMove.width = this.game.width * 0.05;
            newMove.scale.y = newMove.scale.x;
            newMove.left = this.p1Moves.width;
            newMove.events.onOutOfBounds.add(newMove.destroy, newMove);
            this.p1Moves.add(newMove);
            this.p1Moves.right = this.game.width * 0.45;
        }

        if (p2Move !== null) {
            let asset: string = "";
            switch (p2Move.type) {
                case "RpsMove":
                    asset = "rps";
                    break;

                case "DirectionMove":
                    asset = "directions";
                    break;
            }
            const newMove: Phaser.Image = new Phaser.Image(this.game, 0, 0, asset, p2Move.value);
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

    private isGameInProgress(): boolean {
        const state: MaxesGameState = this.maxes.getState();
        return (state !== MaxesGameState.WIN_P1)
            && (state !== MaxesGameState.WIN_P2);
    }

    private setupNewGame(): void {
        this.p1Moves.removeAll(true);
        this.p1Moves.top = this.game.height * 0.1;
        this.p1Moves.right = this.game.width * 0.45;

        this.p2Moves.removeAll(true);
        this.p2Moves.top = this.game.height * 0.1;
        this.p2Moves.left = this.game.width * 0.55;

        this.maxes = new MaxesGame();
    }
}
