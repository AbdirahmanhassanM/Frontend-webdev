// Get API URL from environment variables or use default
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const config = {
    API_URL,
    ENDPOINTS: {
        AUTH: {
            SIGNUP: '/auth/signup',
            SIGNIN: '/auth/signin',
            SIGNOUT: '/auth/signout'
        },
        QUIZ: {
            GET_QUESTIONS: '/quiz/questions',
            SUBMIT_ANSWER: '/quiz/submit',
            GET_RESULTS: '/quiz/results'
        }
    }
}; 