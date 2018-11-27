/**
 * @fileoverview align-assignments
 * @author Lucas Florio
 */

'use strict';

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const rule = require('../../../lib').rules['align-assignments'];


const RuleTester = require('eslint').RuleTester;

// ------------------------------------------------------------------------------
// Tests
// ------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2017 } });


ruleTester.run('align-assignments', rule, {
  valid: [
    {
      code: code([
        'const ABC = require()',
        'const A   = require()'
      ])
    },
    {
      code: code([
        'const ABC = require()',
        'const   A = require()'
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
    },
    {
      code: code([
        "const A = require('a')",
        "const ABC = require('abc')",
        "",
        "const { func } = require('a')",
        "const ss       = require('abc')"
      ]),
      output: code([
        "const A   = require('a')",
        "const ABC = require('abc')",
        "",
        "const { func } = require('a')",
        "const ss       = require('abc')"
      ]),
      errors: [
        { message: 'This group of requires is not aligned' }
      ]
    },
    {
      code: code([
        "const A = require('a')",
        "const ABC = require('abc')",
        "",
        "const { func } = require('a')",
        "const ss = require('abc')"
      ]),
      output: code([
        "const A   = require('a')",
        "const ABC = require('abc')",
        "",
        "const { func } = require('a')",
        "const ss       = require('abc')"
      ]),
      errors: [
        { message: 'This group of requires is not aligned' },
        { message: 'This group of requires is not aligned' }
      ]
    }
  ]
});


function code(lines) {
  return lines.join('\n');
}
