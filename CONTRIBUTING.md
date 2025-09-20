# Contributing to Khisima Frontend

Thank you for your interest in contributing to the Khisima Language Service Provider frontend! This document provides guidelines and instructions for contributing to the project.

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or pnpm package manager
- Git for version control
- Basic knowledge of React, JavaScript, and CSS

### Development Setup

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/khisima---frontend.git
   cd khisima---frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style

#### JavaScript/React
- Use **functional components** with hooks
- Follow **ES6+ syntax** and modern JavaScript features
- Use **destructuring** for props and state
- Implement **proper error boundaries** for React components

#### CSS/Styling
- Use **Tailwind CSS** utility classes
- Follow **mobile-first** responsive design approach
- Use **CSS custom properties** for theming
- Maintain **consistent spacing** using Tailwind scale

#### File Naming
- Use **PascalCase** for component files: `ComponentName.jsx`
- Use **camelCase** for utility files: `utilityFunction.js`
- Use **kebab-case** for CSS files: `component-styles.css`

### Component Structure

```jsx
// ComponentName.jsx
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PropTypes from 'prop-types';

const ComponentName = ({ prop1, prop2, ...props }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  const handleFunction = () => {
    // Event handlers
  };

  return (
    <div className="container mx-auto px-4">
      {/* Component JSX */}
    </div>
  );
};

ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

ComponentName.defaultProps = {
  prop2: 0,
};

export default ComponentName;
```

### State Management

#### Redux Toolkit
- Use **RTK Query** for API calls
- Create **slices** for related functionality
- Follow **normalized state** patterns
- Use **selectors** for computed state

#### Local State
- Use **useState** for component-level state
- Use **useReducer** for complex state logic
- Use **custom hooks** for reusable stateful logic

### API Integration

#### RTK Query Setup
```javascript
// apiSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '@/constants';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: 'include',
  }),
  tagTypes: ['User', 'Quote', 'Service'],
  endpoints: (builder) => ({
    // Define endpoints
  }),
});
```

#### Error Handling
- Implement **proper error boundaries**
- Use **toast notifications** for user feedback
- Handle **loading states** consistently
- Provide **fallback UI** for errors

## 🧪 Testing Guidelines

### Component Testing
```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Testing Best Practices
- Write **unit tests** for utility functions
- Create **component tests** for UI components
- Add **integration tests** for user workflows
- Mock **external dependencies** appropriately

## 📝 Commit Guidelines

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Test additions or changes
- **chore**: Build process or auxiliary tool changes

### Examples
```bash
feat(auth): add user authentication flow
fix(ui): resolve mobile navigation issue
docs(readme): update installation instructions
style(components): improve button component styling
```

## 🔄 Pull Request Process

### Before Submitting
1. **Update** your fork with the latest changes
2. **Test** your changes thoroughly
3. **Lint** your code: `npm run lint`
4. **Build** the project: `npm run build`
5. **Write** clear commit messages

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Manual testing completed
- [ ] Cross-browser compatibility checked

## Screenshots
[If applicable, add screenshots]

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

### Review Process
1. **Automated checks** must pass
2. **Code review** by maintainers
3. **Testing** in staging environment
4. **Approval** from project maintainers

## 🐛 Issue Reporting

### Bug Reports
Include the following information:
- **Environment**: OS, browser, Node.js version
- **Steps to reproduce** the issue
- **Expected behavior**
- **Actual behavior**
- **Screenshots** or error messages
- **Additional context**

### Feature Requests
Include the following information:
- **Problem description**
- **Proposed solution**
- **Alternative solutions** considered
- **Additional context**

## 🎨 UI/UX Guidelines

### Design Principles
- **Accessibility first**: WCAG 2.1 AA compliance
- **Mobile responsive**: Mobile-first approach
- **Performance**: Optimize for Core Web Vitals
- **Consistency**: Follow established design patterns

### Component Library
- Use **Radix UI** primitives for accessibility
- Extend **base components** rather than creating new ones
- Follow **design system** color palette and typography
- Implement **dark mode** support consistently

### Animation Guidelines
- Use **subtle animations** for better UX
- Implement **loading states** for better perceived performance
- Follow **motion principles** for natural feel
- Respect **user preferences** for reduced motion

## 📚 Resources

### Documentation
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Redux Toolkit Docs](https://redux-toolkit.js.org/)
- [Radix UI Docs](https://www.radix-ui.com/docs)

### Tools
- [React DevTools](https://react-dev-tools.netlify.app/)
- [Redux DevTools](https://github.com/reduxjs/redux-devtools)
- [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

## 🤝 Community Guidelines

### Code of Conduct
- Be **respectful** and **inclusive**
- Provide **constructive feedback**
- Help **others learn** and grow
- Follow **professional standards**

### Communication
- Use **clear** and **concise** language
- Be **patient** with questions and feedback
- **Document** your decisions and reasoning
- **Share knowledge** with the community

## 📞 Getting Help

- **Issues**: GitHub Issues for bugs and feature requests
- **Discussions**: GitHub Discussions for questions
- **Email**: tech@khisima.com for direct support
- **Documentation**: Check README.md for setup instructions

Thank you for contributing to Khisima! 🌍