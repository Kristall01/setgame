function generateText(settings, color, text) {
	if(text == '') {
		return '';
	}
	let classes = ['chat'];
	Object.entries(settings).forEach(([key, val]) => {
		if(val) {
			classes.push(key);
		}
	})
	let attributes = {};
	if(color) {
		if(color.startsWith("#")) {
			attributes.style = "color:"+color;
		}
		else {
			classes.push(color);
		}
	}
	attributes.class = classes.join(" ");
	return `<span ${Object.entries(attributes).map(([key,val]) => `${key}="${val}"`).join(" ")}>${text}</span>`;
}

const colorMap = {
	'0': 'black',
	'1': 'darkblue',
	'2': 'darkgreen',
	'3': 'darkcyan',
	'4': 'darkred',
	'5': 'purple',
	'6': 'orange',
	'7': 'gray',
	'8': 'darkgray',
	'9': 'blue',
	'a': 'green',
	'b': 'cyan',
	'c': 'red',
	'd': 'magenta',
	'e': 'yellow',
	'f': 'white'
}

const styleMap = {
	'l': 'bold',
	'm': 'crossed',
	'n': 'underline',
	'o': 'italic'
}

/**
 * @param {string} input 
 */
export function convertToHtml(input) {
	const baseFlag = {bold: false, underline: false, italic: false, crossed: false};

	let output = "";
	let currentBuffer = "";
	let flags = {...baseFlag};
	let color = null;
	let flagByte = false;
	for(let c of input) {
		if(c == '&') {
			if(flagByte) {
				currentBuffer += '&';
				flagByte = false;
			}
			else {
				flagByte = true;
			}
			continue;
		}
		if(!flagByte) {
			if(c == '<') {
				currentBuffer += "&lt;";
			}
			else if(c == '>') {
				currentBuffer += "&gt;";
			}
			else {
				currentBuffer += c;
			}
			continue;
		}
		flagByte = false;
		if(c.match('^[0-9a-f]$')) {
			output += generateText(flags, color, currentBuffer);
			currentBuffer = '';
			color = colorMap[c];
			flags = {...baseFlag};
			continue;
		}
		if(c == 'r') {
			output += generateText(flags, color, currentBuffer);
			currentBuffer = '';
			flags = {...baseFlag};
			color = null;
		}
		let style = styleMap[c];
		if(style) {
			output += generateText(flags, color, currentBuffer);
			currentBuffer = '';
			flags[style] = true;
			continue;
		}
	}
	output += generateText(flags, color, currentBuffer);
	return output;
}

