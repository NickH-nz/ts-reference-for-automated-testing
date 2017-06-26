export class Promisify {
    public static tween(tween: Phaser.Tween): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            tween.onComplete.addOnce(resolve);
        });
    }
}
