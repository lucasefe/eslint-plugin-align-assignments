/**
 * @fileoverview align-assignment
 * @author Broadly
 */
'use strict';

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    fixable: 'code'
  },

  create(context) {
    const hasRequire = /require\(/;
    const sourceCode = context.getSourceCode();

    const groups = [];
    let previousNode;

    function shouldStartNewGroup(node, previousNode) {
      if (!previousNode) return true;
      if (node.parent !== previousNode.parent) return true;

      const lineOfNode = sourceCode.getFirstToken(node).loc.start.line;
      const lineOfPrev = sourceCode.getLastToken(previousNode).loc.start.line;
      return lineOfNode - lineOfPrev !== 1;
    }


    function check(group) {
      const lines  = group.map(node => sourceCode.getText(node));
      const maxPos = getMaxPos(lines);

      if (!areAligned(maxPos, lines)) {
        context.report({
          loc: { start: group[0].loc.start, end: getLast(group).loc.end },
          message: 'This group of requires is not aligned',
          fix:     function(fixer) {
            const range = [group[0].start, getLast(group).end];
            const fixed = lines.map(function(line) {
              const pos = findAssigment(line);

              if (pos === maxPos)
                return line;

              const spacing = ' '.repeat(maxPos - pos);
              const start   = line.substring(0, pos);
              const ending  = line.substring(pos);

              return start + spacing + ending;
            }).join('\n');

            return fixer.replaceTextRange(range, fixed);
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
  }
};
