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
    },
    {
      // it doesn't align assignments that are not on the first line.
      code: code([
        'const options = args.pop();',
        'const [',
        '  time',
        '] = args;'
      ])
    },
    {
      code: code([
        'let ABC  = require()',
        'ABC.name = 12;'
      ])
    },
    {
      code: code([
        'ABC.name = 12;',
        'let ABC  = require()'
      ])
    },
    {
      code: code([
        'async function go() {',
        '  ABC.name  = 9999999999;',
        '  let fetch = require(8);',
        '  response  = await fetch({',
        '    method: "post",',
        '    url:    `https://webapp.broadly.test/business/${business.id}/customer`,',
        '    auth:   { bearer: token },',
        '    json:   {',
        '      name: {',
        '        full: "Assaf Arkin"',
        '      }',
        '    }',
        '  });',
        '}'
      ])
    },
    {
      code: code([
        'let ABC  = require()',
        'ABC.name = 12;',
        "browser.focus('[name=name]')"
      ])
    },
    {
      code: code([
        'for (let i = outArray.length - 1; i >= 0; i--)',
        '  out += outArray[i].toString(toBase);'
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
        'const ABC = 1'
      ]),
      output: code([
        "const A   = require('a')",
        'const ABC = 1'
      ]),
      errors: [{ message: 'This group of assignments is not aligned' }]
    },
    {
      code: code([
        "const a = require('a')",
        "bbb = 'dd'",
        'ccc.hola = 3'
      ]),
      output: code([
        "const a  = require('a')",
        "bbb      = 'dd'",
        'ccc.hola = 3'
      ]),
      errors: [
        { message: 'This group of assignments is not aligned' }
      ]
    },
    {
      code: code([
        "const a = require('a')",
        "bbb = 'dd'",
        "browser.focus('[name=name]').value   = 1"
      ]),
      output: code([
        "const a                            = require('a')",
        "bbb                                = 'dd'",
        "browser.focus('[name=name]').value = 1"
      ]),
      errors: [
        { message: 'This group of assignments is not aligned' }
      ]
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
        '',
        "const { func } = require('a')",
        "const ss       = require('abc')"
      ]),
      output: code([
        "const A   = require('a')",
        "const ABC = require('abc')",
        '',
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
        '',
        "const { func } = require('a')",
        "const ss = require('abc')"
      ]),
      output: code([
        "const A   = require('a')",
        "const ABC = require('abc')",
        '',
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
        'function req() {',
        '  const ABC = require()',
        '  let hola',
        '  const A = require()',
        '}'
      ]),
      output: code([
        'function req() {',
        '  const ABC = require()',
        '  let hola',
        '  const A   = require()',
        '}'
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
    },
    {
      // it doesn't align assignments that are not on the first line.
      code: code([
        'const options      = args.pop();',
        'const [',
        '  time',
        '] = args;'
      ]),
      output: code([
        'const options = args.pop();',
        'const [',
        '  time',
        '] = args;'
      ]),
      errors: [
        { message: 'This group of assignments is not aligned' }
      ]
    },
    {
      code: code([
        'async function go() {',
        '  ABC.name = 9999999999;',
        '  let fetch = require(8);',
        '  responsividad  = await fetch({',
        '    method: "post",',
        '    url:    `https://webapp.broadly.test/business/${business.id}/customer`,',
        '    auth:   { bearer: token },',
        '    json:   {',
        '      name: {',
        '        full: "Assaf Arkin"',
        '      }',
        '    }',
        '  });',
        '}'
      ]),
      output: code([
        'async function go() {',
        '  ABC.name      = 9999999999;',
        '  let fetch     = require(8);',
        '  responsividad = await fetch({',
        '    method: "post",',
        '    url:    `https://webapp.broadly.test/business/${business.id}/customer`,',
        '    auth:   { bearer: token },',
        '    json:   {',
        '      name: {',
        '        full: "Assaf Arkin"',
        '      }',
        '    }',
        '  });',
        '}'
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
      options: [{ requiresOnly: true }],
      code:    code([
        'const ABC = require()',
        'const A = 1'
      ])
    },
    {
      options: [{ requiresOnly: true }],
      code:    code([
        'const ABC = require()',
        'const hh  = require()',
        'const H   = require()',
        'const A = 1'
      ])
    },
    {
      options: [{ requiresOnly: true }],
      code:    code([
        'const ABC = require()',
        'const A = 1',
        'const hh = require()',
        'const H  = require()'
      ])
    }
  ],
  invalid: [
    {
      options: [{ requiresOnly: true }],
      code:    code([
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

ruleTester.run('align-assignments', rule, {
  valid: [
    {
      code:    code([
        'let A = 1',
        'A    += 1'
      ])
    },
    {
      code:    code([
        'A  = 1',
        'B += 1'
      ])
    },
    {
      code:    code([
        'A   = 1',
        'B >>= 1'
      ])
    },
    {
      code:    code([
        'A    = 1',
        'B >>>= 1'
      ])
    },
    {
      code:    code([
        'A   -= 1',
        'B >>>= 1',
        'C    = 1',
        'D  <<= 1'
      ])
    },
    {
      code:    code([
        'A >>>= 1',
        'B  **= 1',
        'C  >>= 1',
        'D  <<= 1',
        'E   |= 1',
        'F   ^= 1',
        'G   &= 1',
        'H   %= 1',
        'I   /= 1',
        'J   *= 1',
        'K   -= 1',
        'L   += 1',
        'M    = 1'
      ])
    }
  ],
  invalid: [
    {
      code:    code([
        'let A = 0',
        'A += 1'
      ]),
      output:    code([
        'let A = 0',
        'A    += 1'
      ]),
      errors: [{ message: 'This group of assignments is not aligned' }]
    },
    {
      code:    code([
        'A = 1',
        'B += 1'
      ]),
      output: code([
        'A  = 1',
        'B += 1'
      ]),
      errors: [{ message: 'This group of assignments is not aligned' }]
    },
    {
      code:    code([
        'A = 1',
        'B >>= 1'
      ]),
      output: code([
        'A   = 1',
        'B >>= 1'
      ]),
      errors: [{ message: 'This group of assignments is not aligned' }]
    },
    {
      code:    code([
        'A = 1',
        'B >>>= 1'
      ]),
      output: code([
        'A    = 1',
        'B >>>= 1'
      ]),
      errors: [{ message: 'This group of assignments is not aligned' }]
    },
    {
      code:    code([
        'A -= 1',
        'B >>>= 1',
        'C = 1',
        'D <<= 1'
      ]),
      output: code([
        'A   -= 1',
        'B >>>= 1',
        'C    = 1',
        'D  <<= 1'
      ]),
      errors: [{ message: 'This group of assignments is not aligned' }]
    },
    {
      code:    code([
        'A >>>= 1',
        'B **= 1',
        'C >>= 1',
        'D <<= 1',
        'E |= 1',
        'F ^= 1',
        'G &= 1',
        'H %= 1',
        'I /= 1',
        'J *= 1',
        'K -= 1',
        'L += 1',
        'M = 1'
      ]),
      output: code([
        'A >>>= 1',
        'B  **= 1',
        'C  >>= 1',
        'D  <<= 1',
        'E   |= 1',
        'F   ^= 1',
        'G   &= 1',
        'H   %= 1',
        'I   /= 1',
        'J   *= 1',
        'K   -= 1',
        'L   += 1',
        'M    = 1'
      ]),
      errors: [{ message: 'This group of assignments is not aligned' }]
    }
  ]
});


function code(lines) {
  return lines.join('\n');
}
