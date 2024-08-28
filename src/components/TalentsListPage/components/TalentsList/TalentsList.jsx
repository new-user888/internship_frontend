import s from "./TalentsList.module.scss";
import { TalentCard } from "./components/TalentCard";


export function TalentsList({talents}) {
	return (
		<div className={s.talents_list}>
			{talents.map((talent) => (
				<TalentCard key={talent.id} talent={talent} />
			))}
		</div>
	);
}
