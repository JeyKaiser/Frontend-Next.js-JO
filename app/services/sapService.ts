import axiosInstance from '@/utils/axiosInstance';

export const getParametros = async () => {
  try {
    const response = await axiosInstance.get('/sap/parametros/');
    return response.data;
  } catch (error) {
    console.error('Error fetching parametros:', error);
    throw error;
  }
};

export const getParametrosView = async () => {
  try {
    const response = await axiosInstance.get('/sap/parametros-view/');
    return response.data;
  } catch (error) {
    console.error('Error fetching parametros view:', error);
    throw error;
  }
};
