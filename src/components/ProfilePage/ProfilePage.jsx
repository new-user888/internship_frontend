import React, { useContext, useEffect, useState, useRef } from "react";
import { useLocation } from "react-router";
import s from "./ProfilePage.module.scss";
import { Button, ModalWindow } from "../../shared/components";
import { useNavigate } from "react-router-dom";
import { TalentsService } from "../../services/api-services";
import { UserContext } from "../../context/UserContext";
import { useCookies } from "react-cookie";
import { TalentData } from "./components/TalentData/TalentData";
import { About } from "./components/About";
import { AddingProofsForm } from "./components/AddingProofsForm/AddingProofsForm";
import { ProfileListProofs } from "./components/ProfileListProofs";

export function ProfilePage() {
    const navigate = useNavigate();
    const location = useLocation();

    const talentDataRef = useRef(null);
    const aboutRef = useRef(null);

    const { user, token } = useContext(UserContext);
    const [profile, setProfile] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [cookies, setCookie, removeCookie] = useCookies(["token", "user"]);
    const [deletedSkills, setDeletedSkills] = useState([]);
    const [editting, setEditting] = useState(false);
    const { setUserInfo } = useContext(UserContext);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [cancelModalIsOpen, setCancelModalIsOpen] = useState(false);
    const [saveError, setSaveError] = useState("");
    const [skillId, setSkillId] = useState([]);
    const [image, setImage] = useState();

    const [skills, setSkills] = useState([]);
    useEffect(() => {
        if (editting) {
            navigate(`${location.pathname}${location.search}#edit`, {
                replace: true,
            });
        } else if (!editting) {
            navigate(`${location.pathname}${location.search}`, {
                replace: true,
            });
        }
    }, [editting, navigate, location.pathname, location.search]);

    useEffect(() => {
        setIsLoading(true);
        if (user.id) {
            TalentsService.getTalent(user.id, token)
                .then((response) => {
                    setProfile(response);
                    setIsLoading(false);
                    setSkills(response.skills);
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
    const [specialization, setSpecialization] = useState({
        spec: "",
        error: "",
        state: true,
    });
    const [talent, setTalent] = useState({
        talent: "",
        error: "",
        state: true,
    });
    const [allTalents, setAllTalents] = useState([]);
    const [links, setLinks] = useState([]);
    const [bio, setBio] = useState({
        bio: "",
        error: "",
        state: true,
    });
    const [additionalInfo, setAdditionalInfo] = useState({
        info: "",
        error: "",
        state: true,
    });
    const [contacts, setContacts] = useState({
        contacts: "",
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
            setSpecialization({
                spec: profile?.specialization,
                error: "",
                state: true,
            });
            setTalent({ talent: "", error: "", state: true });
            setAllTalents(profile?.talents);
            setLinks(
                profile?.links.length !== 0
                    ? profile?.links.map((el, index) => ({
                          id: index,
                          link: el,
                          error: "",
                          state: true,
                      }))
                    : [{ id: 1, link: "", error: "", state: true }]
            );
            setBio({
                bio: profile?.bio ? profile?.bio : "",
                error: "",
                state: true,
            });
            setAdditionalInfo({
                info: profile?.additional_info ? profile?.additional_info : "",
                error: "",
                state: true,
            });
            setContacts({
                contacts: profile?.contacts ? profile?.contacts.join("\n") : "",
                error: "",
                state: true,
            });
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

    function normalizeContacts(str) {
        str = str.replace(/ +/g, " ").trim();
        str = str.replace(/\n+/g, "\n");
        if (str.slice(-1) === "\n") {
            str = str.slice(0, -1);
        }
        str = str.split("\n");
        str = str.map((el) => el.trim());
        return str;
    }

    function normalizeString(str) {
        str = str.replace(/ +/g, " ").trim();
        str = str.replace(/\n+/g, "\n");
        if (str.slice(-1) === "\n") {
            str = str.slice(0, -1);
        }
        return str;
    }

    function save() {
        talentDataRef.current?.validate();
        aboutRef.current?.validate();
        let isValid =
            talentDataRef.current?.validate() && aboutRef.current?.validate();

        if (isValid) {
            const obj = {
                first_name: firstName.name,
                last_name: lastName.name,
                specialization: specialization.spec,
                talents: allTalents,
                links: links
                    .map((el) => el.link)
                    .filter((el) => el.trim().length !== 0),
                bio: normalizeString(bio.bio),
                additional_info: normalizeString(additionalInfo.info),
                contacts: normalizeContacts(contacts.contacts),
            };

            try {
                TalentsService.editTalent(user.id, obj, token)
                    .then(() => {
                        setSaveError("");
                        setProfile((prev) => ({
                            ...prev,
                            first_name: firstName.name,
                            last_name: lastName.name,
                            specialization: specialization.spec,
                            talents: allTalents,
                            links: links
                                .map((el) => el.link)
                                .filter((el) => el.trim().length !== 0),
                            bio: normalizeString(bio.bio),
                            additional_info: normalizeString(
                                additionalInfo.info
                            ),
                            contacts: normalizeContacts(contacts.contacts),
                        }));
                    })
                    .catch((error) => {
                        if (error.response.status === 400) {
                            setSaveError("Data entered incorrectly");
                        }
                    });

                    if(image){
                        TalentsService.addTalentImage(user.id, image, token)
                        .then(() => {
                            setEditting(false);
                        })
                        .catch((error) => {
                            if (error.response.status === 400) {
                                setSaveError("You cannot upload image more than 1 MB or not correct format");
                            }
                        });
                    } else if(!image){
                        setEditting(false);
                    }
                
            } catch (error) {
                console.error(error);
            }
        }

        TalentsService.addTalentSkills(user.id, token, { id: skillId })

            .then(() => {
                setSkills(skills);
            })
            .catch((error) => {});

        deletedSkills.forEach((el) => {
            TalentsService.deleteTalentSkills(user.id, token, el.id).catch(
                (error) => {}
            );
        });
    }

    const deleteTalent = () => {
        try {
            TalentsService.deleteTalent(user.id, token)
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
        profile,
        editting,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        specialization,
        setSpecialization,
        talent,
        setTalent,
        allTalents,
        setAllTalents,
        links,
        setLinks,
        setImage,
    };

    const propsAbout = {
        profile,
        editting,
        setEditting,
        save,
        setModalIsOpen,
        setCancelModalIsOpen,
        bio,
        setBio,
        additionalInfo,
        setAdditionalInfo,
        contacts,
        setContacts,
        saveError,
    };

    return (
        <>
            <ModalWindow
                title={"Deleting"}
                notice={
                    "Are you sure you want to delete your account permanently?"
                }
                agreeButtonText={"Yes, I want"}
                disagreeButtonText={"No, I don't"}
                isOpen={modalIsOpen}
                setIsOpen={setModalIsOpen}
                func={deleteTalent}
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
                <TalentData
                    {...propsTalentData}
                    ref={talentDataRef}
                    onChange={setSkillId}
                    skills={skills}
                    setSkills={setSkills}
                    setDeletedSkills={setDeletedSkills}
                    skillId={skillId}
                    setSkillId={setSkillId}
                />
                <About
                    {...propsAbout}
                    ref={aboutRef}
                    skills={skills}
                    setSkills={setSkills}
                />
            </div>
            <div className={s.proofs_side}>
                <AddingProofsForm id={user.id} token={token} />
            </div>
            {user.id ? (
                <ProfileListProofs id={user.id} token={token} />
            ) : (
                <span>
                    <div className={s.no_proofs}>Something went wrong</div>
                </span>
            )}
        </>
    );
}
