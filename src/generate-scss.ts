export function generateSCSS(htmlSnippet: string): string {
	const openingTagRegex = /<(\w+)(?:\s[^>]*?\bclass\s*=\s*["'](\w+))?[^>]*>|<\/(\w+)>/g;
	const selfClosingTagRegex = /<(\w+)(?:\s[^>]*?\bclass\s*=\s*["'](\w+))?[^>]*\s*\/>/g;
	const closingTagRegex = /<\/(\w+)>/g;
	let scssCode = '';
	let indentLevel = 0;
	let isSelfClosing = false;

	const uniqueTags = new Set<string>();
	const openingTags = [];

	let match;
	while ((match = openingTagRegex.exec(htmlSnippet)) !== null) {
	  const [, openingTag, className, closingTag] = match;

	  if (openingTag) {
		const tagKey = `${openingTag}.${className}`;
		if (uniqueTags.has(tagKey)) {
		  continue; // Skip duplicate opening tag
		}
		uniqueTags.add(tagKey);

		const indent = '\t'.repeat(indentLevel);
		let selector = openingTag;
		if (openingTag === 'div' && className) {
		  selector = `.${className}`;
		} else if (className) {
		  selector += `.${className}`;
		}
		const openingBlock = `${indent}${selector} {\n\n`;
		scssCode += openingBlock;
		openingTags.push(openingTag);
		indentLevel++;
	  } else if (closingTag) {
		if (isSelfClosing) {
		  isSelfClosing = false;
		  continue; // Skip closing tag for self-closing tag
		}
		indentLevel--;
		const indent = '\t'.repeat(indentLevel);
		const closingSelector = closingTag;
		const closingBlock = `${indent}}\n`;
		scssCode += closingBlock;
		openingTags.pop();
	  }
	}

	while ((match = selfClosingTagRegex.exec(htmlSnippet)) !== null) {
	  const [, selfClosingTag, selfClosingClassName] = match;
	  isSelfClosing = true;

	  const tagKey = `${selfClosingTag}.${selfClosingClassName}`;
	  if (uniqueTags.has(tagKey)) {
		continue; // Skip duplicate self-closing tag
	  }
	  uniqueTags.add(tagKey);

	  const indent = '\t'.repeat(indentLevel);
	  let selector = selfClosingTag;
	  if (selfClosingTag === 'div' && selfClosingClassName) {
		selector = `.${selfClosingClassName}`;
	  } else if (selfClosingClassName) {
		selector += `.${selfClosingClassName}`;
	  }
	  const selfClosingBlock = `${indent}${selector} {\n\n}\n`;
	  scssCode += selfClosingBlock;
	}

	while (openingTags.length > 0) {
	  indentLevel--;
	  const indent = '\t'.repeat(indentLevel);
	  const openingTag = openingTags.pop();
	  const closingBlock = `${indent}}\n`;
	  scssCode += closingBlock;
	}

	return scssCode;
  }