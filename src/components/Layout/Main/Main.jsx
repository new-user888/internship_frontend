import React from "react";
import styles from "./Main.module.scss";

export function Main({ children }) {
	return (
		<main className={styles.main}>
			<div className="__container">{children}</div>
		</main>
	);
}
