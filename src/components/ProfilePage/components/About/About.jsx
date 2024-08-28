import React, { useCallback, forwardRef, useImperativeHandle } from "react";
import { Button, Textarea } from "../../../../shared/components";
import edit from "./images/edit.svg";
import s from "./About.module.scss";
import {
    validateAdditionalInfo,
    validateBio,
    validateContacts,
} from "./validate";

export const About = forwardRef((props, ref) => {
    const {
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
        skills,
        setSkills,
    } = props;

    const validateAbout = useCallback(() => {
        setBio((prev) => ({
            ...prev,
            ...validateBio(bio.bio),
        }));

        setAdditionalInfo((prev) => ({
            ...prev,
            ...validateAdditionalInfo(additionalInfo.info),
        }));

        setContacts((prev) => ({
            ...prev,
            ...validateContacts(contacts.contacts),
        }));
        return (
            validateBio(bio.bio).state &&
            validateAdditionalInfo(additionalInfo.info).state &&
            validateContacts(contacts.contacts).state
        );
    }, [bio, additionalInfo, contacts]);

    useImperativeHandle(
        ref,
        () => ({
            validate: () => {
                return validateAbout();
            },
        }),
        [validateAbout]
    );

    return (
        <div className={s.about}>
            <button
                className={s.edit}
                onClick={() => {
                    editting ? setCancelModalIsOpen(true) : setEditting(true);
                }}
            >
                <img src={edit} alt="edit" />
            </button>
            <div className={s.ab_title}>about</div>

            <h3>Bio</h3>
            <div className={s.bio}>
                {editting ? (
                    <div className={s.textarea_block}>
                        <Textarea
                            placeholder="your biography"
                            value={bio.bio}
                            className={`${s.big_textarea} ${
                                bio.state ? "" : s.error
                            }`}
                            maxLength="255"
                            onChange={(event) =>
                                setBio((prev) => ({
                                    ...prev,
                                    bio: event.target.value,
                                }))
                            }
                        />
                        <span className={s.textarea_length}>
                            {bio.bio.length}/255
                        </span>
                        <span>{bio.state ? "" : bio.error}</span>
                    </div>
                ) : (
                    <p>{profile.bio}</p>
                )}
            </div>
            <h3>Additional info</h3>
            <div className={s.additional_info}>
                {editting ? (
                    <div className={s.textarea_block}>
                        <Textarea
                            placeholder="some text"
                            value={additionalInfo.info}
                            className={`${additionalInfo.state ? "" : s.error}`}
                            maxLength="255"
                            onChange={(event) =>
                                setAdditionalInfo((prev) => ({
                                    ...prev,
                                    info: event.target.value,
                                }))
                            }
                        />
                        <span className={s.textarea_length}>
                            {additionalInfo.info.length}/255
                        </span>
                        <span>
                            {additionalInfo.state ? "" : additionalInfo.error}
                        </span>
                    </div>
                ) : (
                    <p>{profile.additional_info}</p>
                )}
            </div>

            <h3>Contacts</h3>
            <div className={s.contacts}>
                {editting ? (
                    <>
                        <div className={s.textarea_block}>
                            <span className={s.contact_info}>
                                write contacts separating them with a paragraph
                            </span>
                            <Textarea
                                placeholder="your contacts (links or email)"
                                value={contacts.contacts}
                                className={`${contacts.state ? "" : s.error}`}
                                onChange={(event) =>
                                    setContacts((prev) => ({
                                        ...prev,
                                        contacts: event.target.value,
                                    }))
                                }
                            />
                            <span className={s.textarea_length}>
                                {contacts.contacts.length}/400
                            </span>
                            <span>{contacts.state ? "" : contacts.error}</span>
                        </div>
                    </>
                ) : (
                    <ul>
                        {profile.contacts?.map((contact, index) => (
                            <li key={index}>{contact}</li>
                        ))}
                    </ul>
                )}
            </div>
            {/* {editting ? (
                        <div className={s.passwords}>
                            <h3>Changing password :</h3>
                            <div className={s.input_block}>
                                <Input
                                    type="password"
                                    placeholder="old password"
                                    autoComplete="off"
                                    className={`$ ${
                                        password.state ? "" : s.error
                                    }`}
                                    onChange={(event) =>
                                        setPassword((prev) => ({
                                            ...prev,
                                            pswd: event.target.value,
                                        }))
                                    }
                                />
                                <span>
                                    {password.state ? "" : password.error}
                                </span>
                            </div>

                            <div className={s.input_block}>
                                <Input
                                    type="password"
                                    placeholder="new password"
                                    autoComplete="off"
                                    className={`$ ${
                                        newPassword.state ? "" : s.error
                                    }`}
                                    onChange={(event) =>
                                        setNewPassword((prev) => ({
                                            ...prev,
                                            pswd: event.target.value,
                                        }))
                                    }
                                />
                                <span>
                                    {newPassword.state ? "" : newPassword.error}
                                </span>
                            </div>
                        </div>
                    ) : (
                        ""
                    )} */}
            {editting ? (
                <div className={s.btns}>
                    <Button
                        onClick={() => {
                            setCancelModalIsOpen(true);
                            setSkills(skills);
                        }}
                        className={s.btn}
                    >
                        Cancel
                    </Button>
                    <Button onClick={save} className={s.btn}>
                        Save
                    </Button>
                    <Button
                        className={s.btn}
                        onClick={() => {
                            setModalIsOpen(true);
                        }}
                    >
                        Delete profile
                    </Button>
                </div>
            ) : (
                ""
            )}
            {saveError && <div className={s.save_error}>{saveError}</div>}
        </div>
    );
});
