function isCapitalized(node) {
    const firstCharacter = node.charAt(0);

    return firstCharacter.toUpperCase() === firstCharacter;
}

function isJSXAttributeOfDOMComponent(path) {
    const identifier = path.parent.value.name.name;
    return identifier != null && !isCapitalized(identifier);
}

function insertAtTopOfFile(source, j, nodeToBeInserted) {
    source
    .find(j.ImportDeclaration)
    .at(0)
    .insertBefore(nodeToBeInserted);
}


export default function transformer(file, api) {
    const j = api.jscodeshift;

    const source = j(file.source);
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


  // find all the imports
    const imports = [];
    source
    .find(j.ImportDefaultSpecifier, {
        type: "ImportDefaultSpecifier",
        local: {
            type: "Identifier",
        },
    })
    .forEach((path) => {
        imports.push(path.value.local.name);
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
        const identifier = path.parent.value.name.name;

        if (identifier == null || (imports.indexOf(identifier) < 0 && isCapitalized(identifier))) {
            const text = `// TODO_RADIUM_TO_GLAMOR - JSX refers to ${identifier}, which is a variable. So wanted behaviour unknown.`;
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
    .filter((path) => path.value.value.expression.type !== "CallExpression")
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


  // Find all style functions
    const styleFunctions = [];
    source
  .find(j.JSXAttribute, {
      name: {
          type: "JSXIdentifier",
          name: "style",
      },
      value: {
          type: "JSXExpressionContainer",
          expression: {
              type: "CallExpression",
              callee: {
                  type: "MemberExpression",
                  property: {
                      type: "Identifier",
                  },
              },
          },
      },
  })
 .filter(isJSXAttributeOfDOMComponent)
  .forEach((path) => {
      const functionName = path.value.value.expression.callee.property.name;
      styleFunctions.push(functionName);

      j(path).replaceWith(
      j.jsxSpreadAttribute(path.node.value.expression)
    );
  });


  // Find style function calls outside
    styleFunctions.forEach((styleFunction) => {
        source.find(j.CallExpression, {
            callee: {
                type: "MemberExpression",
                object: {
                    type: "ThisExpression",
                },
                property: {
                    type: "Identifier",
                    name: styleFunction,
                },
            },
        })
    .filter((path) => path.parent.value.type !== "JSXSpreadAttribute")
    .forEach(() => {
        insertAtTopOfFile(source, j, `// TODO_RADIUM_TO_GLAMOR - call to this.${styleFunction} outside of style prop needs to be looked at`);
    });
    });

  // Add css function to all style function return statements
    source
    .find(j.CallExpression, {
        callee: {
            type: "MemberExpression",
            property: {
                name: "createClass",
            },
        },
    }).forEach((path) => {
        j(path).find(j.Property).forEach((property) => {
            const identifier = property.value.key.name;
            if (styleFunctions.indexOf(identifier) >= 0) {
                cssCallCounter++;
                j(property).find(j.ReturnStatement).forEach((returnStatement) => {
                    j(returnStatement).replaceWith(
              j.returnStatement(
                j.callExpression(
                   j.identifier("css"),
                   [returnStatement.value.argument]
                )
              )
            );
                });
            }
        });
    });


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
    if (cssCallCounter > 0) {
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
