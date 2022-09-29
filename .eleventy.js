const assert = require("node:assert/strict");
const { inspect } = require("node:util");
const yaml = require("js-yaml");

/**
 * @typedef {import('@11ty/eleventy/src/UserConfig')} EleventyConfig
 * @typedef {ReturnType<import('@11ty/eleventy/src/defaultConfig')>} EleventyReturnValue
 * @type {(eleventyConfig: EleventyConfig) => EleventyReturnValue}
 */
module.exports = function (eleventyConfig) {
  eleventyConfig.addGlobalData("eleventyExcludeFromCollections", true);
  eleventyConfig.addDataExtension("yml", contents => yaml.load(contents));

  eleventyConfig.addFilter("assert", function (value, msg = "") {
    try {
      assert.ok(value);
    } catch (err) {
      msg =  `${msg.toString()} ${err.message}`.trim();
      throw new Error(msg);
    }
    return value;
  });
  eleventyConfig.addFilter("inspect", function (value, depth = 5) {
    return inspect(value, { depth, sorted: true });
  });
  eleventyConfig.addFilter("keys", Object.keys);
  eleventyConfig.addFilter("values", Object.values);

  eleventyConfig.addPlugin(require("@11ty/eleventy-plugin-directory-output"));

  eleventyConfig.on("eleventy.after", () => {
    console.info(`[eleventy.after] Memory used: ${getHeap()}`)
  });
  eleventyConfig.setQuietMode(true);

  return {
    dir: {
      input: "src",
      output: "www",
    }
  };
};

function getHeap() {
  const value = process.memoryUsage().heapUsed;
  return `${displayGb(value)} GB`;
}

function displayGb (num) {
  const gb = num / (1024 * 1024 * 1024)
  return Math.round(gb * 100) / 100
}
