import {IExperienceState} from "./ExperienceState";

export class ExperienceTracker {
    public static readonly levelData: number[] = [
        20, 50, 100, 200, 400, 600, 900, 1400, 2000,
    ];

    private level: number;
    private experience: number;
    private previousExpCap: number;
    private currentExpCap: number;

    constructor(startingExperience: number = 0) {
        this.experience = startingExperience;
        this.update(this.experience);
    }

    public getState(): IExperienceState {
        return {
            experienceForNextLevel: this.currentExpCap,
            currentExperience: this.experience,
            startingExperience: this.previousExpCap,
            currentLevel: this.level,
        };
    }

    public addExperience(amount: number): void {
        this.experience = this.experience + Math.max(0, amount);
        this.update(this.experience);
    }

    private update(experience: number): void {
        for (let i = (this.level - 1) || 0; i < ExperienceTracker.levelData.length; i++) {
            if (ExperienceTracker.levelData[i] > this.experience) {
                this.level = i + 1;
                this.previousExpCap = ExperienceTracker.levelData[this.level - 2] || 0;
                this.currentExpCap = ExperienceTracker.levelData[this.level - 1];
                return;
            }
        }

        this.level = ExperienceTracker.levelData.length + 1;
        this.previousExpCap = ExperienceTracker.levelData[ExperienceTracker.levelData.length - 2];
        this.currentExpCap = this.previousExpCap;
        return;
    }
}
