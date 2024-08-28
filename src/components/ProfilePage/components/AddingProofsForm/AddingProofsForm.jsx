import { useCallback, useContext, useState, useEffect } from "react";
import { Button, Input, Textarea } from "../../../../shared/components";
import { TalentsService } from "../../../../services/api-services";
import { UserContext } from "../../../../context/UserContext";
import s from "./AddingProofsForm.module.scss";
import plus from "../../../../shared/images/plus.svg";
import { validateLinks, validateText } from "./validate";
import Select, { components } from "react-select";
import { CustomClearIndicator } from "./components/CustomClearIndicator";
import { ValueCross } from "./components/ValueCross/ValueCross";

export function AddingProofsForm({
    id,
    token,
    edit = null,
    editProof = null,
    setEditProof = null,
    proof = null,
    setCancelModalIsOpen = null,
}) {
    const [skills, setSkills] = useState([]);
    const [skillId, setSkillId] = useState([]);
    const [defaultSkills, setDefaultSkills] = useState([]);
    const [deletedSkills, setDeletedSkills] = useState([]);
    const [activeProofs, setActiveProofs] = useState(edit !== null);
    const [link, setLink] = useState({
        link: edit === null ? "" : proof.link,
        error: "",
        state: true,
    });
    const [text, setText] = useState({
        text: edit === null ? "" : proof.text,
        error: "",
        state: true,
    });

    const [addProofError, setAddProofError] = useState("");
    const {
        user,
        talentsProofs,
        setTalentsProofs,
        currentSkills,
        setCurrentSkills,
    } = useContext(UserContext);
    const validateProof = useCallback(() => {
        setLink((prev) => ({
            ...prev,
            ...validateLinks(link.link),
        }));

        setText((prev) => ({
            ...prev,
            ...validateText(text.text),
        }));

        return validateLinks(link.link).state && validateText(text.text).state;
    }, [link, text]);

    const selectStyles = {
        control: (styles) => ({
            ...styles,
            fontWeight: 500,
            fontSize: "22px",
            lineHeight: "26px",
            borderRadius: "10px",
            color: "#909090",
            border: "3px solid transparent",
            background:
                "linear-gradient(0deg, #000, #000) padding-box, linear-gradient(180deg, #ce9ffc 0%, #a582f7 50%, #7367f0 100%) border-box",
            backgroundSize: "100% 100%, 100% 100%",
        }),
        input: (styles) => ({
            ...styles,
            color: "#fff", // Set the text color to white
        }),
        menu: (styles) => ({
            ...styles,
            background: "#111",
            fontWeight: 500,
            fontSize: "16px",
        }),

        option: (styles, state) => ({
            ...styles,
            backgroundColor: state.isFocused ? "#a582f7" : "transparent",
            color: state.isFocused ? "#fff" : "#adadad",
        }),
    };

    useEffect(() => {
        if (id) {
            TalentsService.getSkills(token)
                .then((response) => {
                    setCurrentSkills(
                        response.map((item) => {
                            return {
                                id: item.id,
                                value: item.skill.toLowerCase(),
                                label: item.skill,
                            };
                        })
                    );
                })

                .catch((error) => {
                    console.log(error);
                });
        }
    }, []);

    useEffect(() => {
        if (proof) {
            TalentsService.getProofsSkills(proof.id, token)
                .then((response) => {
                    setSkills(response.skills);
                })

                .catch((error) => {
                    console.log(error);
                });
        }
    }, [proof, token]);

    function handle(e) {
        e.preventDefault();
        if (validateProof()) {
            const proof = {
                link: link.link,
                text: text.text,
                skills: skills.skills,
            };
            TalentsService.addProof(proof, id, token)
                .then(() => {
                    setTalentsProofs((prev) => [
                        ...prev,
                        {
                            id: NaN,
                            link: "string",
                            text: "string",
                            created: "date",
                            status: "DRAFT",
                        },
                    ]);

                    setActiveProofs(false);
                    setLink({ link: "", error: "", state: true });
                    setText({ text: "", error: "", state: true });
                    setAddProofError("");
                })
                .catch((error) => {
                    if (
                        error.response.status === 400 ||
                        error.response.status === 500
                    ) {
                        setAddProofError(
                            "Incorrect link or description entered"
                        );
                    } else {
                        setAddProofError("Something goes wrong");
                    }
                });
        }
    }

    function handleClear() {
        setDeletedSkills(skills);
        setSkills([]);
        setDefaultSkills([]);
        setSkillId([]);
    }

    function save(e) {
        e.preventDefault();

        if (validateProof()) {
            const newProof = {
                link: link.link,
                text: text.text,
                status: proof.status,
                created: proof.created,
            };

            TalentsService.editProof(id, proof.id, newProof, token)
                .then(() => {
                    setTalentsProofs(
                        talentsProofs.map((obj) => {
                            if (obj.id === proof.id) {
                                return { id: proof.id, ...newProof };
                            }
                            return obj;
                        })
                    );
                    setEditProof(
                        editProof.map((obj) => {
                            if (obj.id === proof.id) {
                                return { ...obj, edit: false };
                            }
                            return obj;
                        })
                    );
                    setLink({ link: "", error: "", state: true });
                    setText({ text: "", error: "", state: true });
                    setAddProofError("");
                })
                .catch((error) => {
                    if (
                        error.response.status === 400 ||
                        error.response.status === 500
                    ) {
                        setAddProofError(
                            "Incorrect link or description entered"
                        );
                    } else {
                        setAddProofError("Something goes wrong");
                    }
                });
        }

        const uniqueSkillId = skillId.filter((id) => {
            // сделал так, чтобы в добавлении те скилы, которые уже есть в поле, игнорировались и повторно не записывались.
            return !skills.some((skill) => skill.id === id);
        });

        if (uniqueSkillId.length > 0) {
            TalentsService.addProofsSkills(id, proof.id, token, {
                skills: uniqueSkillId,
            })
                .then((response) => {
                    setSkills(response);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
        deletedSkills.forEach((el) => {
            TalentsService.deleteProofsSkills(id, proof.id, token, el.id).catch(
                (error) => {}
            );
        });
    }

    const writeSkills = useCallback((data) => {
        setSkillId(data.map((el) => el.id));
    });

    useEffect(() => {
        if (skills.length !== 0 && currentSkills.length !== 0) {
            const map = skills.map((item) =>
                currentSkills.find(
                    (lowerItem) => item.skill === lowerItem.label
                )
            );
            setDefaultSkills(map);
        }
    }, [skills, currentSkills]);

    return (
        <>
            {edit === null ? (
                <div className={s.updating_proofs}>
                    <img
                        className={`${s.add} ${activeProofs ? s.rotated : ""}`}
                        onClick={() => {
                            setActiveProofs((prev) => !prev);
                            setLink({ link: "", error: "", state: true });
                            setText({ text: "", error: "", state: true });
                            setAddProofError("");
                        }}
                        src={plus}
                    ></img>
                </div>
            ) : (
                ""
            )}

            {activeProofs && (
                <form action="" className={s.add_proff_form}>
                    <div className={s.description}>
                        {currentSkills.length !== 0 && edit ? (
                            <Select
                                placeholder={"Select your skills..."}
                                onclick={() => console.log("Selected")}
                                key={defaultSkills.length}
                                onChange={writeSkills}
                                options={currentSkills}
                                defaultValue={defaultSkills}
                                isMulti={true}
                                styles={selectStyles}
                                components={{
                                    MultiValueRemove: (props) => (
                                        <ValueCross
                                            {...props}
                                            proof={proof}
                                            skills={skills}
                                            skillId={skillId}
                                            setSkillId={setSkillId}
                                            setSkills={setSkills}
                                            deletedSkills={deletedSkills}
                                            setDeletedSkills={setDeletedSkills}
                                        />
                                    ),
                                    ClearIndicator: (props) => (
                                        <CustomClearIndicator
                                            {...props}
                                            skills={skills}
                                            clearValue={handleClear}
                                        />
                                    ),
                                }}
                            />
                        ) : null}
                        <Input
                            onChange={(e) =>
                                setLink((prev) => ({
                                    ...prev,
                                    link: e.target.value,
                                }))
                            }
                            value={link.link}
                            className={`${s.pr_link} ${
                                link.state ? "" : s.error
                            }`}
                            type="text"
                            placeholder="Paste only one link"
                            autoComplete="off"
                        />
                        <span className={s.error_msg}>
                            {link.state ? "" : link.error}
                        </span>

                        <div className={s.description_text}>
                            <Textarea
                                onChange={(e) =>
                                    setText((prev) => ({
                                        ...prev,
                                        text: e.target.value,
                                    }))
                                }
                                value={text.text}
                                className={`${s.pr_description} ${
                                    text.state ? "" : s.error
                                }`}
                                placeholder="Write the description"
                                maxLength="255"
                            />
                            <span className={s.description_length}>
                                {text.text.length}/255
                            </span>
                            <span className={s.error_msg}>
                                {text.state ? "" : text.error}
                            </span>
                        </div>

                        <div className={s.btns}>
                            <span className={s.error_form}>
                                {addProofError}
                            </span>
                            {edit === null ? (
                                <Button className={s.btn} onClick={handle}>
                                    Create
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        className={s.btn}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setCancelModalIsOpen(true);
                                            setSkills(skills);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button className={s.btn} onClick={save}>
                                        Save
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </form>
            )}
        </>
    );
}
