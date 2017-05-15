// TODO_RADIUM_TO_GLAMOR - call to this.getStyles outside of style prop needs to be looked at
import { css } from "glamor";
import React from "react";

const InlineStyles = React.createClass({

    propTypes: {
        style: React.propTypes.array.isRequired,
    },

    getStyles() {
        const styles = {
            position: "relative",
            marginBottom: 10,
            marginTop: 10,
            float: "left",
            width: 100,
        };

        return css([
            styles,
            this.props.style,
        ]);
    },

    render() {
        const heyWidth = this.getStyles().width;

        return (
            <div {...this.getStyles()}>
                <div {...css(this.props.style)}>
                    <span {...css({ background: "blue" })}>
                        Hello
                    </span>
                    <span {...css({ width: heyWidth })}>
                        world
                    </span>
                </div>
            </div>
        );
    },
});

export default InlineStyles;
