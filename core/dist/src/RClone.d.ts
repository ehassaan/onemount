import { ChildProcessWithoutNullStreams } from 'node:child_process';
import { TypedEmitter } from './TypedEmitter';
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
    stdout: string;
    stderr: string;
    exitCode: number | null;
    signal: string | null;
}
export declare class RClone {
    opts: RCloneOptions;
    onExit: TypedEmitter<any>;
    stdio: TypedEmitter<string>;
    stderr: TypedEmitter<string | null>;
    constructor(opts?: RCloneOptions);
    runCommand(args: string[], timeout?: number): Promise<ProcessResult>;
    runProcess(args: string[]): RunningProcess;
    getRClonePath(): string;
}
//# sourceMappingURL=RClone.d.ts.map