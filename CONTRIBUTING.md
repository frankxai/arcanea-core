# Contributing to Arcanea

Thank you for your interest in contributing to Arcanea! We welcome contributions from the community and are excited to work with you.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## How to Contribute

### Reporting Issues

- Check if the issue already exists in our [issue tracker](https://github.com/frankxai/arcanea-core/issues)
- Use our issue templates for bug reports and feature requests
- Provide clear, detailed information about the problem
- Include steps to reproduce for bugs
- Add relevant labels to your issue

### Suggesting Features

1. Check our [roadmap](README.md#roadmap) to see if it's already planned
2. Open a [feature request](https://github.com/frankxai/arcanea-core/issues/new?template=feature_request.md)
3. Describe the problem you're trying to solve
4. Explain your proposed solution
5. Consider alternatives you've explored

### Code Contributions

#### Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/arcanea-core.git
   cd arcanea-core
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Workflow

1. **Write Tests First**: We practice TDD. Write tests before implementing features
2. **Follow Code Style**: Run `npm run lint` to check your code
3. **Type Safety**: Ensure all TypeScript types are properly defined
4. **Documentation**: Update relevant documentation and JSDoc comments
5. **Commit Messages**: Use conventional commits:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation changes
   - `test:` Test additions or changes
   - `refactor:` Code refactoring
   - `perf:` Performance improvements
   - `chore:` Maintenance tasks

#### Testing

Run tests before submitting:
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode during development
npm run test:watch
```

Ensure:
- All tests pass
- Coverage remains above 80%
- No TypeScript errors (`npm run type-check`)
- Linting passes (`npm run lint`)

#### Pull Request Process

1. Update the README.md with details of interface changes
2. Add tests for new functionality
3. Ensure CI passes on your PR
4. Request review from maintainers
5. Address review feedback promptly
6. Squash commits before merging

### Documentation

- Keep code comments concise and valuable
- Update README for user-facing changes
- Add JSDoc comments for public APIs
- Include examples for new features
- Update type definitions

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

### Project Structure

```
arcanea-core/
├── packages/           # Monorepo packages
│   ├── core/          # Core functionality
│   ├── openrouter/    # OpenRouter integration
│   └── ...
├── examples/          # Example implementations
├── docs/              # Documentation
└── tests/            # Integration tests
```

### Common Commands

```bash
# Install dependencies
npm install

# Run in development
npm run dev

# Build all packages
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run type-check

# Format code
npm run format
```

## Release Process

We use semantic versioning and automated releases:

1. Changes are merged to `main`
2. CI runs tests and checks
3. Changesets determine version bumps
4. Packages are published to npm
5. GitHub release is created

## Style Guide

### TypeScript

- Use explicit types, avoid `any`
- Prefer interfaces over types for objects
- Use enums for fixed sets of values
- Export types separately from implementations

### Code Organization

- One component/class per file
- Group related functionality
- Keep files under 300 lines
- Extract reusable logic to utilities

### Naming Conventions

- **Files**: `kebab-case.ts`
- **Classes**: `PascalCase`
- **Functions/Variables**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`

### Comments

- Write self-documenting code
- Comment complex algorithms
- Use JSDoc for public APIs
- Avoid obvious comments

## Getting Help

- **Discord**: Join our [community server](https://discord.gg/arcanea)
- **Discussions**: Use [GitHub Discussions](https://github.com/frankxai/arcanea-core/discussions)
- **Office Hours**: Weekly on Thursdays at 2 PM UTC

## Recognition

Contributors are recognized in:
- README.md contributors section
- GitHub contributors page
- Release notes
- Annual contributor spotlight

## License

By contributing, you agree that your contributions will be licensed under the MIT License.