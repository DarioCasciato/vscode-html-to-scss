import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "html-to-scss" is now active!');

    // Register the command to generate SCSS from selected HTML
    let disposable = vscode.commands.registerCommand('extension.generateSCSS', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.selection;
            const htmlSnippet = editor.document.getText(selection);

            const scssSnippet = generateSCSS(htmlSnippet);

            vscode.env.clipboard.writeText(scssSnippet);
            vscode.window.showInformationMessage('SCSS snippet generated and copied to clipboard!');
        }
    });

    // Add the command as a context menu item
    let contextDisposable = vscode.commands.registerTextEditorCommand('extension.generateSCSSContextMenu', (textEditor: vscode.TextEditor) => {
        const selection = textEditor.selection;
        const htmlSnippet = textEditor.document.getText(selection);

        const scssSnippet = generateSCSS(htmlSnippet);

        vscode.env.clipboard.writeText(scssSnippet);
        vscode.window.showInformationMessage('SCSS snippet generated and copied to clipboard!');
    });

    context.subscriptions.push(disposable, contextDisposable);
}

function generateSCSS(htmlSnippet: string): string {
	let indentation = '';
	let scssCode = '';

	// Split the HTML snippet into separate lines
	const lines = htmlSnippet.split('\n');

	// Iterate over each line of the HTML snippet
	for (let line of lines) {
	  // Remove leading and trailing whitespace
	  line = line.trim();

	  // Ignore empty lines
	  if (line.length === 0) {
		continue;
	  }

	  // Determine the indentation level
	  const match = line.match(/^\s+/);
	  if (match && match[0]) {
		indentation = match[0];
	  }

	  // Remove the existing indentation from the line
	  line = line.replace(/^\s+/, '');

	  // Open the SCSS block
	  scssCode += indentation + line + ' {\n';

	  // Increase the indentation level
	  indentation += '  ';
	}

	// Close the SCSS blocks
	while (indentation.length >= 2) {
	  indentation = indentation.slice(0, -2);
	  scssCode += indentation + '}\n';
	}

	return scssCode;
}

export function deactivate() {}