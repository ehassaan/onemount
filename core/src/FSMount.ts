
import { BackendType, MountOptions } from './MountOptions';
import { RClone, RunningProcess } from './RClone';


export enum MountStatus {
    Mounted,
    Unmounted,
    Disposed
}

export class FSMount<T extends BackendType> {

    // public readonly exit = new TypedEmitter<Error | null>();
    // public readonly stdout = new TypedEmitter<string>();
    // public readonly stderr = new TypedEmitter<string>();

    // private _status: MountStatus = MountStatus.Unmounted;
    private _process: RunningProcess | null = null;
    private _remoteName = globalThis.crypto.randomUUID().slice(0, 16).replaceAll("-", "");
    private _opts: MountOptions<T>;
    public readonly bucket: string;
    public readonly endpoint: string;
    public readonly rclone: RClone;

    // public get status() {
    //     return this._status;
    // }
    // private set status(v) {
    //     this._status = v;
    //     this.statusChanged.emit(v);
    //     if (v === MountStatus.Unmounted) {
    //         this.exit.emit(null);
    //     }
    // }

    constructor(options: MountOptions<T>) {
        this._opts = options;
        const url = new URL(options.remoteUri);
        if ("endpoint" in options.nativeArgs) {
            this.endpoint = options.nativeArgs.endpoint as string;
        }
        else {
            this.endpoint = url.origin;
        }
        this.bucket = url.pathname.slice(1);
        if (!this.bucket.endsWith("/")) {
            this.bucket = this.bucket + "/";
        }
        this.rclone = new RClone();
    }

    async createRemote(name: string) {
        let args = ['config', 'create', name, this._opts.type, '--non-interactive'];
        if (this._opts.type === "s3") {
            const nativeOpts = {
                ...{ endpoint: this.endpoint },
                ...this._opts.nativeArgs
            };
            for (let [k, v] of Object.entries(nativeOpts)) {
                args.push(`${k}=${v}`);
            }
        }
        const res = await this.rclone.runCommand(args, 30000);
    }

    async runMountProcess(remoteName: string, bucket: string, localPath: string) {
        this._process = this.rclone.runProcess(["mount", `${remoteName}:${bucket}`, localPath]);

        this._process.stdout.on(data => {
            console.log("stdout: ", data);
        });
        this._process.stderr.on(data => {
            console.log("stderr: ", data);
        });
    }

    async mount() {
        if (this._process) throw Error("Already mounted");
        await this.createRemote(this._remoteName);
        await this.runMountProcess(this._remoteName,
            this.bucket,
            this._opts.localPath);
    }

    public unmount() {
        if (this._process) {
            this._process.process.kill();
            this._process = null;
            // this.exit.emit(null);
        }
    }

    public dispose() {
        this.unmount();
        // this.stderr.dispose();
        // this.stdout.dispose();
        // this.exit.dispose();
    }
}