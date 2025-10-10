# Navigation Guide: Business Plan Functionality

## Overview

This guide explains how to navigate to and use the improved Business Plan functionality from different parts of your application.

---

## 🗺️ Navigation Paths

### **1. From Documents Hub** (Primary Method)

The **Documents Hub** (`/documents`) is the central location for all your documents, including business plans.

#### Steps:
1. Navigate to `/documents` or click "Documents" in the main navigation
2. Find your business plan in the documents grid
3. Click the **three-dot menu** (⋮) on the business plan card
4. Select **"Edit"** from the dropdown menu
5. You'll be redirected to `/edit-plan/{id}` with the enhanced editor

#### Quick Access:
```typescript
// Direct link from Documents Hub
<Link href={`/edit-plan/${document.id}`}>
  <Edit className="h-4 w-4 mr-2" />
  Edit
</Link>
```

---

### **2. From Dashboard**

Add a quick action button to your dashboard for easy access:

#### Implementation:
```tsx
// In your Dashboard component
import { Link } from 'wouter';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

<Button asChild>
  <Link href="/documents?filter=business-plan">
    <FileText className="h-4 w-4 mr-2" />
    My Business Plans
  </Link>
</Button>
```

---

### **3. From Upload Page**

After uploading or creating a new business plan:

#### Implementation:
```tsx
// In your Upload component
import { useLocation } from 'wouter';

const [, setLocation] = useLocation();

// After successful upload
const handleUploadSuccess = (planId: string) => {
  setLocation(`/edit-plan/${planId}`);
};
```

---

### **4. Direct URL Access**

You can navigate directly to a business plan editor using the URL:

```
/edit-plan/{planId}
```

Example:
```
/edit-plan/123
/edit-plan/abc-def-456
```

---

## 📋 URL Parameters

The Business Plan editor supports URL parameters for deep linking to specific sections:

### **Chapter and Section Selection**

```
/edit-plan/{id}?chapter={chapterId}&section={sectionId}
```

#### Examples:

**Executive Summary - Summary Section:**
```
/edit-plan/123?chapter=executive-summary&section=summary
```

**Financials - Cash Flow Section:**
```
/edit-plan/123?chapter=financials&section=cash-flow
```

**Market Analysis - SWOT Analysis:**
```
/edit-plan/123?chapter=market-analysis&section=swot-analysis
```

### **Available Chapters:**

| Chapter ID | Title |
|-----------|-------|
| `executive-summary` | Executive Summary |
| `the-business` | The Business |
| `products-services` | Products / Services |
| `market-analysis` | Market Analysis |
| `strategy` | Strategy |
| `operations` | Operations |
| `financials` | Financials |
| `appendix` | Appendix |

### **Creating Deep Links:**

```tsx
import { Link } from 'wouter';

// Link to specific section
<Link href="/edit-plan/123?chapter=market-analysis&section=swot-analysis">
  Edit SWOT Analysis
</Link>

// Programmatic navigation
const [, setLocation] = useLocation();
setLocation(`/edit-plan/${planId}?chapter=strategy&section=objectives`);
```

---

## 🎯 Integration Examples

### **Example 1: Add to Navbar**

```tsx
// In components/layout/Navbar.tsx
import { FileText } from 'lucide-react';
import { Link } from 'wouter';

<NavigationMenuItem>
  <Link href="/documents?filter=business-plan">
    <NavigationMenuLink>
      <FileText className="h-4 w-4 mr-2" />
      Business Plans
    </NavigationMenuLink>
  </Link>
</NavigationMenuItem>
```

### **Example 2: Quick Action Card**

```tsx
// In pages/dashboard.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Plus } from 'lucide-react';
import { Link } from 'wouter';

<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <FileText className="h-5 w-5" />
      Business Plans
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <Link href="/documents?filter=business-plan">
        <Button variant="outline" className="w-full">
          View All Plans
        </Button>
      </Link>
      <Link href="/ai-business-plan">
        <Button className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Create New Plan
        </Button>
      </Link>
    </div>
  </CardContent>
</Card>
```

### **Example 3: Recent Plans List**

```tsx
// Display recent business plans with edit links
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';

function RecentBusinessPlans() {
  const { data: plans } = useQuery({
    queryKey: ['/api/business-plans/recent'],
  });

  return (
    <div className="space-y-2">
      {plans?.map((plan) => (
        <Link key={plan.id} href={`/edit-plan/${plan.id}`}>
          <div className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
            <p className="font-medium">{plan.name}</p>
            <p className="text-sm text-gray-500">
              {plan.completionPercentage}% complete
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
```

---

## 🔄 Navigation Flow

### **Complete User Journey:**

```
1. User lands on Dashboard (/)
   ↓
2. Clicks "Documents" in navbar
   ↓
3. Arrives at Documents Hub (/documents)
   ↓
4. Filters or searches for business plan
   ↓
5. Clicks "Edit" on business plan card
   ↓
6. Redirected to Edit Plan page (/edit-plan/{id})
   ↓
7. Selects chapter and section from navigation
   ↓
8. URL updates with chapter/section params
   ↓
9. Edits content with AI assistance
   ↓
10. Auto-save or manual save
   ↓
11. Can navigate back to Documents or Dashboard
```

---

## 🎨 UI Components for Navigation

### **Breadcrumb Navigation**

Add breadcrumbs to show current location:

```tsx
// In pages/edit-plan.tsx
import { ChevronRight, Home, FileText } from 'lucide-react';
import { Link } from 'wouter';

<div className="flex items-center gap-2 text-sm text-gray-600">
  <Link href="/">
    <Home className="h-4 w-4" />
  </Link>
  <ChevronRight className="h-4 w-4" />
  <Link href="/documents">
    <FileText className="h-4 w-4" />
    Documents
  </Link>
  <ChevronRight className="h-4 w-4" />
  <span className="text-gray-900 font-medium">
    {businessPlan?.name}
  </span>
</div>
```

### **Back Button**

The edit page already includes a back button:

```tsx
<Button variant="ghost" size="sm" onClick={() => setLocation('/documents')}>
  <ArrowLeft className="h-4 w-4 mr-2" />
  Back to Documents
</Button>
```

---

## 📱 Mobile Navigation

For mobile users, consider adding:

### **Bottom Navigation Bar**

```tsx
// Mobile-friendly navigation
<div className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden">
  <div className="grid grid-cols-4 gap-1 p-2">
    <Link href="/">
      <Button variant="ghost" size="sm" className="flex-col h-auto">
        <Home className="h-5 w-5" />
        <span className="text-xs mt-1">Home</span>
      </Button>
    </Link>
    <Link href="/documents">
      <Button variant="ghost" size="sm" className="flex-col h-auto">
        <FileText className="h-5 w-5" />
        <span className="text-xs mt-1">Documents</span>
      </Button>
    </Link>
    {/* Add more navigation items */}
  </div>
</div>
```

---

## 🔍 Search Integration

Add search functionality to quickly find and navigate to business plans:

```tsx
// Global search component
import { Search } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';

function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [, setLocation] = useLocation();
  
  const { data: results } = useQuery({
    queryKey: ['/api/search', query],
    enabled: query.length > 2,
  });

  const handleSelect = (planId: string) => {
    setLocation(`/edit-plan/${planId}`);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search business plans..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-10"
      />
      {/* Results dropdown */}
    </div>
  );
}
```

---

## 🎯 Keyboard Shortcuts

Implement keyboard shortcuts for power users:

```tsx
// In App.tsx or a global hook
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    // Cmd/Ctrl + K: Open search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      // Open search modal
    }
    
    // Cmd/Ctrl + B: Go to business plans
    if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
      e.preventDefault();
      setLocation('/documents?filter=business-plan');
    }
  };

  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

---

## 📊 Analytics Tracking

Track navigation for insights:

```tsx
// Track page views
import { useEffect } from 'react';
import { useLocation } from 'wouter';

function usePageTracking() {
  const [location] = useLocation();
  
  useEffect(() => {
    // Track page view
    analytics.track('Page View', {
      path: location,
      timestamp: new Date(),
    });
  }, [location]);
}

// Track specific actions
const handleEditClick = (planId: string) => {
  analytics.track('Business Plan Edit Started', {
    planId,
    source: 'documents-hub',
  });
  
  setLocation(`/edit-plan/${planId}`);
};
```

---

## 🔗 Quick Reference

### **Key Routes:**

| Route | Description |
|-------|-------------|
| `/` | Dashboard |
| `/documents` | Documents Hub (main entry point) |
| `/edit-plan/:id` | Business Plan Editor |
| `/ai-business-plan` | AI Business Plan Generator |
| `/business-plans` | Business Plans List (Upload page) |

### **Key Components:**

| Component | Location | Purpose |
|-----------|----------|---------|
| `EditPlan` | `/pages/edit-plan.tsx` | Main editor page |
| `DocumentsHub` | `/pages/documents-hub.tsx` | Document management |
| `ChapterNavigation` | `/components/business-plan/ChapterNavigation.tsx` | Chapter/section navigation |
| `SectionEditor` | `/components/business-plan/SectionEditor.tsx` | Content editor |
| `ProgressDashboard` | `/components/business-plan/ProgressDashboard.tsx` | Progress tracking |

---

## 💡 Best Practices

1. **Always use the Documents Hub** as the primary entry point for document management
2. **Preserve URL state** when navigating between sections
3. **Show breadcrumbs** to help users understand their location
4. **Implement back buttons** for easy navigation
5. **Use deep links** to share specific sections with team members
6. **Track navigation** to understand user behavior
7. **Provide keyboard shortcuts** for power users
8. **Optimize for mobile** with bottom navigation or hamburger menu

---

## 🚀 Next Steps

1. **Test Navigation**: Verify all navigation paths work correctly
2. **Add Analytics**: Track how users navigate to business plans
3. **Optimize Mobile**: Ensure mobile navigation is intuitive
4. **User Feedback**: Gather feedback on navigation flow
5. **Documentation**: Keep this guide updated as navigation evolves

---

## 📞 Support

For questions or issues with navigation:
- Check the main documentation: `BUSINESS_PLAN_IMPROVEMENTS.md`
- Review the component code in `/components/business-plan/`
- Contact the development team

---

**Last Updated**: 2025-10-10
