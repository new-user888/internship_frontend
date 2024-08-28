import React, { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { TalentsContext } from "../context/TalentsContext";

export function RequireAuth({ redirect }) {
	const { auth } = useContext(UserContext);
	const { page, size } = useContext(TalentsContext);
	const location = useLocation();

	return auth ? (
		<Outlet />
	) : (
		<Navigate
			to={`${redirect}?page=${page}&size=${size}#auth`}
			state={{ from: location }}
			replace={true}
		/>
	);
}
