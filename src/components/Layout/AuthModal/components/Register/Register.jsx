import React, { useCallback, useContext, useState, useEffect } from "react";
import { Button, Input } from "../../../../../shared/components";
import s from "./Register.module.scss";
import { TalentsService } from "../../../../../services/api-services";
import { useCookies } from "react-cookie";
import { UserContext } from "../../../../../context/UserContext/UserContext";
import { useLocation, useNavigate } from "react-router-dom";

const advices = [
    {
        title: "Fill out your account.",
        text: "Upload the best avatar, you’ve ever had and write bio.",
    },
    {
        title: "Time to let the world know you",
        text: "Write your proofs — text with links that describes your activity. It’s better to follow 1 rule: 1 activity - 1 proof ;)",
    },
    {
        title: "Keep improving yourself",
        text: "If you need time to think about your proof for editing sometime - save it to drafts and return in any convenient time.",
    },
    {
        title: "Share your goals",
        text: "When you are confident in writing the proof - press “Publish” button to upload it on your profile.",
    },
];

export function Register({ switcher }) {
    const { register } = TalentsService;
    const [cookies, setCookie, removeCookie] = useCookies(["token", "user"]);
    const { setAuth } = useContext(UserContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [isSponsor, setIsSponsor] = useState(false);

    const handleChange = () => {
        setIsSponsor(!isSponsor);
    };

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
    const [email, setEmail] = useState({ mail: "", error: "", state: true });
    const [password, setPassword] = useState({
        pswd: "",
        error: "",
        state: true,
    });
    const [specialization, setSpecialization] = useState({
        spec: "",
        error: "",
        state: true,
    });
    const [repeatPassword, setRepeatPassword] = useState({
        repeat: "",
        error: "",
        state: true,
    });

    function validateFirstName() {
        const FIRST_NAME_REGEXP = /^[a-zA-Z\s]{1,30}$/;
        if (FIRST_NAME_REGEXP.test(String(firstName.name).toLowerCase())) {
            setFirstName((prev) => ({ ...prev, state: true }));
            return true;
        } else {
            if (firstName.name.trim() === "") {
                setFirstName((prev) => ({ ...prev, error: "*empty field" }));
            } else if (firstName.name.length > 30) {
                setFirstName((prev) => ({
                    ...prev,
                    error: "*the value is too long",
                }));
            } else if (!FIRST_NAME_REGEXP.test(firstName.name)) {
                setFirstName((prev) => ({
                    ...prev,
                    error: "*you can use only latins letters",
                }));
            } else {
                setFirstName((prev) => ({ ...prev, error: "*not valid" }));
            }
            setFirstName((prev) => ({ ...prev, state: false }));
            return false;
        }
    }

    function validateLastName() {
        const LAST_NAME_REGEXP = /^[a-zA-Z\s]{1,30}$/;
        if (LAST_NAME_REGEXP.test(String(lastName.name).toLowerCase())) {
            setLastName((prev) => ({ ...prev, state: true }));
            return true;
        } else {
            if (lastName.name.trim() === "") {
                setLastName((prev) => ({ ...prev, error: "*empty field" }));
            } else if (lastName.name.length > 30) {
                setLastName((prev) => ({
                    ...prev,
                    error: "*the value is too long",
                }));
            } else if (!LAST_NAME_REGEXP.test(lastName.name)) {
                setLastName((prev) => ({
                    ...prev,
                    error: "*you can use only latins letters",
                }));
            } else {
                setLastName((prev) => ({ ...prev, error: "*not valid" }));
            }
            setLastName((prev) => ({ ...prev, state: false }));
            return false;
        }
    }

    function validateSpecialization() {
        const SPECIALIZATION_REGEXP = /^[a-zA-Z0-9\s]{1,70}$/;
        if (
            SPECIALIZATION_REGEXP.test(
                String(specialization.spec).toLowerCase()
            )
        ) {
            setSpecialization((prev) => ({ ...prev, state: true }));
            return true;
        } else {
            if (specialization.spec.trim() === "") {
                setSpecialization((prev) => ({
                    ...prev,
                    error: "*empty field",
                }));
            } else if (specialization.spec.length > 70) {
                setSpecialization((prev) => ({
                    ...prev,
                    error: "*the value is too long",
                }));
            } else if (!SPECIALIZATION_REGEXP.test(specialization.spec)) {
                setSpecialization((prev) => ({
                    ...prev,
                    error: "*you can use only latins letters and numbers",
                }));
            } else {
                setSpecialization((prev) => ({
                    ...prev,
                    error: "*not valid",
                }));
            }
            setSpecialization((prev) => ({ ...prev, state: false }));
            return false;
        }
    }

    function validateEmail() {
        const EMAIL_REGEXP =
            /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if (EMAIL_REGEXP.test(String(email.mail).toLowerCase())) {
            setEmail((prev) => ({ ...prev, state: true }));
            return true;
        } else {
            if (email.mail.trim() === "") {
                setEmail((prev) => ({ ...prev, error: "*empty field" }));
            } else if (!email.mail.includes("@")) {
                setEmail((prev) => ({
                    ...prev,
                    error: '*email doesn\'t have "@"',
                }));
            } else if (!email.mail.split("@")[1].includes(".")) {
                setEmail((prev) => ({
                    ...prev,
                    error: '*domain name doesn\'t have "."',
                }));
            } else {
                setEmail((prev) => ({ ...prev, error: "*not valid email" }));
            }
            setEmail((prev) => ({ ...prev, state: false }));
            return false;
        }
    }

    function validatePassword() {
        const PASSWORD_REGEXP = /^[a-zA-Z0-9]{8,}$/;
        if (PASSWORD_REGEXP.test(String(password.pswd).toLowerCase())) {
            setPassword((prev) => ({ ...prev, state: true }));
            return true;
        } else {
            if (password.pswd.trim() === "") {
                setPassword((prev) => ({ ...prev, error: "*empty field" }));
            } else if (password.pswd.length < 8) {
                setPassword((prev) => ({
                    ...prev,
                    error: "*password should be more than or equal 8 symbols",
                }));
            } else if (!/^[a-zA-Z0-9]$/.test(password.pswd)) {
                setPassword((prev) => ({
                    ...prev,
                    error: "*you can use only latins letters and numbers",
                }));
            } else {
                setPassword((prev) => ({
                    ...prev,
                    error: "*not valid password",
                }));
            }
            setPassword((prev) => ({ ...prev, state: false }));
            return false;
        }
    }

    function validateRepeatPassword() {
        if (
            password.pswd === repeatPassword.repeat &&
            repeatPassword.repeat.trim() !== ""
        ) {
            setRepeatPassword((prev) => ({ ...prev, state: true }));
            return true;
        } else {
            if (repeatPassword.repeat.trim() === "") {
                setRepeatPassword((prev) => ({
                    ...prev,
                    error: "*empty field",
                }));
            } else {
                setRepeatPassword((prev) => ({
                    ...prev,
                    error: "*repeated password does not equal the initial one",
                }));
            }
            setRepeatPassword((prev) => ({ ...prev, state: false }));
            return false;
        }
    }

    function validateForm() {
        return (
            validateFirstName() &&
            validateLastName() &&
            (isSponsor || validateSpecialization()) &&
            validateEmail() &&
            validatePassword() &&
            validateRepeatPassword()
        );
    }

    const resetAll = useCallback(() => {
        setFirstName({
            name: "",
            error: "",
            state: true,
        });
        setLastName({
            name: "",
            error: "",
            state: true,
        });
        setEmail({ mail: "", error: "", state: true });
        setPassword({
            pswd: "",
            error: "",
            state: true,
        });
        setSpecialization({
            spec: "",
            error: "",
            state: true,
        });
        setRepeatPassword({
            repeat: "",
            error: "",
            state: true,
        });
    }, []);

    const redirectAfterRegister = useCallback(() => {
        if (location.state !== null) {
            navigate(location.state.from.pathname, { replace: true });
        } else {
            navigate(location.pathname + location.search, { replace: true });
        }
    }, [location.pathname, location.search, location.state, navigate]);

    function handlerSubmit(event) {
        event.preventDefault();
        if (validateForm()) {
            const newUser = {
                first_name: firstName.name,
                last_name: lastName.name,
                login: email.mail,
                password: password.pswd,
                specialization: specialization.spec,
            };
            const service = isSponsor
                ? TalentsService.registerSponsor
                : TalentsService.registerTalent;

            service(newUser)
                .then((response) => {
                    resetAll();
                    const { token, ...user } = response;
                    setCookie("token", token, {
                        path: "/",
                        maxAge: 3600,
                    });
                    setCookie("user", JSON.stringify(user), {
                        path: "/",
                        maxAge: 3600,
                    });
                    setAuth(true);
                    redirectAfterRegister();

                    if (isSponsor) {
                        navigate(`/sponsor`);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
    return (
        <>
            <form onSubmit={handlerSubmit} className={s.form}>
                <label className={s.toggleSwitch}>
                    <input
                        className={s.checkbox}
                        type="checkbox"
                        checked={isSponsor}
                        onChange={handleChange}
                    />
                    <span className={s.slider}>
                        <span className={s.slider_title}>
                            {isSponsor ? "Sponsor" : "Talent"}
                        </span>

                        <span className={s.round}></span>
                    </span>
                </label>
                <span>the mark * indicating that the field is required</span>

                <div className={s.input_block}>
                    <label htmlFor="first_name">First Name*</label>
                    <Input
                        name="first_name"
                        type="text"
                        required
                        placeholder="John"
                        autoComplete="off"
                        className={`${s.input} ${
                            firstName.state ? "" : s.error
                        }`}
                        onChange={(event) =>
                            setFirstName((prev) => ({
                                ...prev,
                                name: event.target.value,
                            }))
                        }
                    ></Input>
                    <span>{firstName.state ? "" : firstName.error}</span>
                </div>
                <div className={s.input_block}>
                    <label htmlFor="last_name">Last Name*</label>
                    <Input
                        name="last_name"
                        type="text"
                        required
                        placeholder="Brown"
                        autoComplete="off"
                        className={`${s.input} ${
                            lastName.state ? "" : s.error
                        }`}
                        onChange={(event) =>
                            setLastName((prev) => ({
                                ...prev,
                                name: event.target.value,
                            }))
                        }
                    ></Input>
                    <span>{lastName.state ? "" : lastName.error}</span>
                </div>
                <div className={s.input_block}>
                    <label htmlFor="login">Login*</label>
                    <Input
                        name="login"
                        type="text"
                        required
                        placeholder="example@gmail.com"
                        autoComplete="off"
                        className={`${s.input} ${email.state ? "" : s.error}`}
                        onChange={(event) =>
                            setEmail((prev) => ({
                                ...prev,
                                mail: event.target.value,
                            }))
                        }
                    ></Input>
                    <span>{email.state ? "" : email.error}</span>
                </div>
                {!isSponsor ? (
                    <div className={s.input_block}>
                        <label htmlFor="specialization">Specialization*</label>
                        <Input
                            name="specialization"
                            type="text"
                            required
                            placeholder="Java Developer"
                            autoComplete="off"
                            className={`${s.input} ${
                                specialization.state ? "" : s.error
                            }`}
                            onChange={(event) =>
                                setSpecialization((prev) => ({
                                    ...prev,
                                    spec: event.target.value,
                                }))
                            }
                        ></Input>
                        <span>
                            {specialization.state ? "" : specialization.error}
                        </span>
                    </div>
                ) : (
                    ""
                )}

                <div className={s.input_block}>
                    <label htmlFor="password">Password*</label>
                    <Input
                        name="password"
                        type="password"
                        required
                        placeholder="your password"
                        autoComplete="off"
                        className={`${s.input} ${
                            password.state ? "" : s.error
                        }`}
                        onChange={(event) =>
                            setPassword((prev) => ({
                                ...prev,
                                pswd: event.target.value,
                            }))
                        }
                    ></Input>
                    <span>{password.state ? "" : password.error}</span>
                </div>
                <div className={s.input_block}>
                    <label htmlFor="repeated_password">Repeat Password*</label>
                    <Input
                        name="repeated_password"
                        type="password"
                        required
                        placeholder="repeat password"
                        autoComplete="off"
                        className={`${s.input} ${
                            repeatPassword.state ? "" : s.error
                        }`}
                        onChange={(event) =>
                            setRepeatPassword((prev) => ({
                                ...prev,
                                repeat: event.target.value,
                            }))
                        }
                    ></Input>
                    <span>
                        {repeatPassword.state ? "" : repeatPassword.error}
                    </span>
                </div>

                <Button type="submit" className={s.btn}>
                    Register
                </Button>
            </form>
            <div className={s.info}>
                <div className={s.title}>Already have an account?</div>
                <ul className={s.advices}>
                    {advices.map(({ title, text }) => (
                        <li key={title}>
                            <h4>{title}</h4>
                            <p>{text}</p>
                        </li>
                    ))}
                </ul>
                <Button className={s.btn} onClick={() => switcher(true)}>
                    Login
                </Button>
            </div>
        </>
    );
}
