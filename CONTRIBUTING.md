# Contributing to ChurchCRM Genesis

Thank you for your interest in contributing to ChurchCRM Genesis! We welcome contributions from the community.

## 🚀 Getting Started

1. **Fork the repository** and clone it locally
2. **Install dependencies**: `npm install`
3. **Create a branch** for your feature: `git checkout -b feature/my-feature`
4. **Make your changes** following our coding standards
5. **Test your changes** thoroughly
6. **Commit your changes** with clear, descriptive messages
7. **Push to your fork** and submit a pull request

## 📋 Code Standards

### TypeScript
- Use TypeScript for all new code
- Enable strict mode and fix all type errors
- Avoid `any` types when possible
- Use meaningful variable and function names

### Code Style
- Run `npm run format` before committing (Prettier)
- Run `npm run lint:fix` to auto-fix linting issues
- Follow existing code structure and patterns

### Git Commits
- Use conventional commits format:
  - `feat: add new feature`
  - `fix: resolve bug`
  - `docs: update documentation`
  - `refactor: improve code structure`
  - `test: add tests`
  - `chore: update dependencies`

### Pre-commit Hooks
The project uses Husky to run checks before commits:
- TypeScript type checking
- ESLint validation
- Critical files protection

## 🧪 Testing

- Test your changes in both light and dark mode
- Verify responsive design on mobile, tablet, and desktop
- Check that all existing features still work
- Test with different user roles (admin, leader, member)

## 📝 Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure CI passes** (lint, typecheck, build)
4. **Request review** from maintainers
5. **Address feedback** promptly
6. **Squash commits** if requested

## 🐛 Reporting Bugs

- Use GitHub Issues
- Include clear reproduction steps
- Provide error messages and screenshots
- Specify browser and OS version

## 💡 Feature Requests

- Open a GitHub Issue
- Describe the use case clearly
- Explain why this would benefit users
- Consider implementation complexity

## 📚 Architecture Guidelines

### Feature-Sliced Design
We follow FSD architecture:
- `app/` - Application initialization and routing
- `pages/` - Page components
- `features/` - User interactions and business logic
- `entities/` - Business models
- `shared/` - Reusable utilities and UI components

### State Management
- Use React Context for global state
- Use Zustand for complex state management
- Keep component state local when possible

### API Integration
- All Supabase calls go through repository layer
- Use React Query for data fetching and caching
- Handle errors gracefully with user feedback

## 🔒 Security

- Never commit secrets or API keys
- Review `.gitignore` before committing
- Report security issues privately (see SECURITY.md)
- Follow RLS (Row Level Security) best practices

## 🌐 Internationalization

- Keep all user-facing text in English by default
- Use translation keys for multi-language support (future)
- Follow Russian/English bilingual standards for documentation

## 📞 Getting Help

- Check existing documentation
- Search existing issues
- Ask questions in discussions
- Contact maintainers

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make ChurchCRM Genesis better! 🙏

