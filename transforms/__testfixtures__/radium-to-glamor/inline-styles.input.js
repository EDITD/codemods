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
        const heyWidth = this.getStyles().width;

        return (
            <div style={this.getStyles()}>
                <div style={this.props.style}>
                    <span style={{ background: "blue" }}>
                        Hello
                    </span>
                    <span style={{ width: heyWidth }}>
                        world
                    </span>
                </div>
            </div>
        );
    },
});

export default Radium(InlineStyles);
