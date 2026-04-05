import katex from "katex";
import "katex/contrib/mhchem";

// const str = String.raw`<p>This is what I was seeing [inlineFontSize="1rem"]**0.412\overline{2}**, is: and the other side was [blockFontSize="1.5rem"]$$0.412\overline{6}$$ and finally I see the light of day.</p>`;
// The above gives a clear example. [inlineFontSize]** should be after it. for [blockFontSize]$$ is valid.
// combination also will work as given above as long as the code is like this.

function CleanAndRender(str: string, displayMode = false) {
    // strip delimiters ** and $$
    const cleaned = str
        .replace(/^\*\*|\*\*$/g, "")
        .replace(/^\$\$|\$\$$/g, "");
    return katex.renderToString(cleaned, {
        output: "htmlAndMathml",
        displayMode,
        throwOnError: false,
    });
}


// Handles inline occurrences of font size + math delimiters
function processInlineDirectives(
    line: string,
    defaults: { inlineFontSize: string; blockFontSize: string }
) {
    return line.replace(
        /\[(inlineFontSize|blockFontSize)=["']?(.+?)["']?\](\*\*[^]*?\*\*|\$\$[^]*?\$\$)/g,
        (full, type, size, math) => {
            const fontSize = size.trim();
            const isBlock = math.startsWith("$$");

            if (type === "inlineFontSize") {
                return `<span style="font-size:${fontSize};">${CleanAndRender(math, false)}</span>`;
            } else {
                // blockFontSize
                return `<div style="font-size:${fontSize};">${CleanAndRender(math, true)}</div>`;
            }
        }
    );
}


// Fallback for math without font directives
function processDefaultMath(
    line: string,
    defaults: { inlineFontSize: string; blockFontSize: string }
) {
    return line.replace(/(\*\*[^]*?\*\*|\$\$[^]*?\$\$)/g, (math) => {
        const isBlock = math.startsWith("$$");
        if (isBlock) {
            return `<div style="font-size:${defaults.blockFontSize};">${CleanAndRender(math, true)}</div>`;
        } else {
            return `<span style="font-size:${defaults.inlineFontSize};">${CleanAndRender(math, false)}</span>`;
        }
    });
}

export default function renderWithDelimitersToString(text: string) {
    if (!text) return "";
    const defaults = { inlineFontSize: "1.0rem", blockFontSize: "1.3rem" };

    return text
        .split("\n")
        .map((line) => {
            const pMatch = line.match(/^<p>([\s\S]*?)<\/p>$/i);
            if (pMatch) line = pMatch[1];

            line = processInlineDirectives(line, defaults);
            line = processDefaultMath(line, defaults);

            return `<p>${line}</p>`;
        })
        .join("\n");
}
