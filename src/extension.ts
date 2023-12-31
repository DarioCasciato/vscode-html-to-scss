import * as vscode from 'vscode';
import { generateSCSS } from './generate-scss';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "html-to-scss" is now active!');

  // Register the command to generate SCSS from selected HTML
  let disposable = vscode.commands.registerCommand('extension.html-to-scss.generate-scss', () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const htmlSnippet = editor.document.getText(selection);

      const outputStyle = vscode.workspace.getConfiguration().get('html-to-scss.outputStyle', 'alman');
      const scssSnippet = generateSCSS(htmlSnippet, outputStyle);

      vscode.env.clipboard.writeText(scssSnippet);
      vscode.window.showInformationMessage('SCSS snippet generated and copied to clipboard!');
    }
  });

  // Add the command as a context menu item
  let contextDisposable = vscode.commands.registerTextEditorCommand('extension.html-to-scss.generate-scssContextMenu', (textEditor: vscode.TextEditor) => {
    const selection = textEditor.selection;
    const htmlSnippet = textEditor.document.getText(selection);

    const outputStyle = vscode.workspace.getConfiguration().get('html-to-scss.outputStyle', 'alman');
    const scssSnippet = generateSCSS(htmlSnippet, outputStyle);

    vscode.env.clipboard.writeText(scssSnippet);
    vscode.window.showInformationMessage('SCSS snippet generated and copied to clipboard!');
  });

  context.subscriptions.push(disposable, contextDisposable);
}

export function deactivate() {}