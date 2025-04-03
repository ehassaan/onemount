
import WebviewPage from '@/providers/WebviewPage';
// import { AddConnectionOptions, getTemplate } from '@/views/add-connection';
import vscode, { ExtensionContext } from "vscode";
import { BackendOptions, BackendOption, FSMount } from "@ducklake/core";
import { readFile } from "node:fs/promises";

let connections = [];

export default function register(context: ExtensionContext) {

    vscode.commands.registerCommand("ducklake.addConnection", async (args) => {
        const options = BackendOptions.s3.options;
        const template = await getTemplate();
        console.log("Template: ", template)
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
            else if (command == "save") {
                console.log("Saving: ", data);
                try {
                    const mount = new FSMount<"s3">(data);
                    await mount.mount();
                    panel.hide();
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


