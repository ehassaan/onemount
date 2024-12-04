
import WebviewPage from '@/providers/WebviewPage';
import { getTemplate } from '@/views/add-connection';
import { readFileSync } from 'fs';
import vscode, { ExtensionContext } from "vscode";
import { BackendOptions } from "@ducklake/core";


let connections = [];

export default function register(context: ExtensionContext) {

    vscode.commands.registerCommand("ducklake.addConnection", (args) => {
        const template = getTemplate();
        const options = BackendOptions.s3.options;
        let panel = new WebviewPage("addConnection", "Add Connection", template);
        panel.show({
            fields: Object.keys(options).map(k => ({
                label: options[k].Name,
                help: options[k].Help,
                name: options[k].Name
            }))
        });
    });
}
