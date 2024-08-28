import { Button, Input } from "../../../../shared/components";
import s from "./SearchPanel.module.scss";

export function SearchPanel() {
    return (
        <div className={s.search_panel}>
            <Input id={s.long} className={s.input} type="text" placeholder="Name"/>
            <Input className={s.input} type="text" placeholder="Specialization"/>
            <Input className={s.input} type="text" placeholder="Skill"/>
            <Button className={s.btn}>Search</Button>
        </div>
    );
}
