import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { useLocation, useNavigate } from "react-router";

import s from "./AuthModal.module.scss";
import { Login } from "./components/Login/Login";
import { Register } from "./components/Register/Register";
import { UserContext } from "../../../context/UserContext";

export function AuthModal() {
	const location = useLocation();
	const navigate = useNavigate();
	const { auth } = useContext(UserContext);

	const [isOpen, setIsOpen] = useState(false);
	const windowRef = useRef();
	const [showLoginForm, setShowLoginForm] = useState(true);

	const showModal = useCallback(() => {
		setIsOpen(true);
		document.body.style.overflowY = "hidden";
	}, []);
	const hideModal = useCallback(() => {
		setShowLoginForm(true);
		setIsOpen(false);
		document.body.style.overflowY = "auto";
	}, []);

	useEffect(() => {
		if (location.hash.includes("auth") && !auth) {
			showModal();
		} else {
			hideModal();			
		}
	}, [auth, hideModal, location.hash, location.state, navigate, showModal]);

	useEffect(() => {
		const handleClickOutside = (e) => {
			if (!windowRef.current.contains(e.target)) {
				navigate(location.pathname, { replace: true });
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [hideModal, location.pathname, navigate]);

	return (
		<div className={`${s.modal} ${isOpen ? s.show : s.hide}`}>
			<div
				className={`${s.window} ${isOpen ? s.show : s.hide}`}
				ref={windowRef}>
				<div className={s.content}>
					<div className={s.header}>
						<div className={s.header_btns}>
							<button
								className={`${s.header_btn} ${showLoginForm ? s.active : ""}`}
								onClick={() => setShowLoginForm(true)}>
								Login
							</button>
							<button
								className={`${s.header_btn} ${!showLoginForm ? s.active : ""} `}
								onClick={() => setShowLoginForm(false)}>
								Register
							</button>
						</div>
						<button
							className={s.close}
							onClick={() =>
								navigate(location.pathname + location.search, { replace: true })
							}>
							&#215;
						</button>
					</div>
					<div className={s.body}>
						{showLoginForm ? <Login switcher={ setShowLoginForm} /> : <Register switcher={ setShowLoginForm}/>}
					</div>
				</div>
			</div>
		</div>
	);
}
