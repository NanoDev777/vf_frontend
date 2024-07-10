import ApiService from './api.service';

const TherapistService = {

  listTherapists: async function({ page, itemsPerPage, sort, filter }) {
    try {
      const params = {
        page,
        per_page: itemsPerPage,
      };

      if (sort) {
        params.sort = JSON.stringify(sort);
      }

      if (filter) {
        Object.keys(filter).forEach(key => {
          params[key] = filter[key];
        });
      }

      const response = await ApiService.getParams('/therapists', { params });
      return response;
    } catch (error) {
        throw error;
    }
  },

  searchTherapists: async function(data) {
    try {
      const params = {
        params: data
      }
      const response = await ApiService.getParams('/therapists/search', params)
      return response
    } catch (error) {
      throw error
    }
  },

  storeTherapist: async function(data) {
    try {
      const response = await ApiService.post('/therapists', data)
      return response
    } catch (error) {
      throw error
    }
  },

  editTherapist: async function(url) {
    try {
      const response = await ApiService.get(url)
      return response
    } catch (error) {
      throw error
    }
  },

  updateTherapist: async function(id, data) {
    try {
      const response = await ApiService.put(`/therapists/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  deleteTherapist: async function(data) {
    try {
      const response = await ApiService.deleteParams('/therapists', {data: {therapists: data}})
      return response
    } catch (error) {
      throw error
    }
  },
}

export default TherapistService
