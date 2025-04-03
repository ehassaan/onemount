import { Uri, commands, Disposable, EventEmitter, ViewColumn, WebviewPanel, window } from 'vscode';
import Context from '@/services/context';
import path from 'path';
import { EXT_NAMESPACE } from '@/utils/constants';
import { Options } from 'ejs';
// import { DefaultUIAction } from './action';

export enum DefaultActions {

    CALL = "CALL",
    NOTIFY_VIEW_READY = "NOTIFY:VIEW_READY",

    REQUEST_RESET = "REQUEST:RESET",
    REQUEST_STATE = "REQUEST:STATE",

    RESPONSE_STATE = "RESPONSE:STATE",
    OPEN_DEVTOOLS = "REQUEST:OPEN_DEVTOOLS",

    SET_STATE = "SET_STATE",
}

export default class WebviewPage implements Disposable {
    get serializationId() {
        return this.id;
    }
    public disposeEvent: EventEmitter<void> = new EventEmitter();
    public get onDidDispose() {
        return this.disposeEvent.event;
    }
    public get visible() {
        return this.panel === undefined ? false : this.panel.visible;
    }

    public onViewActive?: (active: boolean) => any;
    public preserveFocus = true;
    public whereToShow = ViewColumn.One;

    public readonly id: string;
    public readonly title: string;
    public messagesHandler: (...args: any) => void;
    private getHtml = async (opts: { cspSource: string; }) => '';
    private extensionUri: Uri;
    private nonce: string;

    private panel: WebviewPanel;
    private disposables: Disposable[] = [];

    public constructor(args: { id: string, title: string, getHtml: () => Promise<string>; extensionUri: Uri; }) {
        this.id = args.id;
        this.title = args.title;
        this.extensionUri = args.extensionUri;
        this.nonce = getNonce();

        this.getHtml = async (opts: { cspSource: string; }) => {
            let html = await args.getHtml();
            html = html.replaceAll("${cspSource}", opts.cspSource);
            console.log("HTML: ", html);
            let scriptName = html.match(new RegExp(/src=\"\/assets\/(index-.+[.]js)\"/))[1];
            let styleName = html.match(new RegExp(/href=\"\/assets\/(index-.+[.]css)\"/))[1];

            const scriptUri = this.panel.webview.asWebviewUri(Uri.file(path.resolve(__dirname, 'frontend', 'assets', scriptName)));
            const styleUri = this.panel.webview.asWebviewUri(Uri.file(path.resolve(__dirname, 'frontend', 'assets', styleName)));

            html = html.replace(`src="/assets/${scriptName}"`, `nonce="${this.nonce}" src="${scriptUri.toString()}"`);
            html = html.replace(`/assets/${styleName}`, styleUri.toString());
            html = html.replaceAll("${title}", this.title);
            html = html.replaceAll("${nonce}", this.nonce);
            console.log(html);
            return html;
        };
    }

    public async show() {
        if (!this.panel) {
            this.panel = window.createWebviewPanel(
                this.serializationId,
                this.title,
                {
                    viewColumn: this.whereToShow,
                    preserveFocus: true,
                },
                {
                    enableScripts: true,
                    // retainContextWhenHidden: true, // @OPTIMIZE remove and migrate to state restore
                    enableCommandUris: true,
                    localResourceRoots: [Uri.file(path.resolve(__dirname, 'frontend', 'assets')]
                    // enableFindWidget: true,
                }
            );
            // this.panel.iconPath = getIconPaths('database-active');
            this.panel.webview.onDidReceiveMessage(this.onDidReceiveMessage, null, this.disposables);
            this.panel.onDidChangeViewState(
                ({ webviewPanel }) => {
                    this.setPreviewActiveContext(webviewPanel.active);
                    this.onViewActive && this.onViewActive(webviewPanel.active);
                },
                null,
                this.disposables
            );
            this.panel.onDidDispose(this.dispose, null, this.disposables);
            const cspSource = this.panel.webview.cspSource;

            this.panel.webview.html = await this.getHtml({ cspSource: cspSource });
        } else {
            this.panel.reveal(undefined, this.preserveFocus);
        }

        this.updatePanelName();

        this.setPreviewActiveContext(true);
    }

    private onDidReceiveMessage = ({ action, payload, ...rest }) => {
        switch (action) {
            case DefaultActions.RESPONSE_STATE:
                this.lastState = payload;
                break;
            case DefaultActions.CALL:
                return commands.executeCommand(payload.command, ...(payload.args || []));
            case DefaultActions.NOTIFY_VIEW_READY:
                process.env.NODE_ENV === 'development' &&
                    commands.executeCommand('workbench.action.webview.openDeveloperTools');
                break;
        }
        if (this.messagesHandler) {
            this.messagesHandler({ action, payload, ...rest });
        }
    };

    public get isActive() {
        return this.panel && this.panel.active;
    }

    public prepareUrl(localResource: Uri | string) {
        return this.panel && this.panel.webview
            ? this.panel.webview.asWebviewUri(Uri.file(localResource.toString()))
            : null;
    }
    public hide = () => {
        if (this.panel === undefined) return;
        this.setPreviewActiveContext(false);
        this.panel.dispose();
    };

    public dispose = () => {
        this.hide();
        if (this.disposables.length) this.disposables.forEach(d => d.dispose());
        this.disposables = [];
        this.panel = undefined;
        this.disposeEvent.fire();
    };

    public postMessage(message: any) {
        if (!this.panel) return;
        this.panel.webview.postMessage(message);
    }

    public sendMessage(action: string, payload?: any) {
        return this.postMessage({ action, payload });
    }

    private setPreviewActiveContext = (value: boolean) => {
        commands.executeCommand('setContext', `${EXT_NAMESPACE}.${this.id}.active`, value);
    };

    private lastState = undefined;

    public getState = (): Promise<any> => {
        if (!this.panel) return Promise.resolve(null);

        return new Promise((resolve, reject) => {
            let attempts = 0;
            const timer = setInterval(() => {
                if (typeof this.lastState === 'undefined') {
                    if (attempts < 10) return attempts++;

                    clearInterval(timer);
                    return reject(new Error(`Could not get the state for ${this.panel.title}`));
                }
                clearInterval(timer);
                const state = this.lastState;
                this.lastState = undefined;
                return resolve(state);
            }, 200);
            this.panel.webview.postMessage({ action: DefaultActions.REQUEST_STATE });
        });
    };

    public updatePanelName = () => {
        if (this.panel) this.panel.title = this.title;
    };
}

function getNonce() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 32; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

