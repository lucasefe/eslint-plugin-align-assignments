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
    },
    {
      code: code([
        'const ABC = require()',
        'const   A = 1'
      ])
    },
    {
      code: code([
        'const ABC = require()',
        'let hola'
      ])
    },
    {
      code: code([
        'const options = {',
        '  compress:             true,',
        '  sourceMap:            {',
        '    sourceMapURL:       `${mapFilename}?v=${version}`,',
        '    sourceMapFilename:  filename',
        '  }',
        '};'
      ])
    }
  ],
  invalid: [
    {
      code: code([
        "const A = require('a');",
        "const ABC = require('abc')"
      ]),
      output: code([
        "const A   = require('a');",
        "const ABC = require('abc')"
      ]),
      errors: [{ message: 'This group of assignments is not aligned' }]
    },
    {
      code: code([
        "const A = require('a')",
        "const ABC = 1"
      ]),
      output: code([
        "const A   = require('a')",
        "const ABC = 1"
      ]),
      errors: [{ message: 'This group of assignments is not aligned' }]
    },
    {
      code: code([
        "const a = require('a')",
        "const bbb   = require('abc')",
        "const cc         = require('abc')"
      ]),
      output: code([
        "const a   = require('a')",
        "const bbb = require('abc')",
        "const cc  = require('abc')"
      ]),
      errors: [
        { message: 'This group of assignments is not aligned' }
      ]
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
        { message: 'This group of assignments is not aligned' }
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
        { message: 'This group of assignments is not aligned' },
        { message: 'This group of assignments is not aligned' }
      ]
    },
    {
      code: code([
        'const ABC = require()',
        'let hola',
        'const A = require()',
      ]),
      output: code([
        'const ABC = require()',
        'let hola',
        'const A   = require()'
      ]),
      errors: [
        { message: 'This group of assignments is not aligned' }
      ]
    },
    {
      code: code([
        'const options        = {',
        '  compress:             true,',
        '  sourceMap:            {',
        '    sourceMapURL:       `${mapFilename}?v=${version}`,',
        '    sourceMapFilename:  filename',
        '  }',
        '};'
      ]),
      output: code([
        'const options = {',
        '  compress:             true,',
        '  sourceMap:            {',
        '    sourceMapURL:       `${mapFilename}?v=${version}`,',
        '    sourceMapFilename:  filename',
        '  }',
        '};'
      ]),
      errors: [
        { message: 'This group of assignments is not aligned' }
      ]
    }
  ]
});


ruleTester.run('align-assignments', rule, {
  valid: [
    {
      options: [ { requiresOnly: true } ],
      code: code([
        'const ABC = require()',
        'const A = 1'
      ])
    },
    {
      options: [ { requiresOnly: true } ],
      code: code([
        'const ABC = require()',
        'const hh  = require()',
        'const H   = require()',
        'const A = 1'
      ])
    },
    {
      options: [ { requiresOnly: true } ],
      code: code([
        'const ABC = require()',
        'const A = 1',
        'const hh = require()',
        'const H  = require()'
      ])
    }
  ],
  invalid: [
    {
      options: [ { requiresOnly: true } ],
      code: code([
        'const ABC = require()',
        'const hh = require()',
        'const H = require()',
        'const A = 1'
      ]),
      output: code([
        'const ABC = require()',
        'const hh  = require()',
        'const H   = require()',
        'const A = 1'
      ]),
      errors: [{ message: 'This group of assignments is not aligned' }]
    }
  ]
});


function code(lines) {
  return lines.join('\n');
}
