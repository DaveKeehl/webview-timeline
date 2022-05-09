import * as vscode from 'vscode';
import { TimelinePanel } from './TimelinePanel';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(
		vscode.commands.registerCommand('vscode-branching-tutorials-navigation.showTimeline', () => {
			TimelinePanel.createOrShow(context.extensionUri);
		})
	);
}