import React, { useCallback, useEffect, useState } from "react";
import s from "./Filter.module.scss";

export function Filter({children, field}) {
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");

	const toggleOpen = useCallback(() => {
		setOpen((prev) => !prev);
	}, []);

	useEffect(() => {
		if (field !== "") {
			const res = field.split('_').join(' ');
			setTitle(res);
		}
	}, [field])

	return (
		<div className={s.filter}>
			<div className={`${s.filter_title} ${open ? s.opened : ""}`} onClick={toggleOpen}>
				{title}
			</div>
			<div className={`${s.filter_values} ${open ? s.show : s.hide}`}>
				{children}
			</div>
		</div>
	);
}
