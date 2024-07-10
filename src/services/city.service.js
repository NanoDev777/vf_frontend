import ApiService from './api.service'

const CityService = {
  listCities: async function() {
    try {
      const response = await ApiService.get('/cities/listing')
      return response
    } catch (error) {
      throw error
    }
  },

  storeCity: async function(data) {
    try {
      const response = await ApiService.post('/cities', data)
      return response
    } catch (error) {
      throw error
    }
  },
}

export default CityService
