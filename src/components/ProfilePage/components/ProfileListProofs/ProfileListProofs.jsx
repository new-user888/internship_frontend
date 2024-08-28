import { ProfileProofBlock } from "./components/ProfileProofBlock";
import { TalentsService } from "../../../../services/api-services";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../../context/UserContext";
import s from "./ProfileListProofs.module.scss";
import { AddingProofsForm } from "../AddingProofsForm";
import { ModalWindow } from "../../../../shared/components";

export function ProfileListProofs({ id, token }) {
    const { talentsProofs, setTalentsProofs } = useContext(UserContext);
    const [editProof, setEditProof] = useState([]);

    const [proofID, setProofID] = useState(null);
    const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
    const [cancelModalIsOpen, setCancelModalIsOpen] = useState(false);

    const [size, setSize] = useState();

    useEffect(() => {
        if (id) {
            TalentsService.getProofs(id, token, size)
                .then((proofs) => {
                    setTalentsProofs(proofs.content);
                    setEditProof(
                        proofs.content.map((el) => ({ id: el.id, edit: false }))
                    );
                    setSize(
                        proofs.total_elements === 0 ? 5 : proofs.total_elements
                    );
                })
                .catch((err) => console.log(err));
        }
    }, [id, token, talentsProofs?.length, setTalentsProofs, size]);

    const deleteProof = () => {
        try {
            TalentsService.deleteProof(id, proofID, token)
                .then(() => {
                    setTalentsProofs(
                        talentsProofs.filter((el) => el.id !== proofID)
                    );
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            {talentsProofs?.length > 0 ? (
                <div>
                    <ModalWindow
                        title={"Deleting"}
                        notice={
                            "Are you sure you want to delete this proof permanently?"
                        }
                        agreeButtonText={"Yes, I want"}
                        disagreeButtonText={"No, I don't"}
                        isOpen={deleteModalIsOpen}
                        setIsOpen={setDeleteModalIsOpen}
                        func={deleteProof}
                    />
                    <ModalWindow
                        title={"Canceling"}
                        notice={"Are you sure you want to undo all changes?"}
                        agreeButtonText={"Yes, I want"}
                        disagreeButtonText={"No, I don't"}
                        isOpen={cancelModalIsOpen}
                        setIsOpen={setCancelModalIsOpen}
                        func={() => {
                            setEditProof(
                                editProof.map((obj) => {
                                    return {
                                        ...obj,
                                        edit: false,
                                    };
                                })
                            );
                        }}
                    />
                    {talentsProofs.map((el) => {
                        if (editProof.find((obj) => obj.id === el.id)?.edit) {
                            return (
                                <AddingProofsForm
                                    key={el.id}
                                    id={id}
                                    token={token}
                                    edit={true}
                                    editProof={editProof}
                                    setEditProof={setEditProof}
                                    proof={el}
                                    setCancelModalIsOpen={setCancelModalIsOpen}
                                />
                            );
                        } else {
                            return (
                                <ProfileProofBlock
                                    key={el.id}
                                    id={el.id}
                                    userID={id}
                                    token={token}
                                    link={el.link}
                                    text={el.text}
                                    status={el.status}
                                    created={el.created}
                                    editProof={editProof}
                                    setEditProof={setEditProof}
                                    talentsProofs={talentsProofs}
                                    setTalentsProofs={setTalentsProofs}
                                    setDeleteModalIsOpen={setDeleteModalIsOpen}
                                    setProofID={setProofID}
                                />
                            );
                        }
                    })}
                </div>
            ) : (
                <span>
                    <div className={s.no_proofs}>No proofs yet!</div>
                </span>
            )}
        </>
    );
}
