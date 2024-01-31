
export function compareNames(a: string, b: string): number {
    const the = "[Tt][Hh][Ee] *";
    const nameA = stripPrefix(a.toLowerCase().trim(), the);
    const nameB = stripPrefix(b.toLowerCase().trim(), the);
    return nameA.localeCompare(nameB);
}

function stripPrefix(name: string, prefix: string): string {
    return name.replace(new RegExp("^" + prefix), "");
}