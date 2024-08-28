import { ProofBlock } from "./components/ProofBlock";
import { TalentsService } from "../../../../services/api-services";
import { useTalent } from "../../../../hooks/useTalent";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import s from "./ListProofs.module.scss";
import { ModalWindow } from "../../../../shared/components";
export function ListProofs({ id }) {
    const { token, talentsProofs, setTalentsProofs, kudos, setKudos } = useContext(UserContext);

    const [size, setSize] = useState();
    const [proofId, setProofId] = useState(null);
    const [kudoses, setKudoses] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    

    useEffect(() => {
        TalentsService.getProofs(id, token, size)
            .then((proofs) => {
                setTalentsProofs(proofs.content);
                setSize(proofs.total_elements === 0 ? 5 : proofs.total_elements);
            })
            .catch((err) => console.log(err));
    }, [talentsProofs.length]);

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

    useEffect(() => {
        setKudoses(1);
    }, [modalIsOpen]);

    return (
        <>
            {talentsProofs.length > 0 ? (
                <>
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

                    <div>
                        {talentsProofs.map((el) => {
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
                        })}
                    </div>
                </>
            ) : (
                <span>
                    <div className={s.no_proofs}>No proofs yet!</div>
                </span>
            )}
        </>
    );
}
