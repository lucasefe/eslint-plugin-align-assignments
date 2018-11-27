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
    const hasRequire = /require\(/;
    const sourceCode = context.getSourceCode();

    const groups = [];
    let previousNode;

    return {
      VariableDeclaration(node) {
        const source = sourceCode.getText(node);
        if (!hasRequire.test(source)) return;

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
      if (node.parent !== previousNode.parent) return true;

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
          message: 'This group of requires is not aligned',
          fix:     (fixer) =>  {
            return group.map(function(node) {
              const line  = sourceCode.getText(node);
              const pos   = findAssigment(line);
              const lineIsAligned = pos === maxPos;
              if (lineIsAligned)
                return fixer.replaceText(node, line);
              else {
                const spacing = ' '.repeat(maxPos - pos);
                const start   = line.substring(0, pos);
                const ending  = line.substring(pos);
                const fixed   = start + spacing + ending;
                return fixer.replaceText(node, fixed);
              }
            });
          }
        });
      }
    }

    function findAssigment(line) {
      return line.search('=');
    }

    function areAligned(maxPos, lines) {
      return lines
        .map(findAssigment)
        .every(pos => pos === maxPos);
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
