# Copilot Instructions

This project is a **Stock Interval Trading Calculator**, focused on suggesting buy/sell points based on price, volume, and institutional chip data. **Use only English or zh-TW in response.**

## 💡 Coding Vibe

- TypeScript only
- Keep functions **small, composable, and reusable**
- Always follow the project layout in README.md, if not exists yet, create one first and keep in sync.
- Follow TDD.

## 🛠️ Code Style

- Always type inputs and outputs
- Prefer `readonly` arrays for inputs
- Return clean objects with descriptive fields
- Round numbers to 2 decimals unless otherwise specified
- Use `camelCase` for variables and functions
- If not sure, follow https://google.github.io/styleguide/tsguide.html

## 📝 Commit Guidelines

Follow **Conventional Commits** specification:

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature for the user
- `fix`: Bug fix for the user
- `docs`: Documentation changes
- `style`: Code formatting (no production code change)
- `refactor`: Code refactoring (no functional changes)
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Build process or auxiliary tool changes
- `ci`: CI configuration changes

### Examples

```bash
feat(strategy): add SimpleStrategy with chip analysis
fix(util): handle empty arrays in statistical functions
docs(readme): add installation and usage examples
refactor(util): modularize math utilities
test(strategy): add comprehensive backtest scenarios
chore(deps): update puppeteer to v24.15.0
```

### Scope

Use these scopes when applicable:

- `util`: Mathematical utilities and helpers
- `strategy`: Trading strategy implementations
- `cli`: Command line interface
- `refresh`: Data fetching and refresh logic
- `test`: Test-related changes
- `deps`: Dependency updates

## 🌲 Development Workflow

Follow **Trunk-based Development** principles:

### Core Principles

- **Main branch is always releasable**: All commits to main should be production-ready
- **Short-lived feature branches**: Features developed in branches that live for hours/days, not weeks
- **Small, frequent commits**: Prefer many small commits over large batch changes
- **Continuous integration**: Commit and integrate multiple times per day

### Branch Strategy

```bash
# ✅ Preferred: Direct commits to main for small changes
git checkout main
git add .
git commit -m "feat(util): add EMA calculation"
git push origin main

# ✅ For larger features: Short-lived feature branches
git checkout -b feat/backtest-engine
# ... develop feature ...
git commit -m "feat(backtest): implement basic backtest runner"
git checkout main
git merge feat/backtest-engine --no-ff
git branch -d feat/backtest-engine
git push origin main
```

### Integration Rules

- **Maximum branch lifetime**: 2-3 days
- **Pull/rebase frequently**: `git pull origin main` multiple times daily
- **Feature flags for incomplete features**: Use feature toggles for WIP features
- **Hotfixes go directly to main**: Critical fixes bypass feature branches

### Quality Gates

- All tests must pass before merging
- No breaking changes without version bump
- Code review for complex changes (optional for small fixes)
- **CI pipeline must pass**: Automated checks via GitHub Actions
  - ✅ Linting (ESLint)
  - ✅ Type checking (TypeScript)
  - ✅ Unit tests (Node.js native runner)
  - ✅ Build verification
  - ✅ Security audit (pnpm audit)
  - ✅ Node.js 22+ compatibility

### Collaboration Guidelines

- **Communicate early**: Share WIP branches for feedback
- **Pair programming encouraged**: Especially for complex algorithms
- **Documentation updates**: Keep README and docs in sync with code changes
- **Breaking changes**: Coordinate with team and document in commit message
