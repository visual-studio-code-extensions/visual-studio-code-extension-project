
 
import { ProviderResult, TreeDataProvider, TreeItem, TreeItemCollapsibleState, window, workspace } from 'vscode';

import type { ExtensionContext } from 'vscode';
import { Node, Project, TrueLiteral, ts } from 'ts-morph';

class TreeProvider implements TreeDataProvider<Node<ts.Node>> {
	constructor(private sourceNode: Node<ts.Node>) {}

	getTreeItem(element: Node<ts.Node>): TreeItem | Thenable<TreeItem> {
		return new TreeItem(element.getKindName(), TreeItemCollapsibleState.Expanded);
	}

	getChildren(element?: Node<ts.Node> | undefined): ProviderResult<Node<ts.Node>[]> {
		if(element === undefined) {
			return [this.sourceNode];
		}

		return element.getChildren();
	}
}

export function activate(context: ExtensionContext) {
	const saveEvent = workspace.onDidSaveTextDocument((file) => {
		if(file.languageId !== 'typescript') return;

		const project = new Project({
			useInMemoryFileSystem: true,
		});

		const sourceFile = project.createSourceFile('__temp__.ts', file.getText());
		const tree = window.registerTreeDataProvider('seeTree', new TreeProvider(sourceFile));
		context.subscriptions.push(tree);
	});

	context.subscriptions.push(saveEvent);
}

// this method is called when your extension is deactivated
export function deactivate() {}
