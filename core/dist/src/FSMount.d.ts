import { BackendType, MountOptions } from './MountOptions';
import { RClone } from './RClone';
export declare enum MountStatus {
    Mounted = 0,
    Unmounted = 1,
    Disposed = 2
}
export declare class FSMount<T extends BackendType> {
    private _process;
    private _remoteName;
    private _opts;
    readonly bucket: string;
    readonly endpoint: string;
    readonly rclone: RClone;
    constructor(options: MountOptions<T>);
    createRemote(name: string): Promise<void>;
    runMountProcess(remoteName: string, bucket: string, localPath: string): Promise<void>;
    mount(): Promise<void>;
    unmount(): void;
    dispose(): void;
}
//# sourceMappingURL=FSMount.d.ts.map