# Fetch Dogs - Dog Adoption Platform

A modern web application for browsing and adopting dogs from shelters. Built with React, TypeScript, and Tailwind CSS.

## Features

- User authentication
- Browse available dogs with filtering and sorting
- Add dogs to favorites
- Generate matches based on favorite dogs
- Responsive design with smooth animations
- Modern UI with a focus on user experience

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd fetch-dogs
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

```
src/
├── api/          # API service functions
├── components/   # React components
├── context/      # React context providers
├── types/        # TypeScript type definitions
├── App.tsx       # Main application component
└── main.tsx      # Application entry point
```

## Technologies Used

- React
- TypeScript
- Tailwind CSS
- Framer Motion
- Axios
- React Router

## API Integration

The application integrates with the Fetch Dogs API for:
- User authentication
- Dog search and filtering
- Breed information
- Location data
- Match generation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 