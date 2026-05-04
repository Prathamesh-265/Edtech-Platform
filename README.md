# EduVerse

A modern, full-stack EdTech platform built with React, Node.js, and PostgreSQL for collaborative learning.

## Features

- **Course Management**: Create, update, and organize educational content
- **Lesson Tracking**: Structured lessons with progress monitoring
- **Student Enrollment**: Seamless registration and enrollment system
- **Analytics Dashboard**: Platform insights and performance metrics
- **Responsive Design**: Mobile-friendly interface with smooth animations

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript, Drizzle ORM
- **Database**: PostgreSQL
- **Deployment**: Vercel (frontend), Render (backend)

## Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd EdTech-Platform
   ```

2. **Install dependencies**

   ```bash
   cd standalone
   npm run install:all
   ```

3. **Set up environment variables**
   - Create `.env` in `standalone/server/` with `DATABASE_URL`
   - Create database and run migrations

4. **Start development servers**

   ```bash
   npm run dev
   ```

   Frontend: http://localhost:5175
   Backend: http://localhost:5000

## Project Structure

```
standalone/
├── client/          # React frontend
├── server/          # Express API
└── package.json     # Root scripts
```

## Deployment

- **Frontend**: Deploy `standalone/client/` to Vercel
- **Backend**: Deploy `standalone/server/` to Render
- Set `VITE_API_BASE_URL` in Vercel environment variables

## API Endpoints

- `GET /api/courses` - List courses
- `POST /api/courses` - Create course
- `GET /api/enrollments` - List enrollments
- `GET /api/dashboard/stats` - Platform statistics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License
