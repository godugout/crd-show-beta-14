# Claude Code Command Templates

Place reusable prompts or task checklists in this folder. Claude Code will find them automatically with `/use <name>`.

## Examples

### refactor-large-component.md

```
/clear
I need to refactor <ComponentName> for readability & performance:
- Split out hooks ➜ /utils
- Add explicit prop types
- Remove dead props
- Update all imports
- Run tests & `npm run lint`
```

### create-tests.md

```
/clear
Generate Jest + RTL tests for the following files:
<file list>
- Coverage ≥ 80%
```
