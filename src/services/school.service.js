import ApiService from './api.service'

const SchoolService = {
  searchSchools: async function(data) {
    try {
      const params = {
        params: data
      }
      const response = await ApiService.getParams('/schools/search', params)
      return response
    } catch (error) {
      throw error
    }
  },

  storeSchool: async function(data) {
    try {
      const response = await ApiService.post('/schools', data)
      return response
    } catch (error) {
      throw error
    }
  },
}

export default SchoolService
