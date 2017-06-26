import { Promisify } from "../../util/Promisify";
import { IExperienceState } from "./ExperienceState";
import { ExperienceTracker } from "./ExperienceTracker";

export class ExperienceBar extends Phaser.Image {
    private tracker: ExperienceTracker;
    private lastState: IExperienceState;

    private bar: Phaser.Graphics;
    private levelIndicator: Phaser.Text;

    constructor(game: Phaser.Game, x: number, y: number, tracker: ExperienceTracker) {
        super(game, x, y, "exp-bar-backing");
        this.tracker = tracker;
        this.lastState = this.tracker.getState();

        this.bar = new Phaser.Graphics(game, this.width * 0.27, this.height * 0.335);
        this.bar.beginFill(0x2222DD);
        this.bar.drawRect(0, 0, this.width * 0.715, this.height * 0.33);
        const nominalCurExp: number = this.lastState.currentExperience - this.lastState.startingExperience;
        const nominalMaxExp: number = this.lastState.experienceForNextLevel - this.lastState.startingExperience;
        this.bar.scale.x = Math.min(1, nominalCurExp / nominalMaxExp);
        this.addChild(this.bar);

        this.addChild(new Phaser.Image(game, 0, 0, "exp-bar-front"));

        this.levelIndicator = new Phaser.Text(game, 0, 0, `${this.tracker.getState().currentLevel}`, {
            fill: "black",
            align: "center",
            fontSize: this.height * 0.7,
        });
        this.levelIndicator.centerX = this.height * 0.5;
        this.levelIndicator.centerY = this.height * 0.5;
        this.addChild(this.levelIndicator);
    }

    public async addExperience(amount: number): Promise<void> {
        this.tracker.addExperience(amount);
        const newState: IExperienceState = this.tracker.getState();

        // Update things
        for (let i: number = this.lastState.currentLevel; i < newState.currentLevel; i++) {
            await Promisify.tween(this.game.add.tween(this.bar.scale)
                .to({x: 1}, 500, Phaser.Easing.Quartic.InOut, true));
            this.bar.scale.x = 0;

            this.levelIndicator.text = `${i + 1}`;
        }

        const nominalCurExp: number = newState.currentExperience - newState.startingExperience;
        const nominalMaxExp: number = newState.experienceForNextLevel - newState.startingExperience;
        await Promisify.tween(this.game.add.tween(this.bar.scale)
            .to({x: Math.min(1, nominalCurExp / nominalMaxExp)}, 500, Phaser.Easing.Quartic.InOut, true));
        this.lastState = newState;
    }
}
