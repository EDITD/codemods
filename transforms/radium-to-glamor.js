function isCapitalized(node) {
    const firstCharacter = node.charAt(0);

    return firstCharacter.toUpperCase() === firstCharacter;
}

function getJSXComponentNameFromAttributePath(path) {
    return path.parent.value.name.name;
}

function isJSXAttributeOfDOMComponent(path) {
    const name = getJSXComponentNameFromAttributePath(path);
    return name != null && !isCapitalized(name);
}

function isJSXAttributeOfVariableComponent(path, defaultImports) {
    const name = getJSXComponentNameFromAttributePath(path);
    return name == null || (defaultImports.indexOf(name) < 0 && isCapitalized(name));
}

function insertAtTopOfFile(source, j, nodeToBeInserted) {
    source
    .find(j.ImportDeclaration)
    .at(0)
    .insertBefore(nodeToBeInserted);
}

function hasGlamorImport(source, j) {
  return source.find(j.ImportDeclaration, {
    source: {
      type: 'Literal',
      value: 'glamor',
    }
  }).length > 0;
}


export default function transformer(file, api) {
    const j = api.jscodeshift;

    const source = j(file.source);
    const defaultImports = [];
    let cssCallCounter = 0;


  // Remove Radium component wrapper
    source
    .find(j.CallExpression, {
        callee: {
            type: "Identifier",
            name: "Radium",
        },
    })
    .forEach((path) => {
        const argument = path.node.arguments[0];
        j(path).replaceWith(argument);
    });


  // find all the defaultImports
    source
    .find(j.ImportDefaultSpecifier, {
        type: "ImportDefaultSpecifier",
        local: {
            type: "Identifier",
        },
    })
    .forEach((path) => {
        defaultImports.push(path.value.local.name);
    });


  // Add comments where variables are used as identifiers
    source
    .find(j.JSXAttribute, {
        name: {
            type: "JSXIdentifier",
            name: "style",
        },
    })
    .forEach((path) => {
        if (isJSXAttributeOfVariableComponent(path, defaultImports)) {
            const identifier = getJSXComponentNameFromAttributePath(path);
            const text = `// TODO_RADIUM_TO_GLAMOR - JSX refers to ${identifier}, which is a variable. So wanted behaviour unknown.`;
            insertAtTopOfFile(source, j, text);
        }
    });

  // Find any spread of this.props that can't be statically analysed and warn about it
    source
    .find(j.JSXSpreadAttribute)
    .filter((path) => (
        isJSXAttributeOfDOMComponent(path) ||
        isJSXAttributeOfVariableComponent(path, defaultImports)
    ))
    .forEach((path) => {
        const thisPropsDescendents = j(path).find(j.MemberExpression, {
            object: {
                type: "ThisExpression",
            },
            property: {
                type: "Identifier",
                name: "props",
            },
        });

        if (thisPropsDescendents.length === 0) {
            return;
        }

        const siblingAttributes = path.parentPath.node.attributes;
        const indexOfSpread = siblingAttributes.indexOf(path.value);
        const postSpreadSiblings = siblingAttributes.slice(indexOfSpread + 1);
        const styleAttributesPostSpread = j(postSpreadSiblings).filter((siblingPath) => {
            const { value } = siblingPath;
            return value.type === "JSXAttribute" && value.name.name === "style";
        });

        if (styleAttributesPostSpread.length > 0) {
            const componentName = path.parentPath.node.name.name;
            const text = `// TODO_RADIUM_TO_GLAMOR - In JSX the props for component, ${componentName}, contains a spread which references this.props, followed by a style prop. It's not safe to assume that this is safe because the style prop has been removed`;
            insertAtTopOfFile(source, j, text);
        }
    });


  // Replace all the object literals with calls to the CSS function
    source
    .find(j.JSXAttribute, {
        name: {
            type: "JSXIdentifier",
            name: "style",
        },
        value: {
            type: "JSXExpressionContainer",
        },
    })
    .filter(isJSXAttributeOfDOMComponent)
    .forEach((path) => {
        cssCallCounter += 1;
        j(path).replaceWith(
        j.jsxSpreadAttribute(
            j.callExpression(
               j.identifier("css"),
               [path.node.value.expression]
            )
          )
      );
    });

  // keyframes
    source.find(j.CallExpression, {
        callee: {
            type: "MemberExpression",
            object: {
                type: "Identifier",
                name: "Radium",
            },
            property: {
                type: "Identifier",
                name: "keyframes",
            },
        },
    })
    .forEach((path) => {
        const args = path.value.arguments;

        if (args.length === 2) {
            args.reverse();
        }

        j(path).replaceWith(
          j.callExpression(
              j.memberExpression(j.identifier("css"), j.identifier("keyframes")),
                args
            )
        );

        cssCallCounter++;
    });


    const getStateCalls = source.find(j.CallExpression, {
        callee: {
            type: "MemberExpression",
            object: {
                type: "Identifier",
                name: "Radium",
            },
            property: {
                type: "Identifier",
                name: "getState",
            },
        },
    });


  // Add todo comment where Radium.getState is used and needs to be fixed manually
    if (getStateCalls.length > 0) {
        insertAtTopOfFile(source, j, "// TODO_RADIUM_TO_GLAMOR - use of Radium.getState() needs to be manually changed");
    }


  // import glamor where needed
    if (cssCallCounter > 0 && !hasGlamorImport(source, j)) {
        insertAtTopOfFile(source, j, "import { css } from \"glamor\";");
    }


  // Remove Radium import
    source
      .find(j.ImportDeclaration, {
          source: {
              value: "radium",
          },
      })
      .forEach((path) => {
          j(path).remove();
      });


    return source.toSource();
}


module.exports.parser = "flow";
