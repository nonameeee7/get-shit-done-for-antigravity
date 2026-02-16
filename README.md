# GSD Kit - Get Shit Done for Antigravity

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.0-blue" alt="Version">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  <img src="https://img.shields.io/badge/platform-Antigravity-orange" alt="Platform">
</p>

> A spec-driven, context-engineered development methodology for Google Antigravity AI.

## Quick Install (Copy & Paste)

Paste this into your Antigravity agent:

```
Clone https://github.com/nonameeee7/get-shit-done-for-antigravity to ~/.agent/
```

Then run in Antigravity:
```
/help
```

## Installation

### Option 1: Clone Manually

```bash
# Clone the repo
git clone https://github.com/nonameeee7/get-shit-done-for-antigravity.git ~/.agent/gsd

# Or copy to your project
cp -r get-shit-done-for-antigravity/.agent/ /your/project/
```

### Option 2: Download & Extract

1. Download: https://github.com/nonameeee7/get-shit-done-for-antigravity/archive/main.zip
2. Extract to your `.agent/` folder

## Usage

After installation, run in Antigravity:

```bash
/new-project              # Initialize new project
/discuss-phase 1         # Discuss phase requirements
/plan-phase 1            # Create execution plans
/execute-phase 1         # Execute all plans
/verify-work 1           # Verify the work
```

## All Commands

| Command | Description |
|---------|-------------|
| `/new-project [--auto]` | Initialize new project |
| `/discuss-phase [N]` | Discuss phase requirements |
| `/plan-phase [N]` | Create execution plans |
| `/execute-phase <N>` | Execute phase plans |
| `/verify-work [N]` | Verify phase completion |
| `/debug [desc]` | Systematic debugging |
| `/quick` | Ad-hoc task mode |
| `/new-milestone [name]` | Start new version |
| `/complete-milestone` | Archive milestone |
| `/audit-milestone` | Review milestone |
| `/add-phase` | Add phase to roadmap |
| `/remove-phase [N]` | Remove phase |
| `/progress` | Show current position |
| `/pause-work` | Save session |
| `/resume-work` | Restore session |
| `/settings` | Configure settings |
| `/set-profile <profile>` | Set model profile |
| `/add-todo [desc]` | Add todo |
| `/check-todos` | List todos |
| `/map-codebase` | Analyze codebase |
| `/help` | Show all commands |

## Project Structure

When you initialize a project:

```
.planning/
├── PROJECT.md           # Project vision
├── REQUIREMENTS.md       # Scoped requirements
├── ROADMAP.md            # Phase breakdown
├── STATE.md              # Session state
├── config.json           # Settings
└── phases/               # Phase directories
```

## Task Format

Tasks use YAML format:

```yaml
tasks:
  - name: Create login endpoint
    files: src/app/api/auth/login/route.ts
    action: |
      Use jose for JWT (not jsonwebtoken).
      Validate credentials against users table.
      Return httpOnly cookie on success.
    verify: curl -X POST localhost:3000/api/auth/login returns 200
    done: Valid credentials return cookie, invalid return 401
```

## Requirements

- Node.js 16+
- Google Antigravity
- Git

## Based On

[glittercowboy/get-shit-done](https://github.com/glittercowboy/get-shit-done)

## License

MIT
