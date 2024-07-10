import ApiService from './api.service';

const PeopleService = {
  listPeople: async function({ page, itemsPerPage, sort, filter }) {
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

      const response = await ApiService.getParams('/people', { params });
      return response;
    } catch (error) {
        throw error;
    }
  },

  searchPeoples: async function(data) {
    try {
      const params = {
        params: data
      }
      const response = await ApiService.getParams('/people/search', params)
      return response
    } catch (error) {
      throw error
    }
  },

  storePeople: async function(data) {
    try {
      const response = await ApiService.post('/people', data)
      return response
    } catch (error) {
      throw error
    }
  },

  editPeople: async function(url) {
    try {
      const response = await ApiService.get(url)
      return response
    } catch (error) {
      throw error
    }
  },

  updatePeople: async function(id, data) {
    try {
      const response = await ApiService.put(`/people/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  deletePeople: async function(data) {
    try {
      const response = await ApiService.deleteParams('/people', {data: {people: data}})
      return response
    } catch (error) {
      throw error
    }
  },
}

export default PeopleService
