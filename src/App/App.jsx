import { Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { TalentPage } from "../components/TalentPage";
import { TalentsListPage } from "../components/TalentsListPage";
import { ProfilePage } from "../components/ProfilePage";
import { SponsorPage } from "../components/SponsorPage";
import "./App.scss";
import { NotFoundPage } from "../components/NotFoundPage";
import { RequireAuth } from "../hoc/RequireAuth";
import { ListProofsPage } from "../components/ListProofsPage";

export function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route
                    index
                    element={<Navigate to="/talents" replace={true} />}
                />
                <Route path="talents" element={<TalentsListPage />} />
                <Route path="proofs" element={<ListProofsPage />} />

                <Route element={<RequireAuth redirect={"/talents"} />}>
                    <Route path="talents/:id" element={<TalentPage />} />
                </Route>
                <Route path="profile" element={<ProfilePage />} />
                <Route path="sponsor" element={<SponsorPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}
