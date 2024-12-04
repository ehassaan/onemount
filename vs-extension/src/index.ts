import * as vscode from 'vscode';
import os from "os";
import fs from "fs";
import Context from "./services/context";
import registerConnection from './connections/connection';

export function activate(context: vscode.ExtensionContext) {
    Context.set(context);

    registerConnection(context);

    // const base_path = vscode.workspace.workspaceFolders[0].uri.fsPath;

    // fs.realpath(os.tmpdir(), (err, path) => {
    //     if (err) throw Error("Temp directory not accessible");

    //     try {
    //     }
    //     catch (ex) {
    //         console.log("Failed: ", ex);
    //     }
    // });

}
