// TODO_RADIUM_TO_GLAMOR - use of Radium.getState() needs to be manually changed
import { css } from "glamor";
import React from "react";

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
                <div key={"hider"} {...css({ ":hover": {}})}>
                  I might hide you
                </div>
                {this.renderHiddenContent()}
                Hello
          </div>
        );
    },
});

export default GetState;
