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

        return [
            styles,
            this.props.style,
        ];
    },

    render() {
        return (
            <div {...css(this.getStyles())}>
                <div {...css({ marginLeft: 10 })}>
                    <span {...css({ background: "blue" })}>
                        Hello
                    </span>
                </div>
            </div>
        );
    },
});

export default InlineStyles;
