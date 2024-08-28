import React from "react";

import Select, { components } from "react-select";

export function ValueCross(props) {
    const {
        skills,
        setSkills,
        setDeletedSkills,
        deletedSkills,
        setSkillId,
        skillId,
    } = props;

    const handleClearOne = (removedSkill) => {
        setDeletedSkills((prevDeletedSkills) => [
            ...prevDeletedSkills,
            removedSkill,
        ]);
        setSkillId((prevSkills) => {
            if (removedSkill.id && removedSkill.isNew) {
                return prevSkills.filter(
                    (skill) => skill.id !== removedSkill.id
                );
            } else {
                return prevSkills.filter((skill) => skill !== removedSkill);
            }
        });
        setSkills((prevSkills) => {
            if (removedSkill.id && removedSkill.isNew) {
                return prevSkills.filter(
                    (skill) => skill.id !== removedSkill.id
                );
            } else {
                return prevSkills.filter((skill) => skill !== removedSkill);
            }
        });
    };

    return (
        <>
            {skills.length > 0 ? (
                <components.MultiValueRemove {...props}>
                    <span
                        style={{ cursor: "pointer" }}

                        onClick={() => handleClearOne(props.data)}

                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        x
                    </span>
                </components.MultiValueRemove>
            ) : (
                <components.MultiValueRemove {...props}>
                    <span
                        style={{ cursor: "pointer" }}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        x
                    </span>
                </components.MultiValueRemove>
            )}
        </>
    );
}
