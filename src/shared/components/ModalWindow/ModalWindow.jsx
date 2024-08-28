import React, { useEffect, useRef, useCallback } from "react";
import s from "./ModalWindow.module.scss";

import { Button } from "../../components";

export function ModalWindow({
    title,
    notice,
    agreeButtonText,
    disagreeButtonText,
    isOpen,
    setIsOpen,
    func,
}) {
    const window = useRef();
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!window.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, [setIsOpen]);

    const showModal = useCallback(() => {
        setIsOpen(true);
        document.body.style.overflowY = "hidden";
    }, [setIsOpen]);

    const hideModal = useCallback(() => {
        setIsOpen(false);
        document.body.style.overflowY = "auto";
    }, [setIsOpen]);

    useEffect(() => {
        if (isOpen) {
            showModal();
        } else {
            hideModal();
        }
    }, [isOpen, showModal, hideModal]);

    return (
        <div className={`${s.modal} ${isOpen ? s.show : s.hide}`}>
            <div
                ref={window}
                className={`${s.block_modal} ${isOpen ? s.show : s.hide}`}
            >
                <div className={s.header}>
                    <span>{title}</span>
                    <button
                        className={s.close}
                        onClick={() => setIsOpen(false)}
                    >
                        &#215;
                    </button>
                </div>
                <div className={s.body}>
                    <p>{notice}</p>
                </div>
                <div className={s.btns}>
                    {agreeButtonText ? (
                        <Button
                            className={s.btn}
                            onClick={() => {
                                hideModal();
                                func();
                            }}
                        >
                            {agreeButtonText}
                        </Button>
                    ) : (
                        <></>
                    )}

                    <Button className={s.btn} onClick={() => setIsOpen(false)}>
                        {disagreeButtonText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
