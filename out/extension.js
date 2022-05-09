"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
const TimelinePanel_1 = require("./TimelinePanel");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('vscode-branching-tutorials-navigation.showTimeline', () => {
        TimelinePanel_1.TimelinePanel.createOrShow(context.extensionUri);
    }));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map