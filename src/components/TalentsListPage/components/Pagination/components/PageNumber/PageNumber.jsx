import React from "react";
import { Button } from "../../../../../../shared/components";
import s from "./PageNumber.module.scss";
import { Link } from "react-router-dom";

export function PageNumber({
    index,
    page,
    size,
    pageNumbers,
    number,
    handlerPage,
    path,
}) {
    return (
        <>
            {index === pageNumbers.length - 1 &&
                page < pageNumbers.length - 3 && <div>...</div>}
            <Link
                className={`${s.page} ${page === index ? s.selected : ""}`}
                key={number}
                to={`/${path}?page=${index}&size=${size}`}
                onClick={() => handlerPage()}
            >
                {number}
            </Link>
            {index === 0 && page > 2 && <div>...</div>}
        </>
    );
}
