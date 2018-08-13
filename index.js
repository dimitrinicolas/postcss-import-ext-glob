const postcss = require('postcss');
const valueParser = require('postcss-value-parser');

const path = require('path');
const fg = require('fast-glob');
const sort = require('fast-sort');

const SORTERS = ['asc', 'desc'];
const DEFAULT_SORTER = 'asc';

module.exports = postcss.plugin('postcss-import-ext-glob', (opts = {}) => {
  const sorter = SORTERS.indexOf(opts.sort) > -1
    ? opts.sort
    : DEFAULT_SORTER;

  return css => {
    const promisesList = [];

    css.walkAtRules('import-glob', rule => {
      promisesList.push(new Promise((resolve, reject) => {
        const globList = [];
        const params = valueParser(rule.params).nodes;

        const dirname = typeof rule.source.input.file === 'string'
          ? path.dirname(rule.source.input.file)
          : __dirname;

        for (const param of params) {
          if (param.type === 'string') {
            globList.push(path.join(dirname, param.value));
          }
        }

        if (globList.length) {
          fg(globList)
            .then(entries => {
              const sortedEntries = sort(entries)[sorter]();

              for (const entry of sortedEntries) {
                css.insertBefore(rule, {
                  name: 'import',
                  params: `"${entry}"`
                });
              }
              rule.remove();
              resolve();
            });
        } else {
          reject(new Error(
            `No string found with rule @import-glob ${rule.params}`
          ));
        }
      }));
    });

    return Promise.all(promisesList);
  };
});
