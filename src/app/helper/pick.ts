// export const pick = <T extends Record<string, unknown>, k extends keyof T>(
//     obj: T,
//     keys: k[]
// ): Partial<T> => {
//     console.log(obj, keys);
//     const finalObj: Partial<T> = {};
//     for (const key of keys) {
//         if (obj && obj.hasOwnProperty.call(obj, key)) {
//             finalObj[key] = obj[key];
//         }
//     }
//     console.log(finalObj);
//     return finalObj;
// };

export const pick = <T extends Record<string, unknown>, k extends keyof T>(
    obj: T,
    keys: k[]
): Partial<T> => {
    const newObj: Partial<T> = {};
    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            newObj[key] = obj[key];
        }
    }
    return newObj;
};
