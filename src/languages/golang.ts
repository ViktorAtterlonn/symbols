import * as vscode from 'vscode'
import { Item } from '../types'

function findStructNames(text: string) {
  const structRegex = /type\s+(\w+)\s+struct\s*{/g

  let match
  const structNames: Item[] = []

  while ((match = structRegex.exec(text)) !== null) {
    structNames.push({
      type: 'struct',
      name: match[1],
      index: text.indexOf(match[1])
    })
  }

  return structNames
}

function findStructIndex(structName: string, document: vscode.TextDocument) {
  const index = document.getText().indexOf(`type ${structName} struct {`)

  if (index > -1) {
    return index
  }
}

function findFunctionNames(text: string) {
  const functionRegex = /func\s+(\w+)\s*\(\s*/g
  const structFunctionRegex = /func\s*\(\s*(\w+)\s*\*\s*(\w+)\s*\)\s*(\w+)\s*\(\s*/g

  let match
  const functionNames: Item[] = []

  while ((match = functionRegex.exec(text)) !== null) {
    functionNames.push({
      type: 'function',
      name: match[1],
      index: text.indexOf(match[1])
    })
  }

  while ((match = structFunctionRegex.exec(text)) !== null) {
    functionNames.push({
      type: 'function',
      name: `${match[2]}.${match[3]}`,
      index: text.indexOf(match[3])
    })
  }

  return functionNames
}

function findFunctionIndex(functionName: string, document: vscode.TextDocument) {
  const parsed = functionName.split('.')
  const name = parsed[parsed.length - 1]

  const patterns = [`func ${name} (`, `func ${name}(`, `) ${name} (`, `)${name}(`]

  while (patterns.length) {
    const pattern = patterns.shift()

    if (!pattern) {
      break
    }

    const index = document.getText().indexOf(pattern)

    if (index > -1) {
      return index
    }
  }
}

function findSymbols(text: string): Item[] {
  const structs = findStructNames(text)
  const functions = findFunctionNames(text)

  return [...structs, ...functions].sort((a, b) => {
    return a.index - b.index
  }) as Item[]
}

function findSymbolIndex(symbol: Item, document: vscode.TextDocument) {
  switch (symbol.type) {
    case 'struct':
      return findStructIndex(symbol.name, document)
    case 'function':
      return findFunctionIndex(symbol.name, document)
  }
}

export { findSymbolIndex, findSymbols }
