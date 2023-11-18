// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'

import { FunctionItem, FunctionNamesProvider } from './treeview'
import { getLanguage } from './languages'
import { Item } from './types'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor
  if (editor) {
    // Get the document and its text content
    const document = editor.document
    const text = document.getText()

    const functionNames = getLanguage(document.languageId).findSymbols(text)

    const provider = new FunctionNamesProvider(functionNames)
    const view = vscode.window.createTreeView('functionNames', {
      treeDataProvider: provider
    })

    vscode.workspace.onDidOpenTextDocument((e) => {
      const functionNames = getLanguage(e.languageId).findSymbols(e.getText())

      provider.refresh(functionNames)
    })

    vscode.workspace.onDidChangeTextDocument((e) => {
      const functionNames = getLanguage(e.document.languageId).findSymbols(e.document.getText())

      provider.refresh(functionNames)
    })

    view.onDidChangeSelection((e) => {
      if (e.selection.length === 1 && e.selection[0] instanceof FunctionItem) {
        const selectedFunction = e.selection[0] as FunctionItem
        openAndRevealDocument(selectedFunction.item)
      }
    })
  }
}

async function openAndRevealDocument(functionName: Item) {
  const editor = vscode.window.activeTextEditor
  if (editor) {
    const currentDocument = editor.document
    const uri = vscode.Uri.file(currentDocument.fileName)
    const document = await vscode.workspace.openTextDocument(uri)

    const index = getLanguage(document.languageId).findSymbolIndex(functionName, document)

    if (!index) {
      console.error(`Function ${functionName} not found`)
      return
    }

    const position = document.positionAt(index)

    vscode.window.showTextDocument(document, {
      selection: new vscode.Selection(position, position)
    })
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
