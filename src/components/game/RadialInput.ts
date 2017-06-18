import {InputOption} from "./InputOption";

export class RadialInput<T> extends Phaser.Group {

    public readonly onMoveSelected: Phaser.Signal;

    private options: Array<InputOption<T>>;

    constructor(game: Phaser.Game, options: Array<InputOption<T>>) {
        super(game);

        this.options = options;

        this.onMoveSelected = new Phaser.Signal();

        const radius: number = game.height * 0.4;

        const border: Phaser.Graphics = new Phaser.Graphics(game);
        border.lineStyle(game.width * 0.005, 0xFFFFFF);
        border.drawCircle(0, 0, radius * 2);
        this.add(border);

        options.forEach((optionData: InputOption<T>, i: number) => {
            const icon: Phaser.Image = new Phaser.Image(game, 0, 0, optionData.imageTag, optionData.frame);
            const theta: number = (Math.PI * 2) * (i + 1) / options.length;
            icon.centerX = radius * Math.sin(theta);
            icon.centerY = radius * Math.cos(theta);
            icon.inputEnabled = true;
            icon.input.pixelPerfectClick = true;
            icon.events.onInputUp.add((object: any, pointer: Phaser.Pointer, isOver: boolean) => {
                if (isOver) {
                    this.onMoveSelected.dispatch(optionData.option);
                }
            });
            this.add(icon);
        });
    }
}
