import * as htmlparser2 from 'htmlparser2';
import { DomHandler, Element } from 'domhandler';

export function generateSCSS(htmlSnippet: string): string {
  let scssCode = '';
  let indentLevel = 0;
  let isSelfClosing = false;

  const uniqueTags = new Set<string>();
  const openingTags: string[] = [];

  const handler = new DomHandler((error, dom) => {
    if (error) {
      throw new Error(`Error parsing HTML: ${error}`);
    }

    function processElement(element: Element) {
      const { tagName, attribs, children } = element;

      if (tagName && tagName !== 'svg') {
        const classNames = attribs.class ? attribs.class.split(' ') : [];
        const tagKey = `${tagName}.${classNames.join('.')}`;
        if (uniqueTags.has(tagKey)) {
          return; // Skip duplicate tag
        }
        uniqueTags.add(tagKey);

        const indent = '\t'.repeat(indentLevel);
        let selector = '';
        if (tagName !== 'div') {
          selector = tagName;
        }
        if (classNames.length > 0) {
          selector += `.${classNames.join('.')}`;
        }

        const openingBlock = `${indent}${selector}\n${indent}{\n\n`;
        scssCode += openingBlock;
        openingTags.push(tagName);
        indentLevel++;

        for (const child of children) {
          if (child.type === 'tag') {
            processElement(child as Element);
          }
        }

        indentLevel--;
        const closingBlock = `${indent}}\n`;
        scssCode += closingBlock;
        openingTags.pop();
      }
    }

    for (const element of dom) {
      if (element.type === 'tag') {
        processElement(element as Element);
      }
    }
  });

  const parser = new htmlparser2.Parser(handler);
  parser.write(htmlSnippet);
  parser.end();

  return scssCode;
}