export abstract class Enum {
    public readonly type: string;
    public readonly value: number;

    protected constructor(type: string, value: number) {
        this.type = type;
        this.value = value;
    }
}
