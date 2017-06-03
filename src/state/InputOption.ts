export class InputOption<T> {
    public readonly option: T;
    public readonly imageTag: string;
    public readonly frame: number | string;

    public constructor(option: T, imageTag: string, frame: number | string) {
        this.option = option;
        this.imageTag = imageTag;
        this.frame = frame;
    }
}
