
# NB Studio: Mission Control - Implementation Roadmap

**Version:** 1.0  
**Status:** Approved for Implementation  
**Client:** OpenClaw (Dereck)  
**Objective:** Transform NB Studio from a static dashboard into a fully functional AI Operations Center.

---

## 🏗️ Phase 1: The Command Center (Core Dashboard)

### 1.1 Agent Fleet Status (Live View)
**Goal:** A real-time grid showing the health, status, and activity of all agents (CTO, QA, Growth, etc.).

*   **Architecture:**
    *   **State:** Global `AgentStore` (Zustand) holding an array of agent objects.
    *   **Updates:** WebSocket connection (or polling interval) to `scripts/agent-watch.ts` which monitors process PIDs or API activity.
    *   **Data Model:**
        ```typescript
        interface AgentStatus {
          id: string; // 'cto', 'qa'
          state: 'idle' | 'working' | 'thinking' | 'error' | 'offline';
          currentTask: string | null;
          lastHeartbeat: number;
          cpuUsage: number;
          errorLogs: string[];
        }
        ```
*   **UI/UX:**
    *   **Component:** `AgentFleetGrid`.
    *   **Visuals:** Card layout. Green pulsing dot for 'working', Red border for 'error'.
    *   **Interaction:** Click card to open `AgentDetailPanel` (logs, memory dump).
*   **Implementation Steps:**
    1.  [ ] Create `AgentStore` in `store/agentStore.ts`.
    2.  [ ] Update `constants.tsx` with full mock data covering all states.
    3.  [ ] Refactor `AgentBoard` component to use the new visual indicators.
    4.  [ ] Implement "Heartbeat" logic: Visual indicator turns gray if no update in >5min.

### 1.2 Cost War Room
**Goal:** Real-time financial visibility with predictive modeling.

*   **Architecture:**
    *   **Logic:** Frontend calculator using linear extrapolation based on `tokensToday` and `currentRate`.
    *   **Alerts:** LocalStorage persistent thresholds (50%, 75%, 90%).
*   **UI/UX:**
    *   **Component:** Enhanced `CostView`.
    *   **Visuals:** "Burn Rate" speedometer. Linear graph showing "Projected vs Limit".
    *   **Alerts:** Toast notifications when crossing thresholds.
*   **Implementation Steps:**
    1.  [ ] Add `projectedCost` calculation utility in `utils/finance.ts`.
    2.  [ ] Create `BudgetGauge` component (SVG arc).
    3.  [ ] Implement notification trigger logic in `App.tsx` (useEffect on cost change).

### 1.3 Emergency Stop (Kill Switch)
**Goal:** Immediate cessation of all AI activities.

*   **Architecture:**
    *   **Mechanism:** A global `isSystemLocked` boolean. When `true`, all API calls in `geminiService.ts` throw an abort error immediately.
*   **UI/UX:**
    *   **Visuals:** Big Red Button in the Header or "Command Center" widget.
    *   **Feedback:** UI turns grayscale/red overlay. Toast: "EMERGENCY STOP ACTIVE".
*   **Implementation Steps:**
    1.  [ ] Add `emergencyStop` state to `App.tsx`.
    2.  [ ] Create `EmergencyButton` component with double-confirm modal.
    3.  [ ] Wrap API calls with a check for this state.

---

## 🗓️ Phase 2: Project Management System

### 2.1 Task Pipeline Visualizer (Kanban)
**Goal:** Visualizing the lifecycle: Backlog → In Progress → QA Review → Done.

*   **Architecture:**
    *   **Data Source:** Local Markdown files (`TASK-001.md`) parsed into JSON.
    *   **Library:** `dnd-kit` for drag-and-drop.
*   **UI/UX:**
    *   **Component:** `KanbanBoard` (Evolution of `AgentBoard`).
    *   **Columns:** Backlog, Draft, Build (CTO), Review (QA), Done.
    *   **Card:** Shows Task ID, Assignee Avatar, and Priority Tag.
*   **Implementation Steps:**
    1.  [ ] Install `dnd-kit`.
    2.  [ ] Create `Task` interface representing parsed MD files.
    3.  [ ] Implement `KanbanColumn` and `KanbanCard` components.
    4.  [ ] Connect drag events to state updates (optimistic UI update).

### 2.2 Auto-Task Generation
**Goal:** Convert conversation intent into structured `TASK.md` files.

*   **Architecture:**
    *   **AI:** Gemini Pro call with a specific system prompt: "Extract task details and output JSON".
    *   **Template:** Standard `TASK.md` template string.
*   **UI/UX:**
    *   **Interaction:** "Create Task" button in `GeminiAssistant` or Command Palette.
    *   **Form:** Pre-filled modal where user reviews AI suggestions before "Saving".
*   **Implementation Steps:**
    1.  [ ] Create `TaskTemplate.md` in `constants.tsx`.
    2.  [ ] Add `generateTaskDraft` function to `geminiService.ts`.
    3.  [ ] Build `TaskCreationModal` form.

---

## 🤖 Phase 3: Agent Interaction Protocol

### 3.1 Context Sharing & Shared Memory
**Goal:** Ensure all agents operate on the same truth.

*   **Architecture:**
    *   **Storage:** `MEMORY.md` (Human readable) + `context.json` (Machine efficient).
    *   **Flow:** Before any agent runs, it reads `context.json`. After running, it appends summary to `MEMORY.md`.
*   **UI/UX:**
    *   **View:** "Brain" or "Memory" tab in `DepartmentPortal`.
    *   **Visuals:** A list of "Recent Memories" or "Active Context Keys".
*   **Implementation Steps:**
    1.  [ ] Define `ContextSchema` (Global variables, active directives).
    2.  [ ] Create `MemoryViewer` component.
    3.  [ ] Update `AgentDetailPanel` to show what context the agent currently has loaded.

### 3.2 Role-Based Communication
**Goal:** Formalize the handoff (GM -> CTO -> QA).

*   **Architecture:**
    *   **State Machine:** Define valid transitions.
        *   `CTO` can only move task to `QA`.
        *   `QA` can move to `Done` or `Backlog` (Rejection).
*   **UI/UX:**
    *   **Visuals:** Dependency lines on the Kanban board or Topology map.
*   **Implementation Steps:**
    1.  [ ] Define `WorkflowRules` object.
    2.  [ ] Validate drag-and-drop actions against these rules (e.g., prevent moving straight from Backlog to Done).

---

## 📊 Phase 4: Data & Insights

### 4.1 Analytics Dashboard
**Goal:** Visualizing throughput and efficiency.

*   **Architecture:**
    *   **Calculation:** Aggregate `completedTasks` from `DATA_METRICS.json`.
*   **UI/UX:**
    *   **Charts:** Recharts (AreaChart for tokens, BarChart for tasks).
    *   **Cards:** "Efficiency Score" (Tokens spent / Tasks completed).
*   **Implementation Steps:**
    1.  [ ] Install `recharts`.
    2.  [ ] Create `AnalyticsView` component replacing the simple `CostView`.
    3.  [ ] Implement `TokenEfficiencyChart` and `TaskVelocityChart`.

---

## 🔗 Phase 5: Integration Layer

### 5.1 File System Intelligence
**Goal:** The dashboard reflects the local file system state.

*   **Architecture (Hybrid):**
    *   Since this is a web app (Next.js/React), it cannot directly read the user's *actual* local OS disk without a bridge.
    *   **Bridge:** A small Node.js server (OpenClaw Gateway) running locally on port 18789 that serves/modifies files.
    *   **Frontend:** `fetch('http://localhost:18789/api/tasks')`.
*   **UI/UX:**
    *   **Indicator:** "Local Bridge: Connected" green dot in Smart Rail.
*   **Implementation Steps:**
    1.  [ ] Design the API interface for the local bridge (Mock for now, implement later).
    2.  [ ] Create `FileSystemService` in frontend to abstract API calls.

---

## 📱 Phase 6: Human-in-the-Loop Controls

### 6.1 E's Executive View (Mobile)
**Goal:** A simplified, read-only view for the President on mobile.

*   **Architecture:**
    *   **Responsive Design:** Hide complex tables on `< md` breakpoints.
    *   **Content:** Focus on High-level Metrics and "Needs Approval" list.
*   **UI/UX:**
    *   **Navigation:** Bottom Tab Bar on mobile (already partially implemented).
    *   **Interactions:** Swipe to Approve/Reject.
*   **Implementation Steps:**
    1.  [ ] Refactor `App.tsx` layout to support a dedicated "Mobile Mode".
    2.  [ ] Create `MobileApprovalCard` component.

---

## 🚀 Recommended Deployment Order

1.  **Grid & DND (Completed):** The foundation is laid.
2.  **Notification System (Completed):** Communication channel ready.
3.  **Agent Fleet Visuals (Next):** Upgrade the `AgentBoard` to use the new Card designs and simulated "Heartbeat".
4.  **Kanban Implementation:** Replace the static Agent lists with draggable Task lists.
5.  **Gemini Context Integration:** Connect the `GeminiAssistant` to read from the simulated `MEMORY.md`.
6.  **Cost Projections:** Add the math logic to `CostView`.
