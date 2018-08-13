import test from 'ava';

import postcss from 'postcss';
import postcssImport from 'postcss-import';

import postcssImportExtGlob from '.';

const testPostcss = async (input, output, t, opts = {}) => {
  const plugins = [];

  for (const plugin of opts.pluginsBefore || []) {
    plugins.push(plugin);
  }
  plugins.push(opts.plugin || postcssImportExtGlob());
  for (const plugin of opts.pluginsAfter || []) {
    plugins.push(plugin);
  }

  if (output instanceof Error) {
    t.plan(1);
  } else {
    // t.plan(2);
    t.plan(1);
  }

  await postcss(plugins).process(input, { from: '' }).then(result => {
    if (output instanceof Error) {
      t.fail();
      return;
    }
    t.is(result.css.replace(/\n|\r/g, ' '), output.replace(/\n|\r/g, ' '));
    // t.is(result.warnings().length, 0);
  }).catch(err => {
    if (!(output instanceof Error)) {
      t.fail(err);
      return;
    }
    t.is(err.message, output.message);
  });
};

test('simple test', async t => {
  const input = '@import-glob "fixtures/css/foo/**/*.css";';
  const output = [
    '.bar {',
    '  display: inline-block;',
    '}',
    '.foo {',
    '  display: block;',
    '}'
  ].join(' ');
  await testPostcss(input, output, t, {
    pluginsAfter: [postcssImport()]
  });
});

test('sort option', async t => {
  const input = '@import-glob "fixtures/css/foo/**/*.css";';
  const output = [
    '.foo {',
    '  display: block;',
    '}',
    '.bar {',
    '  display: inline-block;',
    '}'
  ].join(' ');
  await testPostcss(input, output, t, {
    plugin: postcssImportExtGlob({
      sort: 'desc'
    }),
    pluginsAfter: [postcssImport()]
  });
});

test('multiple globs', async t => {
  const input = '@import-glob "fixtures/css/foo/**/*.css"; @import-glob "fixtures/css/*.css";';
  const output = [
    '.bar {',
    '  display: inline-block;',
    '}',
    '.foo {',
    '  display: block;',
    '}',
    'div {',
    '  margin: auto;',
    '}'
  ].join(' ');
  await testPostcss(input, output, t, {
    pluginsAfter: [postcssImport()]
  });
});

test('multiple globs inline', async t => {
  const input = '@import-glob "fixtures/css/foo/**/*.css",  "fixtures/css/*.css";';
  const output = [
    '.bar {',
    '  display: inline-block;',
    '}',
    '.foo {',
    '  display: block;',
    '}',
    'div {',
    '  margin: auto;',
    '}'
  ].join(' ');
  await testPostcss(input, output, t, {
    pluginsAfter: [postcssImport()]
  });
});

test('error empty param test', async t => {
  const input = '@import-glob';
  const output = new Error('No string found with rule @import-glob ');
  await testPostcss(input, output, t, {
    pluginsAfter: [postcssImport()]
  });
});
