<template>
  <div class="auth-forms">
    <form v-if="showLoginForm" @submit.prevent="handleLogin" class="auth-form">
      <h2>Login</h2>
      <input v-model="loginForm.email" type="email" placeholder="Email" required>
      <input v-model="loginForm.password" type="password" placeholder="Password" required>
      <button type="submit">Login</button>
      <p>Don't have an account? <a href="#" @click.prevent="showLoginForm = false">Sign up</a></p>
    </form>

    <form v-else @submit.prevent="handleSignup" class="auth-form">
      <h2>Sign Up</h2>
      <input v-model="signupForm.username" type="text" placeholder="Username" required>
      <input v-model="signupForm.email" type="email" placeholder="Email" required>
      <input v-model="signupForm.password" type="password" placeholder="Password" required>
      <button type="submit">Sign Up</button>
      <p>Already have an account? <a href="#" @click.prevent="showLoginForm = true">Login</a></p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Auth',
  props: {
    apiService: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showLoginForm: true,
      loginForm: {
        email: '',
        password: ''
      },
      signupForm: {
        username: '',
        email: '',
        password: ''
      }
    };
  },
  methods: {
    async handleLogin() {
      try {
        const response = await this.apiService.login(this.loginForm);
        this.$emit('login-success', response);
        this.loginForm = { email: '', password: '' };
      } catch (error) {
        this.$emit('error', error.message);
      }
    },
    async handleSignup() {
      try {
        await this.apiService.signup(this.signupForm);
        this.showLoginForm = true;
        this.signupForm = { username: '', email: '', password: '' };
      } catch (error) {
        this.$emit('error', error.message);
      }
    }
  }
};
</script>

<style scoped>
.auth-forms {
  margin-top: 20px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.auth-form input {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.auth-form button {
  padding: 10px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.auth-form button:hover {
  background-color: #45a049;
}

.auth-form p {
  text-align: center;
  margin-top: 10px;
}

.auth-form a {
  color: #2196F3;
  text-decoration: none;
}

.auth-form a:hover {
  text-decoration: underline;
}
</style> 