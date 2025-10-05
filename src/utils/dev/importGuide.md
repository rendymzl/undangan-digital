# Import Organization Guide

This guide defines the standard import organization patterns for the Menantikan project.

## Import Order

Imports should be organized in the following order, with blank lines between each group:

1. **External libraries** (React, third-party packages)
2. **Internal modules** (using path aliases)
3. **Relative imports** (./components, ../utils)
4. **Type-only imports** (at the end)

## Example

```typescript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { toast } from 'sonner';

// 2. Internal modules (using path aliases)
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/useAuth';
import { ROUTES } from '@/constants/routes';
import { config } from '@/config';

// 3. Relative imports
import './Component.css';
import { localHelper } from '../utils/helper';

// 4. Type-only imports
import type { User } from '@/types/user';
import type { ComponentProps } from './types';
```

## Path Alias Usage

Always prefer path aliases over relative imports when importing from:
- `@/components/*` - UI and shared components
- `@/features/*` - Feature-specific modules
- `@/utils/*` - Utility functions
- `@/types/*` - Type definitions
- `@/constants/*` - Application constants
- `@/config/*` - Configuration files
- `@/router/*` - Routing related files
- `@/hooks/*` - Custom hooks
- `@/lib/*` - External library configurations
- `@/pages/*` - Page components
- `@/assets/*` - Static assets

## Import Naming Conventions

### Default Imports
- Use PascalCase for components: `import Button from '@/components/ui/Button'`
- Use camelCase for utilities: `import { formatDate } from '@/utils/date'`
- Use UPPER_CASE for constants: `import { API_ENDPOINTS } from '@/constants/api'`

### Named Imports
- Group related imports: `import { useState, useEffect, useCallback } from 'react'`
- Use destructuring for multiple exports: `import { Button, Input, Card } from '@/components/ui'`

### Type Imports
- Always use `import type` for type-only imports
- Group type imports at the end
- Use descriptive names: `import type { UserProfile, AuthState } from '@/types'`

## Examples by File Type

### Component Files
```typescript
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/features/auth/useAuth';
import { ANIMATION_DURATION } from '@/constants/ui';

import { validateForm } from '../utils/validation';

import type { FormData } from '@/types/forms';
import type { ComponentProps } from './types';
```

### Hook Files
```typescript
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import { apiClient } from '@/lib/api';
import { STORAGE_KEYS } from '@/constants/ui';
import { logError } from '@/utils/error';

import type { User } from '@/types/user';
import type { ApiResponse } from '@/types/api';
```

### Utility Files
```typescript
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

import { config } from '@/config';
import { VALIDATION } from '@/constants/ui';

import type { DateFormatOptions } from './types';
```

## Anti-Patterns to Avoid

❌ **Don't mix import types**
```typescript
// Bad
import React, { type FC } from 'react';
import { Button, type ButtonProps } from '@/components/ui/button';
```

✅ **Separate type imports**
```typescript
// Good
import React from 'react';
import { Button } from '@/components/ui/button';

import type { FC } from 'react';
import type { ButtonProps } from '@/components/ui/button';
```

❌ **Don't use relative imports for shared modules**
```typescript
// Bad
import { Button } from '../../../components/ui/button';
import { useAuth } from '../../features/auth/useAuth';
```

✅ **Use path aliases**
```typescript
// Good
import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/useAuth';
```

❌ **Don't mix import styles**
```typescript
// Bad
import React from 'react';
import { Button } from '@/components/ui/button';
import toast from 'sonner';
import { useAuth } from '@/features/auth/useAuth';
```

✅ **Group and order consistently**
```typescript
// Good
import React from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/features/auth/useAuth';
```