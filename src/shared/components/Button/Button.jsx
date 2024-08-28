import React from "react";
import s from "./Button.module.scss";

export function Button({ children, className, ...props }) {
    return (
        <button
            className={`${s.btn} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
