const fs = require('fs');
const path = require('path');
const url = require('url');
const ora = require('ora');
const chalk = require('chalk');
const prettyMs = require('pretty-ms');
const glob = require('glob');

const getMetaTag = (html, property) => {
  const regex = new RegExp(
    `<meta[^>]*(property|name)=["|']${property}["|'][^>]*>`,
    'i'
  );
  const regexExec = regex.exec(html);

  if (regexExec) {
    return regexExec[0];
  }
  return false;
};

const getMetaTagContent = metaTagHtml => {
  const regex = /content=["]([^"]*)["]/i;
  const regexExec = regex.exec(metaTagHtml);

  if (regexExec) {
    return regexExec[1];
  }
  return false;
};

module.exports = bundler => {
  bundler.on('buildEnd', async () => {
    const spinner = ora(chalk.grey('Fixing meta tags image links')).start();
    const start = Date.now();

    glob.sync(`${bundler.options.outDir}/**/*.html`).forEach(file => {
      const htmlPath = path.resolve(file);
      const html = fs.readFileSync(htmlPath).toString();
      let patchedHtml = html;

      const ogUrlTag = getMetaTag(html, 'og:url');
      const ogImageTag = getMetaTag(html, 'og:image');
      const twitterImageTag = getMetaTag(html, 'twitter:image');

      if (ogUrlTag) {
        const ogUrlContent = getMetaTagContent(ogUrlTag);

        if (ogImageTag) {
          const ogImageContent = getMetaTagContent(ogImageTag);
          const absoluteOgImageUrl = url.resolve(ogUrlContent, ogImageContent);
          const ogImageTagAbsoluteUrl = ogImageTag.replace(
            ogImageContent,
            absoluteOgImageUrl
          );
          patchedHtml = patchedHtml.replace(ogImageTag, ogImageTagAbsoluteUrl);
        }

        if (twitterImageTag) {
          const twitterImageContent = getMetaTagContent(twitterImageTag);
          const absoluteTwitterImageUrl = url.resolve(
            ogUrlContent,
            twitterImageContent
          );
          const twitterImageTagAbsoluteUrl = twitterImageTag.replace(
            twitterImageContent,
            absoluteTwitterImageUrl
          );
          patchedHtml = patchedHtml.replace(
            twitterImageTag,
            twitterImageTagAbsoluteUrl
          );
        }
      }

      fs.writeFileSync(htmlPath, patchedHtml);
    });

    const end = Date.now();
    spinner.stopAndPersist({
      symbol: '✨ ',
      text: chalk.green(
        `Fixed meta tags image links in ${prettyMs(end - start)}.`
      )
    });
  });
};
