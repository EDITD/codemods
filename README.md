## EDITED codemods

This repository contains a codemod script for converting React codebases from Radium to glamor automatically. Eventually this will become a place for all sorts of JS migrations, but there's just one for now.

### Setup & Run

  * `npm install -g jscodeshift`
  * `git clone https://github.com/EDITD/codemods.git` or download a zip file
    from `https://github.com/EDITD/codemods/archive/master.zip`
  * Run `npm install` or `yarn` in the codemods directory
  * `jscodeshift -t <codemod-script> <path> --parser=flow --extensions=js,jsx`
  * Use the `-d` option for a dry-run and use `-p` to print the output
    for comparison

### Included Scripts

#### `radium-to-glamor`

This does a few things in order to move a codebase from Radium to glamor completely.

* Removes all `Radium` imports and calls
* Converts `style={someStyles}` to `{...css(someStyles)}` in JSX when the components are DOM components from React. Props to any other components are left as they are. If it's not possible to statically analyse whether the expression should be spread and passed into `css` then we add comments leading with `TODO_RADIUM_TO_GLAMOR`.
* Adds `import { css } from "glamor"` to all files that need it

### Recast Options

Options to [recast](https://github.com/benjamn/recast)'s printer can be provided
through the `printOptions` command line argument

```sh
jscodeshift -t transform.js <path> --printOptions='{"quote":"double"}'
```

### Support and Contributing

Please feel free to make a Pull Request with any improvements!
