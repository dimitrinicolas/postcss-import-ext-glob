# postcss-import-ext-glob [![Build Status][travis badge]][travis link] [![Coverage Status][coveralls badge]][coveralls link]
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdimitrinicolas%2Fpostcss-import-ext-glob.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdimitrinicolas%2Fpostcss-import-ext-glob?ref=badge_shield)

A [PostCSS][postcss] plugin to extend [postcss-import][postcss-import] path 
resolver to allow [glob][glob ref] usage as a path.

You must use this plugin along with [postcss-import][postcss-import], place 
this plugin **before** `postcss-import`.

```pcss
@import-glob "components/**/*.css";
```

## Installation

```console
$ npm install postcss-import-ext-glob
```

## Usage

```js
// PostCSS plugins
postcss([
  require('postcss-import-ext-glob'),
  require('postcss-import')
]);
```

Check out [PostCSS](https://github.com/postcss/postcss) docs for the complete 
installation.

### Example

This plugin transform this:

```pcss
@import-glob "components/**/*.css";
```

into this:

```pcss
@import "components/form/input.css";
@import "components/form/submit.css";
/* etc */
```

Thereby, the plugin `postcss-import` can now import each file.

You can pass multiple globs in one:

```pcss
@import-glob "helpers/**/*.css", "components/**/*.css";
```

## Options

You can pass a `sort` option to this plugin with a value of "asc" or "desc":

```js
// Postcss plugins
postcss([
  require('postcss-import-ext-glob')({
    sort: 'desc'
  }),
  require('postcss-import')
]);
```

The sort order is by default ascending.

## Related

- [postcss-import][postcss-import] - PostCSS plugin to inline @import rules 
content
- [fast-glob][fast-glob] - Module used for getting glob entries
- [fast-sort][fast-sort] - Module used for sorting glob entries
- [ava-postcss-tester][ava-postcss-tester] - Simply test your PostCSS plugin 
with AVA

## License

This project is licensed under the [MIT license](LICENSE).

[travis badge]: https://travis-ci.org/dimitrinicolas/postcss-import-ext-glob.svg?branch=master
[travis link]: https://travis-ci.org/dimitrinicolas/postcss-import-ext-glob
[coveralls badge]: https://coveralls.io/repos/github/dimitrinicolas/postcss-import-ext-glob/badge.svg?branch=master
[coveralls link]: https://coveralls.io/github/dimitrinicolas/postcss-import-ext-glob?branch=master

[postcss]: https://github.com/postcss/postcss
[postcss-import]: https://github.com/postcss/postcss-import
[fast-glob]: https://www.npmjs.com/package/fast-glob
[fast-sort]: https://www.npmjs.com/package/fast-sort
[ava-postcss-tester]: https://github.com/dimitrinicolas/ava-postcss-tester

[glob ref]: https://en.wikipedia.org/wiki/Glob_(programming)


[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fdimitrinicolas%2Fpostcss-import-ext-glob.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fdimitrinicolas%2Fpostcss-import-ext-glob?ref=badge_large)