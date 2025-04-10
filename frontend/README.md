# Are You Dumb? - Fun Quiz App

A fun and interactive quiz application that tests your knowledge with challenging questions. Built with vanilla JavaScript and Vite.

## Features

- User authentication (signup/login)
- Interactive quiz interface
- Real-time score tracking
- Fun feedback based on performance
- Responsive design
- Secure API integration

## Tech Stack

- Vite
- Vanilla JavaScript
- CSS3
- REST API integration
- Local Storage for session management

## Project Structure

```
frontend/
├── src/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   ├── components/
│   ├── config/
│   │   └── config.js
│   └── main.js
├── index.html
└── README.md
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`

## API Integration

The frontend communicates with a Fastify backend API. Make sure to:

1. Set up the backend server
2. Update the API URL in `src/config/config.js` if needed
3. Ensure CORS is properly configured on the backend

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 