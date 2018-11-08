const tests = [
    "inline-styles",
    "inline-style-to-component",
    "get-state",
    "keyframes",
    "es6-class",
    "this-props-spread",
];

const defineTest = require("jscodeshift/dist/testUtils").defineTest;

describe("radium-to-glamor", () => { // eslint-disable-line no-undef
    tests.forEach((test) =>
    defineTest(
      __dirname, // eslint-disable-line no-undef
      "radium-to-glamor",
      null,
      `radium-to-glamor/${test}`
    )
  );
});
