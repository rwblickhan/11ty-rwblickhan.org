// Eleventy plugins
const EleventyGoogleFonts = require("eleventy-google-fonts");
const EleventyImage = require("@11ty/eleventy-img");
const EleventyPluginRSS = require("@11ty/eleventy-plugin-rss");
const EleventyPluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const EleventyPluginTOC = require("eleventy-plugin-toc");

// markdown-it plugins
const MarkdownIt = require("markdown-it");
const MarkdownItFootnote = require("markdown-it-footnote");
const MarkdownItAnchor = require("markdown-it-anchor");

// Other dependencies
const HtmlMinifier = require('html-minifier');

async function imageShortcode(src, alt, sizes) {
    const metadata = await EleventyImage(`.${src}`, {
        widths: [600],
        urlPath: "/images/",
        outputDir: "./_site/images/",
    });

    let imageAttributes = {
        alt,
        sizes,
        loading: "lazy",
        decoding: "async",
    };

    return EleventyImage.generateHTML(metadata, imageAttributes, {
        whitespaceMode: "inline"
    });
}

module.exports = eleventyConfig => {
    eleventyConfig.addPassthroughCopy("files");
    eleventyConfig.addPassthroughCopy("_headers");
    eleventyConfig.addPassthroughCopy("robots.txt");
    eleventyConfig.addPassthroughCopy("stork.js");
    eleventyConfig.addPassthroughCopy("stork.wasm");
    eleventyConfig.addPassthroughCopy("styles/prism-okaidia.css");
    eleventyConfig.addPassthroughCopy("styles/stork.css");

    eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
        if (process.env.ELEVENTY_PRODUCTION && outputPath && outputPath.endsWith('.html')) {
            let minified = HtmlMinifier.minify(content, {
                useShortDoctype: true,
                removeComments: true,
                collapseWhitespace: true,
            });
            return minified;
        }
        return content;
    });

    const options = {
        html: true,
        breaks: true,
        linkify: true,
    };
    eleventyConfig.setLibrary(
        "md",
        MarkdownIt(options)
            .use(MarkdownItAnchor)
            .use(MarkdownItFootnote)
    );

    eleventyConfig.addAsyncShortcode("image", imageShortcode);

    eleventyConfig.addPlugin(EleventyGoogleFonts);
    eleventyConfig.addPlugin(EleventyPluginRSS);
    eleventyConfig.addPlugin(EleventyPluginSyntaxHighlight);
    eleventyConfig.addPlugin(EleventyPluginTOC);
};
