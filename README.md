# Feet Manager Robot

A robot management system supporting real-time and offline operations.

## System Limits
- Maximum 10 worksets
- Maximum 100 robots
- Page load time < 3s
- Render time < 1s
- Memory usage < 100MB
- Network requests < 50/minute
- WebSocket/gRPC stability > 99.9%

## Tech Stack
- TypeScript + React (Next.js)
- PostgreSQL + SQLite
- WebSocket/MQTT/gRPC
- JWT Authentication
- RBAC
- Docker + Kubernetes
- CI/CD Pipeline

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/kimlam2010/feet-manager-robot.git
cd feet-manager-robot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Run development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm test` - Run tests

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/         # Next.js pages
  ├── services/      # API services
  ├── utils/         # Utility functions
  ├── hooks/         # Custom React hooks
  ├── store/         # Redux store
  ├── types/         # TypeScript types
  ├── assets/        # Static assets
  └── styles/        # Global styles
```

## Contributing

1. Create a new branch
2. Make your changes
3. Submit a pull request

## License

MIT
