Build a small “people & Slack” workflow canvas with a TypeScript/Node.js backend, React-based frontend, to run locally on my k3s cluster.

High-level architecture
Frontend (canvas & UI)

    React + TypeScript

    Canvas/graph library:

        React Flow (best fit for n8n/Tines-style node editor)

    Talks to backend via REST/WebSocket for saving workflows and triggering runs

Backend (workflow API & engine)

    Node.js + TypeScript with a framework like NestJS or Fastify

    REST API for:

        CRUD for resources: engineers, teams, Slack channels

        CRUD for workflows (nodes, edges, configuration)

        Endpoint to “run” a workflow with a given input

    In-memory execution engine at first (no need for complex orchestration)

Data & integrations

    Database: PostgreSQL    

Slack: use Slack Web API (via user or bot token) to send messages

POC feature slice
For a first version, scope it to:

Entities / inventory

    Teams (name, description)

    Engineers (name, email, team_id, slack_user_id)

    Slack config (workspace, default channel, bot token stored securely)

Workflow types (nodes)

    “Select Team” node: dropdown of teams

    “Select Engineer” node: engineers filtered by selected team

    “Compose Message” node: text template with variables (engineer name, team)

    “Send Slack Message” node: sends message to engineer’s Slack user or a channel

Canvas behavior

    User drags nodes onto canvas and connects them (React Flow)

    Each node has a config panel (right/side drawer)

    “Run workflow” button executes from start node → slack node

Execution model (simple)

Backend receives workflow graph (nodes + edges) and a “run” request

Executes nodes in topological order (no branches at first)

Each node is a small function: async execute(input, config, context)

“Send Slack” node calls Slack API; response stored in run log

Suggested tech choices
Frontend

React + TypeScript

React Flow for workflow canvas

Tailwind CSS or MUI for quick UI

Backend

Node.js + TypeScript with NestJS or Fastify

Slack Node SDK (@slack/web-api)

Prisma +  Postgres 

Running on Containerization

Dockerfile for frontend

Dockerfile for backend

Use a single Postgres container 




