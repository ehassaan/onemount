
import WebviewPage from '@/providers/WebviewPage';
import { AddConnectionOptions, getTemplate } from '@/views/add-connection';
import vscode, { ExtensionContext } from "vscode";
import { BackendOptions, BackendOption } from "@ducklake/core";

let connections = [];

export default function register(context: ExtensionContext) {

    vscode.commands.registerCommand("ducklake.addConnection", (args) => {
        const template = getTemplate();
        const options = BackendOptions.s3.options;
        let panel = new WebviewPage<AddConnectionOptions>("addConnection", "Add Connection", template);
        panel.show({
            fields: Object.values(options) as BackendOption[],
        });
    });
}
