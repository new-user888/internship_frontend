import React from "react";
import s from "./Textarea.module.scss";

export function Textarea({ children, className, ...props }) {
	return (
        <textarea
            className={`${s.textarea} ${className}`}
            {...props}>
			{children}
		</textarea>
	);
}
