import { apiService } from './apiService';

export const recipeService = {
  getAll() {
    return apiService.get('/recipes');
  },

  create(data) {
    return apiService.post('/recipes', data);
  },

  update(id, data) {
    return apiService.put(`/recipes/${id}`, data);
  },

  delete(id) {
    return apiService.delete(`/recipes/${id}`);
  },
};