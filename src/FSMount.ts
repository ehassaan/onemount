
import { MountOptions, s3Defaults } from './MountOptions';
import { TypedEmitter } from "./TypedEmitter";
import { ChildProcessWithoutNullStreams, exec, spawn } from 'child_process';


export enum MountStatus {
    Mounted,
    Unmounted,
    Disposed
}

export class FSMount {

    public readonly exit = new TypedEmitter<Error | null>();
    public readonly stdout = new TypedEmitter<string>();
    public readonly stderr = new TypedEmitter<string>();

    private _status: MountStatus = MountStatus.Unmounted;
    private _process: ChildProcessWithoutNullStreams | null = null;
    private _remoteName = globalThis.crypto.randomUUID().slice(0, 16).replaceAll("-", "");

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

    constructor() {
    }

    getRClonePath() {
        if (!(["darwin", "linux", "win32"].includes(process.platform))) {
            throw Error("OS is not supported: " + process.platform);
        }

        const ext = process.platform === "win32" ? ".exe" : "";
        let arch = null;
        if (process.arch === "arm64") {
            arch = "arm64";
        }
        else if (process.arch === "x64") {
            arch = "amd64";
        }
        else {
            throw Error("NodeJs architecture is not supported: " + process.arch);
        }
        return `${__dirname}/../lib/${process.platform}/${arch}/rclone${ext}`;
    }

    async createRemote(name: string, options: MountOptions) {
        let args = `config create "${name}" ${options.type} --non-interactive`;
        if (options.type === "s3") {
            const nativeOpts = {
                ...s3Defaults,
                ...{ endpoint: options.remoteUri },
                ...options.nativeArgs
            };
            for (let [k, v] of Object.entries(nativeOpts)) {
                args += ` ${k}=${v}`;
            }
        }
        const res = await this.runCommand(args);
        console.log(res);
    }

    async mount(options: MountOptions) {
        await this.createRemote(this._remoteName, options);

        this._process = this.runProcess(["mount", `${this._remoteName}:${options.localPath}`]);

        this._process.stdout?.on("data", msg => {
            console.log("stdout: ", msg.toString());
        });
        this._process.stderr?.on("data", msg => {
            console.log("stderr: ", msg);
        });
        this._process.on("close", msg => {
            console.log("close: ", msg);
        });
        this._process.on("error", err => {
            console.log("error: ", err);
        });
        this._process.on("disconnect", () => {
            console.log("disconnect");
        });
        this._process.on("exit", code => {
            console.log("exit: ", code);
            this.dispose();
        });
        this._process.on("spawn", () => {
            console.log("spawn");
        });
    }

    async runCommand(cmd: string) {
        const rclone_path = this.getRClonePath();
        let promise = new Promise<string>((resolve, reject) => {
            exec(`${rclone_path} ${cmd}`, (err, stdout, stderr) => {
                if (err) {
                    return reject(stderr);
                }
                resolve(stdout);
            });
        });
        return promise;
    }

    private runProcess(args: string[]) {
        const rclone_path = this.getRClonePath();
        let process = spawn(rclone_path, args, { stdio: "pipe" });
        return process;
    }

    public dispose() {
        if (this._process) {
            this._process.kill();
            this._process = null;
        }
        this.stderr.dispose();
        this.stdout.dispose();
        this.exit.emit(null);
        this.exit.dispose();
    }
}