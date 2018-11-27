/**
 * @fileoverview align-assignments
 * @author Lucas Florio
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

const util = require('util');

util.inspect.defaultOptions.depth = 10;

module.exports = {
  meta: {
    fixable: 'code'
  },

  create(context) {
    const { options }  = context;
    const requiresOnly = options && options.length > 0 && options[0].requiresOnly;

    const hasRequire   = /require\(/;
    const spaceMatcher = /(\s*)=/;
    const sourceCode   = context.getSourceCode();

    const groups = [];
    let previousNode;

    return {
      VariableDeclaration(node) {
        const source = sourceCode.getText(node);
        if (requiresOnly && !hasRequire.test(source)) return;

        if (shouldStartNewGroup(node, previousNode))
          groups.push([node]);
        else
          getLast(groups).push(node);

        previousNode = node;
      },

      'Program:exit'(node) {
        groups.forEach(check);
      },
    };

    function shouldStartNewGroup(node, previousNode) {
      // first line of all
      if (!previousNode) return true;

      // switching parent nodes
      if (node.parent !== previousNode.parent)
        return true;

      // previous line was blank.
      const lineOfNode = sourceCode.getFirstToken(node).loc.start.line;
      const lineOfPrev = sourceCode.getLastToken(previousNode).loc.start.line;
      return lineOfNode - lineOfPrev !== 1;
    }


    function check(group) {
      const lines  = group.map(node => sourceCode.getText(node));
      const maxPos = getMaxPos(lines);

      if (!areAligned(maxPos, lines)) {
        context.report({
          loc: {
            start: group[0].loc.start,
            end:   getLast(group).loc.end
          },
          message: 'This group of assignments is not aligned',
          fix:     (fixer) =>  {
            const fixings = group.map(function(node) {
              const hasAssignment = sourceCode
                .getTokens(node)
                .find(token => token.value === '=');

              const line          = sourceCode.getText(node);
              const lineIsAligned = line.charAt(maxPos) === '=';
              if (lineIsAligned || !hasAssignment)
                return fixer.replaceText(node, line);
              else {
                const startAndEnding = line.split('=');
                const start          = startAndEnding[0].replace(/\s+\B/, '');
                const ending         = startAndEnding[1].replace(/\A\s+/, '');
                const spacesRequired = maxPos - start.length;
                const fixedText      = start + ' '.repeat(spacesRequired) + '=' + ending;
                return fixer.replaceText(node, fixedText);
              }
            });

            return fixings.filter(fix => fix);
          }
        });
      }
    }

    function findAssigment(line) {
      const match = line.match(spaceMatcher);
      if (match) {
        return match.index + 1;
      } else
        return null;
    }

    function areAligned(maxPos, lines) {
      return lines
        .filter(line => line.includes('='))
        .every(line => line.charAt(maxPos) === '=');
    }

    function getMaxPos(lines) {
      return lines
        .map(findAssigment)
        .reduce(function(last, current) {
          return Math.max(last, current);
        });
    }

    function getLast(ary) {
      return ary[ary.length - 1];
    }
  }
};
