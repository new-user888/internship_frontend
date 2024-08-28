export function validateFirstName(firstName) {
    const FIRST_NAME_REGEXP = /^[a-zA-Z'\s]{1,30}$/;
    if (FIRST_NAME_REGEXP.test(String(firstName).toLowerCase())) {
        return { error: "", state: true };
    } else {
        let msg = "";
        if (firstName.trim() === "") {
            msg = "*empty field";
        } else if (firstName.length > 30) {
            msg = "*the value is too long";
        } else if (!FIRST_NAME_REGEXP.test(firstName)) {
            msg = "*you can use only latins letters";
        } else {
            msg = "*not valid";
        }
        return { error: msg, state: false };
    }
}

export function validateLastName(lastName) {
    const LAST_NAME_REGEXP = /^[a-zA-Z'\s]{1,30}$/;
    if (LAST_NAME_REGEXP.test(String(lastName).toLowerCase())) {
        return { error: "", state: true };
    } else {
        let msg = "";
        if (lastName.trim() === "") {
            msg = "*empty field";
        } else if (lastName.length > 30) {
            msg = "*the value is too long";
        } else if (!LAST_NAME_REGEXP.test(lastName)) {
            msg = "*you can use only latins letters";
        } else {
            msg = "*not valid";
        }
        return { error: msg, state: false };
    }
}

export function validateSpecialization(specialization) {
    const SPECIALIZATION_REGEXP = /^[a-zA-Z0-9'\s]{1,70}$/;
    if (SPECIALIZATION_REGEXP.test(String(specialization).toLowerCase())) {
        return {error:"", state:true};
    } else {
		let msg = "";
        if (specialization.trim() === "") {
			msg = "*empty field";
        } else if (specialization.length > 70) {
			msg = "*the value is too long";
        } else if (!SPECIALIZATION_REGEXP.test(String(specialization))) {
			msg = "*you can use only latins letters and numbers";
        } else {
			msg = "*not valid";
        }
        return {error:msg, state:false};
    }
}

export function validateTalent(talent) {
	const TALENT_REGEXP = /^[A-Za-z0-9'\s]{1,30}$/;
	if (TALENT_REGEXP.test(String(talent).toLowerCase()) && talent.trim().length !== 0) {
		return {error:"", state:true};
	} else {
		let msg = "";
        if (talent.trim().length === 0) {
			msg = "*empty field";
		}else if (talent.length > 30) {
			msg = "*the value is too long";
		} else if (!TALENT_REGEXP.test(String(talent))) {
			msg = "*using incorrect symbols";
		}
		return {error:msg, state:false};
	}
}

export function validateLinks(obj) {
    const LINKS_REGEXP = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
	let arr = [];
    obj.forEach((el)=>{
        if(el.link.trim() === ""){}
        else if(!LINKS_REGEXP.test(String(el.link))){
            arr.push(el.id)
        }
    })
    return arr;
}
