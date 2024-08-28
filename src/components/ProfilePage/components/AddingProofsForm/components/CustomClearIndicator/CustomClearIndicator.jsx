import React from "react";
import Select, { components } from "react-select";
export function CustomClearIndicator(props) {
    const { skills, clearValue } = props;

    return (
        <>
            {skills.length > 0 ? (
                <components.ClearIndicator {...props}>
                    <span
                        onClick={clearValue}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        x
                    </span>
                </components.ClearIndicator>
            ) : (
                ""
            )}
        </>
    );
}
