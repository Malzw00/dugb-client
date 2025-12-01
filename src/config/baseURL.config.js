// config/baseURL.js
const devURL  = import.meta.env.VITE_API_DEV_URL;
const prodURL = import.meta.env.VITE_API_PROD_URL;

const baseURL = import.meta.env.DEV ? devURL : prodURL;

export default baseURL;