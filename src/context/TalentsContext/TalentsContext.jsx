import React, { createContext, useEffect, useMemo, useState } from "react";
import { TalentsService } from "../../services/api-services";
import data from "../../shared/data/response.json";

export const TalentsContext = createContext({
    talents: [],
    setTalents: () => {},
    isLoading: false,
    setIsLoading: () => {},
    page: 0,
    setPage: () => {},
    size: 5,
    setSize: () => {},
    countOfPages: 0,
    setCountOfPages: () => {},
});

export function TalentsProvider({ children }) {
    const [talents, setTalents] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(5);
    const [countOfPages, setCountOfPages] = useState(0);

    const { getTalents } = TalentsService;

    useEffect(() => {
        setIsLoading(true);
        try {
            getTalents(page, size).then((response) => {
                setTalents(response.content);
                setCountOfPages(response.total_pages);
                setIsLoading(false);
            });
        } catch (error) {
            setIsLoading(false);
            console.log(error);
            setTalents(data.content);
        }
    }, [getTalents, page, size]);

    const talentsValue = useMemo(
        () => ({
            talents,
            setTalents,
            isLoading,
            setIsLoading,
            page,
            setPage,
            size,
            setSize,
            countOfPages,
            setCountOfPages,
        }),
        [countOfPages, isLoading, page, size, talents]
    );

    return (
        <TalentsContext.Provider value={talentsValue}>
            {children}
        </TalentsContext.Provider>
    );
}
