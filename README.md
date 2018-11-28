# eslint-plugin-align-assignments 

ESLint rule to enforce alignment of assignment declarations in a group. 

[![Build Status](https://travis-ci.org/lucasefe/eslint-plugin-align-assignments.svg?branch=master)](https://travis-ci.org/lucasefe/eslint-plugin-align-assignments)

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm install eslint --save-dev
```

Next, install `eslint-plugin-align-assignments`:

```
$ npm install eslint-plugin-align-assignments --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must
also install `eslint-plugin-align-assignmentss` globally.

## Usage

Add `align-assignments` to the plugins section of your `.eslintrc` configuration
file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": [
    "align-assignments"
  ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "align-assignments/align-assignments": [2, { "requiresOnly": false } ]
  }
}
```



