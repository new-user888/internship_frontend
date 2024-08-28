import React from "react";
import s from "./NotFoundPage.module.scss";
import img from "./images/notfound.png";
import { Button } from "../../shared/components";
import { Link } from "react-router-dom";

export function NotFoundPage() {
	return (
		<section className={s.notfound_block}>
			<div className={s.image}>
				<img src={img} alt="404" />
			</div>
			<div className={s.text}>This page does not exist</div>
			<div className={s.btn_block}>
				<Link to={'/'}>
					<Button className={s.btn}>Go Home</Button>
				</Link>
			</div>
		</section>
	);
}
