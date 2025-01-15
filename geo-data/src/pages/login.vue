<template>
    <div class="login-container">
      <h2>Login Page</h2>
      
      <!-- Error Alert -->
      <div v-if="loginError" class="alert alert-error">
        {{ loginError }}
      </div>
  
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter email"
            v-model="email"
            :class="{ 'error': validationErrors.email }"
            @input="clearError('email')"
          />
          <span v-if="validationErrors.email" class="error-text">
            {{ validationErrors.email }}
          </span>
        </div>
  
        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-input">
            <input
              id="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter password"
              v-model="password"
              :class="{ 'error': validationErrors.password }"
              @input="clearError('password')"
            />
            <button 
              type="button" 
              class="toggle-password"
              @click="togglePassword"
            >
              {{ showPassword ? '👁️' : '👁️‍🗨️' }}
            </button>
          </div>
          <span v-if="validationErrors.password" class="error-text">
            {{ validationErrors.password }}
          </span>
        </div>
  
        <button 
          type="submit" 
          class="login-button" 
          :disabled="isSubmitting"
        >
          <span v-if="isSubmitting">Logging in...</span>
          <span v-else>Login</span>
        </button>
  
        <div class="form-footer">
          <router-link to="/" class="register-link">
            Don't have an account? Register
          </router-link>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import { mapActions, mapGetters } from 'vuex';
  
  export default {
    name: "LoginPage",
    data() {
      return {
        email: '',
        password: '',
        showPassword: false,
        isSubmitting: false,
        validationErrors: {}
      };
    },
    computed: {
      ...mapGetters(['loginError', 'isLoggedIn'])
    },
    methods: {
      ...mapActions(['loginUser']),
  
      togglePassword() {
        this.showPassword = !this.showPassword;
      },
  
      clearError(field) {
        if (this.validationErrors[field]) {
          this.validationErrors = {
            ...this.validationErrors,
            [field]: ''
          };
        }
      },
  
      validateForm() {
        const errors = {};
        
        // Email validation
        if (!this.email) {
          errors.email = 'Email is required';
        } else if (!this.isValidEmail(this.email)) {
          errors.email = 'Please enter a valid email address';
        }
        
        // Password validation
        if (!this.password) {
          errors.password = 'Password is required';
        } else if (this.password.length < 6) {
          errors.password = 'Password must be at least 8 characters, one uppercase, one lowercase, one numeric and one special character';
        }
        
        this.validationErrors = errors;
        return Object.keys(errors).length === 0;
      },
  
      isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
  
      async handleSubmit() {
        if (!this.validateForm()) {
          return;
        }
  
        this.isSubmitting = true;
  
        try {
          const result = await this.loginUser({
            email: this.email,
            password: this.password
          });
  
          if (result.success) {
            this.$router.push('/dashboard');
          }
        } catch (error) {
          console.error('Login error:', error);
        } finally {
          this.isSubmitting = false;
        }
      }
    },
    // Redirect if already logged in
    created() {
      if (this.isLoggedIn) {
        this.$router.push('/dashboard');
      }
    }
  };
  </script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .login-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  label {
    font-weight: 500;
    color: #374151;
  }
  
  .password-input {
    position: relative;
    display: flex;
    align-items: center;
  }
  
  .toggle-password {
    position: absolute;
    right: 0.75rem;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
  }
  
  input {
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  input.error {
    border-color: #dc2626;
  }
  
  .error-text {
    color: #dc2626;
    font-size: 0.875rem;
  }
  
  .alert {
    padding: 1rem;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
  
  .alert-error {
    background-color: #fee2e2;
    border: 1px solid #dc2626;
    color: #dc2626;
  }
  
  .login-button {
    padding: 0.75rem;
    background-color: #2563eb;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .login-button:hover:not(:disabled) {
    background-color: #1d4ed8;
  }
  
  .login-button:disabled {
    background-color: #93c5fd;
    cursor: not-allowed;
  }
  
  .form-footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
  }
   .register-link {
    color: #2563eb;
    text-decoration: none;
    font-size: 0.875rem;
  }
  </style>