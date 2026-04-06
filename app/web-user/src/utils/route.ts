export function normalizeRouteId(value?: string | string[] | number | null) {
    if (value == null) {
        return "";
    }
    const nextValue = Array.isArray(value) ? value[0] : value;
    return String(nextValue).trim();
}
