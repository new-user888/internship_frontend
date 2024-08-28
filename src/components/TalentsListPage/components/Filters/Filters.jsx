import { useCallback, useEffect, useState } from "react";
import { Filter } from "./components/Filter/Filter";
import { FilterValue } from "./components/FilterValue";
import { SortValue } from "./components/SortValue";
import s from "./Filters.module.scss";

const filterExceptions = ["id", "firstname", "lastname", "image"];
const sortFields = ["name", "specialization"];

export function Filters({ talents }) {
	const [filters, setFilters] = useState([]);
	const [selectedSort, setSelectedSort] = useState("");

	const handleSelect = useCallback((sort) => {
		if (selectedSort === sort) {
			setSelectedSort("");
		} else {			
			setSelectedSort((prev) => sort);
		}
	});

	const parseFiltersFields = useCallback(() => {
		let filtersArr = []; // итоговый массив
		let fields = []; // массив для названий полей по которым будет осуществляться фильтрация
		for (let i = 0; i < talents.length; i++) {
			for (const key of Object.keys(talents[i])) {
				if (!fields.includes(key) && !filterExceptions.includes(key)) {
					// выбираем поля по которым будем фильтровать учитывая исключения
					fields.push(key);
				}
			}
		}
		for (let i = 0; i < fields.length; i++) {
			let values = []; // массив в котором будут храниться значения фильтрации для каждого поля
			for (let j = 0; j < talents.length; j++) {
				const val = talents[j][fields[i]]; // существующие значения (перед добавлением надо проверить дубликаты)
				switch (
					typeof val // значения могут быть либо в строков виде, либо в виде массива
				) {
					case "object":
						if (val.length !== 0) {
							for (const v of val) {
								if (!values.includes(v.toString().toLowerCase())) {
									// чтобы собрать итоговый массив значений проверяем дубликаты
									values.push(v.toString().toLowerCase());
								}
							}
						}
						break;

					case "string":
						if (!values.includes(val.toLowerCase())) {
							// также проверяем дубликаты
							values.push(val.toLowerCase());
						}
						break;

					default:
						break;
				}
			}
			filtersArr.push({
				// формируем итоговый массив объектов из полей и их возможных значений (уже без дубликатов)
				field: fields[i],
				values: values,
			});
		}
		return filtersArr;
	}, [talents]);

	useEffect(() => {
		const newArr = parseFiltersFields();
		setFilters(newArr);
	}, [parseFiltersFields, talents]);

	return (
		<div className={s.filters_block}>
			<div className={s.title}>Filters</div>
			<div className={s.filters}>
				<Filter field={"Sort by"}>
					{sortFields.map((sort) => (
						<SortValue
							selected={selectedSort}
							key={sort}
							value={sort}
							onClick={() => handleSelect(sort)}
						/>
					))}
				</Filter>
				{filters.map((filter, index) => {
					return (
						<Filter key={index} field={filter.field}>
							{filter.values.map((value) => {
								return <FilterValue key={value} value={value} />;
							})}
						</Filter>
					);
				})}
			</div>
		</div>
	);
}
