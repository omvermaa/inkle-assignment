import axios from 'axios';

// URLs from the assignment document
const BASE_URL = 'https://685013d7e7c42cfd17974a33.mockapi.io';

export const api = {
  // GET /taxes
  getTaxes: async () => {
    const response = await axios.get(`${BASE_URL}/taxes`);
    return response.data;
  },
  
  // Country list for dropdown
  getCountries: async () => {
    const response = await axios.get(`${BASE_URL}/countries`);
    return response.data;
  },

  // PUT /taxes/:id
  updateTax: async (id, data) => {
    const response = await axios.put(`${BASE_URL}/taxes/${id}`, data);
    return response.data;
  }
};