import {IExperienceState} from "./ExperienceState";

export class ExperienceTracker {
    public static readonly levelData: number[] = [
        20, 50, 100, 200, 400, 600, 900, 1400, 2000,
    ];

    private level: number;
    private experience: number;

    constructor(startingExperience: number = 0) {
        this.experience = startingExperience;
        this.level = this.getLevelFromExperience(this.experience);
    }

    public getState(): IExperienceState {
        return {
            experienceForNextLevel: 0,
            currentExperience: this.experience,
            startingExperience: 0,
            currentLevel: this.level,
        };
    }

    public addExperience(amount: number): void {
        this.experience = this.experience + Math.max(0, amount);
        this.level = this.getLevelFromExperience(this.experience);
    }

    private getLevelFromExperience(experience: number): number {
        for (let i = (this.level - 1) || 0; i < ExperienceTracker.levelData.length; i++) {
            if (ExperienceTracker.levelData[i] > this.experience) {
                return i + 1;
            }
        }
        return ExperienceTracker.levelData.length + 1;
    }
}
