import { css } from "glamor";

export const anonKeyframes = css.keyframes({
    "0%": { width: "10%" },
    "50%": { width: "50%" },
    "100%": { width: "10%" },
});

export const namedKeyframes = css.keyframes("name", {
    "0%": { width: "10%" },
    "50%": { width: "50%" },
    "100%": { width: "10%" },
});
