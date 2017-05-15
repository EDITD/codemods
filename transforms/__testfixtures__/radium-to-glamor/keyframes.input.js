import Radium from "radium";

export const anonKeyframes = Radium.keyframes({
    "0%": { width: "10%" },
    "50%": { width: "50%" },
    "100%": { width: "10%" },
});

export const namedKeyframes = Radium.keyframes({
    "0%": { width: "10%" },
    "50%": { width: "50%" },
    "100%": { width: "10%" },
}, "name");
