import { Button } from "../../../../shared/components";
import edit from "./images/edit.svg";
import s from "./SponsorAbout.module.scss";

export function SponsorAbout({ editting, setEditting, save, setModalIsOpen, setCancelModalIsOpen, saveError }) {
    return (
        <div className={s.about}>
            <button
                className={s.edit}
                onClick={() => {
                    editting ? setCancelModalIsOpen(true) : setEditting(true);
                }}
            >
                <img src={edit} alt="edit" />
            </button>

            {editting ? (
                <>
                    <div className={s.btns}>
                        <Button onClick={() => setCancelModalIsOpen(true)} className={s.btn}>
                            Cancel
                        </Button>
                        <Button onClick={save} className={s.btn}>
                            Save
                        </Button>
                        <Button
                            className={s.btn}
                            onClick={() => {
                                setModalIsOpen(true);
                            }}
                        >
                            Delete profile
                        </Button>
                    </div>
                    {saveError && <div className={s.save_error}>{saveError}</div>}
                </>
            ) : (
                ""
            )}
        </div>
    );
}
