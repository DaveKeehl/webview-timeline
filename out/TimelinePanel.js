"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimelinePanel = exports.getWebviewOptions = void 0;
const vscode = require("vscode");
const utils_1 = require("./utils");
const getWebviewOptions = (extensionUri) => {
    return {
        // Enable javascript in the webview
        enableScripts: true,
        // And restrict the webview to only loading content from our extension's `media` directory.
        localResourceRoots: [
            vscode.Uri.joinPath(extensionUri, 'media'),
            vscode.Uri.joinPath(extensionUri, 'node_modules'),
            vscode.Uri.joinPath(extensionUri, 'src')
        ]
    };
};
exports.getWebviewOptions = getWebviewOptions;
class TimelinePanel {
    constructor(panel, extensionUri) {
        this._disposables = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        // Set the webview's initial html content
        this._update();
        // Listen for when the panel is disposed
        // This happens when the user closes the panel or when the panel is closed programmatically
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        // Update the content based on view changes
        this._panel.onDidChangeViewState(e => {
            if (this._panel.visible) {
                this._update();
            }
        }, null, this._disposables);
        // Handle messages from the webview
        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'alert':
                    vscode.window.showErrorMessage(message.text);
                    return;
            }
        }, null, this._disposables);
    }
    static createOrShow(extensionUri) {
        const column = vscode.window.activeTextEditor
            ? vscode.window.activeTextEditor.viewColumn
            : undefined;
        // If we already have a panel, show it.
        if (TimelinePanel.currentPanel) {
            TimelinePanel.currentPanel._panel.reveal(column);
            return;
        }
        // Otherwise, create a new panel.
        const panel = vscode.window.createWebviewPanel(TimelinePanel.viewType, 'Timeline', column || vscode.ViewColumn.One, (0, exports.getWebviewOptions)(extensionUri));
        TimelinePanel.currentPanel = new TimelinePanel(panel, extensionUri);
    }
    static revive(panel, extensionUri) {
        TimelinePanel.currentPanel = new TimelinePanel(panel, extensionUri);
    }
    doRefactor() {
        // Send a message to the webview webview.
        // You can send any JSON serializable data.
        this._panel.webview.postMessage({ command: 'refactor' });
    }
    dispose() {
        TimelinePanel.currentPanel = undefined;
        // Clean up our resources
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    // private _update() {
    // 	const webview = this._panel.webview;
    // 	// Vary the webview's content based on where it is located in the editor.
    // 	switch (this._panel.viewColumn) {
    // 		case vscode.ViewColumn.Two:
    // 			this._updateForCat(webview, 'Compiling Cat');
    // 			return;
    // 		case vscode.ViewColumn.Three:
    // 			this._updateForCat(webview, 'Testing Cat');
    // 			return;
    // 		case vscode.ViewColumn.One:
    // 		default:
    // 			this._updateForCat(webview, 'Coding Cat');
    // 			return;
    // 	}
    // }
    async _update() {
        const webview = this._panel.webview;
        this._panel.webview.html = this._getHtmlForWebview(webview);
        webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case "onInfo": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showInformationMessage(data.value);
                    break;
                }
                case "onError": {
                    if (!data.value) {
                        return;
                    }
                    vscode.window.showErrorMessage(data.value);
                    break;
                }
            }
        });
    }
    _getHtmlForWebview(webview) {
        // And the uri we use to load this script in the webview
        const scriptUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'src', 'main.js'));
        // Uri to load styles into webview
        const stylesResetUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'reset.css'));
        const stylesMainUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'vscode.css'));
        const gitgraphOverrideUri = webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, 'media', 'gitgraph-override.css'));
        // Use a nonce to only allow specific scripts to be run
        const nonce = (0, utils_1.getNonce)();
        return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">

				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource}; img-src ${webview.cspSource} https:; script-src 'nonce-${nonce}';">

				<meta name="viewport" content="width=device-width, initial-scale=1.0">

				<link href="${stylesResetUri}" rel="stylesheet">
				<link href="${stylesMainUri}" rel="stylesheet">
				<link href="${gitgraphOverrideUri}" rel="stylesheet">

				</head>
				<body>
				<div id="graph-container"></div>
				
				<script nonce="${nonce}" src="https://cdn.jsdelivr.net/npm/@gitgraph/js" crossorigin></script>
				<script nonce="${nonce}" src="${scriptUri}"></script>
			 </body>
			</html>`;
    }
}
exports.TimelinePanel = TimelinePanel;
TimelinePanel.viewType = 'vscode-branching-tutorials-navigation';
//# sourceMappingURL=TimelinePanel.js.map