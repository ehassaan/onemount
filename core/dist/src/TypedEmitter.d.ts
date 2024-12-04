export declare class TypedEmitter<T = any> {
    private _subscriptions;
    private _counterSub;
    private _dispose;
    private _counterDis;
    emit(event: T): void;
    on(callback: (event: T) => any): () => void;
    onDispose(callback: (code: number) => any): () => void;
    dispose(code?: number): void;
}
//# sourceMappingURL=TypedEmitter.d.ts.map