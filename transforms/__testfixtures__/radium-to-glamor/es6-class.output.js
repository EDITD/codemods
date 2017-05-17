import { css } from "glamor";
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
            <div {...css(this.getStyles())}>
                Hello
          </div>
        );
    }
}

export default Es6Component;
