module.exports = (eleventyConfig) => {
  eleventyConfig.addPassthroughCopy('vendor')

  // Rebuild the site whenever there is a change in the `vendor` directory.
  eleventyConfig.addWatchTarget('vendor')

  /**
   * We need this option so 11ty allows us to watch the .gitignore'd `vendor`
   * directory.
   */
  eleventyConfig.setUseGitIgnore(false)
}
