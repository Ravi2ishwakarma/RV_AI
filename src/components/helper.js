export function checkHeading(str) {
    return /^(\*)(\*)(.*)\$/.test(str);
}
export function removeHeadingstar(str) {
    const newstr = str.replace(/\*/g, "").replace(/:/g, '');
    return newstr;
}