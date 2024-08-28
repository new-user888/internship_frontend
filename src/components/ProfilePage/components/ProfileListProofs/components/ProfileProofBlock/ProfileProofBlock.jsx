import { useEffect, useState } from "react";
import { TalentsService } from "../../../../../../services/api-services";
import { Kudos } from "../../../../../TalentPage/components/ListProofs/components/ProofBlock/components/Kudos";
import s from "./ProfileProofBlock.module.scss";
import { handlerDropdown } from "./dropdown";

export function ProfileProofBlock({
    id,
    userID,
    token,
    link,
    text,
    status,
    created,
    talentsProofs,
    setTalentsProofs,
    editProof,
    setEditProof,
    setDeleteModalIsOpen,
    setProofID,
}) {
    window.onclick = (event) => {
        handlerDropdown(event, s.dropdown_content, s.show);
    };
    const [skills, setSkills] = useState([]);
    function save(newStatus) {
        const newProof = {
            link: link,
            text: text,
            status: newStatus,
            created: created,
        };
        TalentsService.editProof(userID, id, newProof, token)
            .then(() => {
                setTalentsProofs(
                    talentsProofs.map((obj) => {
                        if (obj.id === id) {
                            return { id: id, ...newProof };
                        }
                        return obj;
                    })
                );
            })
            .catch((error) => {
                console.log(error);
            });
    }
    useEffect(() => {
        TalentsService.getProofsSkills(id, token)

            .then((response) => {
                setSkills(response.skills);
            })

            .catch((error) => {
                console.log(error);
            });
    }, [id, token]);

    return (
        <>
            <div className={s.out}>
                <div className={s.proofs}>
                    <div className={s.info}>
                        <div className={s.settings}>
                            <button
                                className={s.dropbtn}
                                onClick={() => {
                                    setProofID(id);
                                }}
                            ></button>
                            <div
                                id="cityDropdown"
                                className={s.dropdown_content}
                            >
                                {status === "DRAFT" ? (
                                    <button
                                        onClick={() => {
                                            setEditProof(
                                                editProof.map((obj) => {
                                                    return {
                                                        ...obj,
                                                        edit: obj.id === id,
                                                    };
                                                })
                                            );
                                        }}
                                    >
                                        Edit
                                    </button>
                                ) : (
                                    ""
                                )}
                                {status === "DRAFT" || status === "HIDDEN" ? (
                                    <button onClick={() => save("PUBLISHED")}>
                                        Publish
                                    </button>
                                ) : (
                                    ""
                                )}
                                {status === "PUBLISHED" ? (
                                    <button onClick={() => save("HIDDEN")}>
                                        Hide
                                    </button>
                                ) : (
                                    ""
                                )}
                                <button
                                    onClick={() => setDeleteModalIsOpen(true)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                        <span className={s.status}>
                            {status.toLocaleLowerCase()}
                        </span>

                        <h1>Link:</h1>
                        <a
                            className={s.link}
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                        >
                            Click to know me more
                        </a>
                        <div className={s.proof_description}>
                            <div className={s.title}>Description:</div>
                            <p>{text}</p>
                        </div>
                    </div>
                    <div className={s.skills}>
                        {skills
                            ? skills.map((skill, index) => (
                                  <div className={s.skill} key={index}>
                                      {skill.skill}
                                  </div>
                              ))
                            : ""}
                    </div>
                    <div className={s.date}>
                        <Kudos id={id} />
                        <b className={s.created}>
                            Created: {created.split(" ")[0]}
                        </b>
                    </div>
                </div>
            </div>
        </>
    );
}
