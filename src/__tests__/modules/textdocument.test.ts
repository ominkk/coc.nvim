import { Position, Range } from 'vscode-languageserver-protocol'
import { LinesTextDocument } from '../../model/textdocument'
import { TextDocument } from 'vscode-languageserver-textdocument'

function createTextDocument(lines: string[]): LinesTextDocument {
  return new LinesTextDocument('file://a', 'txt', 1, lines, true)
}

describe('LinesTextDocument', () => {
  it('should apply edits', async () => {
    let textDocument = TextDocument.create('file:///a', 'vim', 1, 'use std::io::Result;')
    let s = 'use std::io::Result;'
    // 1234567890
    let edits = [
      { range: { start: { line: 0, character: 7 }, end: { line: 0, character: 11 } }, newText: "" },
      { range: { start: { line: 0, character: 13 }, end: { line: 0, character: 19 } }, newText: "io" },
      { range: { start: { line: 0, character: 19 }, end: { line: 0, character: 19 } }, newText: "::" },
      {
        range: { start: { line: 0, character: 19 }, end: { line: 0, character: 19 } }, newText: "{Result, Error}"
      }
    ]
    let res = TextDocument.applyEdits(textDocument, edits)
    expect(res).toBe('use std::io::{Result, Error};')
  })

  it('should get line count and content', async () => {
    let doc = createTextDocument(['a', 'b'])
    expect(doc.lineCount).toBe(3)
    let content = doc.getText()
    expect(content).toBe('a\nb\n')
  })

  it('should get text by line', async () => {
    const doc = createTextDocument(['foo', 'bar'])
    const textLine = doc.lineAt(0)
    expect(textLine.text).toBe('foo')
  })

  it('should get text by position', async () => {
    const doc = createTextDocument(['foo', 'bar'])
    const textLine = doc.lineAt(Position.create(0, 3))
    expect(textLine.text).toBe('foo')
  })

  it('should get position', async () => {
    let doc = createTextDocument(['foo', 'bar'])
    let pos = doc.positionAt(4)
    expect(pos).toEqual({ line: 1, character: 0 })
  })

  it('should get content by range', async () => {
    let doc = createTextDocument(['foo', 'bar'])
    let content = doc.getText(Range.create(0, 0, 0, 3))
    expect(content).toBe('foo')
  })

  it('should get offset', async () => {
    let doc = createTextDocument(['foo', 'bar'])
    let offset = doc.offsetAt(Position.create(0, 4))
    expect(offset).toBe(4)
    offset = doc.offsetAt(Position.create(2, 1))
    expect(offset).toBe(8)
  })
})
