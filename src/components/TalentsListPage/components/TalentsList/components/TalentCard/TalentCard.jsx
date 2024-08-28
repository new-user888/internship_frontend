import { useCallback, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import s from "./TalentCard.module.scss";

import userAvatar from "../../../../../../shared/images/user.png";
import { UserContext } from "../../../../../../context/UserContext/UserContext";
import { TalentsContext } from "../../../../../../context/TalentsContext";

export function TalentCard({ talent }) {
    const { auth, user } = useContext(UserContext);

    const editPath = useCallback(() => {
        if (user.id === talent.id && user.role === "TALENT") {
            return "/profile";
        } else {
            return `/talents/${talent.id}`;
        }
    }, []);

    return (
        <Link
            to={editPath()}
            state={{ redirect: `/talents/${talent.id}` }}
            className={s.talent_card}
        >
            {/* <Link to={path} className={s.talent_card}> */}
            <div className={s.photo}>
                <img
                    src={talent.image ? talent.image : userAvatar}
                    alt="talent_photo"
                />
            </div>
            <div className={s.info}>
                <div className={s.name}>
                    {talent.first_name + " " + talent.last_name}
                </div>
                <div className={s.specialization}>{talent.specialization}</div>
                <div className={s.skills}>
                    {talent.skills.map((skill, index) => (
                        <div className={s.skill} key={index}>
                            {skill.skill}
                        </div>
                    ))}
                </div>
            </div>
        </Link>
    );
}
