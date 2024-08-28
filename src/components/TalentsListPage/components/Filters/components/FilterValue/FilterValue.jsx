import React, { useCallback, useMemo, useState } from "react";
import s from "./FilterValue.module.scss";

export function FilterValue({ value }) {
	const [checked, setChecked] = useState(false);
	const inputId = useMemo(
		() => `my-input-${Math.random().toString(36).slice(2, 9)}`,
		[]
	);

	const toggleChecked = useCallback(() => {
		setChecked((prev) => !prev);
	}, []);

	return (
		<div className={s.filter_value} onClick={toggleChecked}>
			<input
				type="checkbox"
				id={inputId}
				checked={checked}
				onChange={toggleChecked}
			/>
			<label htmlFor={inputId} />
			<div>{value}</div>
		</div>
	);
}
