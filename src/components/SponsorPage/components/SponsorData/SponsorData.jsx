import {
    useState,
    useContext,
    useEffect,
    forwardRef,
    useCallback,
    useImperativeHandle,
} from "react";
import { UserContext } from "../../../../context/UserContext";
import { TalentsService } from "../../../../services/api-services";
import {
    validateFirstName,
    validateLastName,
    validateKudos,
} from "./validate.js";
import { Input, Button } from "../../../../shared/components";
import s from "./SponsorData.module.scss";
import userAvatar from "../../../../shared/images/user.png";

export const SponsorData = forwardRef((props, ref) => {
    const { kudos, userInfo } = useContext(UserContext);
    const {
        editting,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        numberKudos,
        setNumberKudos,
    } = props;

    const valideTalentData = useCallback(() => {
        setFirstName((prev) => ({
            ...prev,
            ...validateFirstName(firstName.name),
        }));
        setLastName((prev) => ({
            ...prev,
            ...validateLastName(lastName.name),
        }));
        setNumberKudos((prev) => ({
            ...prev,
            ...validateKudos(numberKudos.kudos, kudos),
        }));

        return (
            validateFirstName(firstName.name).state &&
            validateLastName(lastName.name).state &&
            validateKudos(numberKudos.kudos, kudos).state
        );
    }, [firstName, lastName, numberKudos]);

    useImperativeHandle(
        ref,
        () => ({
            validate: () => {
                return valideTalentData();
            },
        }),
        [valideTalentData]
    );

    return (
        <div className={s.sponsor_data}>
            <img className={s.ava} src={userAvatar} alt="avatar" />

            <div className={s.sponsor}>
                <div className={s.kudos}>
                    {editting ? (
                        <>
                            <div className={s.add_kudos}>
                                <Input
                                    type="text"
                                    placeholder="add kudos"
                                    autoComplete="off"
                                    maxLength="10"
                                    className={`${
                                        numberKudos.state ? "" : s.error
                                    }`}
                                    onChange={(event) =>
                                        setNumberKudos((prev) => ({
                                            ...prev,
                                            kudos: event.target.value,
                                        }))
                                    }
                                />
                                <span>
                                    {numberKudos.state ? "" : numberKudos.error}
                                </span>
                            </div>
                        </>
                    ) : (
                        `Amount of Kudos: ${kudos}`
                    )}
                </div>
                <div className={s.name}>
                    {editting ? (
                        <>
                            <div className={s.input_block}>
                                <Input
                                    type="text"
                                    value={firstName.name}
                                    placeholder="first name"
                                    autoComplete="off"
                                    className={`${
                                        firstName.state ? "" : s.error
                                    }`}
                                    onChange={(event) =>
                                        setFirstName((prev) => ({
                                            ...prev,
                                            name: event.target.value,
                                        }))
                                    }
                                />
                                <span>
                                    {firstName.state ? "" : firstName.error}
                                </span>
                            </div>
                            <div className={s.input_block}>
                                <Input
                                    type="text"
                                    value={lastName.name}
                                    placeholder="last name"
                                    autoComplete="off"
                                    className={`${
                                        lastName.state ? "" : s.error
                                    }`}
                                    onChange={(event) =>
                                        setLastName((prev) => ({
                                            ...prev,
                                            name: event.target.value,
                                        }))
                                    }
                                />
                                <span>
                                    {lastName.state ? "" : lastName.error}
                                </span>
                            </div>
                        </>
                    ) : (
                        `${userInfo.first_name} ${userInfo.last_name}`
                    )}
                </div>
            </div>
        </div>
    );
});
