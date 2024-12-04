import config from '@/config.json';

export const ApiUrl = config.VUE_APP_API_BASE_URL;

export const ApiUrlUsers = `${ApiUrl}/user`;
export const ApiUrlAssos = `${ApiUrl}/association`;
export const ApiUrlMembres = `${ApiUrl}/membre`;
export const ApiUrlTresories = `${ApiUrl}/tresorerie`;
