// src/services/adminService.js
import { loanApiClient,userApiClient } from "./apiClient";
import { API_CONFIG } from "../config/apiConfig";

export const getLoans = async () => {
  try {
    const response = await loanApiClient.get(API_CONFIG.ENDPOINTS.ALL_LOANS);
    return response.data;
  } catch (error) {
    console.error("Error fetching loans:", error);
    throw error;
  }
};


export const getCustomers = async () => {
  try {
    const response = await userApiClient.get(API_CONFIG.ENDPOINTS.USERS);
    return response.data.filter(customer=>customer.roles[0]==='user' && customer.active===true);
  } catch (error) {
    console.error('Error fetching customers:', error);
    throw error;
  }
};

export const addUser = async (userData) => {
  try {
    const response = await userApiClient.post(API_CONFIG.ENDPOINTS.REGISTER, userData);
    return response.data;
  } catch (error) {
    console.error("Error adding customer:", error);
    throw error;
  }
};

export const deactivateCustomer = async (email) => {
  try {
    const response = await userApiClient.patch(API_CONFIG.ENDPOINTS.DEACTIVATE,{email});
    return response.data;
  } catch (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
};

export const getBankers = async () => {
  try {
    const response = await userApiClient.get(API_CONFIG.ENDPOINTS.USERS);
    return response.data.filter(banker=>banker.roles[0]==='banker' && banker.active===true);
  } catch (error) {
    console.error("Error fetching bankers:", error);
    throw error;
  }
};


export const deactivateBanker = async (email) => {
  try {
    const response = await userApiClient.patch(`${API_CONFIG.ENDPOINTS.DEACTIVATE}`,{email});
    return response.data;
  } catch (error) {
    console.error("Error deleting banker:", error);
    throw error;
  }
};

