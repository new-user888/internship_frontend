export function handlerDropdown (event, content, show) {
	var targ = event.target;
	var drp = document.getElementsByClassName(content);
	for (const element of drp) {
		if (element.previousElementSibling === targ) {
			element.classList.toggle(show);
		} else {
			element.classList.remove(show);
		}
	}
};