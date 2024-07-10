import ApiService from './api.service';

const PatientService = {

  listPatients: async function({ page, itemsPerPage, sort, filter }) {
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

      const response = await ApiService.getParams('/patients', { params });
      return response;
    } catch (error) {
        throw error;
    }
  },

  searchPatient: async function(data) {
    try {
      const params = {
        params: data
      }
      const response = await ApiService.getParams('/patients/search', params)
      return response
    } catch (error) {
      throw error
    }
  },

  storePatient: async function(data) {
    try {
      const response = await ApiService.post('/patients', data)
      return response
    } catch (error) {
      throw error
    }
  },

  editPatient: async function(url) {
    try {
      const response = await ApiService.get(url)
      return response
    } catch (error) {
      throw error
    }
  },

  updatePatient: async function(id, data) {
    try {
      const response = await ApiService.put(`/patients/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  deletePatient: async function(data) {
    try {
      const response = await ApiService.deleteParams('/patients', {data: {patients: data}})
      return response
    } catch (error) {
      throw error
    }
  },

  pdfListPatient: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/patients/list-pdf',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  excelListPatient: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/patients/list-excel',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },
}

export default PatientService
