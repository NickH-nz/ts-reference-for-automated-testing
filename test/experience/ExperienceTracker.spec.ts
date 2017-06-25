import expect from "ceylon";

import {ExperienceTracker} from "../../src/components/experience/ExperienceTracker";

describe("ExperienceTracker", () => {
    let tracker: ExperienceTracker;

    beforeEach(() => {
        tracker = new ExperienceTracker();
    });

    describe("Setup", () => {
        describe("Defaults", () => {
            it("Starts with 0 experience.", () => {
                expect(tracker.getState().currentExperience).toBe(0);
            });

            it("Starts on level 1.", () => {
                expect(tracker.getState().currentLevel).toBe(1);
            });
        });

        describe("Preset experience amount", () => {
            it("Starts with the given experience amount.", () => {
                tracker.addExperience(100);
                expect(tracker.getState().currentExperience).toBe(100);
            });

            it("Starts on the correct level.", () => {
                tracker.addExperience(ExperienceTracker.levelData[0]);
                expect(tracker.getState().currentLevel).toBe(2);
            });
        });
    });

    describe("Progress", () => {
        it("Adding experience increases the experience by that amount.", () => {
            tracker.addExperience(100);
            expect(tracker.getState().currentExperience).toBe(100);
        });

        it("Adding enough experience to level up increases the level.", () => {
            tracker.addExperience(ExperienceTracker.levelData[0]);
            expect(tracker.getState().currentLevel).toBe(2);
        });

        it("Adding less than the experience required to level up does not change the level.", () => {
            tracker.addExperience(ExperienceTracker.levelData[0] - 1);
            expect(tracker.getState().currentLevel).toBe(1);
        });

        it("Adding negative experience has no effect.", () => {
            tracker.addExperience(-100);
            expect(tracker.getState().currentExperience).toBe(0);
        });
    });

    describe("Limits", () => {
        it("Cannot progress past the maximum level", () => {
            tracker.addExperience(ExperienceTracker.levelData[ExperienceTracker.levelData.length - 1] + 1);
            expect(tracker.getState().currentLevel).toBe(ExperienceTracker.levelData.length + 1);
        });
    });
});
