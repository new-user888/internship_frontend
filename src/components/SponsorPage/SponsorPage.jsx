import React, { useContext, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router";
import s from "./SponsorPage.module.scss";
import { Button, ModalWindow } from "../../shared/components";
import { useNavigate } from "react-router-dom";
import { TalentsService } from "../../services/api-services";
import { UserContext } from "../../context/UserContext";
import { useCookies } from "react-cookie";
import { SponsorData } from "./components/SponsorData";
import { SponsorAbout } from "./components/SponsorAbout/SponsorAbout";
export function SponsorPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const talentDataRef = useRef(null);

    const { user, token } = useContext(UserContext);
    const [profile, setProfile] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["token", "user"]);

    const [editting, setEditting] = useState(false);
    const { setUserInfo, kudos, setKudos } = useContext(UserContext);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [cancelModalIsOpen, setCancelModalIsOpen] = useState(false);
    const [saveError, setSaveError] = useState("");

    useEffect(() => {
        const path = `${location.pathname}${location.search}`;
        const hash = editting ? "#edit" : "";
        navigate(`${path}${hash}`, { replace: true });
    }, [editting, navigate, location.pathname, location.search]);

    useEffect(() => {
        setIsLoading(true);
        if (user.id) {
            TalentsService.getSponsor(user.id, token)
                .then((response) => {
                    setProfile(response);
                    setIsLoading(false);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [user.id, token]);

    const [firstName, setFirstName] = useState({
        name: "",
        error: "",
        state: true,
    });
    const [lastName, setLastName] = useState({
        name: "",
        error: "",
        state: true,
    });
    const [numberKudos, setNumberKudos] = useState({
        kudos: "",
        error: "",
        state: true,
    });

    useEffect(() => {
        setUserInfo(profile);
    }, [profile]);

    useEffect(() => {
        if (Object.keys(profile).length !== 0) {
            setFirstName({ name: profile?.first_name, error: "", state: true });
            setLastName({ name: profile?.last_name, error: "", state: true });
            setSaveError("");
        }
    }, [profile, editting]);

    if (isLoading || !profile) {
        return (
            <>
                <p>Loading</p>
            </>
        );
    }

    function save() {
        talentDataRef.current?.validate();
        let isValid = talentDataRef.current?.validate();
        if (isValid) {
            const obj = {
                first_name: firstName.name,
                last_name: lastName.name,
                count_of_kudos: numberKudos.kudos,
            };

            try {
                TalentsService.editSponsor(user.id, obj, token)
                    .then(() => {
                        setSaveError("");
                        setProfile((prev) => ({
                            ...prev,
                            first_name: firstName.name,
                            last_name: lastName.name,
                        }));
                        if(numberKudos.kudos !== ""){
                            setKudos((prev) => prev + parseInt(numberKudos.kudos));
                        }

                        setEditting(false);
                    })
                    .catch((error) => {
                        if (error.response.status === 400) {
                            setSaveError("Data entered incorrectly");
                        }
                    });
            } catch (error) {
                console.error(error);
            }
        }
    }

    const deleteSponsor = () => {
        try {
            TalentsService.deleteSponsor(user.id, token)
                .then(() => {
                    removeCookie("token");
                    removeCookie("user");
                    navigate("/", { replace: true });
                })
                .catch((error) => {
                    console.error(error);
                });
        } catch (error) {
            console.error(error);
        }
    };

    const propsTalentData = {
        editting,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        numberKudos,
        setNumberKudos,
    };

    const propsAbout = {
        editting,
        setEditting,
        save,
        setModalIsOpen,
        setCancelModalIsOpen,
        saveError,
    };

    return (
        <>
            <ModalWindow
                title={"Deleting"}
                notice={"Are you sure you want to delete your account permanently?"}
                agreeButtonText={"Yes, I want"}
                disagreeButtonText={"No, I don't"}
                isOpen={modalIsOpen}
                setIsOpen={setModalIsOpen}
                func={deleteSponsor}
            />
            <ModalWindow
                title={"Canceling"}
                notice={"Are you sure you want to undo all changes?"}
                agreeButtonText={"Yes, I want"}
                disagreeButtonText={"No, I don't"}
                isOpen={cancelModalIsOpen}
                setIsOpen={setCancelModalIsOpen}
                func={() => {
                    setEditting(false);
                }}
            />
            <div className={s.btns}>
                <Button className={s.btn} onClick={() => navigate(-1)}>
                    Back
                </Button>
            </div>
            <div className={s.container}>
                <SponsorData {...propsTalentData} ref={talentDataRef} />

                <SponsorAbout {...propsAbout} />
            </div>
        </>
    );
}
