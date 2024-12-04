import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('ducklake.addConnections', () => {
            const panel = vscode.window.createWebviewPanel(
                'connections',
                'Connections',
                vscode.ViewColumn.One,
                {}
            );

            // Get path to resource on disk
            const onDiskPath = vscode.Uri.joinPath(context.extensionUri, 'media', 'cat.gif');

            // And get the special URI to use with the webview
            const catGifSrc = panel.webview.asWebviewUri(onDiskPath);

            panel.webview.html = getWebviewContent(catGifSrc);
        })
    );
}

function getWebviewContent(catGifSrc: vscode.Uri) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Coding</title>
</head>
<body>
    <img src="${catGifSrc}" width="300" />
</body>
</html>`;
}
