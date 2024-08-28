import React, { useContext, useMemo } from "react";
import { PageNumber } from "./components/PageNumber";
import s from "./Pagination.module.scss";
import { TalentsContext } from "../../../../context/TalentsContext";
import { Button } from "../../../../shared/components";
import { Link } from "react-router-dom";

export function Pagination({ countOfPages, page, size, path }) {
    const pageNumbers = useMemo(() => {
        let arr = [];
        for (let i = 0; i < countOfPages; i++) {
            arr.push(i + 1);
        }
        return arr;
    }, [countOfPages]);

    const handlerPage = () => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
        // if (i >= 0 && i < countOfPages) {
        // 	setPage(i)
        // }
    };

    return (
        <>
            {countOfPages > 1 ? (
                <div className={s.pagination}>
                    <Link
                        className={s.left}
                        to={`/${path}?page=${
                            page - 1 >= 0 ? page - 1 : page
                        }&size=${size}`}
                        onClick={() => handlerPage()}
                    ></Link>

                    <div className={s.pages}>
                        {pageNumbers.map((number, index) => {
                            const pageJSX = (
                                <PageNumber
                                    key={index}
                                    index={index}
                                    page={page}
                                    size={size}
                                    pageNumbers={pageNumbers}
                                    number={number}
                                    handlerPage={handlerPage}
                                    path={path}
                                />
                            );
                            if (index >= page - 1 && index <= page + 1) {
                                // three numbers are always displayed
                                return pageJSX;
                            }
                            if (page === 0 || page === pageNumbers.length - 1) {
                                // three numbers are always displayed, even if it`s start or end position
                                if (index >= page - 2 && index <= page + 2) {
                                    return pageJSX;
                                }
                            }
                            if (index === 0 && page >= 2) {
                                // first page are always displayed if selected page index is equal or more than 3
                                return pageJSX;
                            }
                            if (
                                index === pageNumbers.length - 1 &&
                                page <= pageNumbers.length - 3
                            ) {
                                // last page are always displayed if selected page index is equal or less than 3
                                return pageJSX;
                            }
                            return "";
                        })}
                    </div>
                    <Link
                        className={s.right}
                        to={`/${path}?page=${
                            page + 1 < countOfPages ? page + 1 : page
                        }&size=${size}`}
                        onClick={() => handlerPage()}
                    ></Link>
                </div>
            ) : (
                ""
            )}
        </>
    );
}
