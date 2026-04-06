# {Package Name} - AI Context

> Quick reference for AI agents working with this package.
> **Generated**: {date}

---

## Package Info

- **Name**: `{package-name}`
- **Version**: {version}
- **Path**: `{path}`
- **Type**: {Library/Application/Tool}

---

## Critical Rules

1. **{Rule 1}**: {Explanation}
2. **{Rule 2}**: {Explanation}
3. **{Rule 3}**: {Explanation}

---

## Import Pattern

```typescript
// ✅ CORRECT - Standard import
import { feature1, feature2 } from '{package-name}';

// ✅ CORRECT - Specific entry point (if available)
import { specificFeature } from '{package-name}/{entry}';

// ❌ AVOID - Deep imports
import something from '{package-name}/src/internal/module';

// ❌ AVOID - Default imports (unless documented)
import SomethingDefault from '{package-name}';
```

---

## Key Types

```typescript
// Essential types when using this package

{Minimal type definitions needed for usage}
```

---

## Common Patterns

### Pattern 1: {Name}

```typescript
// {Description}
{code example}
```

### Pattern 2: {Name}

```typescript
// {Description}
{code example}
```

---

## Anti-patterns

### ❌ {Anti-pattern 1}

```typescript
// DON'T do this
{bad example}

// ✅ Instead, do this
{good example}
```

### ❌ {Anti-pattern 2}

```typescript
// DON'T do this
{bad example}

// ✅ Instead, do this
{good example}
```

---

## Dependencies Context

### This Package Requires

- `{dep1}` - {brief reason}
- `{dep2}` - {brief reason}

### Used By

- `{consumer1}` - {how it uses this}
- `{consumer2}` - {how it uses this}

---

## Quick Reference

| Task | How |
|------|-----|
| Import main features | `import { x } from '{package}'` |
| {Common task} | {Brief how} |
| {Another task} | {Brief how} |

---

## See Also

- [Full Documentation](./{package-name}.md)
- [Related Package Context](./related.context.md)
