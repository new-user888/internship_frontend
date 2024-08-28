import React, { useCallback, useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../../../../../context/UserContext/UserContext";
import { Button, Input } from "../../../../../shared/components";
import s from "./Login.module.scss";
import { TalentsService } from "../../../../../services/api-services";
import { useCookies } from "react-cookie";
import { switchCase } from "@babel/types";

const advices = [
    {
        title: "Searching and connecting",
        text: "You can search for the talents all around the globe and connect with them easily.",
    },
    {
        title: "Upload any quantity of proofs",
        text: "It is allowed for you to upload any quantity of proofs you want.",
    },
    {
        title: "Job alerts",
        text: " You will be immediately recognised, when employers will want to make connection.",
    },
    {
        title: "Free CV review",
        text: "It is allowed to have the CV review for free!",
    },
];

export function Login({ switcher }) {
    const location = useLocation();
    const navigate = useNavigate();

    const { login } = TalentsService;

    const [email, setEmail] = useState({ mail: "", error: "", state: true });
    const [password, setPassword] = useState({
        pswd: "",
        error: "",
        state: true,
    });
    const [errMessage, setErrMessage] = useState("");
    const [cookies, setCookie, removeCookie] = useCookies(["token", "user"]);
    const { setAuth } = useContext(UserContext);

    const validateEmail = useCallback(() => {
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
    }, [email.mail]);

    const validatePassword = useCallback(() => {
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
    }, [password.pswd]);

    const validateForm = useCallback(() => {
        return validateEmail() && validatePassword();
    }, [validateEmail, validatePassword]);

    const redirectAfterLogin = useCallback(() => {
        if (location.state !== null) {
            navigate(location.state.from.pathname, { replace: true });
        } else {
            navigate(location.pathname + location.search, { replace: true });
        }
    }, [location.pathname, location.search, location.state, navigate]);

    const handlerSubmit = useCallback(
        (e) => {
            e.preventDefault();
            if (validateForm()) {
                login(email.mail.toLowerCase(), password.pswd)
                    .then((response) => {
                        setErrMessage("");
                        setEmail({ mail: "", error: "", state: true });
                        setPassword({
                            pswd: "",
                            error: "",
                            state: true,
                        });
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
                        redirectAfterLogin();
                    })
                    .catch((err) => {
                        if (err.response.status === 401) {
                            setErrMessage("Incorrect Login or Password");
                        }
                    });


            }
        },
        [
            email.mail,
            login,
            password.pswd,
            redirectAfterLogin,
            setAuth,
            setCookie,
            validateForm,
        ]
    );

    return (
        <>
            <form onSubmit={handlerSubmit} className={s.form}>
                <span>the mark * indicating that the field is required</span>
                <div className={s.input_block}>
                    <label htmlFor="login">Login*</label>
                    <Input
                        name="login"
                        type="text"
                        required
                        value={email.mail}
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
                <div className={s.input_block}>
                    <label htmlFor="password">Password*</label>
                    <Input
                        name="password"
                        type="password"
                        required
                        value={password.pswd}
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
                <div className={s.controls}>
                    <Button type="submit" className={s.btn}>
                        Login
                    </Button>

                    {errMessage && (
                        <div className={s.error_message}>{errMessage}</div>
                    )}
                </div>
            </form>
            <div className={s.info}>
                <div className={s.title}>Not Registered?</div>
                <ul className={s.advices}>
                    {advices.map(({ title, text }) => (
                        <li key={title}>
                            <h4>{title}</h4>
                            <p>{text}</p>
                        </li>
                    ))}
                </ul>
                <Button className={s.btn} onClick={() => switcher(false)}>
                    Register
                </Button>
            </div>
        </>
    );
}
