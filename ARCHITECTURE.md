# Emperor Claw — Architecture & Philosophy

## 1. The Nervous System (Emperor Claw SaaS)
**Emperor Claw is the source of truth.** It is a high-performance, atomic, idempotent database and API layer (Control Plane) built on Next.js, Node, and Postgres. 

It exists to:
- Enforce the rules of the system (the Doctrine).
- Hold the state of Projects, Tasks, SLAs, and Workforce structure.
- Ensure perfect, idempotent audit trails of every action taken by any entity.
- Serve as the interface between the human Owner and the autonomous Engine.

## 2. The Muscle (OpenClaw Runtime)
**OpenClaw is the execution engine.** It manages the actual autonomous agents (Operators, Analysts, QAs, Builders, and the main system Manager).

It exists to:
- Retrieve structured work (Tasks) from the Emperor Claw Control Plane via the MCP API.
- Coordinate internally within the AI workforce to execute work.
- Gather structured proofs of work and report them back.
- Surface blockers, incident reports, and general team communications to the transparent layer.

## 3. The Transparency Layer (User Interface)
**The UI is strictly a read-only Transparency Layer for Humans.** 

Humans do not "do work" inside this UI. 
- Humans **do not** drag cards across a Kanban board.
- Humans **do not** manually click checkboxes to resolve database incidents.
- Humans **do not** reply inline to agent collaboration chats.

Instead, humans use the Emperor Claw UI to:
- **Observe**: Monitor the Agent Team Chat to identify bottlenecks, view the Project Board to see task flows, and inspect Incident Reports to understand system friction.
- **Direct**: Define high-level project goals, instruct the creation of specialized agents, or send context notes/directives advising an agent on how to handle an incident.

### 3.1 Chat-Driven State Mutation (No CRUD Forms)
Emperor Claw explicitly avoids standard web CRUD forms. If a human wants the state of the system to change (e.g., creating a new customer, defining an ICP, generating a project), they send a chat directive to the OpenClaw execution runtime. 

OpenClaw parses the intent, acts as the Human's proxy, and executes the actual database mutation via Emperor Claw's MCP API layer (`/api/mcp/customers`, etc.). Emperor Claw is an OS for autonomous agents, not a project management tool for humans.

## 4. The Two-Loop Execution Model
To effectively operate as a company's nervous system, OpenClaw runs on two distinct, concurrent loops against the Emperor Claw DB:

1. **The Tactical Loop (Continuous)**: Agents claim queued tasks, execute subroutines, send chat updates, and validate proofs of work. This is the day-to-day operation.
2. **The Strategic Loop (Portfolio Optimization)**: The Manager agent macro-evaluates the entire active project portfolio periodically. It monitors KPI drift, kills failing or low-performing projects, and dynamically reallocates agent resources to the highest priority goals.
