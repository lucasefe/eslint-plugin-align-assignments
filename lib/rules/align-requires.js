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
      const texts = group.map(node => sourceCode.getText(node));

      if (!areAligned(texts)) {
        texts.sort((a, b) => {
          const aLower = a.toLowerCase();
          const bLower = b.toLowerCase();
          return aLower < bLower ? -1 : aLower > bLower ? 1 : 0;
        });

        context.report({
          loc: { start: group[0].loc.start, end: getLast(group).loc.end },
          message: 'This group of requires is not aligned',
          fix: fixer => fixer.replaceTextRange(
            [group[0].start, getLast(group).end],
            texts.join('\n')
          ),
        });
      }
    }


    function areAligned(lines) {
      const maxPos = lines
        .map(findAssignment)
        .reduce(getMaxPos);

      return lines
        .map(findAssignment)
        .every(pos => pos === maxPos);
    }

    function findAssignment(line) {
      return line.search('=');
    }

    function getMaxPos(last, current) {
      return Math.max(last, current);
    };

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
