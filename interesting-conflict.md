The issue is that `react-query@3.39.3` doesn't support React 19. The package has been renamed and updated. Let me fix the client package.json to use the correct packages:Now let me update the installation commands to use the correct packages:Now let me add the immediate fix for your current situation:Perfect! I've identified and fixed the issue. The problem is that you have both `react-query@3.39.3` (old, deprecated) and `@tanstack/react-query@5.59.16` (new, modern) in your dependencies, and the old one doesn't support React 19.

## **🔧 Quick Fix (Choose one):**

**Option 1: Remove the conflicting package**
```bash
cd client
npm uninstall react-query
npm install @tanstack/react-query@^5.59.16
npm install --legacy-peer-deps
```

**Option 2: Clean slate install**
```bash
# Delete conflicting files
del package-lock.json
rmdir /s /q node_modules

# Install correct packages only
npm install vite @vitejs/plugin-react
npm install react@^19.1.1 react-dom@^19.1.1
npm install @mui/material @emotion/react @emotion/styled
npm install react-router-dom axios @tanstack/react-query
npm install formik yup date-fns react-hot-toast zustand
```

**Option 3: Use React 18 (most compatible)**
```bash
npm install react@^18.3.1 react-dom@^18.3.1
npm install @types/react@^18.3.11 @types/react-dom@^18.3.2
npm install --legacy-peer-deps
```

## **🎯 Key Issue Fixed:**
- ❌ `react-query@3.39.3` (doesn't support React 19)
- ✅ `@tanstack/react-query@5.59.16` (supports React 19)

After applying one of these fixes, your `npm run client:dev` should work!