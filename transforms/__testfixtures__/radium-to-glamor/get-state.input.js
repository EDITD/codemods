import React from "react";
import Radium from "radium";

const GetState = React.createClass({
    renderHiddenContent() {
        if (Radium.getState(this.state, "hider", ":hover")) {
            return null;
        }

        return (
            <div>
                I might be hidden
            </div>
        );
    },

    render() {
        return (
            <div>
                <div key={"hider"} style={{ ":hover": {}}}>
                  I might hide you
                </div>
                {this.renderHiddenContent()}
                Hello
          </div>
        );
    },
});

export default Radium(GetState);
