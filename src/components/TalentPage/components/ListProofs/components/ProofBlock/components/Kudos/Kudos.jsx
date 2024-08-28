import s from "./Kudos.module.scss";
import { useState, useContext, useEffect } from "react";
import { TalentsService } from "../../../../../../../../services/api-services";
import { UserContext } from "../../../../../../../../context/UserContext";
import { TalentsContext } from "../../../../../../../../context/TalentsContext";

export function Kudos({ id, setProofId = null, setModalIsOpen = null }) {
    const { user, token } = useContext(UserContext);
    const { page, size } = useContext(TalentsContext);
    const [kudos, setKudos] = useState(0);
    const [sponsors, setSponsors] = useState({});

    useEffect(() => {
        TalentsService.getKudos(id, token)
            .then((kudos) => {
                setKudos(kudos.all_kudos_on_proof);
                setSponsors(
                    Object.values(kudos.kudos_from_sponsor)
                        .map(
                            ({ first_name, last_name }) =>
                                `${first_name} ${last_name}`
                        )
                        .join(", ")
                );
            })
            .catch((err) => console.log(err));
    }, [user.id, kudos]);
    function openModal() {
        if (token) {
            setProofId(id);
            setModalIsOpen(true);
        } else {
            window.location.href = `proofs?page=${page}&size=${size}#auth`;
        }
    }

    return (
        <div className={s.kudos_block}>
            {user.role === "SPONSOR" || Object.keys(sponsors).length == 0 ? (
                <>
                    <svg
                        cursor="pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        color="#676767"
                        width="35"
                        height="35"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        onClick={user.role !== "TALENT" ? openModal : () => {}}
                        className={s.kudos}
                    >
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />{" "}
                    </svg>
                    <div className={s.count}>{kudos}</div>
                </>
            ) : !user.id ? (
                ""
            ) : (
                <>
                    <span tooltip={`${sponsors}`} flow="right">
                        <svg
                            cursor="pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            color="#676767"
                            width="35"
                            height="35"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            onClick={
                                user.role !== "TALENT" ? openModal : () => {}
                            }
                            className={s.kudos}
                        >
                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />{" "}
                        </svg>
                    </span>
                    <div className={s.count}>
                        {user.role === "TALENT" ? kudos : ""}
                    </div>
                </>
            )}
        </div>
    );
}
