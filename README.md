# Feet Manager Robot

A modern web application for managing robot fleets with real-time monitoring and control capabilities.

## Features

- Robot Management
  - Real-time status monitoring
  - Health tracking
  - Battery level monitoring
  - Location tracking
  - Maintenance scheduling
  - Firmware management

- Workset Management
  - Create and edit worksets
  - Assign robots to worksets
  - Track workset progress
  - Schedule workset execution

- System Features
  - Real-time updates via WebSocket
  - Offline support
  - Data synchronization
  - Multi-robot coordination
  - Audit logging

## Tech Stack

- Frontend:
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - React Query
  - Socket.io Client

- Backend:
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL
  - Socket.io

## Getting Started

1. Clone the repository:
```bash
git clone [repository-url]
cd feet-manager-robot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Then edit `.env.local` with your configuration.

4. Run database migrations:
```bash
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 