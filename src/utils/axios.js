import axios from 'axios';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------
const baseURL = CONFIG.site.serverUrl;

const axiosInstance = axios.create({
  baseURL: CONFIG.site.serverUrl,
  headers: { 'ngrok-skip-browser-warning': 'true' },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      // Ensure sessionStorage is available (only in the browser)
      const token = sessionStorage.getItem('jwt_access_token'); // Retrieve token from sessionStorage

      if (token) {
        config.headers.Authorization = `Bearer ${token}`; // Set Authorization header dynamically
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/auth/me',
    signIn: `${baseURL}/login`,
    signUp: `${baseURL}/register`,
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },

  dashboard: {
    branches: `${baseURL}/branches`,
    get_employee: `${baseURL}/employee`,
    img: `${baseURL}/img`, 
    levelurgencies: `${baseURL}/levelurgencies`,
    main_case: `${baseURL}/main-cases`,
    receive_case: `${baseURL}/receive-case`,
    receivecaseJoin: `${baseURL}/receive-caseJoin`,
    status: `${baseURL}/status`,
    sub_case: `${baseURL}/subcasedata`,
    subcase: `${baseURL}/subcase`,
    subcasejoin: `${baseURL}/sub_casejoin`,
    team: `${baseURL}/team`,
    user: `${baseURL}/user`,
    
  },
  dashboard_post: {
    branchesPost: `${baseURL}/branches`,
    get_employeePost: `${baseURL}/employee`,
    imgPost: `${baseURL}/upload-image`, // เส้นทางนี้สำหรับการอัปโหลดไฟล์ภาพ
    levelurgenciesPost: `${baseURL}/levelurgencies`,
    main_casePost: `${baseURL}/main-cases`,
    receive_casePost: `${baseURL}/receive-case`,
    statusPost: `${baseURL}/status`,
    sub_casePost: `${baseURL}/subcasedata`,
    subcasePost: `${baseURL}/subcase`,
    teamPost: `${baseURL}/team`,
    userPost: `${baseURL}/user`,
  },
  dashboard_update: {
    branchesUpdate: `${baseURL}//branches/:branch_id`,
    get_employeeUpdate: `${baseURL}/employee/:id`,
    imgUpdate: `${baseURL}/img/:id`, // เส้นทางนี้สำหรับการอัปเดตข้อมูลภาพโดยใช้ ID
    levelurgenciesUpdate: `${baseURL}/levelurgencies/:id`,
    main_caseUpdate: `${baseURL}/main-cases/:id`,
    receive_caseUpdate: `${baseURL}//receive-case/:id`,
    statusUpdate: `${baseURL}/status/:id`,
    sub_caseUpdate: `${baseURL}/subcasedata/:id`,
    subcaseUpdate: `${baseURL}/subcase`,
    teamUpdate: `${baseURL}//team/:id`,
    userUpdate: `${baseURL}/user`,
  },

  dashboard_delete: {
    branchesdelete: `${baseURL}//branches/:branch_id`,
    get_employeedelete: `${baseURL}/employee/:id`,
    imgdelete: `${baseURL}/img/:id`, // เส้นทางนี้สำหรับการลบข้อมูลภาพโดยใช้ ID
    levelurgenciesdelete: `${baseURL}/levelurgencies/:id`,
    main_casedelete: `${baseURL}/main-cases/:id`,
    receive_casedelete: `${baseURL}//receive-case/:id`,
    statusdelete: `${baseURL}/status/:id`,
    sub_casedelete: `${baseURL}/subcasedata/:id`,
    subcasedelete: `${baseURL}/subcase`,
    teamdelete: `${baseURL}//team/:id`,
    userdelete: `${baseURL}/user`,
  },
};
