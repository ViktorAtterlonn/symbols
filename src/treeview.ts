import path = require('path')
import * as vscode from 'vscode'
import { Item } from './types'

export class FunctionNamesProvider implements vscode.TreeDataProvider<FunctionItem> {
  constructor(private items: Item[]) {}

  getTreeItem(element: FunctionItem): vscode.TreeItem {
    return element
  }

  getChildren(): Thenable<FunctionItem[]> {
    return Promise.resolve(this.items.map((item) => new FunctionItem(item)))
  }

  private _onDidChangeTreeData: vscode.EventEmitter<FunctionItem | undefined | null | void> =
    new vscode.EventEmitter<FunctionItem | undefined | null | void>()
  readonly onDidChangeTreeData: vscode.Event<FunctionItem | undefined | null | void> =
    this._onDidChangeTreeData.event

  refresh(items: Item[]): void {
    this.items = items
    this._onDidChangeTreeData.fire()
  }
}

export class FunctionItem extends vscode.TreeItem {
  constructor(public readonly item: Item) {
    super(item.name)

    if (item.type === 'function') {
      this.iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'item-icon.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'item-icon.svg')
      }
    }

    if (['struct', 'type'].includes(item.type)) {
      this.iconPath = {
        light: path.join(__filename, '..', '..', 'resources', 'light', 'type-icon.svg'),
        dark: path.join(__filename, '..', '..', 'resources', 'dark', 'type-icon.svg')
      }
    }
  }
}
