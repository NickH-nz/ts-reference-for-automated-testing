import { ExperienceBar } from "../components/experience/ExperienceBar";
import { ExperienceTracker } from "../components/experience/ExperienceTracker";
import { DirectionMove } from "../components/game/DirectionMove";
import { InputOption } from "../components/game/InputOption";
import { MaxesGame, MaxesGameState } from "../components/game/MaxesGame";
import { RadialInput } from "../components/game/RadialInput";
import { RpsMove } from "../components/game/RpsMove";

export class MaxesState extends Phaser.State {

    private static readonly EXP_CORRECT_MOVE: number = 2;
    private static readonly EXP_WIN: number = 20;

    private maxes: MaxesGame;

    private p1Moves: Phaser.Group;
    private p2Moves: Phaser.Group;

    private expBar: ExperienceBar;
    private endGameMessage: Phaser.Text;

    private boundaryInput: Phaser.Rectangle;
    private boundaryHistory: Phaser.Rectangle;
    private boundaryExp: Phaser.Rectangle;

    public preload(): void {
        this.load.spritesheet("moves", "assets/moves.png", 275, 275);
        this.load.image("rps-select", "assets/rps-combined.png");
        this.load.image("direction-select", "assets/directions-combined.png");
        this.load.image("exp-bar-backing", "assets/exp-bar-backing.png");
        this.load.image("exp-bar-front", "assets/exp-bar-front.png");
    }

    public init(): void {
        super.init();
    }

    public create(): void {
        this.setupBoundaries();

        const padding: number = this.game.width * 0.01;
        this.expBar = new ExperienceBar(this.game, padding, padding, new ExperienceTracker());
        this.expBar.height = this.boundaryExp.height;
        this.expBar.width = this.boundaryExp.width;
        this.expBar.scale.set(Math.min(this.expBar.scale.x, this.expBar.scale.y));
        this.expBar.x = this.boundaryExp.x;
        this.expBar.centerY = this.boundaryExp.centerY;
        this.add.existing(this.expBar);

        this.p1Moves = this.add.group();
        this.p2Moves = this.add.group();

        const rps: RadialInput<RpsMove> = new RadialInput<RpsMove>(this.game, [
            new InputOption(RpsMove.ROCK, "moves", 4),
            new InputOption(RpsMove.PAPER, "moves", 5),
            new InputOption(RpsMove.SCISSORS, "moves", 6),
        ]);
        rps.width = this.boundaryInput.width * 0.6;
        rps.height = this.boundaryInput.height * 0.8;
        rps.scale.set(Math.min(rps.scale.x, rps.scale.y));
        rps.centerX = this.boundaryInput.centerX;
        rps.centerY = this.boundaryInput.centerY;
        rps.visible = false;
        rps.onMoveSelected.add(async (move: RpsMove) => {
            const p2Move: RpsMove = this.game.rnd.pick([RpsMove.ROCK, RpsMove.PAPER, RpsMove.SCISSORS]);
            if (this.maxes.submitRpsRound(move, p2Move)) {
                this.addMoveToUi(move, p2Move);
                rps.visible = false;
            }
            rps.visible = false;
            rpsSelector.visible = true;
            directionSelector.visible = true;
        });
        this.add.existing(rps);

        const directions: RadialInput<DirectionMove> = new RadialInput<DirectionMove>(this.game, [
            new InputOption(DirectionMove.RIGHT, "moves", 0),
            new InputOption(DirectionMove.UP, "moves", 1),
            new InputOption(DirectionMove.LEFT, "moves", 2),
            new InputOption(DirectionMove.DOWN, "moves", 3),
        ]);
        directions.width = this.boundaryInput.width * 0.6;
        directions.height = this.boundaryInput.height * 0.8;
        directions.scale.set(Math.min(directions.scale.x, directions.scale.y));
        directions.centerX = this.boundaryInput.centerX;
        directions.centerY = this.boundaryInput.centerY;
        directions.visible = false;
        directions.onMoveSelected.add(async (move: DirectionMove) => {
            const p2Move: DirectionMove = this.game.rnd.pick([
                DirectionMove.UP,
                DirectionMove.DOWN,
                DirectionMove.LEFT,
                DirectionMove.RIGHT,
            ]);
            if (this.maxes.submitDirectionRound(move, p2Move)) {
                this.addMoveToUi(move, p2Move);
                directions.visible = false;

                const state: MaxesGameState = this.maxes.getState();
                if (state === MaxesGameState.WIN_P1
                    || state === MaxesGameState.WIN_P2) {
                    const message: string = state === MaxesGameState.WIN_P1 ? "YOU WON!" : "YOU LOST!";
                    this.showEndGameMessage(message);

                    this.game.time.events.add(3000, () => {
                        this.setupNewGame();
                    });
                }

                if (state === MaxesGameState.WIN_P1) {
                    await this.expBar.addExperience(MaxesState.EXP_WIN);
                }
            }
            directions.visible = false;
            rpsSelector.visible = true;
            directionSelector.visible = true;
        });
        this.add.existing(rps);

        const rpsSelector: Phaser.Image = new Phaser.Image(this.game, 0, 0, "rps-select");
        rpsSelector.width = this.boundaryInput.halfWidth * 0.6;
        rpsSelector.height = this.boundaryInput.height * 0.6;
        rpsSelector.scale.set(Math.min(rpsSelector.scale.x, rpsSelector.scale.y));
        rpsSelector.centerX = this.boundaryInput.x + (this.boundaryInput.width * 0.3);
        rpsSelector.centerY = this.boundaryInput.centerY;
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
        directionSelector.width = this.boundaryInput.halfWidth * 0.6;
        directionSelector.height = this.boundaryInput.height * 0.6;
        directionSelector.scale.set(Math.min(directionSelector.scale.x, directionSelector.scale.y));
        directionSelector.centerX = this.boundaryInput.x + (this.boundaryInput.width * 0.7);
        directionSelector.centerY = this.boundaryInput.centerY;
        directionSelector.inputEnabled = true;
        directionSelector.events.onInputUp.add(() => {
            if (this.isGameInProgress()) {
                rpsSelector.visible = false;
                directionSelector.visible = false;
                directions.visible = true;
            }
        });
        this.add.existing(directionSelector);

        this.endGameMessage = new Phaser.Text(this.game, 0, 0, "", {
            fill: "white",
            fontSize: this.boundaryInput.height * 0.2,
        });
        this.endGameMessage.y = this.boundaryInput.top;
        this.endGameMessage.centerX = this.boundaryInput.centerX;
        this.add.existing(this.endGameMessage);

        this.setupNewGame();
    }

    private setupBoundaries(): void {
        const padding: number = Math.min(this.game.width * 0.01, this.game.height * 0.01);

        this.boundaryExp = new Phaser.Rectangle(
            padding,
            padding,
            this.game.width - (padding * 2),
            (this.game.height * 0.2) - (padding * 2),
        );

        this.boundaryHistory = new Phaser.Rectangle(
            padding,
            (this.game.height * 0.2) + padding,
            this.game.width - (padding * 2),
            (this.game.height * 0.2) - (padding * 2),
        );

        this.boundaryInput = new Phaser.Rectangle(
            padding,
            this.game.height * 0.4 + padding,
            this.game.width - (padding * 2),
            (this.game.height * 0.6) - (padding * 2),
        );
    }

    private addMoveToUi(p1Move: RpsMove | DirectionMove, p2Move: RpsMove | DirectionMove): void {
        if (p1Move !== null) {
            const offset: number = 0;
            if (p1Move.type === "RpsMove") {
                offset = 4;
            }
            const newMove: Phaser.Image = new Phaser.Image(this.game, 0, 0, "moves", p1Move + offset);
            newMove.height = this.boundaryHistory.height * 0.6;
            newMove.scale.x = newMove.scale.y;
            newMove.left = this.p1Moves.width;
            newMove.events.onOutOfBounds.add(newMove.destroy, newMove);
            this.p1Moves.add(newMove);
            this.p1Moves.right = this.boundaryHistory.halfWidth * 0.95;
            this.p1Moves.centerY = this.boundaryHistory.centerY;
        }

        if (p2Move !== null) {
            const offset: number = 0;
            if (p2Move.type === "RpsMove") {
                offset = 4;
            }
            const newMove: Phaser.Image = new Phaser.Image(this.game, 0, 0, "moves", p2Move + offset);
            newMove.height = this.boundaryHistory.height * 0.6;
            newMove.scale.x = newMove.scale.y;
            newMove.events.onOutOfBounds.add(newMove.destroy, newMove);
            this.p2Moves.children.forEach((child) => {
                child.x += newMove.width;
            });
            this.p2Moves.add(newMove);
            this.p2Moves.left = this.game.width * 0.55;
            this.p2Moves.centerY = this.boundaryHistory.centerY;
        }
    }

    private showEndGameMessage(message: string): void {
        this.endGameMessage.text = message;
        this.endGameMessage.centerX = this.game.width * 0.5;
        this.endGameMessage.centerY = this.game.height * 0.6;
        this.endGameMessage.visible = true;
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

        this.endGameMessage.visible = false;

        this.maxes = new MaxesGame();
    }
}
