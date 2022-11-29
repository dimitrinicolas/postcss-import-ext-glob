const test = require('ava');
const PostcssTester = require('ava-postcss-tester');

const postcss = require('postcss');
const postcssImport = require('postcss-import');

const postcssImportExtGlob = require('.');

const tester = new PostcssTester({
  postcss,
  plugin: postcssImportExtGlob,
});

test('no @import-blog', async (t) => {
  const input = `
    @import "fixtures/css/foo/**/*.css";
  `;

  const output = `
    @import "fixtures/css/foo/**/*.css";
  `;

  await tester.test(input, output, t);
});

test('simple test', async (t) => {
  const input = `
    @import-glob "fixtures/css/foo/**/*.css";
  `;

  const output = `
    @import "${__dirname}/fixtures/css/foo/bar.css";
    @import "${__dirname}/fixtures/css/foo/foo.css";
  `;

  await tester.test(input, output, t);
});

test('only changing @import-glob at rules', async (t) => {
  const input = `
    @import "fixtures/css/foo/**/*.css";
    @import-glob "fixtures/css/foo/**/*.css";
    @media (max-width: 600px) { .foo { color: red; } }
  `;

  const output = `
    @import "fixtures/css/foo/**/*.css";
    @import "${__dirname}/fixtures/css/foo/bar.css";
    @import "${__dirname}/fixtures/css/foo/foo.css";
    @media (max-width: 600px) { .foo { color: red; } }
  `;

  await tester.test(input, output, t);
});

test('simple test postcss-import', async (t) => {
  const input = `
    @import-glob "fixtures/css/foo/**/*.css";
  `;

  const output = `
    .bar {
      display: inline-block;
    }
    .foo {
      display: block;
    }
  `;

  await tester.test(input, output, t, {
    pluginsAfter: [postcssImport],
  });
});

test('sort option', async (t) => {
  const input = `
    @import-glob "fixtures/css/foo/**/*.css";
  `;

  const output = `
    .foo {
      display: block;
    }
    .bar {
      display: inline-block;
    }
  `;

  await tester.test(input, output, t, {
    pluginOptions: {
      sort: 'desc',
    },
    pluginsAfter: [postcssImport],
  });
});

test('multiple globs', async (t) => {
  const input = `
    @import-glob "fixtures/css/foo/**/*.css";
    @import-glob "fixtures/css/*.css";
  `;

  const output = `
    .bar {
      display: inline-block;
    }
    .foo {
      display: block;
    }
    div {
      margin: auto;
    }
  `;

  await tester.test(input, output, t, {
    pluginsAfter: [postcssImport],
  });
});

test('multiple globs inline', async (t) => {
  const input = `
    @import-glob "fixtures/css/foo/**/*.css", "fixtures/css/*.css";
  `;

  const output = `
    .bar {
      display: inline-block;
    }
    .foo {
      display: block;
    }
    div {
      margin: auto;
    }
  `;

  await tester.test(input, output, t, {
    pluginsAfter: [postcssImport],
  });
});

test('error empty param test', async (t) => {
  const input = `
    @import-glob;
  `;

  await tester.test(
    input,
    (err) => {
      t.true(/No string found with rule @import-glob/.test(err));
    },
    t,
    {
      pluginsAfter: [postcssImport],
    }
  );
});

test('no entries warning', async (t) => {
  const warningsTester = new PostcssTester({
    postcss,
    plugin: postcssImportExtGlob,
    tolerateWarnings: true,
  });
  const input = `
    @import-glob "fixtures/css/_unknow/**/*.css";
  `;
  await warningsTester.test(input, '', t, {
    pluginsAfter: [postcssImport],
  });
});

test('layer test', async (t) => {
  const input = `
    @import-glob "fixtures/css/foo/**/*.css" layer(test);
  `;

  const output = `
    @import "${__dirname}/fixtures/css/foo/bar.css" layer(test);
    @import "${__dirname}/fixtures/css/foo/foo.css" layer(test);
  `;

  await tester.test(input, output, t);
});
