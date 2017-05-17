import React from "react";

class Es6Component extends React.Component {

    getStyles() {
        return {
            backgroundColor: "red",
            color: "white",
            padding: 5,
        };
    }

    render() {
        return (
            <div style={this.getStyles()}>
                Hello
          </div>
        );
    }
}

export default Radium(Es6Component);
