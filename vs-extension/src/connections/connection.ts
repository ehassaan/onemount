
import WebviewPage from '@/providers/WebviewPage';
import { AddConnectionOptions, getTemplate } from '@/views/add-connection';
import vscode, { ExtensionContext } from "vscode";
import { BackendOptions, BackendOption, FSMount } from "@ducklake/core";
import path from 'path';

let connections = [];


export default function register(context: ExtensionContext) {

    vscode.commands.registerCommand("ducklake.addConnection", (args) => {
        const template = getTemplate();
        const options = BackendOptions.s3.options;
        let panel = new WebviewPage<AddConnectionOptions>("addConnection", "Add Connection", template);
        panel.show({
            fields: Object.values(options) as BackendOption[],
        });
        // let panel = vscode.window.createWebviewPanel(
        //     "addConnection",
        //     "Add Connection",
        //     {
        //         viewColumn: vscode.ViewColumn.One,
        //         preserveFocus: true,
        //     },
        //     {
        //         enableScripts: true,
        //         retainContextWhenHidden: true, // @OPTIMIZE remove and migrate to state restore
        //         enableCommandUris: true,
        //         localResourceRoots: [vscode.Uri.file(path.resolve(__dirname))]
        //         // enableFindWidget: true,
        //     }
        // );
        // panel.webview.html = template({
        //     title: "add asdasd",
        //     fields: Object.values(options) as BackendOption[],
        //     nonce: getNonce(),
        //     cspSource: panel.webview.cspSource,
        //     scriptUri: panel.webview.asWebviewUri(vscode.Uri.file(path.resolve(__dirname, 'views', 'add-connection', 'script.js'))),
        // });
        panel.messagesHandler = async ({ command, data }) => {
            console.log("Action: ", command, "data: ", data);
            if (command == "cancel") {
                panel.hide();
            }
            else if (command == "save") {
                console.log("Saving: ", data);
                try {
                    const mount = new FSMount<"s3">(data);
                    await mount.mount();
                    panel.hide();
                }
                catch(e) {
                    console.log("Error while mounting: ", e);
                    panel.sendMessage("error", e.message);
                }
            }
        };
        panel.onDidDispose(() => {
            console.log("Webiew panel disposed");
        });
    });
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

