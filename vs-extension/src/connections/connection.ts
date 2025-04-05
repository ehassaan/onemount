
import WebviewPage from '@/providers/WebviewPage';
// import { AddConnectionOptions, getTemplate } from '@/views/add-connection';
import vscode, { ExtensionContext } from "vscode";
import { BackendOptions, BackendOption, FSMount, MountOptions } from "@ducklake/core";
import { readFile } from "node:fs/promises";
import path from 'node:path';

let connections = [];

export default function register(context: ExtensionContext) {

    vscode.commands.registerCommand("ducklake.addConnection", async (args) => {
        const options = BackendOptions.s3.options;
        const template = await getTemplate();
        console.log("Template: ", template);
        let panel = new WebviewPage({
            id: "add-connection",
            title: "Add Connection",
            getHtml: getTemplate,
            extensionUri: context.extensionUri
        });
        await panel.show();

        panel.messagesHandler = async ({ command, data }) => {
            console.log("Action: ", command, "data: ", data);
            if (command == "cancel") {
                panel.hide();
            }
            else if (command == "connection.create") {
                try {
                    const localPath = path.join(vscode.workspace.workspaceFolders[0].uri.fsPath, "_mount", data.name);
                    console.log("Mount Location: ", localPath);

                    const config = {
                        type: "s3",
                        remoteUri: data.uri,
                        localPath: localPath,
                        authType: "KEY",
                        nativeArgs: {
                            provider: "Minio",
                            region: "pk-west1",
                            access_key_id: data.access_key_id,
                            secret_access_key: data.secret_access_key,
                        }
                    };
                    console.log("Config: ", config);
                    const mount = new FSMount<"s3">(config as MountOptions<"s3">);
                    await mount.createRemote(data.name);
                    await mount.runMountProcess(data.name, mount.bucket, localPath);
                    // panel.hide();
                }
                catch (e) {
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

async function getTemplate() {
    const file = (await readFile(`${__dirname}/frontend/index.html`)).toString("utf8");
    return file;
}


