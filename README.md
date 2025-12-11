# Chainboard - Workflow Canvas Application

A workflow canvas application for building and executing automated workflows with Slack integration. Create visual workflows to select teams, engineers, compose messages, and send them via Slack.

## Tech Stack

### Frontend
- React 18 + TypeScript
- React Flow (workflow canvas)
- Tailwind CSS (styling)
- Zustand (state management)
- React Query (data fetching)
- Vite (build tool)

### Backend
- NestJS + TypeScript
- Prisma ORM
- PostgreSQL 15
- Slack Web API (@slack/web-api)

### Deployment
- Docker + Docker Compose
- k3s compatible

## Features

- Visual workflow builder with drag-and-drop nodes
- Team and engineer management
- Workflow execution engine with topological sort
- Slack message sending (DMs and channels)
- Workflow execution history and logs
- Template-based message composition with variables

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Slack Bot Token (for Slack integration)

## Quick Start

### 1. Clone the repository

```bash
cd chainboard
```

### 2. Set up environment variables

Backend (`.env` in `backend/`):
```bash
cp backend/.env.example backend/.env
# Edit backend/.env and add your Slack bot token
```

Frontend (`.env` in `frontend/`):
```bash
cp frontend/.env.example frontend/.env
```

### 3. Start with Docker Compose

```bash
# Start all services
docker-compose up -d

# Run database migrations
docker-compose exec backend npx prisma migrate dev

# View logs
docker-compose logs -f
```

### 4. Access the application

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432

### 5. Stop the application

```bash
docker-compose down
```

## Local Development (without Docker)

### Backend

```bash
# Start PostgreSQL
docker run --name chainboard-postgres \
  -e POSTGRES_PASSWORD=chainboard_dev \
  -e POSTGRES_DB=chainboard \
  -e POSTGRES_USER=chainboard \
  -p 5432:5432 -d postgres:15-alpine

# Install dependencies
cd backend
npm install

# Run migrations
npx prisma migrate dev

# Start development server
npm run start:dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Teams
- `POST /api/teams` - Create team
- `GET /api/teams` - List all teams
- `GET /api/teams/:id` - Get team details
- `PATCH /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team

### Engineers
- `POST /api/engineers` - Create engineer
- `GET /api/engineers?teamId=<id>` - List engineers (optionally filtered)
- `GET /api/engineers/:id` - Get engineer details
- `PATCH /api/engineers/:id` - Update engineer
- `DELETE /api/engineers/:id` - Delete engineer

### Workflows
- `POST /api/workflows` - Create workflow
- `GET /api/workflows` - List all workflows
- `GET /api/workflows/:id` - Get workflow with recent runs
- `PATCH /api/workflows/:id` - Update workflow
- `DELETE /api/workflows/:id` - Delete workflow
- `POST /api/workflows/:id/execute` - Execute workflow

### Slack Config
- `POST /api/slack-config` - Create Slack configuration
- `GET /api/slack-config` - List configurations
- `GET /api/slack-config/:id` - Get configuration
- `PATCH /api/slack-config/:id` - Update configuration
- `DELETE /api/slack-config/:id` - Delete configuration

## Workflow Node Types

1. **Select Team** - Choose a team from the database
2. **Select Engineer** - Choose an engineer (filtered by selected team)
3. **Compose Message** - Create a message template with variables ({{engineerName}}, {{teamName}}, etc.)
4. **Send Slack Message** - Send message to engineer's DM or a specific channel

## Database Schema

- **Teams** - name, description
- **Engineers** - name, email, slackUserId, teamId
- **SlackConfig** - workspace, botToken, defaultChannel
- **Workflows** - name, description, nodes (JSON), edges (JSON)
- **WorkflowRuns** - status, logs, error, timestamps

## Getting a Slack Bot Token

1. Go to https://api.slack.com/apps
2. Create a new app or select an existing one
3. Go to "OAuth & Permissions"
4. Add bot token scopes: `chat:write`, `users:read`, `im:write`
5. Install app to workspace
6. Copy the "Bot User OAuth Token" (starts with `xoxb-`)
7. Add to `backend/.env` as `SLACK_BOT_TOKEN`

## Project Structure

```
chainboard/
├── backend/              # NestJS backend
│   ├── src/
│   │   ├── modules/     # Feature modules
│   │   ├── common/      # Shared modules (Prisma)
│   │   └── config/      # Configuration
│   └── prisma/          # Database schema
├── frontend/             # React frontend
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── services/    # API client
│       ├── stores/      # Zustand stores
│       └── types/       # TypeScript types
└── docker-compose.yml   # Docker orchestration
```

## Troubleshooting

### Docker Issues

```bash
# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# View logs
docker-compose logs backend
docker-compose logs frontend
```

### Database Issues

```bash
# Reset database
docker-compose exec backend npx prisma migrate reset

# Open Prisma Studio
docker-compose exec backend npx prisma studio
```

## License

MIT
