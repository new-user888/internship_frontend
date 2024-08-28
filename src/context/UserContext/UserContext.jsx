import React, { createContext, useEffect, useMemo, useState } from "react";
import { useCookies } from "react-cookie";
import { TalentsService } from "../../services/api-services";

export const UserContext = createContext({
    auth: false,
    setAuth: () => {},
});

export function UserProvider({ children }) {
    const [auth, setAuth] = useState(false);
    const [token, setToken] = useState("");
    const [user, setUser] = useState({});
    const [cookies, setCookie] = useCookies(["token", "user"]);
    const [talentsProofs, setTalentsProofs] = useState([]);
    const [userInfo, setUserInfo] = useState({});
    const [role, setRole] = useState("");
    const [kudos, setKudos] = useState(0);
    const [proofs, setProofs] = useState({});
    const [currentSkills, setCurrentSkills] = useState([]);

    useEffect(() => {
        if (cookies.token) {
            setToken(cookies.token);
            setAuth(true);
        } else {
            setToken("");
            setAuth(false);
        }
    }, [cookies.token]);

    useEffect(() => {
        if (cookies.user) {
            setUser(cookies.user);
            setAuth(true);
        } else {
            setUser({});
            setAuth(false);
        }
    }, [cookies.user]);

    useEffect(() => {
        const refreshToken = () => {
            if (token !== "") {
                try {
                    TalentsService.getNewToken(token).then((res) => {
                        const newToken = res?.token;
                        if (newToken) {
                            setCookie("token", newToken);
                        }
                    });
                } catch (err) {
                    console.log(err);
                }
            }
        };
        setInterval(refreshToken, 1000 * 60 * 45); // 45 minutes refresh
        return clearInterval(refreshToken);
    }, [setCookie, token]);

    const userValue = useMemo(
        () => ({
            auth,
            setAuth,
            token,
            setToken,
            user,
            setUser,
            talentsProofs,
            setTalentsProofs,
            userInfo,
            setUserInfo,
            role,
            setRole,
            kudos,
            setKudos,
            proofs,
            setProofs,
            currentSkills,
            setCurrentSkills
        }),
        [auth, token, user, userInfo, talentsProofs, kudos, proofs, currentSkills]
    );

    return (
        <UserContext.Provider value={userValue}>
            {children}
        </UserContext.Provider>
    );
}
