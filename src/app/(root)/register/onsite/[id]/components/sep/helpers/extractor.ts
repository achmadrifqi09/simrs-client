export const extractPorvinceIdInUrl = (url: string): string | null => {
    const regex = /bpjs\/v-claim\/reference\/province\/(\d+)\/regency/;
    const match = url.match(regex);
    return match ? match[1] : null;
};

export const extractRegencyIdInUrl = (url: string): string | null => {
    const regex = /regency\/(\d+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
};
