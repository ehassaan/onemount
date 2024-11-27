import { ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import { TypedEmitter } from './TypedEmitter';
import { join } from "path";


export interface RCloneOptions {
    cwd?: string;
}

export interface RunningProcess {
    stdout: TypedEmitter<string>;
    stderr: TypedEmitter<string>;
    exit: TypedEmitter<number | null>;
    process: ChildProcessWithoutNullStreams;
}

export interface ProcessResult {
    stdout: string,
    stderr: string,
    exitCode: number | null,
    signal: string | null;
}

export class RClone {

    opts: RCloneOptions;
    onExit = new TypedEmitter<any>();
    stdio = new TypedEmitter<string>();
    stderr = new TypedEmitter<string | null>();

    constructor(opts?: RCloneOptions) {
        this.opts = opts ?? {};
    }

    async runCommand(args: string[], timeout: number = 30000) {
        const rclone_path = this.getRClonePath();
        let chunks: string[] = [];
        let errors: string[] = [];

        const process = spawn(rclone_path, args, {
            stdio: "pipe",
            cwd: this.opts.cwd
        });

        process.stdout.on("data", (data: Buffer) => {
            chunks.push(data.toString("utf8"));
        });
        process.stderr.on("data", (data: Buffer) => {
            errors.push(data.toString("utf8"));
        });

        const numTimeout = setTimeout(() => {
            process.kill();
        }, timeout);

        return new Promise<ProcessResult>((resolve, reject) => {
            process.on("exit", (code, signal) => {
                clearTimeout(numTimeout);
                if (code) {
                    return reject({
                        message: errors.join(""),
                        exitCode: code,
                        signal: signal?.toString() ?? null
                    });
                }
                return resolve({
                    stdout: chunks.join(""),
                    stderr: errors.join(""),
                    exitCode: code,
                    signal: signal?.toString() ?? null
                });
            });
        });
    }

    public runProcess(args: string[]) {
        const rclone_path = this.getRClonePath();
        console.log("Running Command: \n", `${rclone_path} ${args.join(" ")}`);
        let process = spawn(rclone_path, args, {
            cwd: this.opts.cwd,
            stdio: "pipe",
        });

        let rproc: RunningProcess = {
            stdout: new TypedEmitter(),
            stderr: new TypedEmitter(),
            exit: new TypedEmitter(),
            process: process
        };

        process.stdout.on("data", (data: Buffer) => {
            rproc.stdout.emit(data.toString("utf8"));
        });
        process.stderr.on("data", (data: Buffer) => {
            rproc.stderr.emit(data.toString("utf8"));
        });
        return rproc;
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
        return join(__dirname, '..', 'lib', process.platform, arch, `rclone${ext}`);
    }
}