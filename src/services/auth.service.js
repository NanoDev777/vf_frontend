import ApiService from './api.service'

const AuthService = {
  logout: async function() {
    try {
      const response = await ApiService.post('/logout')
      return response
    } catch (error) {
      throw error
    }
  },
}

export default AuthService
