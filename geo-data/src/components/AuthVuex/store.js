import { createStore } from 'vuex';
import axiosInstance from '@/config/axios';

const store = createStore({
  state: {
    user: null,
    isLoggedIn: false,
    registerError: null,
    registerSuccess: false,
},

  mutations: {
    SET_USER(state, user) {
      state.user = user;
      state.isLoggedIn = true;
    },
    LOGOUT_USER(state) {
      state.user = null;
      state.isLoggedIn = false;
    },
    SET_REGISTER_ERROR(state, error) {
      state.registerError = error;
      state.registerSuccess = false;
    },
    SET_REGISTER_SUCCESS(state) {
      state.registerError = null;
      state.registerSuccess = true;
    },
    SET_LOGIN_ERROR(state, error) {
        state.loginError = error;
        state.isLoggedIn = false;
      },
  },
  actions: {
    async loginUser({ commit }, formData) {
        commit('SET_LOGIN_PROGRESS', true);
        try {
          const response = await axiosInstance.post('http://localhost:9050/api/users/login', formData);
          
          if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            
            // Set default authorization header for future requests
            axiosInstance.defaults.headers.common['Authorization'] = response.data.token;
            
            // Fetch user details
            const userResponse = await axiosInstance.get('http://localhost:9050/api/users/account');
            commit('SET_USER', userResponse.data);
            return { success: true };
          } else {
            throw new Error('No token received');
          }
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
          commit('SET_LOGIN_ERROR', errorMessage);
          return { success: false, error: errorMessage };
        } 
      },

    async registerUser({ commit }, formData) {
      try {
        const response = await axiosInstance.post('http://localhost:9050/api/users/register', formData);
        commit('SET_REGISTER_SUCCESS');
        return { success: true, data: response.data };
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Registration failed';
        commit('SET_REGISTER_ERROR', errorMessage);
        return { success: false, error: errorMessage };
      }
    },

    logoutUser({ commit }) {
        localStorage.removeItem('token');
        commit('LOGOUT_USER');
      },
  },
  getters: {
    user: (state) => state.user,
    isLoggedIn: (state) => state.isLoggedIn,
    registerError: (state) => state.registerError,
    registerSuccess: (state) => state.registerSuccess,
    loginError: (state) => state.loginError,
  }
});

export default store;
