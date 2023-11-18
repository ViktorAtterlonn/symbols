import * as vscode from 'vscode'
import { Item } from '../types'

function findFunctionNames(text: string) {
  const functionRegex = /function\s+([a-zA-Z_]\w*)\s*\(/g
  const constFunctionRegex = /const\s+([a-zA-Z_]\w*)\s*=\s*(async\s*)?\(/g

  let match
  const functionNames: string[] = []

  while ((match = functionRegex.exec(text)) !== null) {
    functionNames.push(match[1])
  }

  while ((match = constFunctionRegex.exec(text)) !== null) {
    functionNames.push(match[1])
  }

  return functionNames
}

function findFunctionIndex(functionName: string, document: vscode.TextDocument) {
  const patterns = [
    `function ${functionName} (`,
    `function ${functionName}(`,
    `async function ${functionName} (`,
    `async function ${functionName}(`,
    `const ${functionName} = async (`,
    `const ${functionName} = async(`,
    `const ${functionName} = (`,
    `const ${functionName} =(`
  ]

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

function findTypeNames(text: string) {
  const typeRegex = /type\s+([a-zA-Z_]\w*)\s*=\s*{/g
  let match
  const typeNames: string[] = []

  while ((match = typeRegex.exec(text)) !== null) {
    typeNames.push(match[1])
  }

  return typeNames
}

function findTypeIndex(typeName: string, document: vscode.TextDocument) {
  const patterns = [`type ${typeName} = {`, `type ${typeName}={`]

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
  const types = findTypeNames(text)
  const functions = findFunctionNames(text)

  return [
    ...types.map((name) => ({ type: 'type', name })),
    ...functions.map((name) => ({ type: 'function', name }))
  ] as Item[]
}

function findSymbolIndex(symbol: Item, document: vscode.TextDocument) {
  switch (symbol.type) {
    case 'function':
      return findFunctionIndex(symbol.name, document)
    case 'type':
      return findTypeIndex(symbol.name, document)
  }
}

export { findSymbolIndex, findSymbols }
