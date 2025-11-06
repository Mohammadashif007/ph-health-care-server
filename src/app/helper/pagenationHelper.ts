// type TOptions = {
//     page?: string | number;
//     limit?: string | number;
//     sortBy?: string;
//     sortOrder?: string;
// };

// type TOptionsResult = {
//     page: number;
//     limit: number;
//     skip: number;
//     sortBy: string;
//     sortOrder: string;
// };

// export const calculatePagination = (options: TOptions): TOptionsResult => {
//     const page: number = Number(options.page) || 1;
//     const limit: number = Number(options.limit) || 10;
//     const skip: number = (Number(page) - 1) * limit;

//     const sortBy: string = options.sortBy || "createdAt";
//     const sortOrder: string = options.sortOrder || "desc";

//     return {
//         page,
//         limit,
//         skip,
//         sortBy,
//         sortOrder,
//     };
// };

type TOptions = {
    page?: string | number;
    limit?: string | number;
    sortBy?: string;
    sortOrder?: string;
};

type TOptionsReturn = {
    page: number;
    limit: number;
    skip: number;
    sortBy: string;
    sortOrder: string;
};

export const calculatePagination = (options: TOptions): TOptionsReturn => {
    const page = Number(options.page) || 1;
    const limit = Number(options.limit) || 10;
    const skip = (Number(page) - 1) * limit;

    const sortBy = options.sortBy || "createdAt";
    const sortOrder = options.sortOrder || "desc";

    return {
        page,
        limit,
        skip,
        sortBy,
        sortOrder,
    };
};
