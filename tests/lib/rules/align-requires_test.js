/**
 * @fileoverview align-requires
 * @author Lucas Florio
 */

'use strict';

const util = require('util');
util.inspect.defaultOptions.depth = 10;

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib').rules['align-requires'];


const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2017 } });


ruleTester.run('align-requires', rule, {
  valid: [
    {
      code: code([
        'const ABC = require()',
        'const A   = require()'
      ])
    }
  ],
  invalid: [
    {
      code: code([
        "const A = require('a')",
        "const ABC = require('abc')"
      ]),
      output: code([
        "const A   = require('a')",
        "const ABC = require('abc')"
      ]),
      errors: [{ message: 'This group of requires is not aligned' }]
    }
  ]
});


function code(lines) {
  return lines.join('\n');
}
