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
    signIn: `${baseURL}/auth/login`,
    signUp: `${baseURL}/auth/register`,
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
    branches: `${baseURL}/branch/Getall-branch`,
    get_employee: `${baseURL}/Employee/GetEmployeesall`,
    img: `${baseURL}/img`,
    levelurgencies: `${baseURL}/levelUrgent/Getall-levelUrgent`,
    main_case: `${baseURL}/maincase/get-all-maincases`,
    receive_case: `${baseURL}/receivecase/getreceivecase`,
    receivecaseJoin: `${baseURL}/receivecase/getreceivecase`,
    status: `${baseURL}/status/get-all-statuses`,
    sub_case: `${baseURL}/subcase-type/get-all-subcase-types`,
    subcase: `${baseURL}/subcase`,
    subcasejoin: `${baseURL}/sub_casejoin`,
    team: `${baseURL}/team/get-all-teams`,
    user: `${baseURL}/users/GetAll-Users`,
  },
  dashboard_post: {
    branchesPost: `${baseURL}/branch/create-branch`,
    get_employeePost: `${baseURL}/Employee/createEmployee`,
    imgPost: `${baseURL}/upload-image`,
    levelurgenciesPost: `${baseURL}/levelUrgent/create-levelUrgent`,
    main_casePost: `${baseURL}/maincase/create-maincase`,
    receive_casePost: `${baseURL}receivecase/insert`,
    statusPost: `${baseURL}/status/create-status`,
    sub_casePost: `${baseURL}/subcasedata`,
    subcasePost: `${baseURL}/subcase`,
    teamPost: `${baseURL}/team/add-team`,
    userPost: `${baseURL}/auth/register`,
  },
  dashboard_update: {
    branchesUpdate: `${baseURL}/branch/update/:id`,
    get_employeeUpdate: `${baseURL}/Employee/update/:id`,
    imgUpdate: `${baseURL}/img/:id`,
    levelurgenciesUpdate: `${baseURL}/levelUrgent/update/:id`,
    main_caseUpdate: `${baseURL}/maincase/update/:id`,
    receive_caseUpdate: `${baseURL}/receivecase/updatecase/:id`,
    statusUpdate: `${baseURL}/status/update/:id`,
    sub_caseUpdate: `${baseURL}/subcasedata/:id`,
    subcaseUpdate: `${baseURL}/subcase`,
    teamUpdate: `${baseURL}/team/update/:id`,
    userUpdate: `${baseURL}/users/:id`,
  },

  dashboard_delete: {
    branchesdelete: `${baseURL}//branches/:branch_id`,
    get_employeedelete: `${baseURL}/employee/:id`,
    imgdelete: `${baseURL}/img/:id`, // เส้นทางนี้สำหรับการลบข้อมูลภาพโดยใช้ ID
    levelurgenciesdelete: `${baseURL}/levelurgencies/:id`,
    main_casedelete: `${baseURL}/main-cases/:id`,
    receive_casedelete: `${baseURL}/receivecase/deletecase/:id`,
    statusdelete: `${baseURL}/status/delete/:id`,
    sub_casedelete: `${baseURL}/subcasedata/:id`,
    subcasedelete: `${baseURL}/subcase`,
    teamdelete: `${baseURL}/team/delete/:id`,
    userdelete: `${baseURL}/users/:id`,
  },
};
