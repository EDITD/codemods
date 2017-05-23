// TODO_RADIUM_TO_GLAMOR - JSX refers to ComponentClass, which is a variable. So wanted behaviour unknown.
// TODO_RADIUM_TO_GLAMOR - In JSX the props for component, ComponentClass, contains a spread which references this.props, followed by a style prop. It's not safe to assume that this is safe because the style prop has been removed
// TODO_RADIUM_TO_GLAMOR - In JSX the props for component, div, contains a spread which references this.props, followed by a style prop. It's not safe to assume that this is safe because the style prop has been removed
import { css } from "glamor";
import React from "react";
import OtherComponent from "./OtherComponent";

const Spreader = React.createClass({

    render() {
        const { ComponentClass, OtherClass } = this.props; // eslint-disable-line react/prop-types

        return (
            <ComponentClass
                {...this.props}
                style={this.getStyles()}
            >
                <div {...this.props} {...css(this.getDivStyles())}>
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
                  NO DANGER BECAUSE NO STYLE
                </li>
                <OtherClass
                    {...this.props}
                    otherProp={true}
                >
                  NO DANGER BECAUSE NO STYLE
                </OtherClass>
            </ComponentClass>
        );
    },
});

export default Spreader;
