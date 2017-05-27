export enum MaxesGameState {
    RPS,
    DIRECTION_ADV_P1,
    DIRECTION_ADV_P2,
    WIN_P1,
    WIN_P2,
}

export enum RpsMove {
    ROCK,
    PAPER,
    SCISSORS,
}

export enum DirectionMove {
    UP,
    DOWN,
    LEFT,
    RIGHT,
}

export class MaxesGame {

    private state: MaxesGameState;

    constructor() {
        this.state = MaxesGameState.RPS;
    }

    public getState(): MaxesGameState {
        return this.state;
    }

    public submitRpsRound(p1Move: RpsMove, p2Move: RpsMove): boolean {
        switch (this.state) {
            case MaxesGameState.RPS:
                return this.processRps(p1Move, p2Move);

            case MaxesGameState.DIRECTION_ADV_P1:
            case MaxesGameState.DIRECTION_ADV_P2:
            case MaxesGameState.WIN_P1:
            case MaxesGameState.WIN_P2:
            default:
                return false;
        }
    }

    public submitDirectionRound(p1Move: DirectionMove, p2Move: DirectionMove): boolean {
        switch (this.state) {
            case MaxesGameState.DIRECTION_ADV_P1:
            case MaxesGameState.DIRECTION_ADV_P2:
                return this.processDirections(p1Move, p2Move);

            case MaxesGameState.RPS:
            case MaxesGameState.WIN_P1:
            case MaxesGameState.WIN_P2:
            default:
                return false;
        }
    }

    private processRps(p1Move: RpsMove, p2Move: RpsMove): boolean {
        const result: number = this.compareRpsMoves(p1Move, p2Move);
        switch (result) {
            case 0: // Draw
                return true;

            case 1: // P1 Win
                this.state = MaxesGameState.DIRECTION_ADV_P1;
                return true;

            case -1: // P2 Win
                this.state = MaxesGameState.DIRECTION_ADV_P2;
                return true;
        }
    }

    private compareRpsMoves(move1: RpsMove, move2: RpsMove): number {
        // Draw
        if (move1 === move2) {
            return 0;
        }

        // Win or loss
        switch (move1) {
            case RpsMove.PAPER:
                if (move2 === RpsMove.ROCK) {
                    return 1;
                } else if (move2 === RpsMove.SCISSORS) {
                    return -1;
                }
                break;

            case RpsMove.SCISSORS:
                if (move2 === RpsMove.PAPER) {
                    return 1;
                } else if (move2 === RpsMove.ROCK) {
                    return -1;
                }
                break;

            case RpsMove.ROCK:
                if (move2 === RpsMove.SCISSORS) {
                    return 1;
                } else if (move2 === RpsMove.PAPER) {
                    return -1;
                }
                break;
        }

        return 0;
    }

    private processDirections(p1Move: DirectionMove, p2Move: DirectionMove): boolean {
        if (p1Move !== p2Move) { // Loss for player with advantage
            this.state = MaxesGameState.RPS;
        } else { // Win for player with advantage
            if (this.state === MaxesGameState.DIRECTION_ADV_P1) {
                this.state = MaxesGameState.WIN_P1;
            } else {
                this.state = MaxesGameState.WIN_P2;
            }
        }
        return true;
    }
}
