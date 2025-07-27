# CRD Show Beta - Subagents

This directory contains specialized AI subagents designed to improve development quality and speed for your CRD Show Beta application.

## 🎯 **Available Subagents**

### 1. **React/TypeScript Reviewer** (`react-typescript-reviewer.md`)
**Purpose**: Expert code review for React components, TypeScript patterns, and performance optimization.

**Best for**:
- Reviewing new React components
- TypeScript type safety improvements
- Performance optimization suggestions
- Modern React patterns implementation

**Usage**:
```
> Use the react-typescript-reviewer subagent to review my new component
> Have the react-typescript-reviewer check my TypeScript interfaces
```

### 2. **Supabase/Database Specialist** (`supabase-database-specialist.md`)
**Purpose**: Database optimization, RLS policies, queries, and Supabase configuration.

**Best for**:
- Database schema design
- Query optimization
- RLS policy implementation
- Authentication flows
- Real-time subscriptions

**Usage**:
```
> Use the supabase-database-specialist to optimize this query
> Have the supabase-database-specialist review my RLS policies
```

### 3. **UI/UX Component Specialist** (`ui-ux-component-specialist.md`)
**Purpose**: Component design, accessibility, responsive design, and user experience.

**Best for**:
- Component architecture
- Accessibility compliance
- Responsive design implementation
- Animation and micro-interactions
- Design system consistency

**Usage**:
```
> Use the ui-ux-component-specialist to improve this component's accessibility
> Have the ui-ux-component-specialist review my responsive design
```

### 4. **Performance/Build Optimizer** (`performance-build-optimizer.md`)
**Purpose**: Vite optimization, bundle analysis, and development workflow efficiency.

**Best for**:
- Bundle size optimization
- Build performance improvements
- Development workflow optimization
- Performance monitoring setup

**Usage**:
```
> Use the performance-build-optimizer to analyze my bundle size
> Have the performance-build-optimizer optimize my Vite config
```

### 5. **Testing/QA Specialist** (`testing-qa-specialist.md`)
**Purpose**: Comprehensive testing strategies, quality assurance, and bug prevention.

**Best for**:
- Test implementation
- Quality assurance processes
- Bug detection and prevention
- Test coverage improvement

**Usage**:
```
> Use the testing-qa-specialist to implement tests for this component
> Have the testing-qa-specialist review my test coverage
```

## 🚀 **How to Use Subagents**

### Automatic Delegation
Subagents are automatically invoked when Claude detects relevant tasks. They operate with their own context window, preserving your main conversation.

### Explicit Invocation
You can explicitly request a specific subagent:

```
> Use the react-typescript-reviewer to review my recent changes
> Have the supabase-database-specialist optimize this query
> Ask the ui-ux-component-specialist to improve accessibility
```

### Chaining Subagents
For complex tasks, you can chain multiple subagents:

```
> First use the react-typescript-reviewer to review the code, then use the testing-qa-specialist to add tests
```

## 🎯 **Best Practices**

1. **Be Specific**: Mention the exact subagent you want to use
2. **Provide Context**: Give the subagent enough information about your task
3. **Chain When Needed**: Use multiple subagents for complex workflows
4. **Review Results**: Always review the subagent's recommendations

## 📋 **Subagent Capabilities**

Each subagent has access to specific tools:
- **Read**: File reading and analysis
- **Edit**: Code modification and improvement
- **Bash**: Terminal commands and build processes
- **Grep**: Code search and pattern matching
- **Glob**: File pattern matching

## 🔧 **Customization**

You can modify any subagent by editing its `.md` file. The structure is:
- YAML frontmatter with configuration
- Detailed system prompt with specific instructions
- Checklists and best practices

## 📈 **Expected Benefits**

- **Faster Development**: Specialized expertise for specific tasks
- **Higher Quality**: Comprehensive review and optimization
- **Better Performance**: Optimized builds and runtime performance
- **Improved Testing**: Comprehensive test coverage and quality assurance
- **Enhanced UX**: Better accessibility and user experience

## 🎯 **Quick Start**

1. **Start with automatic delegation**: Let Claude choose the right subagent
2. **Be explicit when needed**: Request specific subagents for specialized tasks
3. **Review and iterate**: Always review subagent recommendations
4. **Customize as needed**: Modify subagents to match your specific needs

Your subagents are now ready to help you build a better CRD Show Beta application! 🚀 