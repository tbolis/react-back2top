#  Back To Top React Component

[![GitHub release][github-image]][github-url]
[![NPM downloads][downloads-image]][downloads-url]
[![CI][ci-image]][ci-url]

A react component to perform a "back to top" action

##  Installation

```sh
npm install --save react-back2top
```

Requires React 16.8 or newer. TypeScript types are included.

##  Usage

```tsx
import React from 'react';
import Back2Top from 'react-back2top';

const Demo = () => (
    <div>
        <h3>Scroll down for the button to appear</h3>

        <Back2Top>&#8679;</Back2Top>

        {/* A long page */}
    </div>
);
```

The component renders an `<a href="#">` with the class `back-to-top` (unstyled, position it with CSS).
Any other anchor attributes (`aria-label`, `style`, `data-*`, ...) are passed through.

##  Example

The examples are served with Vite:

```sh
git clone https://github.com/tbolis/react-back2top.git
npm install
npm start
```

##  Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| alwaysVisible | boolean | false | Make the button always visible |
| fadeDuration | number (ms) | 300 | Duration of fade effect |
| scrollDuration | number (ms) | 800 | Duration of scroll-to-top effect, `0` scrolls instantly |
| visibilityHeight | number (px) | 400 | Scroll offset after which the button becomes visible |
| className | string | `back-to-top` | Class name of the link |
| onClick | function | | Called after the scroll to top starts |

The animation is skipped when the user prefers reduced motion.

## Development

```sh
npm test               # run tests
npm run test:coverage  # with coverage
npm run lint
npm run build
```

## Issues

See https://github.com/tbolis/react-back2top/issues

## Changelog

See https://github.com/tbolis/react-back2top/blob/master/CHANGELOG.md

##  License

MIT, do remember to add a reference if you find it useful :)

[github-image]: https://img.shields.io/github/release/tbolis/react-back2top.svg
[github-url]: https://github.com/tbolis/react-back2top/releases
[npm-image]: https://img.shields.io/npm/v/react-back2top.svg?style=flat
[npm-url]: https://www.npmjs.com/package/react-back2top
[downloads-image]: https://img.shields.io/npm/dm/react-back2top.svg?style=flat
[downloads-url]: https://www.npmjs.com/package/react-back2top
[ci-image]: https://github.com/tbolis/react-back2top/actions/workflows/ci.yml/badge.svg
[ci-url]: https://github.com/tbolis/react-back2top/actions/workflows/ci.yml
