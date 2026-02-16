# GSD Kit - Get Shit Done for Antigravity

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/platform-Antigravity-orange" alt="Platform">
</p>

> A spec-driven, context-engineered development methodology adapted for Google Antigravity AI.

## What is GSD?

**GSD (Get Shit Done)** is a powerful meta-prompting and context engineering system originally designed for Claude Code. This is the **Antigravity adaptation** that brings the same systematic approach to Google Antigravity.

**What GSD solves:** Context rot — the quality degradation that happens as AI fills its context window.

**How it works:** GSD gives the AI everything it needs through structured context files, XML-formatted task plans, multi-agent orchestration, and atomic git commits.

## Why Use GSD?

| Feature | Benefit |
|---------|---------|
| **Context Engineering** | Structured files keep AI focused |
| **Atomic Commits** | Every task = one commit = easy rollback |
| **Multi-Agent** | Parallel execution with fresh context |
| **Spec-Driven** | Verify work against requirements |
| **Wave Planning** | Maximize parallel execution |

## Installation

```bash
# Global installation (recommended)
npx gsd-kit --global

# Local installation (current project only)
npx gsd-kit --local
```

## Quick Start

```bash
# After installation, run in Antigravity:
/new-project              # Initialize new project
/discuss-phase 1         # Discuss phase requirements (optional)
/plan-phase 1            # Create execution plans
/execute-phase 1         # Execute all plans
/verify-work 1           # Verify the work
```

## Project Structure

When you initialize a project, GSD creates:

```
.planning/
├── PROJECT.md           # Project vision and context
├── REQUIREMENTS.md       # Scoped requirements (v1, v2, out of scope)
├── ROADMAP.md            # Phase-based breakdown
├── STATE.md              # Project memory across sessions
├── config.json           # Workflow preferences
└── phases/               # Phase directories
    └── 01-foundation/
        ├── 01-01-PLAN.md
        ├── 01-01-SUMMARY.md
        └── 01-01-VERIFICATION.md
```

## All Commands

### Core Workflow

| Command | Description |
|---------|-------------|
| `/new-project [--auto]` | Initialize new project with questioning → research → requirements → roadmap |
| `/discuss-phase [N]` | Capture implementation decisions before planning |
| `/plan-phase [N]` | Research + plan for a phase |
| `/execute-phase <N>` | Execute all plans with wave-based parallelization |
| `/verify-work [N]` | Manual user acceptance testing |
| `/debug [desc]` | Systematic debugging with 3-strike rule |
| `/quick` | Ad-hoc task mode (skip research/verification) |

### Project Management

| Command | Description |
|---------|-------------|
| `/new-milestone [name]` | Start next version (v2, v3, etc.) |
| `/complete-milestone` | Archive milestone with audit |
| `/audit-milestone` | Review milestone quality |

### Phase Management

| Command | Description |
|---------|-------------|
| `/add-phase` | Add phase to roadmap |
| `/remove-phase [N]` | Remove future phase |
| `/insert-phase [N]` | Insert phase (auto-renumbers) |
| `/list-phase-assumptions` | See planner's approach |
| `/plan-milestone-gaps` | Close gaps from audit |

### Navigation & State

| Command | Description |
|---------|-------------|
| `/progress` | Show current position |
| `/pause-work` | Save session state |
| `/resume-work` | Restore from last session |

### Utilities

| Command | Description |
|---------|-------------|
| `/settings` | Configure model profile |
| `/set-profile <profile>` | Switch model (quality/balanced/budget) |
| `/add-todo [desc]` | Capture idea |
| `/check-todos` | List pending todos |
| `/map-codebase` | Analyze existing codebase |
| `/help` | Show all commands |
| `/update` | Update GSD |
| `/join-discord` | Join community |

## How It Works

### 1. Context Files

GSD maintains structured context files:

```markdown
# PROJECT.md
## Vision
What you're building and why

## Core Value
The ONE thing that must work

## Constraints
Budget, timeline, tech limitations
```

### 2. XML Task Format

Every plan uses XML for precise execution:

```xml
<task type="auto">
  <name>Create login endpoint</name>
  <files>src/app/api/auth/login/route.ts</files>
  <action>
    Use jose for JWT (not jsonwebtoken - CommonJS issues).
    Validate credentials against users table.
    Return httpOnly cookie on success.
  </action>
  <verify>curl -X POST localhost:3000/api/auth/login returns 200 + Set-Cookie</verify>
  <done>Valid credentials return cookie, invalid return 401</done>
</task>
```

### 3. Atomic Commits

Each task gets its own commit:

```
abc123f feat(01): create login endpoint
def456g feat(01): add password validation
hij789k feat(01): implement JWT cookie handling
```

### 4. Wave Execution

Plans run in waves for maximum parallelization:

```
Wave 1: Task A, Task B (independent)
    ↓
Wave 2: Task C (depends on A)
    ↓
Wave 3: Task D (depends on B and C)
```

## Configuration

### Workflow Preferences

Run `/settings` to configure:

| Setting | Options |
|---------|---------|
| Mode | YOLO / Interactive |
| Depth | Quick / Standard / Comprehensive |
| Execution | Parallel / Sequential |
| Git Tracking | Yes / No |
| Research | Yes / No |
| Plan Check | Yes / No |
| Verifier | Yes / No |

### Model Profiles

| Profile | Use |
|---------|-----|
| `quality` | Opus for research/roadmap |
| `balanced` | Sonnet for most agents |
| `budget` | Haiku where possible |

Set with: `/set-profile balanced`

## Requirements

- Node.js 16+
- Google Antigravity
- Git (for atomic commits)

## Credits

- **Original GSD:** [glittercowboy/get-shit-done](https://github.com/glittercowboy/get-shit-done)
- **Adapted for:** Google Antigravity by [ygsgsd](https://github.com/ygsgsd)

## License

MIT

## Support

- Discord: [Join our community](https://discord.gg/5JJgD5svVS)
- Issues: [GitHub Issues](https://github.com/ygsgsd/get-shit-done-antigravity/issues)
