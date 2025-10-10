# Quick Start Guide - Code Integrity Improvements

This guide helps you quickly adopt the new code integrity improvements in your development workflow.

---

## 🚀 Quick Reference

### Using the Logger

```typescript
import { logger } from './server/utils/logger';

// Basic logging
logger.info('User logged in', { userId: '123' });
logger.warn('Rate limit approaching', { remaining: 10 });
logger.error('Database connection failed', error);

// With context
logger.setContext({ userId: '123', requestId: 'abc' });
logger.info('Processing request'); // Includes context automatically

// Child logger
const requestLogger = logger.child({ requestId: req.id });
requestLogger.info('Request started');

// Timing operations
await logger.time('Database query', async () => {
  return await db.query('SELECT * FROM users');
});
```

---

### Using Custom Errors

```typescript
import { 
  NotFoundError, 
  ValidationError, 
  UnauthorizedError,
  assertExists 
} from './server/utils/errors';

// Throw specific errors
throw new NotFoundError('User');
throw new ValidationError('Invalid email format');
throw new UnauthorizedError('Token expired');

// Assert helpers
const user = await findUser(id);
assertExists(user, 'User'); // Throws NotFoundError if null

// In routes with error handler
router.get('/users/:id', asyncHandler(async (req, res) => {
  const user = await findUser(req.params.id);
  assertExists(user, 'User');
  res.json(user);
}));
```

---

### Using Validation Schemas

```typescript
import { ValidationSchemas } from '../shared/types/validation';

// Validate request body
router.post('/business-plans', async (req, res) => {
  try {
    const validData = ValidationSchemas.InsertBusinessPlanSchema.parse(req.body);
    const plan = await createBusinessPlan(validData);
    res.json(plan);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ValidationError('Invalid input', error.errors);
    }
    throw error;
  }
});

// Or use safeParse
const result = ValidationSchemas.InsertInvestmentSchema.safeParse(data);
if (!result.success) {
  logger.warn('Validation failed', { errors: result.error.errors });
  throw new ValidationError('Invalid investment data', result.error.errors);
}
```

---

### Using Domain Types

```typescript
import { 
  BusinessPlan, 
  Investment, 
  FinancialData,
  Metric 
} from '../shared/types/domain';

// Type-safe function signatures
async function createInvestment(data: InsertInvestment): Promise<Investment> {
  // TypeScript ensures data has all required fields
  return await investmentRepository.create(data);
}

// Type-safe return values
async function getMetrics(planId: string): Promise<Metric[]> {
  const analysis = await getAnalysis(planId);
  return analysis.financialMetrics; // Type-checked
}
```

---

## 📝 Common Patterns

### Pattern 1: Async Route Handler

```typescript
import { asyncHandler, assertExists, logger } from './server/utils';

router.get('/plans/:id', asyncHandler(async (req, res) => {
  logger.info('Fetching business plan', { planId: req.params.id });
  
  const plan = await planRepository.findById(req.params.id);
  assertExists(plan, 'Business plan');
  
  res.json(plan);
}));
```

### Pattern 2: Validated POST Route

```typescript
import { asyncHandler, ValidationError } from './server/utils';
import { ValidationSchemas } from '../shared/types';

router.post('/investments', asyncHandler(async (req, res) => {
  const result = ValidationSchemas.InsertInvestmentSchema.safeParse(req.body);
  
  if (!result.success) {
    throw new ValidationError('Invalid investment data', result.error.errors);
  }
  
  const investment = await investmentRepository.create(result.data);
  logger.info('Investment created', { investmentId: investment.id });
  
  res.status(201).json(investment);
}));
```

### Pattern 3: Error Handling

```typescript
import { AppError, logger } from './server/utils';

try {
  await riskyOperation();
} catch (error) {
  if (error instanceof AppError) {
    // Known error, let it propagate
    throw error;
  }
  
  // Unknown error, log and wrap
  logger.error('Unexpected error in operation', error);
  throw new InternalServerError('Operation failed');
}
```

### Pattern 4: Repository Method

```typescript
import { logger, DatabaseError } from './server/utils';
import { BusinessPlan, InsertBusinessPlan } from '../shared/types';

class BusinessPlanRepository {
  async create(data: InsertBusinessPlan): Promise<BusinessPlan> {
    try {
      logger.debug('Creating business plan', { userId: data.userId });
      
      const result = await db.collection('businessPlans').insertOne({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      logger.info('Business plan created', { planId: result.insertedId });
      return this.findById(result.insertedId);
      
    } catch (error) {
      logger.error('Failed to create business plan', error);
      throw new DatabaseError('Failed to create business plan');
    }
  }
}
```

---

## 🔧 Migration Checklist

When refactoring existing code:

### ✅ Replace Console Logging
```typescript
// ❌ Before
console.log('User created:', userId);
console.error('Error:', error);

// ✅ After
logger.info('User created', { userId });
logger.error('User creation failed', error);
```

### ✅ Replace Generic Errors
```typescript
// ❌ Before
throw new Error('User not found');
res.status(404).json({ error: 'Not found' });

// ✅ After
throw new NotFoundError('User');
// Error handler middleware handles the response
```

### ✅ Add Validation
```typescript
// ❌ Before
const data = req.body;
const plan = await createPlan(data);

// ✅ After
const validData = ValidationSchemas.InsertBusinessPlanSchema.parse(req.body);
const plan = await createPlan(validData);
```

### ✅ Add Type Annotations
```typescript
// ❌ Before
async function getPlans(userId) {
  return await storage.getBusinessPlans(userId);
}

// ✅ After
async function getPlans(userId: string): Promise<BusinessPlan[]> {
  return await planRepository.findByUserId(userId);
}
```

### ✅ Use Async Handler
```typescript
// ❌ Before
router.get('/plans', (req, res) => {
  getPlans(req.user.id)
    .then(plans => res.json(plans))
    .catch(error => res.status(500).json({ error: error.message }));
});

// ✅ After
router.get('/plans', asyncHandler(async (req, res) => {
  const plans = await getPlans(req.user.id);
  res.json(plans);
}));
```

---

## 🎯 Best Practices

### 1. Always Use Logger
- Never use `console.log/error/warn` directly
- Add context to logs for better debugging
- Use appropriate log levels

### 2. Throw Specific Errors
- Use custom error classes for known error cases
- Let error handler middleware format responses
- Include helpful error messages

### 3. Validate at Boundaries
- Validate all external input (API requests, file uploads, etc.)
- Use Zod schemas for runtime validation
- Handle validation errors gracefully

### 4. Type Everything
- Add type annotations to function parameters and returns
- Use domain types from shared/types
- Avoid `any` types

### 5. Use Async/Await
- Prefer async/await over promises
- Use asyncHandler for route handlers
- Handle errors with try/catch or let them propagate

---

## 📚 Additional Resources

- **Full Documentation**: See `docs/CODE_INTEGRITY_IMPROVEMENT_PLAN.md`
- **Summary**: See `CODE_INTEGRITY_SUMMARY.md`
- **Type Definitions**: See `shared/types/domain.ts`
- **Validation Schemas**: See `shared/types/validation.ts`
- **Utilities**: See `server/utils/`

---

## 🆘 Troubleshooting

### TypeScript Errors

**Problem**: Type mismatch errors  
**Solution**: Check that you're using the correct domain types from `shared/types`

**Problem**: `any` type warnings  
**Solution**: Add proper type annotations or use domain types

### Validation Errors

**Problem**: Zod validation failing  
**Solution**: Check schema definition and ensure data matches expected format

**Problem**: Need optional field  
**Solution**: Use `.optional()` in schema definition

### Runtime Errors

**Problem**: Error not being caught by handler  
**Solution**: Ensure you're using `asyncHandler` wrapper

**Problem**: Logs not appearing  
**Solution**: Check `LOG_LEVEL` environment variable

---

## 💡 Tips

1. **Start Small**: Refactor one route at a time
2. **Test Thoroughly**: Test each change before moving on
3. **Use IDE**: Let TypeScript guide you with autocomplete
4. **Read Errors**: TypeScript errors are helpful, read them carefully
5. **Ask Questions**: Refer to documentation or ask team

---

**Happy Coding! 🚀**
