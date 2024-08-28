import React from "react";
import s from "./Input.module.scss";

export function Input({ children, className, ...props }) {
	return (
        <input
            className={`${s.input} ${className}`}
            {...props}>
			{children}
		</input>
	);
}
