// TODO_RADIUM_TO_GLAMOR - JSX refers to ComponentClass, which is a variable. So wanted behaviour unknown.
import { css } from "glamor";
import React from "react";
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
            <div {...css(this.getStyles())}>
                <Button style={{ background: "blue" }}>
                    Hello
                </Button>
                <ComponentClass style={{ background: "green" }} />
            </div>
        );
    },
});

export default InlineStyles;
