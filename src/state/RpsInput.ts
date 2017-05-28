import {RpsMove} from "../MaxesGame";

export class RpsInput extends Phaser.Group {

    public readonly onMoveSelected: Phaser.Signal;

    private rock: Phaser.Image;
    private paper: Phaser.Image;
    private scissors: Phaser.Image;

    constructor(game: Phaser.Game) {
        super(game);

        this.onMoveSelected = new Phaser.Signal();

        const radius: number = game.height * 0.4;

        const border: Phaser.Graphics = new Phaser.Graphics(game);
        border.lineStyle(game.width * 0.005, 0xFFFFFF);
        border.drawCircle(0, 0, radius * 2);
        this.add(border);

        const rock: Phaser.Image = new Phaser.Image(game, 0, 0, "rps", 0);
        rock.centerX = radius * Math.sin(0);
        rock.centerY = radius * Math.cos(0);
        rock.inputEnabled = true;
        rock.input.pixelPerfectClick = true;
        rock.events.onInputUp.add((object: any, pointer: Phaser.Pointer, isOver: boolean) => {
            if (isOver) {
                this.onMoveSelected.dispatch(RpsMove.ROCK);
            }
        });
        this.add(rock);

        const paper: Phaser.Image = new Phaser.Image(game, 0, 0, "rps", 1);
        paper.centerX = radius * Math.sin((Math.PI * 2) * 1 / 3);
        paper.centerY = radius * Math.cos((Math.PI * 2) * 1 / 3);
        paper.inputEnabled = true;
        paper.input.pixelPerfectClick = true;
        paper.events.onInputUp.add((object: any, pointer: Phaser.Pointer, isOver: boolean) => {
            if (isOver) {
                this.onMoveSelected.dispatch(RpsMove.PAPER);
            }
        });
        this.add(paper);

        const scissors: Phaser.Image = new Phaser.Image(game, 0, 0, "rps", 2);
        scissors.centerX = radius * Math.sin((Math.PI * 2) * 2 / 3);
        scissors.centerY = radius * Math.cos((Math.PI * 2) * 2 / 3);
        scissors.inputEnabled = true;
        scissors.input.pixelPerfectClick = true;
        scissors.events.onInputUp.add((object: any, pointer: Phaser.Pointer, isOver: boolean) => {
            if (isOver) {
                this.onMoveSelected.dispatch(RpsMove.SCISSORS);
            }
        });
        this.add(scissors);
    }
}
