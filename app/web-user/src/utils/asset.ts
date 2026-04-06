import { BASE_URL } from '@/request';

const absoluteUrlPattern = /^(https?:)?\/\//i;

export function resolveAssetUrl(url?: string | null) {
    if (!url) {
        return '';
    }
    if (absoluteUrlPattern.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
        return url;
    }
    return `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`;
}
