# Test Coverage: A Complete Guide

Test coverage is a metric that measures how much of your source code is executed when your test suite runs. It helps identify untested code paths and ensures your tests are comprehensive.

## Table of Contents

- [Coverage Metrics](#coverage-metrics)
- [Setting Up Coverage with Vitest](#setting-up-coverage-with-vitest)
- [Running Coverage](#running-coverage)
- [Reading Coverage Reports](#reading-coverage-reports)
- [Common Uncovered Patterns](#common-uncovered-patterns)
- [Coverage Thresholds](#coverage-thresholds)
- [Best Practices](#best-practices)
- [Coverage vs Quality](#coverage-vs-quality)

---

## Coverage Metrics

### 1. Statement Coverage

**What it measures:** The percentage of executable statements that have been run.

```typescript
function example(a: number) {
  const x = a + 1;      // Statement 1
  const y = x * 2;      // Statement 2
  return y;             // Statement 3
}
```

If your test calls `example(5)`, all 3 statements are executed = **100% statement coverage**.

### 2. Branch Coverage

**What it measures:** The percentage of conditional branches (if/else, ternary, switch cases) that have been taken.

```typescript
function example(a: number) {
  if (a > 0) {          // Branch 1: true
    return "positive";
  } else {              // Branch 2: false
    return "non-positive";
  }
}
```

| Test | Branch 1 (a > 0) | Branch 2 (a <= 0) | Branch Coverage |
|------|------------------|-------------------|-----------------|
| `example(5)` | Yes | No | 50% |
| `example(5)` + `example(-1)` | Yes | Yes | 100% |

### 3. Function Coverage

**What it measures:** The percentage of functions that have been called at least once.

```typescript
function add(a: number, b: number) { return a + b; }      // Function 1
function subtract(a: number, b: number) { return a - b; } // Function 2
function multiply(a: number, b: number) { return a * b; } // Function 3
```

| Tests | Function Coverage |
|-------|-------------------|
| Only test `add()` | 33% (1/3) |
| Test `add()` and `subtract()` | 66% (2/3) |
| Test all three | 100% (3/3) |

### 4. Line Coverage

**What it measures:** The percentage of executable lines that have been run. Similar to statement coverage but counts by line number.

```typescript
function example(a: number, b: number) {
  const sum = a + b; const product = a * b;  // Line 1: 2 statements
  return { sum, product };                    // Line 2: 1 statement
}
```

Line coverage counts line 1 as covered if either statement runs. Statement coverage requires both statements to be counted separately.

---

## Setting Up Coverage with Vitest

### Step 1: Install Dependencies

Vitest supports two coverage providers:

```bash
# Option A: V8 (Recommended - faster, built into Node.js)
npm install -D vitest @vitest/coverage-v8

# Option B: Istanbul (more traditional, wider compatibility)
npm install -D vitest @vitest/coverage-istanbul
```

**Which one to choose?**

| Provider | Pros | Cons |
|----------|------|------|
| **V8** | Faster, no instrumentation needed, accurate | Node.js only |
| **Istanbul** | Works everywhere, mature ecosystem | Slower, requires code transformation |

### Step 2: Configure Vitest

Create or update `vitest.config.ts`:

```typescript
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Enable global test APIs (describe, it, expect)
    globals: true,

    // Test environment
    environment: "node", // or "jsdom" for browser-like environment

    // Test file patterns
    include: ["src/**/*.test.ts", "src/**/*.spec.ts"],

    // Coverage configuration
    coverage: {
      // Coverage provider
      provider: "v8", // or "istanbul"

      // Files to include in coverage
      include: ["src/**/*.ts"],

      // Files to exclude from coverage
      exclude: [
        "src/**/*.test.ts",
        "src/**/*.spec.ts",
        "src/**/*.d.ts",
        "src/**/index.ts", // barrel files
      ],

      // Report formats
      reporter: ["text", "html", "json", "lcov"],

      // Output directory
      reportsDirectory: "./coverage",
    },
  },
});
```

### Step 3: Add Scripts to package.json

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

## Running Coverage

### Basic Commands

```bash
# Run tests once with coverage
npx vitest run --coverage

# Run tests in watch mode with coverage
npx vitest --coverage

# Using npm scripts
npm run test:coverage
```

### Command Line Options

```bash
# Specify coverage provider
npx vitest run --coverage --coverage.provider=v8

# Generate specific report formats
npx vitest run --coverage --coverage.reporter=text --coverage.reporter=html

# Only cover specific files
npx vitest run --coverage --coverage.include="src/services/**/*.ts"

# Set coverage thresholds (fail if below)
npx vitest run --coverage --coverage.thresholds.lines=80
```

---

## Reading Coverage Reports

### Terminal Output

After running coverage, you'll see a table like this:

```
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
All files          |   85.71 |    75.00 |     100 |   85.71 |
 src/services      |   85.71 |    75.00 |     100 |   85.71 |
  user.service.ts  |     100 |      100 |     100 |     100 |
  auth.service.ts  |   71.42 |    50.00 |     100 |   71.42 | 15-18,25
-------------------|---------|----------|---------|---------|-------------------
```

**Understanding the columns:**

| Column | Meaning |
|--------|---------|
| **% Stmts** | Percentage of statements executed |
| **% Branch** | Percentage of branches taken |
| **% Funcs** | Percentage of functions called |
| **% Lines** | Percentage of lines executed |
| **Uncovered Line #s** | Specific lines not covered |

### HTML Report

The HTML report (`coverage/index.html`) provides an interactive view:

1. **Open the report:**
   ```bash
   # macOS
   open coverage/index.html

   # Linux
   xdg-open coverage/index.html

   # Windows
   start coverage/index.html
   ```

2. **Navigate the report:**
   - **Summary page**: Shows all files with coverage percentages
   - **Click any file**: See line-by-line coverage details

3. **Color coding:**
   | Color | Meaning |
   |-------|---------|
   | Green | Line is covered |
   | Red | Line is not covered |
   | Yellow | Line is partially covered (some branches) |

4. **Branch indicators:**
   ```
   if (condition) {  // 1/2 branches covered
   ```
   The `1/2` shows only one branch (true or false) was tested.

### Report Formats Explained

| Format | File | Use Case |
|--------|------|----------|
| **text** | Terminal output | Quick local check |
| **html** | `coverage/index.html` | Detailed exploration |
| **json** | `coverage/coverage-final.json` | Programmatic access |
| **lcov** | `coverage/lcov.info` | CI tools (Codecov, Coveralls) |
| **cobertura** | `coverage/cobertura-coverage.xml` | Jenkins, GitLab CI |

---

## Common Uncovered Patterns

### 1. Error Handling Branches

```typescript
async function fetchData() {
  try {
    const data = await api.get();  // Tested
    return data;
  } catch (error) {
    console.error(error);          // Often untested!
    throw error;
  }
}
```

**Solution:** Mock the API to throw errors:

```typescript
it("handles API errors", async () => {
  vi.mocked(api.get).mockRejectedValue(new Error("Network error"));
  await expect(fetchData()).rejects.toThrow("Network error");
});
```

### 2. Ternary Operators

```typescript
const result = condition ? valueA : valueB;
//                         ^^^^^    ^^^^^^
//                         Both branches need tests
```

**Solution:** Write tests for both truthy and falsy conditions:

```typescript
it("returns valueA when condition is true", () => {
  expect(getResult(true)).toBe(valueA);
});

it("returns valueB when condition is false", () => {
  expect(getResult(false)).toBe(valueB);
});
```

### 3. Optional Chaining Short-circuits

```typescript
const name = user?.profile?.name ?? "Anonymous";
//           ^^^^^ ^^^^^^^^ ^^^^
//           Each ?. and ?? is a branch
```

**Solution:** Test with `undefined` at each level:

```typescript
it("returns name when user has profile", () => {
  expect(getName({ profile: { name: "John" } })).toBe("John");
});

it("returns Anonymous when user is undefined", () => {
  expect(getName(undefined)).toBe("Anonymous");
});

it("returns Anonymous when profile is undefined", () => {
  expect(getName({ profile: undefined })).toBe("Anonymous");
});
```

### 4. Default Parameters

```typescript
function greet(name = "World") {
  return `Hello, ${name}!`;
}
```

**Solution:** Test with and without the parameter:

```typescript
it("greets with provided name", () => {
  expect(greet("Alice")).toBe("Hello, Alice!");
});

it("greets World by default", () => {
  expect(greet()).toBe("Hello, World!");
});
```

### 5. Switch Statement Cases

```typescript
function getStatus(code: number) {
  switch (code) {
    case 200: return "OK";
    case 404: return "Not Found";
    case 500: return "Server Error";
    default: return "Unknown";
  }
}
```

**Solution:** Test each case including default:

```typescript
it.each([
  [200, "OK"],
  [404, "Not Found"],
  [500, "Server Error"],
  [999, "Unknown"],
])("returns %s for code %i", (code, expected) => {
  expect(getStatus(code)).toBe(expected);
});
```

---

## Coverage Thresholds

Enforce minimum coverage to prevent regression:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      thresholds: {
        // Global thresholds
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,

        // Per-file thresholds (stricter for critical files)
        "src/services/**/*.ts": {
          statements: 90,
          branches: 85,
        },
      },
    },
  },
});
```

**CI will fail** if coverage drops below these thresholds.

---

## Best Practices

### 1. Aim for High Coverage, Not 100%

| Target | Use Case |
|--------|----------|
| **80-90%** | Most applications |
| **90-95%** | Critical libraries, payment systems |
| **70-80%** | Rapid prototyping, internal tools |

100% coverage doesn't guarantee bug-free code. Focus on meaningful tests.

### 2. Prioritize Critical Paths

**High priority** (aim for 90%+):
- Business logic
- Data transformations
- API handlers
- Authentication/Authorization
- Payment processing

**Lower priority** (70-80% is fine):
- Simple getters/setters
- Configuration files
- Logging utilities
- Type definitions

### 3. Use Coverage to Find Gaps

Coverage reports help identify:
- Dead code that's never executed
- Missing edge case tests
- Incomplete error handling
- Forgotten code paths

### 4. Don't Game the Metrics

**Bad practice** (testing without assertions):
```typescript
it("covers the function", () => {
  myFunction();  // No expect() - just runs for coverage
});
```

**Good practice** (meaningful assertions):
```typescript
it("returns expected result", () => {
  const result = myFunction();
  expect(result).toBe(expectedValue);
});
```

### 5. Review Coverage in Code Reviews

- Check coverage diff in PRs
- Require tests for new features
- Don't merge if coverage decreases significantly

---

## Coverage vs Quality

High coverage doesn't equal high quality:

| Scenario | Coverage | Quality |
|----------|----------|---------|
| Tests with no assertions | High | Low |
| Tests only happy paths | Medium | Medium |
| Tests with edge cases and error handling | High | High |
| No tests | 0% | Unknown |

**Remember:** Coverage measures **quantity** of testing, not **quality**. A well-designed test with good assertions is more valuable than many tests that just execute code without verifying behavior.

### The Coverage Paradox

```typescript
// This function has a subtle bug
function divide(a: number, b: number) {
  return a / b;  // Bug: doesn't handle b === 0
}

// This test achieves 100% coverage but misses the bug
it("divides two numbers", () => {
  expect(divide(10, 2)).toBe(5);  // 100% coverage!
});

// This test catches the bug
it("throws when dividing by zero", () => {
  expect(() => divide(10, 0)).toThrow();  // Fails! Bug found.
});
```

---

## Quick Reference

```bash
# Install
npm install -D vitest @vitest/coverage-v8

# Run with coverage
npx vitest run --coverage

# View HTML report
open coverage/index.html
```

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      reporter: ["text", "html"],
      thresholds: { lines: 80 },
    },
  },
});
```

---

## Further Reading

- [Vitest Coverage Documentation](https://vitest.dev/guide/coverage)
- [V8 Coverage Provider](https://vitest.dev/guide/coverage#coverage-providers)
- [Istanbul Coverage](https://istanbul.js.org/)
