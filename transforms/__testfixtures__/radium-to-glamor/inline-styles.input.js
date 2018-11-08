import { css } from "glamor";
import React from "react";
import Radium from "radium";

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
            <div style={this.getStyles()}>
                <div {...css({ marginLeft: 10 })}>
                    <span style={{ background: "blue" }}>
                        Hello
                    </span>
                </div>
            </div>
        );
    },
});

export default Radium(InlineStyles);
