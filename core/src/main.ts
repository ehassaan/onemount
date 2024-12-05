
export { FSMount, MountStatus } from "./FSMount";
export type { MountOptions, S3MountOptions, BackendType, Backend, NativeArgName, BackendOption } from "./MountOptions";
export { RClone, type RCloneOptions, type RunningProcess, type ProcessResult } from "./RClone";
import * as options from "../assets/options.json";

export let BackendOptions = options;