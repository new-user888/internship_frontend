import React, { useCallback, forwardRef, useImperativeHandle, useContext, useState, useEffect } from "react";
import { Input, Button } from "../../../../shared/components";
import userAvatar from "../../../../shared/images/user.png";
import plus from "./images/plus.svg";
import linkedin from "../../../../shared/images/linkedin.svg";
import github from "../../../../shared/images/github.svg";
import Select, { components } from "react-select";
import { ClearTalentSkills } from "./components/ClearTalentSkills/ClearTalentSkills";
import { ClearOneSkill } from "./components/ClearOneSkill/ClearOneSkill";
import s from "./TalentData.module.scss";
import { validateFirstName, validateLastName, validateLinks, validateSpecialization, validateTalent } from "./validate";
import { Links } from "./components/Links";
import { UserContext } from "../../../../context/UserContext/UserContext";
import { TalentsService } from "../../../../services/api-services";

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
        marginTop: "10px",
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

export const TalentData = forwardRef((props, ref) => {
    const { user, token } = useContext(UserContext);
    const [defaultSkills, setDefaultSkills] = useState([]);
    const [skills, setFormSkills] = useState(props.skills || []);
    const [imageURL, setImageURL] = useState();
    const fileReader = new FileReader();
    const [currentSkills, setCurrentSkills] = useState([]);
    const {
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
        onChange,
        setSkills,
        deletedSkills,
        setDeletedSkills,
        skillId,
        setSkillId,
        setImage,
    } = props;
    useEffect(() => {
        if (user.id) {
            TalentsService.getAllSkills(user.id, token).then((response) => {
                const uniqueSkills = Array.from(new Set(response));
                setCurrentSkills(
                    uniqueSkills.map((item) => {
                        return {
                            id: item.id,
                            value: item.skill.toLowerCase(),
                            label: item.skill,
                        };
                    })
                );
            });
        }
    }, [user.id, token]);

    const valideTalentData = useCallback(() => {
        setFirstName((prev) => ({
            ...prev,
            ...validateFirstName(firstName.name),
        }));
        setLastName((prev) => ({
            ...prev,
            ...validateLastName(lastName.name),
        }));

        setSpecialization((prev) => ({
            ...prev,
            ...validateSpecialization(specialization.spec),
        }));

        setLinks(
            links.map((obj) => {
                if (validateLinks(links).includes(obj.id)) {
                    return { ...obj, error: "*not valid link", state: false };
                }
                return obj;
            })
        );
        return (
            validateFirstName(firstName.name).state &&
            validateLastName(lastName.name).state &&
            validateSpecialization(specialization.spec).state &&
            validateLinks(links).length === 0
        );
    }, [firstName, lastName, specialization, links]);

    useImperativeHandle(
        ref,
        () => ({
            validate: () => {
                return valideTalentData();
            },
        }),
        [valideTalentData]
    );

    function addTalent() {
        setTalent((prev) => ({
            ...prev,
            ...validateTalent(talent.talent),
        }));
        if (validateTalent(talent.talent).state) {
            setAllTalents((prev) => [...prev, talent.talent.replace(/\s+/g, " ").trim()]);
            setTalent({ talent: "", error: "", state: true });
        }
    }

    fileReader.onloadend = () => {
        setImageURL(fileReader.result);
    };

    const handleOnChange = (event) => {
        event.preventDefault();
        const file = event.target.files[0];
        if (file) {
            fileReader.readAsDataURL(file);
        }
        setImage({ file });
    };

    const writeSkills = useCallback((data) => {
        if (
            !props.skills.find((el) => {
                return el?.id === data.at(-1)?.id;
            })
        ) {
            onChange((prev) => [...prev, data.at(-1)?.id]);
        }

        setSkills(data);
    });

    useEffect(() => {
        let map = [];
        if (skills.length !== 0 && currentSkills.length !== 0) {
            map = props.skills.map((item) => currentSkills.find((lowerItem) => item.skill === lowerItem.label));
        }
        if (!props.skills[0]?.value) {
            map = props.skills.map((el) => ({
                id: el.id,
                value: el.skill.toLowerCase(),
                label: el.skill,
            }));
        }
        setDefaultSkills(map);
    }, [skills, currentSkills]);

    useEffect(() => {
        setImageURL();
        setImage();
    }, [editting]);

    function handleClear() {
        setDeletedSkills(skills);
        setSkills([]);
        setDefaultSkills([]);
    }

    return (
        <div className={s.talent_data}>
            {editting ? (
                <>
                    <img
                        className={s.ava}
                        src={imageURL ? imageURL : profile.image ? profile.image : userAvatar}
                        alt="avatar"
                    />
                    <Input type="file" onChange={handleOnChange} className={s.avatar} />
                </>
            ) : (
                <img className={s.ava} src={profile.image ? profile.image : userAvatar} alt="avatar" />
            )}

            <div>
                <div className={s.name}>
                    {editting ? (
                        <>
                            <div className={s.input_block}>
                                <Input
                                    type="text"
                                    value={firstName.name}
                                    placeholder="first name"
                                    autoComplete="off"
                                    className={`${firstName.state ? "" : s.error}`}
                                    onChange={(event) =>
                                        setFirstName((prev) => ({
                                            ...prev,
                                            name: event.target.value,
                                        }))
                                    }
                                />
                                <span>{firstName.state ? "" : firstName.error}</span>
                            </div>
                            <div className={s.input_block}>
                                <Input
                                    type="text"
                                    value={lastName.name}
                                    placeholder="last name"
                                    autoComplete="off"
                                    className={`${lastName.state ? "" : s.error}`}
                                    onChange={(event) =>
                                        setLastName((prev) => ({
                                            ...prev,
                                            name: event.target.value,
                                        }))
                                    }
                                />
                                <span>{lastName.state ? "" : lastName.error}</span>
                            </div>
                        </>
                    ) : (
                        `${profile.first_name} ${profile.last_name}`
                    )}
                </div>

                <div className={s.specialization}>
                    {editting ? (
                        <div className={s.input_block}>
                            <Input
                                type="text"
                                value={specialization.spec}
                                placeholder="specialization"
                                autoComplete="off"
                                className={`${specialization.state ? "" : s.error}`}
                                onChange={(event) =>
                                    setSpecialization((prev) => ({
                                        ...prev,
                                        spec: event.target.value,
                                    }))
                                }
                            />
                            <span>{specialization.state ? "" : specialization.error}</span>
                        </div>
                    ) : (
                        <p>{profile?.specialization}</p>
                    )}
                </div>

                <div className={s.links}>
                    {editting ? (
                        <>
                            {links.map((el) => (
                                <Links links={links} setLinks={setLinks} el={el} key={el.id} />
                            ))}

                            <button
                                disabled={links.length >= 7}
                                className={s.add}
                                onClick={() =>
                                    setLinks((prev) => [
                                        ...prev,
                                        {
                                            id: links[links.length - 1].id + 1,
                                            link: "",
                                            error: "",
                                            state: true,
                                        },
                                    ])
                                }
                            >
                                <img src={plus} alt="+" />
                            </button>
                            <Select
                                placeholder={"Select your skills..."}
                                options={currentSkills}
                                key={defaultSkills.length}
                                isMulti={true}
                                styles={selectStyles}
                                defaultValue={defaultSkills}
                                onChange={writeSkills}
                                components={{
                                    MultiValueRemove: (props) => (
                                        <ClearOneSkill
                                            {...props}
                                            skills={skills}
                                            skillId={skillId}
                                            setSkillId={setSkillId}
                                            setSkills={setSkills}
                                            deletedSkills={deletedSkills}
                                            setDeletedSkills={setDeletedSkills}
                                        />
                                    ),
                                    ClearIndicator: (props) => (
                                        <ClearTalentSkills {...props} skills={skills} clearValue={handleClear} />
                                    ),
                                }}
                            />
                        </>
                    ) : (
                        (profile.links?.map((link, talent) => (
                            <a className={s.link} href={link} key={talent}>
                                {link.includes("linkedin") ? (
                                    <img className={s.socials} src={linkedin} alt=" media icon" />
                                ) : (
                                    <img className={s.socials} src={github} alt=" media icon" />
                                )}
                            </a>
                        )),
                        (
                            <div className={s.skills}>
                                {props.skills.map((skill, index) => (
                                    <div className={s.skill} key={index}>
                                        {skill.label || skill.skill}
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
});
