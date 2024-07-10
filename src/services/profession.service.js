import ApiService from './api.service'

const ProfessionService = {
  listProfessions: async function() {
    try {
      const response = await ApiService.get('/professions/listing')
      return response
    } catch (error) {
        throw error
    }
  },

  storeProfession: async function(data) {
    try {
      const response = await ApiService.post('/professions', data)
      return response
    } catch (error) {
      throw error
    }
  },
}

export default ProfessionService
