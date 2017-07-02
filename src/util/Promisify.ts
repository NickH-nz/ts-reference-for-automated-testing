export class Promisify {
    public static tween(tween: Phaser.Tween): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            tween.onComplete.addOnce(resolve);
        });
    }

    public static time(game: Phaser.Game, timeMs: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            game.time.events.add(timeMs, resolve);
        });
    }
}
