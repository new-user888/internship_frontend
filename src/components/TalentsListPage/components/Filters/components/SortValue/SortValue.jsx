import React from "react";
import s from "./SortValue.module.scss";

export function SortValue({ value, selected, ...props}) {
	return (
        <div className={`${s.sort_value} ${selected === value ? s.selected : ""}`}
           {...props}
        >
			{value}
		</div>
	);
}
