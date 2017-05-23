// TODO_RADIUM_TO_GLAMOR - JSX refers to ComponentClass, which is a variable. So wanted behaviour unknown.
// TODO_RADIUM_TO_GLAMOR - In JSX the props for component, ComponentClass, contains a spread which references this.props. It's not safe to assume that this is safe because it might contain a style prop that'll no longer be reconciled by Radium
// TODO_RADIUM_TO_GLAMOR - In JSX the props for component, div, contains a spread which references this.props. It's not safe to assume that this is safe because it might contain a style prop that'll no longer be reconciled by Radium
// TODO_RADIUM_TO_GLAMOR - In JSX the props for component, li, contains a spread which references this.props. It's not safe to assume that this is safe because it might contain a style prop that'll no longer be reconciled by Radium
// TODO_RADIUM_TO_GLAMOR - In JSX the props for component, OtherClass, contains a spread which references this.props. It's not safe to assume that this is safe because it might contain a style prop that'll no longer be reconciled by Radium
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

export default Spreader;
