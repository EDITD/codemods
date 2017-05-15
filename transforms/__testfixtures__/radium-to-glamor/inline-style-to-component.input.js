import React from "react";
import Radium from "radium";
import Button from "./Button";

const InlineStyles = React.createClass({

    propTypes: {
        ComponentClass: React.propTypes.func.isRequired,
    },

    getStyles() {
        return {
            borderWidth: 1,
            borderColor: "red",
            borderStyle: "solid",
        };
    },

    render() {
        const { ComponentClass } = this.props;

        return (
            <div style={this.getStyles()}>
                <Button style={{ background: "blue" }}>
                    Hello
                </Button>
                <ComponentClass style={{ background: "green" }} />
            </div>
        );
    },
});

export default Radium(InlineStyles);
