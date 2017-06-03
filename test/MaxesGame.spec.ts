import { assert } from "ceylon";
import expect from "ceylon";

import {DirectionMove} from "../src/enums/DirectionMove";
import {RpsMove} from "../src/enums/RpsMove";
import {MaxesGame, MaxesGameState} from "../src/MaxesGame";

describe("MaxesGame", () => {
    let game: MaxesGame;

    beforeEach(() => {
        game = new MaxesGame();
    });

    describe("Setup", () => {
        it("Starts with Rock Paper Scissors.", () => {
            expect(game.getState()).toBe(MaxesGameState.RPS);
        });
    });

    describe("Gameplay - RPS", () => {
        it("Stays on Rock Paper Scissors when there is a draw.", () => {
            game.submitRpsRound(RpsMove.PAPER, RpsMove.PAPER);
            expect(game.getState()).toBe(MaxesGameState.RPS);
        });

        it("Progresses to Directions when there is a win.", () => {
            game.submitRpsRound(RpsMove.PAPER, RpsMove.SCISSORS);
            expect(game.getState())
                .toNotBe(MaxesGameState.RPS)
                .toNotBe(MaxesGameState.WIN_P1)
                .toNotBe(MaxesGameState.WIN_P2);
            // Intent: toBe(MaxesGameState.DIRECTION_ADV_P1 || MaxesGameState.DIRECTION_ADV_P1)
        });

        it("Player 1 gains Directions advantage when they win.", () => {
            game.submitRpsRound(RpsMove.ROCK, RpsMove.SCISSORS);
            expect(game.getState()).toBe(MaxesGameState.DIRECTION_ADV_P1);
        });

        it("Player 2 gains Directions advantage when they win.", () => {
            game.submitRpsRound(RpsMove.PAPER, RpsMove.SCISSORS);
            expect(game.getState()).toBe(MaxesGameState.DIRECTION_ADV_P2);
        });
    });

    describe("Gameplay - DIRECTIONS", () => {
        it("Returns to Rock Paper Scissor when moves don't match.", () => {
            game.submitRpsRound(RpsMove.PAPER, RpsMove.ROCK);
            game.submitDirectionRound(DirectionMove.DOWN, DirectionMove.UP);

            expect(game.getState()).toBe(MaxesGameState.RPS);
        });

        it("The player with advantage wins if the directions match.", () => {
            game.submitRpsRound(RpsMove.PAPER, RpsMove.ROCK);
            game.submitDirectionRound(DirectionMove.DOWN, DirectionMove.DOWN);

            expect(game.getState()).toBe(MaxesGameState.WIN_P1);
        });
    });

    describe("End Game", () => {
        it("A move can not be made after the game has been won.", () => {
            game.submitRpsRound(RpsMove.PAPER, RpsMove.ROCK);
            game.submitDirectionRound(DirectionMove.DOWN, DirectionMove.DOWN);

            expect(game.submitRpsRound(RpsMove.PAPER, RpsMove.PAPER)).toBeFalse();
        });
    });
});
