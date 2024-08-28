import React from "react";
import s from "./Links.module.scss";
import { Input } from "../../../../../../shared/components";


export function Links({links, setLinks, el}) {
    return (
        <div className={s.input_block}>
            <div className={s.input_delete}>
				<Input
					type="text"
					value={el.link}
					placeholder="link"
					autoComplete="off"
					className={`${el.state ? "" : s.error}`}
					onChange={(event) =>
						setLinks(
							links.map((obj) => {
								if (obj.id === el.id) {
									return { ...obj, link: event.target.value };
								}
								return obj;
							})
						)
					}
				/>
				<button disabled={links.length === 1} onClick={() => setLinks((current) => current.filter((link) => link.id !== el.id))}></button>
			</div>
            <span>{el.state ? "" : el.error}</span>
        </div>
    );
}
