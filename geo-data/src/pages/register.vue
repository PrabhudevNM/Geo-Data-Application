<template>
    <div class="register-container">
      <h2>Register Page</h2>
      <div v-if="registerError" class="error-message">
        {{ registerError }}
      </div>
      <form @submit.prevent="handleSubmit" class="register-form">
        <div class="form-group">
          <input
            type="text"
            placeholder="Enter username"
            v-model="username"
            :class="{ 'error': validationErrors.username }"
          />
          <span v-if="validationErrors.username" class="error-text">
            {{ validationErrors.username }}
          </span>
        </div><br />
        <div class="form-group">
          <input
            type="email"  
            placeholder="Enter email"
            v-model="email"
            :class="{ 'error': validationErrors.email }"
          />
          <span v-if="validationErrors.email" class="error-text">
            {{ validationErrors.email }}
          </span>
        </div>
        <div class="form-group">
          <input
            type="password"
            placeholder="Enter password"
            v-model="password"
            :class="{ 'error': validationErrors.password }"
          />
          <span v-if="validationErrors.password" class="error-text">
            {{ validationErrors.password }}
          </span>
        </div>
        <button type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? 'Registering...' : 'Register' }}
        </button>
        <button class="login-button">
        <router-link to="/login" class="login-bc">login</router-link>
        </button>
      </form>
    </div>
  </template>
  
  <script>
  import { mapActions, mapGetters } from 'vuex';
  
  export default {
    name: "RegisterPage",
    data() {
      return {
        username: '',
        email: '',
        password: '',
        isSubmitting: false,
        validationErrors: {}
      };
    },
    computed: {
      ...mapGetters(['registerError'])
    },
    methods: {
      ...mapActions(['registerUser']),
      
      validateForm() {
        const errors = {};
        
        if (!this.username.trim()) {
          errors.username = 'Username is required';
        } else if (this.username.length < 3) {
          errors.username = 'Username must be at least 3 characters';
        }
        
        if (!this.email.trim()) {
          errors.email = 'Email is required';
        } else if (!this.isValidEmail(this.email)) {
          errors.email = 'Please enter a valid email';
        }
        
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
          const result = await this.registerUser({
            username: this.username,
            email: this.email,
            password: this.password,
          });
          
          if (result.success) {
            this.$router.push('/login');
          }
        } catch (error) {
          console.error('Registration error:', error);
        } finally {
          this.isSubmitting = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
   .register-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .login-bc{
    color: #ced4da;
  }
  
  .error-message {
    color: #dc3545;
    padding: 0.5rem;
    margin-bottom: 1rem;
    border: 1px solid #dc3545;
    border-radius: 4px;
    background-color: #f8d7da;
  }
  
  .error {
    border-color: #dc3545;
  }
  
  .error-text {
    color: #dc3545;
    font-size: 0.875rem;
    margin-top: 0.25rem;
  }
  
  input {
    width: 100%;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
  }
  
  button {
    width: 25%;
    padding: 0.5rem;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }

  .login-button{
    background-color:green
  }
  
  button:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }

  .login-link {
    color: #2563eb;
    text-decoration: none;
    font-size: 0.875rem;
  }
  </style>