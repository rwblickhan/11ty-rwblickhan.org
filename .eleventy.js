const markdownIt = require("markdown-it");
const markdownItFootnote = require("markdown-it-footnote");
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const brokenLinksPlugin = require("eleventy-plugin-broken-links");

module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy('styles/Vollkorn')
  eleventyConfig.addPassthroughCopy('styles/pygments.css')
  eleventyConfig.addPassthroughCopy('images')
  eleventyConfig.addPassthroughCopy('tailwind_styles')

  // Rebuild the site whenever there is a change in the `vendor` directory.
  eleventyConfig.addWatchTarget('vendor')

  /**
   * We need this option so 11ty allows us to watch the .gitignore'd `vendor`
   * directory.
   */
  eleventyConfig.setUseGitIgnore(false)

  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  eleventyConfig.setLibrary("md", markdownIt(options).use(markdownItFootnote));

  eleventyConfig.addPlugin(syntaxHighlight);
  eleventyConfig.addPlugin(brokenLinksPlugin);
}
