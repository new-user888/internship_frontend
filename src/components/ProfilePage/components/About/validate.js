export function validateBio(bio) {
    const BIO_REGEXP = /^[A-Za-z0-9'".,:;@#?!()[\]*_/—-\s]{0,255}$/;
    if (BIO_REGEXP.test(String(bio).toLowerCase())) {
        return { error: "", state: true };
    } else {
        let msg = "";
        if (bio.length > 255) {
            msg = "*the value is too long (not more 255 symbols)";
        } else if (!BIO_REGEXP.test(String(bio))) {
            msg = "*using incorrect symbols";
        }
        return { error: msg, state: false };
    }
}

export function validateAdditionalInfo(additionalInfo) {
    const ADDTIONAL_INFO_REGEXP = /^[A-Za-z0-9'".,:;@#?!()[\]*_/—-\s]{0,255}$/;
    if (ADDTIONAL_INFO_REGEXP.test(String(additionalInfo).toLowerCase())) {
        return { error: "", state: true };
    } else {
        let msg = "";
        if (additionalInfo.length > 255) {
            msg = "*the value is too long (not more 255 symbols)";
        } else if (!ADDTIONAL_INFO_REGEXP.test(String(additionalInfo))) {
            msg = "*using incorrect symbols";
        }
        return { error: msg, state: false };
    }
}

export function validateContacts(contacts) {
    if (contacts.length > 400) {
        return { error: "*the value is too long (not more 400 symbols)", state: false };
    } else {
        return { error: "", state: true };
    }
}

// function validatePassword() {
//     if (profile.password !== password.pswd && password.pswd.length !== 0) {
//         setPassword((prev) => ({
//             ...prev,
//             error: "*password doesn't equal to the previous one",
//         }));
//         setPassword((prev) => ({ ...prev, state: false }));
//         return false;
//     } else if (
//         newPassword.pswd.length !== 0 &&
//         password.pswd.length === 0
//     ) {
//         setPassword((prev) => ({ ...prev, error: "*empty field" }));
//         setPassword((prev) => ({ ...prev, state: false }));
//         return false;
//     } else {
//         setPassword((prev) => ({ ...prev, state: true }));
//         return true;
//     }
// }

// function validateNewPassword() {
//     const NEW_PASSWORD_REGEXP = /^[a-zA-Z0-9]{8,}$/;

//     if (
//         (NEW_PASSWORD_REGEXP.test(String(newPassword.pswd).toLowerCase()) &&
//             newPassword.pswd !== password.pswd) ||
//         (newPassword.pswd.length === 0 && password.pswd.length === 0)
//     ) {
//         setNewPassword((prev) => ({ ...prev, state: true }));
//         return true;
//     } else {
//         if (newPassword.pswd.length === 0) {
//             setNewPassword((prev) => ({ ...prev, error: "*empty field" }));
//         } else if (
//             newPassword.pswd === password.pswd &&
//             newPassword.pswd.length !== 0
//         ) {
//             setNewPassword((prev) => ({
//                 ...prev,
//                 error: "*new password can't be equal to the previous one",
//             }));
//         } else if (
//             newPassword.pswd.length < 8 &&
//             newPassword.pswd.length !== 0
//         ) {
//             setNewPassword((prev) => ({
//                 ...prev,
//                 error: "*password should be more than or equal 8 symbols",
//             }));
//         } else if (!/^[a-zA-Z0-9]$/.test(newPassword.pswd)) {
//             setNewPassword((prev) => ({
//                 ...prev,
//                 error: "*you can use only latins letters and numbers",
//             }));
//         }
//         setNewPassword((prev) => ({ ...prev, state: false }));
//         return false;
//     }
// }
