import React from "react";
import Radium from "radium";
import OtherComponent from "./OtherComponent";

const Spreader = React.createClass({

    render() {
        const { ComponentClass, OtherClass } = this.props; // eslint-disable-line react/prop-types

        return (
            <ComponentClass
                {...this.props}
                style={this.getStyles()}
            >
                <div
                    {...this.props}
                    style={this.getDivStyles()}
                >
                    DANGER BECAUSE DOM
                </div>
                <OtherComponent
                    {...this.props}
                    style={this.getDivStyles()}
                >
                    NO DANGER - NO MESSAGE
                </OtherComponent>
                <li
                    {...this.props}
                    otherProp={true}
                >
                    DANGER BECAUSE DOM AND SPREAD
                </li>
                <OtherClass
                    {...this.props}
                    otherProp={true}
                >
                    DANGER BECAUSE VARIABLE AND SPREAD
                </OtherClass>
            </ComponentClass>
        );
    },
});

export default Radium(Spreader);
