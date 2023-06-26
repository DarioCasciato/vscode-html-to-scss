export function generateSCSS(htmlSnippet: string): string {
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


//Regex for normal object opener:  <(\w+)(?:\s[^>]*?\bclass\s*=\s*["\'](\w+))?[^>]*>