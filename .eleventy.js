const eleventyGoogleFonts = require("eleventy-google-fonts");
const htmlminifier = require('html-minifier');
const markdownIt = require("markdown-it");
const markdownItFootnote = require("markdown-it-footnote");
const markdownItAnchor = require("markdown-it-anchor");
const pluginRSS = require("@11ty/eleventy-plugin-rss");
const pluginTOC = require("eleventy-plugin-toc");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const Image = require("@11ty/eleventy-img");

async function imageShortcode(src, alt) {
    if (alt === undefined) {
        // You bet we throw an error on missing alt (alt="" works okay)
        throw new Error(`Missing \`alt\` on myImage from: ${src}`);
    }

    const metadata = await Image(`.${src}`, {
        widths: [600],
        formats: ["jpeg"],
        urlPath: "/images/",
        outputDir: "./_site/images/",
    });

    const data = metadata.jpeg[metadata.jpeg.length - 1];
    return `<a href="${src}" title="${alt}" target="_blank"><img src="${data.url}" width="${data.width}" height="${data.height}" alt="${alt}" loading="lazy" decoding="async"></a>`;
}

module.exports = eleventyConfig => {
    eleventyConfig.addPassthroughCopy("styles/prism-okaidia.css");
    eleventyConfig.addPassthroughCopy("styles/stork.css");
    eleventyConfig.addPassthroughCopy("images");
    eleventyConfig.addPassthroughCopy("files");
    eleventyConfig.addPassthroughCopy("robots.txt");
    eleventyConfig.addPassthroughCopy("_headers");
    eleventyConfig.addPassthroughCopy("stork.js");
    eleventyConfig.addPassthroughCopy("stork.wasm");

    eleventyConfig.addTransform('htmlmin', function (content, outputPath) {
        if (process.env.ELEVENTY_PRODUCTION && outputPath && outputPath.endsWith('.html')) {
            let minified = htmlminifier.minify(content, {
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
        markdownIt(options)
            .use(markdownItAnchor)
            .use(markdownItFootnote)
    );

    eleventyConfig.addPlugin(eleventyGoogleFonts);
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPlugin(pluginRSS);
    eleventyConfig.addPlugin(pluginTOC);
    eleventyConfig.addLiquidShortcode("image", imageShortcode);
    eleventyConfig.addPlugin(pluginRSS);
};
