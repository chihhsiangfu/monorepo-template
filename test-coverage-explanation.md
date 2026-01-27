# Test Coverage Explanation

Test coverage is a metric that measures how much of your source code is executed when your test suite runs. It helps identify untested code paths and ensures your tests are comprehensive.

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

## Coverage Report Example

```
-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
All files          |     100 |      100 |     100 |     100 |
 create-item.ts    |     100 |      100 |     100 |     100 |
 delete-item.ts    |     100 |      100 |     100 |     100 |
 list-items.ts     |     100 |      100 |     100 |     100 |
-------------------|---------|----------|---------|---------|-------------------
```

- **% Stmts**: Statement coverage percentage
- **% Branch**: Branch coverage percentage
- **% Funcs**: Function coverage percentage
- **% Lines**: Line coverage percentage
- **Uncovered Line #s**: Specific lines not covered by tests

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

**Solution:** Write tests that mock the API to throw errors.

### 2. Ternary Operators

```typescript
const result = condition ? valueA : valueB;
//                         ^^^^^    ^^^^^^
//                         Both branches need tests
```

**Solution:** Write separate tests for truthy and falsy conditions.

### 3. Optional Chaining Short-circuits

```typescript
const name = user?.profile?.name ?? "Anonymous";
//           ^^^^^ ^^^^^^^^ ^^^^
//           Each ?. and ?? is a branch
```

**Solution:** Test with `undefined` values at each level.

### 4. Default Parameters

```typescript
function greet(name = "World") {
  return `Hello, ${name}!`;
}
```

| Test | Covers Default |
|------|----------------|
| `greet("Alice")` | No |
| `greet()` | Yes |

## Running Coverage in This Project

### Commands

```bash
# Run tests with coverage report
pnpm test:coverage

# Open HTML coverage report in browser
pnpm test:coverage:html
```

### Configuration

Coverage is configured in `apps/server/vitest.config.ts`:

```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/services/**/*.ts"],
    },
  },
});
```

- **provider: "v8"**: Uses V8's built-in coverage (fast, accurate)
- **include**: Only measures coverage for service files

## Coverage Thresholds

You can enforce minimum coverage by adding thresholds:

```typescript
// vitest.config.ts
coverage: {
  provider: "v8",
  thresholds: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80,
  },
},
```

Tests will fail if coverage drops below these thresholds.

## Best Practices

### 1. Aim for High Coverage, Not 100%

- **80-90%** is generally a good target
- 100% coverage doesn't guarantee bug-free code
- Some code (logging, error handlers) may not need tests

### 2. Focus on Critical Paths

Prioritize coverage for:
- Business logic
- Data transformations
- API handlers
- Validation logic

Lower priority:
- Simple getters/setters
- Configuration files
- Type definitions

### 3. Use Coverage to Find Gaps

Coverage reports help identify:
- Dead code that's never executed
- Missing edge case tests
- Incomplete error handling

### 4. Don't Game the Metrics

Bad practice (testing without assertions):
```typescript
it("covers the function", () => {
  myFunction();  // No expect() - just runs for coverage
});
```

Good practice:
```typescript
it("returns expected result", () => {
  const result = myFunction();
  expect(result).toBe(expectedValue);
});
```

## Understanding the HTML Report

The `coverage/index.html` report provides:

1. **Summary Page**: Overview of all files with coverage percentages
2. **File Details**: Click any file to see line-by-line coverage
3. **Color Coding**:
   - Green: Covered lines
   - Red: Uncovered lines
   - Yellow: Partially covered (some branches taken)

## Coverage vs. Quality

| High Coverage | Low Coverage |
|---------------|--------------|
| Code is executed by tests | Code may have untested paths |
| Doesn't guarantee correctness | Definitely has gaps |
| May have weak assertions | Missing test scenarios |

**Remember:** Coverage measures quantity of testing, not quality. A well-designed test with good assertions is more valuable than many tests that just execute code without verifying behavior.
