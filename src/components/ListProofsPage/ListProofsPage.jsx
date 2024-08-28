import { TalentsService } from "../../services/api-services";
import { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import { ProofBlock } from "../TalentPage/components/ListProofs/components/ProofBlock";
import { Button, ModalWindow } from "../../shared/components";
import { Pagination } from "../TalentsListPage/components/Pagination";
import s from "./ListProofsPage.module.scss";

export function ListProofsPage() {
    const { token, kudos, setKudos, proofs, setProofs } = useContext(UserContext);
    const [pages, setPages] = useState({ page: 0, size: 5, orderBy: "desc" });
    const [countOfPages, setCountOfPages] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [proofId, setProofId] = useState(null);
    const [kudoses, setKudoses] = useState(1);

    useEffect(() => {
        if (searchParams.has("page") && searchParams.has("size")) {
            if (
                Number(searchParams.get("page")) < 0 ||
                Number(searchParams.get("page")) > countOfPages ||
                Number(searchParams.get("size")) <= 0
            ) {
                let sParams = {};
                sParams.page = page;
                sParams.size = size;
                setSearchParams(sParams, { replace: true });
            } else {
                setPage(Number(searchParams.get("page")));
                setSize(Number(searchParams.get("size")));
            }
        }
    }, [searchParams]);

    useEffect(() => {
        if (!searchParams.has("page") || !searchParams.has("size")) {
            let sParams = {};
            sParams.page = page;
            sParams.size = size;
            setSearchParams(sParams, { replace: true });
        }
    }, [page, searchParams, size]);

    useEffect(() => {
        if (0 < page < countOfPages) {
            TalentsService.getAllProofs(searchParams.get("page") || "", pages.size, pages.orderBy).then((res) => {
                setProofs(res.content);
                setCountOfPages(res.total_pages);
            });
        } else {
            TalentsService.getAllProofs(0, pages.size, pages.orderBy).then((res) => {
                setProofs(res.content);
                setCountOfPages(res.total_pages);
            });
        }
    }, [pages, page, size]);

    useEffect(() => {
        setKudoses(1);
    }, [modalIsOpen]);

    const filterByDateAsc = () => {
        setPages({ ...pages, orderBy: "asc" });
    };

    const filterByDateDesc = () => {
        setPages({ ...pages, orderBy: "desc" });
    };

    function likeProof(kudoses) {
        if (token) {
            if (parseInt(kudoses) === 0) {
                alert("You can't give 0 kudoses");
                
            } else if (parseInt(kudoses) > kudos){
                alert("You can't give kudoses more than you have");
            }else {
                const obj = { amount: kudoses };
                TalentsService.putKudos(proofId, obj, token)
                    .then(() => {
                        setKudos((prev) => prev - parseInt(obj.amount));
                        setKudoses(1);
                    })
                    .catch((err) => {
                        
                        if (err.response.status === 403) {
                            alert("You have been already kudosed this proof");
                        }
                    });
            }
        } else {
            window.location.href = `proofs?page=${page}&size=${size}#auth`;
        }
    }
    const handleInputChange = (event) => {
        const value = event.target.value.trim();
        if (value === "") {
            setKudoses(0);
        } else {
            const parsedValue = parseInt(value);
            if (!isNaN(parsedValue) && parsedValue <= kudos) {
                setKudoses(parsedValue);
            } else {
                setKudoses(kudos);
            }
        }
    };

    return (
        <>
            {kudos !== 0 ? (
                <ModalWindow
                    title={"Kudos Proof"}
                    notice={
                        <>
                            <span className={s.modal_text}>
                                <input
                                    type="range"
                                    onChange={(event) => {
                                        setKudoses(event.target.value);
                                    }}
                                    min={1}
                                    max={kudos}
                                    step={1}
                                    value={kudoses}
                                    className={s.slider}
                                ></input>
                                <span className={s.kudos_parent}>
                                    <input className={s.kudos_value} onChange={handleInputChange} value={kudoses} />
                                </span>
                            </span>
                        </>
                    }
                    agreeButtonText={"Kudos"}
                    disagreeButtonText={"Close"}
                    isOpen={modalIsOpen}
                    setIsOpen={setModalIsOpen}
                    func={() => {
                        likeProof(kudoses);
                    }}
                />
            ) : (
                <ModalWindow
                    title={"Kudos Proof"}
                    notice={
                        <>
                            <span className={s.modal_text}>You can't put kudoses</span>
                        </>
                    }
                    disagreeButtonText={"Close"}
                    isOpen={modalIsOpen}
                    setIsOpen={setModalIsOpen}
                    func={() => {
                        likeProof(kudoses);
                    }}
                />
            )}

            <div>
                <div className={s.buttons}>
                    <Button className={s.button} onClick={filterByDateDesc}>
                        Sort by date: ascending
                    </Button>
                    <Button className={s.button} onClick={filterByDateAsc}>
                        Sort by date: descending
                    </Button>
                </div>

                {proofs.length > 0 ? (
                    proofs.map((el) => {
                        return (
                            <ProofBlock
                                key={el.id}
                                id={el.id}
                                link={el.link}
                                text={el.text}
                                created={el.created}
                                status={el.status}
                                setProofId={setProofId}
                                setModalIsOpen={setModalIsOpen}
                            />
                        );
                    })
                ) : (
                    <div></div>
                )}
                <Pagination countOfPages={countOfPages} page={page} size={pages.size} path={"proofs"} />
            </div>
        </>
    );
}
