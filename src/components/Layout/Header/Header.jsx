import { useCallback, useContext, useMemo, useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import s from "./Header.module.scss";
import { Button, ModalWindow } from "../../../shared/components";
import { UserContext } from "../../../context/UserContext";
import { useCookies } from "react-cookie"; // temp
import { TalentsService } from "../../../services/api-services";

export function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const editPath = useCallback(() => {
        return location.pathname + location.search + "#auth";
    }, [location]);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const { auth, user, token, userInfo, setUserInfo, kudos, setKudos } =
        useContext(UserContext);

    const [cookies, setCookie, removeCookie] = useCookies(["token", "user"]);

    useEffect(() => {
        if (user.id && user.role === "TALENT") {
            TalentsService.getTalent(user.id, token)
                .then((response) => {
                    setUserInfo(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        } else if (user.id && user.role === "SPONSOR") {
            TalentsService.getSponsor(user.id, token)
                .then((response) => {
                    setUserInfo(response);
                })
                .catch((error) => {
                    console.log(error);
                });
            TalentsService.getSponsorKudoses(user.id, token)
                .then((kudos) => {
                    setKudos(kudos.amount);
                })
                .catch((err) => console.log(err));
        }
    }, [user.id]);
    const menuItems = useMemo(
        () => [
            { title: "Talents", link: "/talents" },
            { title: "Proofs", link: "/proofs" },
        ],
        []
    );

    function spreadKudos(kudos) {
        if (kudos >= 1000000000) {
            return (kudos / 1000000000).toFixed(1) + "B";
        } else if (kudos >= 1000000) {
            return (kudos / 1000000).toFixed(1) + "M";
        } else if (kudos >= 1000) {
            return (kudos / 1000).toFixed(1) + "K";
        } else {
            return kudos;
        }
    }

    return (
        <>
            <ModalWindow
                title={"Log out"}
                notice={"Are you sure you want to log out?"}
                agreeButtonText={"Yes, I want"}
                disagreeButtonText={"No, I don't"}
                isOpen={modalIsOpen}
                setIsOpen={setModalIsOpen}
                func={() => {
                    removeCookie("token");
                    removeCookie("user");
                    navigate("/", { replace: true });
                    setUserInfo({});
                }}
            />
            <header className={s.header}>
                <div className="__container">
                    <Link to="/" className={s.logo}>
                        Proved<span>Code</span>
                    </Link>
                    <nav className={s.nav}>
                        {menuItems.map(({ title, link }, index) => (
                            <NavLink
                                to={link}
                                key={index}
                                className={({ isActive }) => {
                                    return isActive ? s.active : "";
                                }}
                            >
                                {title}
                            </NavLink>
                        ))}
                    </nav>
                    <div className={s.btns}>
                        {!auth ? (
                            <Button
                                className={s.btn}
                                onClick={() => {
                                    navigate(editPath(), { replace: true });
                                }}
                            >
                                Login / Register
                            </Button>
                        ) : (
                            <>
                                {user.role === "SPONSOR" ? (
                                    <div className={s.kudos_block}>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            color="#efa612"
                                            width="30"
                                            height="30"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />{" "}
                                        </svg>
                                        <div className={s.count}>
                                            {spreadKudos(kudos)}{" "}
                                        </div>
                                    </div>
                                ) : (
                                    ""
                                )}

                                <Link
                                    to={
                                        user.role === "SPONSOR"
                                            ? "/sponsor"
                                            : "/profile"
                                    }
                                    className={s.username}
                                >
                                    {userInfo?.first_name && userInfo?.last_name
                                        ? userInfo?.first_name +
                                          " " +
                                          userInfo?.last_name
                                        : ""}
                                </Link>
                                <Button
                                    className={s.btn}
                                    onClick={() => {
                                        setModalIsOpen(true);
                                    }}
                                >
                                    Log Out
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </header>
        </>
    );
}
