// First letter Capitalized function
export const firstLetterCap = (str: string) => {
    if (str === undefined) {
        return null;
    }
    if (str.length < 0) {
        return null;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
};
export const splitEmail = (email: string) => {
    const [localPart, domain] = email.split('@');
    const [beforePlus, afterPlus = ''] = localPart.split('+');
    return {
        beforePlus,
        afterPlus,
        domain
    };
}
