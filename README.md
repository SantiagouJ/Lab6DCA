# Todo App with Firebase Authentication

A modern, secure todo application built with Firebase Authentication and Firestore. This application allows users to manage their tasks with a beautiful and responsive interface.

## Features

### Authentication
- **Secure User Authentication**
  - Email and password authentication
  - User registration and login
  - Secure password requirements
  - Session management
  - Automatic sign-out handling

- **Enhanced Security Features**
  - Rate limiting for failed login attempts
  - Password strength validation
  - Email format validation
  - Protection against brute force attacks
  - Secure error handling

- **User-Friendly Error Handling**
  - Clear and specific error messages
  - Visual feedback for errors
  - Remaining attempts counter
  - Helpful suggestions for common issues
  - Smooth error animations

### Todo Management
- **User-Specific Todos**
  - Each user can only see and manage their own todos
  - Secure data isolation between users
  - Real-time updates for todo changes

- **Todo Operations**
  - Add new todos
  - Mark todos as complete/incomplete
  - Delete todos
  - View todo history
  - Sort todos by creation date

### User Interface
- **Modern Design**
  - Clean and intuitive interface
  - Responsive layout for all devices
  - Smooth animations and transitions
  - Error state visualizations
  - Loading indicators

- **Form Validation**
  - Real-time input validation
  - Visual feedback for errors
  - Clear error messages
  - Field-specific error highlighting
  - Password strength indicators

## Technical Features

### Security
- Firebase Authentication integration
- Secure password storage
- Rate limiting for failed attempts
- Input validation and sanitization
- Protected routes and operations

### Data Management
- Firestore database integration
- Real-time data synchronization
- User-specific data isolation
- Efficient data queries
- Optimized data structure

### Error Handling
- Comprehensive error messages
- User-friendly error display
- Graceful error recovery
- Network error handling
- Authentication error management

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Firebase:
   - Create a Firebase project
   - Enable Authentication and Firestore
   - Add your Firebase configuration to `src/index.ts`

4. Run the development server:
   ```bash
   npm start
   ```

## Firebase Setup

1. Create a new Firebase project
2. Enable Email/Password authentication
3. Set up Firestore database
4. Create the required indexes:
   - Collection: `todos`
   - Fields: 
     - `userId` (Ascending)
     - `createdAt` (Descending)

## Security Features

### Authentication Security
- Rate limiting after 3 failed attempts
- 30-second cooldown period
- Password strength requirements
- Email format validation
- Session management

### Data Security
- User-specific data access
- Secure data operations
- Protected API endpoints
- Input validation
- Error handling

## Error Handling

The application includes comprehensive error handling for:
- Authentication errors
- Network issues
- Invalid inputs
- Database operations
- Rate limiting

Each error provides:
- Clear error messages
- Visual feedback
- User guidance
- Recovery suggestions
- Security measures

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Project Structure

```
├── src/
│   ├── components/     # Web Components
│   ├── index.html     # Main HTML file
│   └── index.ts       # Application entry point
├── package.json
├── tsconfig.json
└── webpack.config.js
```

## Adding New Components

1. Create a new TypeScript file in the `src/components` directory
2. Define your component class extending `HTMLElement`
3. Register your component using `customElements.define()`
4. Import and use your component in other components or the main app 