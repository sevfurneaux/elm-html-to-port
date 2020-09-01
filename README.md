# elm-html-to-port

This project is an example of sending [Elm HTML](https://package.elm-lang.org/packages/elm/html/latest/) through [a port](https://guide.elm-lang.org/interop/ports.html) as a string and rendering the output in node.

It is a simplified version of [eeue56](https://github.com/eeue56)'s [elm-static-html-lib](https://github.com/eeue56/elm-static-html-lib).

## Requirements

-   [node](https://nodejs.org/)
-   [yarn](http://yarnpkg.com/)

## Installation

Run this command to install the JavaScript dependencies:

```
yarn
```

Run this command to make an HTTP request and output the `view` in Main.elm as a string.

```
yarn start
```

## Credits

-   [eeue56](https://github.com/eeue56)'s original implementation: [elm-static-html-lib](https://github.com/eeue56/elm-static-html-lib). Thank you Noah for your hard work on the original implementation! ❤️
-   [dawehner](https://github.com/dawehner)'s 0.19 forked implementation: [elm-static-html-lib](https://github.com/dawehner/elm-static-html-lib). Thank you David for porting the original implementation to Elm 0.19! 💪