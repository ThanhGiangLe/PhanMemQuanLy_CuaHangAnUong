const BASE_URL = "http://localhost:5248/api";

const API_ENDPOINTS = {
  LOGIN: `${BASE_URL}/user/login`,
  CHECK_EMAIL_EXISTS: `${BASE_URL}/email/check`,
  UPDATE_PASSWORD: `${BASE_URL}/user/update-password`,
  GET_ALL_FOOD_CATEGORIES: `${BASE_URL}/food/get-all-category`,
  GET_ALL_FOOD_ITEMS: `${BASE_URL}/food/get-all-food-items`,
  GET_ALL_ADDITIONAL_FOODS: `${BASE_URL}/food/get-all-additional-food`,
  ADD_ORDER: `${BASE_URL}/food/add-order`,
  ADD_ORDER_ITEM: `${BASE_URL}/food/add-order-item`,
  GET_ALL_EMPLOYEES: `${BASE_URL}/user`, // Lấy danh sách nhân viên từ database
  ADD_USER: `${BASE_URL}/user/add`,
  GET_ALL_TABLE: `${BASE_URL}/area/get-all-table`,
  GET_ALL_REVENUE_BY_EMPLOYEE: `${BASE_URL}/report/total-revenue-employee`,
  GET_ALL_REVENUE_BY_EMPLOYEE_AND_TIME: `${BASE_URL}/report/total-revenue-employee-time`,
  GET_ALL_REVENUE_BY_EMPLOYEE_AND_TIME_MONTH: `${BASE_URL}/report/total-revenue-employee-time-month`,
  GET_ALL_REVENUE_BY_CATEGORY: `${BASE_URL}/report/total-revenue-category`,
  GET_ALL_REVENUE_BY_CATEGORY_AND_TIME: `${BASE_URL}/report/total-revenue-category-time`,
  GET_ALL_REVENUE_BY_CATEGORY_AND_TIME_MONTH: `${BASE_URL}/report/total-revenue-category-time-month`,
  GET_ALL_REVENUE_BY_TIME: `${BASE_URL}/report/total-revenue-time`,
  GET_ALL_REVENUE_BY_TIME_MONTH: `${BASE_URL}/report/total-revenue-time-month`,
  GET_ALL_ORDERITEM_BESTSELING: `${BASE_URL}/report/get-all-orderitem-bestseling`,
  GET_ALL_ORDERITEM_BESTSELING_CURRENTDAY: `${BASE_URL}/report/get-all-orderitem-bestseling-currentday`,
  GET_ALL_ORDERITEM_BESTSELING_CURRENTMONTH: `${BASE_URL}/report/get-all-orderitem-bestseling-currentmonth`,
  GET_ALL_ORDER: `${BASE_URL}/report/get-all-order`,
  GET_ALL_ORDER_CURRENT_DAY: `${BASE_URL}/report/get-all-order-currentday`,
  GET_ALL_ORDER_CURRENT_MONTH: `${BASE_URL}/report/get-all-order-currentmonth`,
  GET_ALL_ORDER_FULL_NAME: `${BASE_URL}/report/get-all-order-fullname`,
  ADD_FOOD_ITEM: `${BASE_URL}/food/add-food-item`,
  DELETE_FOOD_ITEM: `${BASE_URL}/food/delete-food-item`,
  UPDATE_FOOD_ITEM: `${BASE_URL}/food/update-food-item`,
};

export default API_ENDPOINTS;
