import { apiService } from './apiService';

export const ingredientService = {
  searchByName(term) {
    return apiService.get(`/ingredients/name/${term}`);
  },
};