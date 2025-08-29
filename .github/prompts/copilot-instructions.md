# Copilot Instructions

This project is a **Stock Interval Trading Calculator**, focused on suggesting buy/sell points based on price, volume, and institutional chip data. **Use only English or TW-ZH in response.**

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
