<template>
  <div class="quiz-container">
    <div v-if="!currentQuestion" class="quiz-start">
      <h2>Welcome to the Quiz!</h2>
      <button @click="startQuiz">Start Quiz</button>
    </div>

    <div v-else-if="!showResults" class="quiz-question">
      <h3>Question {{ currentQuestionIndex + 1 }} of {{ quizData.length }}</h3>
      <p class="question-text">{{ currentQuestion.question }}</p>
      <div class="answers">
        <button 
          v-for="(answer, index) in currentQuestion.answers" 
          :key="index"
          :class="{ 'selected': selectedAnswer === index }"
          @click="selectAnswer(index)"
        >
          {{ answer }}
        </button>
      </div>
      <button 
        @click="submitAnswer" 
        :disabled="selectedAnswer === null"
        class="submit-btn"
      >
        Submit Answer
      </button>
    </div>

    <div v-else class="results">
      <h2>Quiz Results</h2>
      <p>Your score: {{ score }} out of {{ quizData.length }}</p>
      <p>{{ feedbackText }}</p>
      <button @click="retryQuiz">Try Again</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Quiz',
  props: {
    apiService: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      quizData: [],
      currentQuestionIndex: 0,
      selectedAnswer: null,
      showResults: false,
      score: 0
    };
  },
  computed: {
    currentQuestion() {
      return this.quizData[this.currentQuestionIndex] || null;
    },
    scorePercentage() {
      return (this.score / this.quizData.length) * 100;
    },
    feedbackText() {
      if (this.scorePercentage >= 80) return 'Excellent! You are a master of the subject!';
      if (this.scorePercentage >= 60) return 'Good job! You have a solid understanding.';
      if (this.scorePercentage >= 40) return 'Not bad! Keep practicing to improve.';
      return 'You might need to review the material and try again.';
    }
  },
  methods: {
    async startQuiz() {
      try {
        this.quizData = await this.apiService.getAllQuizzes();
        this.currentQuestionIndex = 0;
        this.selectedAnswer = null;
        this.showResults = false;
        this.score = 0;
      } catch (error) {
        this.$emit('error', error.message);
      }
    },
    selectAnswer(index) {
      this.selectedAnswer = index;
    },
    async submitAnswer() {
      if (this.selectedAnswer === null) return;

      try {
        const result = await this.apiService.submitAnswer(
          this.currentQuestion.id,
          this.selectedAnswer
        );
        
        if (result.correct) {
          this.score++;
        }

        if (this.currentQuestionIndex < this.quizData.length - 1) {
          this.currentQuestionIndex++;
          this.selectedAnswer = null;
        } else {
          this.showResults = true;
        }
      } catch (error) {
        this.$emit('error', error.message);
      }
    },
    retryQuiz() {
      this.startQuiz();
    }
  }
};
</script>

<style scoped>
.quiz-container {
  margin-top: 20px;
}

.quiz-start {
  text-align: center;
}

.quiz-question {
  margin-top: 20px;
}

.question-text {
  margin-bottom: 20px;
}

.answers {
  display: grid;
  gap: 10px;
  margin: 20px 0;
}

.answers button {
  padding: 15px;
  border: 2px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  transition: all 0.3s;
}

.answers button.selected {
  background-color: #e3f2fd;
  border-color: #2196F3;
}

.answers button:hover {
  background-color: #f5f5f5;
}

.submit-btn {
  padding: 10px 20px;
  background-color: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.results {
  margin-top: 20px;
  text-align: center;
}

.results button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style> 