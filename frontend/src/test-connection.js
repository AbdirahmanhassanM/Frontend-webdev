// Test script for API connection
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function testConnection() {
  try {
    console.log('Testing connection to:', API_URL);
    
    // Test authentication endpoints
    const signupResponse = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword'
      })
    });
    
    console.log('Signup test response:', await signupResponse.json());
    
    // Test quiz endpoints
    const quizResponse = await fetch(`${API_URL}/quiz`);
    console.log('Quiz test response:', await quizResponse.json());
    
  } catch (error) {
    console.error('Connection test failed:', error);
  }
}

// Run the test
testConnection(); 