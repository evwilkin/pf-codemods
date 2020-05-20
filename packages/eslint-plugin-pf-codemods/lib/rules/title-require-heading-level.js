const { getPackageImports } = require('../helpers');

// #4 and #5 from https://github.com/patternfly/patternfly-react/pull/3922
module.exports = {
  create: function(context) {
    const titleImports = getPackageImports(context, '@patternfly/react-core')
      .filter(specifier => specifier.imported.name === 'Title');

    return !titleImports ? {} : {
      JSXOpeningElement(node) {
        if (titleImports.map(imp => imp.local.name).includes(node.name.name)) {
          if (!node.attributes.map(node => node.name.name).includes('headingLevel')) {
            context.report({
              node,
              message: `headingLevel attribute is required for ${node.name.name}`,
              fix(fixer) {
                return fixer.insertTextAfter(node.name, ' headingLevel="h2"');
              }
            });
          }
        }
      }
    };
  }
};