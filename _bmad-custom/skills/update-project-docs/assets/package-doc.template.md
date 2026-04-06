# {Package Display Name}

{Brief description from package.json}

## Overview

| Property       | Value                      |
| -------------- | -------------------------- |
| **Package**    | `{package-name}`           |
| **Version**    | {version}                  |
| **Path**       | `{relative-path}`          |
| **Type**       | {Library/Application/Tool} |
| **Private**    | {Yes/No}                   |
| **Visibility** | {Internal/External}        |

## Purpose

{Expanded description of what this package does and why it exists. Explain the problem it solves and its role in the architecture.}

## Architecture

```
{package-name}/
├── src/
│   ├── index.ts          # Main entry point
│   ├── {module1}/        # {Description}
│   ├── {module2}/        # {Description}
│   └── types/            # Type definitions
├── __tests__/            # Test files
└── package.json
```

## Key Components

### {Component/Module 1}

{Description of purpose and functionality}

**Usage:**
```typescript
import { Component1 } from '{package-name}';
```

### {Component/Module 2}

{Description}

## API Reference

### Exports

| Export | Type | Description |
|--------|------|-------------|
| `{export1}` | {function/component/type} | {description} |
| `{export2}` | {function/component/type} | {description} |

### Types

```typescript
// Key interfaces and types
interface {TypeName} {
  // ...
}

type {AnotherType} = // ...
```

## Usage Examples

### Basic Usage

```typescript
import { something } from '{package-name}';

// Basic example
const result = something();
```

### Advanced Usage

```typescript
// More complex example with configuration
import { advancedFeature } from '{package-name}';

const configured = advancedFeature({
  option1: 'value',
  option2: true,
});
```

### Integration with Other Packages

```typescript
// Example of how this package integrates with others
import { feature } from '{package-name}';
import { otherFeature } from '{other-package-name}';

// Combined usage
```

## Dependencies

### Internal (Workspace)

| Package | Purpose |
|---------|---------|
| `{workspace-dep}` | {why needed} |

### External

| Package | Version | Purpose |
|---------|---------|---------|
| `{external-dep}` | {version} | {why} |

### Peer Dependencies

| Package | Version | Notes |
|---------|---------|-------|
| `react` | {version} | {if applicable} |

## Configuration

{If the package has configuration options}

```typescript
// Configuration example
```

## Testing

Test files location: `__tests__/`

Run tests:
```bash
{package-manager} --filter {package-name} test
```

## Related Documentation

- [Related Package](../category/related-package.md)
- [Architecture Guide](../../../docs/Architecture/relevant.md)
- [Usage Guidelines](../../../docs/Guidelines/relevant.md)

---

*Generated: {date}*
