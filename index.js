const valueParser = require('postcss-value-parser');

const path = require('path');
const fg = require('fast-glob');
const { sort } = require('fast-sort');

const SORTERS = ['asc', 'desc'];
const DEFAULT_SORTER = 'asc';

module.exports = (opts = {}) => {
  const sorter = SORTERS.indexOf(opts.sort) !== -1 ? opts.sort : DEFAULT_SORTER;

  return {
    postcssPlugin: 'postcss-import-ext-glob',
    Once(root, { AtRule, result }) {
      const promisesList = [];

      root.walkAtRules('import-glob', (rule) => {
        promisesList.push(
          new Promise((resolve) => {
            const globList = [];
            const layer = new Map();

            const params = valueParser(rule.params).nodes;

            const dirName =
              typeof rule.source.input.file === 'string'
                ? path.dirname(rule.source.input.file)
                : __dirname;

            for (const param of params) {
              if (param.type === 'string') {
                globList.push(
                  path.join(dirName, param.value).replace(/\\/g, '/')
                );
              }
              if (param.type === 'function' && param.value === 'layer') {
                layer.set(dirName, param.nodes[0].value);
              }
            }

            if (globList.length) {
              fg(globList).then((entries) => {
                if (!entries.length) {
                  result.warn(`No file found for @import-glob ${rule.params}`, {
                    node: rule,
                  });
                }

                const sortedEntries = sort(entries)[sorter]();

                sortedEntries.forEach((entry) => {
                  const paramValue = layer.get(dirName)
                    ? `"${entry}" layer(${layer.get(dirName)})`
                    : `"${entry}"`;

                  rule.before(
                    new AtRule({
                      name: 'import',
                      params: paramValue,
                      source: rule.source,
                    })
                  );
                });

                rule.remove();

                resolve();
              });
            } else {
              throw rule.error(
                `No string found with rule @import-glob ${rule.params}`,
                {
                  word: rule.params,
                }
              );
            }
          })
        );
      });

      return Promise.all(promisesList);
    },
  };
};

module.exports.postcss = true;
