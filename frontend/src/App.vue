<template>
  <div class="container">
    <h1>Are You Dumb? 🤔</h1>
    
    <Auth 
      v-if="!isAuthenticated" 
      :api-service="$refs.apiService"
      @login-success="handleLoginSuccess"
      @error="handleError"
    />
    
    <Quiz 
      v-else 
      :api-service="$refs.apiService"
      @error="handleError"
    />
  </div>
</template>

<script>
import ApiService from './components/ApiService.vue';
import Auth from './components/Auth.vue';
import Quiz from './components/Quiz.vue';

export default {
  name: 'App',
  components: {
    ApiService,
    Auth,
    Quiz
  },
  data() {
    return {
      isAuthenticated: false
    };
  },
  methods: {
    handleLoginSuccess() {
      this.isAuthenticated = true;
    },
    handleError(message) {
      alert(message);
    }
  },
  created() {
    // Check if user is already authenticated
    this.isAuthenticated = !!this.$refs.apiService?.getToken();
  }
};
</script>

<style>
body {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f0f0f0;
}

.container {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #333;
}
</style> 