import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./shared/styles/index.scss";
import { App } from "./App";
import { TalentsProvider } from "./context/TalentsContext";
import { UserProvider } from "./context/UserContext";
import { CookiesProvider } from "react-cookie";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	// <React.StrictMode>
	<CookiesProvider>
		<UserProvider>
			<TalentsProvider>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</TalentsProvider>
		</UserProvider>
	</CookiesProvider>
	// </React.StrictMode>
);
