# Visual Navigation Diagram

## 🗺️ Complete Navigation Map

```
┌─────────────────────────────────────────────────────────────────────┐
│                         YOUR APPLICATION                             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│  NAVBAR (Always Visible)                                            │
│  ┌──────┐  ┌──────────┐  ┌────────┐  ┌───────────┐  ┌──────────┐ │
│  │ Home │  │Documents │  │Funding │  │ Education │  │ Programs │ │
│  └──────┘  └────┬─────┘  └────────┘  └───────────┘  └──────────┘ │
└──────────────────┼──────────────────────────────────────────────────┘
                   │ Click here!
                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  DOCUMENTS HUB (/documents)                                         │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Search: [_______________] [Filter ▼] [Sort ▼] [+ Upload]   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  📁 All Documents:                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │
│  │ 📄 My Plan       │  │ 📄 Proposal      │  │ 📄 Pitch Deck    │ │
│  │ Business Plan    │  │ Grant Proposal   │  │ Investor Deck    │ │
│  │ 75% Complete     │  │ 45% Complete     │  │ 100% Complete    │ │
│  │ ┌──────────────┐ │  │ ┌──────────────┐ │  │ ┌──────────────┐ │ │
│  │ │ [⋮] Menu     │ │  │ │ [⋮] Menu     │ │  │ │ [⋮] Menu     │ │ │
│  │ └──────────────┘ │  │ └──────────────┘ │  │ └──────────────┘ │ │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                   │ Click [⋮] Menu
                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  DROPDOWN MENU                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ 👁️  View                                                     │   │
│  │ ✏️  Edit  ← CLICK THIS!                                     │   │
│  │ 🔗 Share                                                     │   │
│  │ 💾 Download                                                  │   │
│  │ ─────────────────────────────────────────────────────────   │   │
│  │ 📦 Archive                                                   │   │
│  │ 🗑️  Delete                                                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                   │ Redirects to...
                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│  BUSINESS PLAN EDITOR (/edit-plan/123)                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ [← Back] My Business Plan [Dashboard] [Preview] [Export]   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Tabs: [Editor ✓] [Progress]                                │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ┌──────────────┬──────────────────────────────────────────────┐   │
│  │ NAVIGATION   │  SECTION EDITOR                              │   │
│  │              │  ┌────────────────────────────────────────┐  │   │
│  │ Executive ▼  │  │ Summary                                │  │   │
│  │ • Summary ✓  │  │ ┌────────────────────────────────────┐ │  │   │
│  │ • Mission    │  │ │ Progress: 250/300 words (83%)      │ │  │   │
│  │ • Company    │  │ │ [AI Generate] [Analyze] [Save]     │ │  │   │
│  │ • Products   │  │ └────────────────────────────────────┘ │  │   │
│  │ • Opportunity│  │                                        │  │   │
│  │              │  │ ┌────────────────────────────────────┐ │  │   │
│  │ Business     │  │ │                                    │ │  │   │
│  │ • Description│  │ │ Write your content here...         │ │  │   │
│  │ • Background │  │ │                                    │ │  │   │
│  │              │  │ │                                    │ │  │   │
│  │ Products     │  │ └────────────────────────────────────┘ │  │   │
│  │ Market       │  │                                        │  │   │
│  │ Strategy     │  │ 💡 Tips:                               │  │   │
│  │ Operations   │  │ • Keep it concise                      │  │   │
│  │ Financials   │  │ • Focus on key points                  │  │   │
│  │ Appendix     │  │ • Use specific data                    │  │   │
│  └──────────────┴──┴────────────────────────────────────────┴──┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Alternative Navigation Paths

### **Path 1: Dashboard Widget (Optional)**

```
Dashboard (/)
    │
    ├─ BusinessPlansWidget
    │   ├─ Recent Plan 1 → Click → /edit-plan/1
    │   ├─ Recent Plan 2 → Click → /edit-plan/2
    │   └─ [View All] → /documents?filter=business-plan
    │
    └─ Quick Actions
        └─ [My Business Plans] → /documents?filter=business-plan
```

### **Path 2: Direct URL**

```
Browser Address Bar
    │
    └─ Type: /edit-plan/123
       └─ Opens editor directly
```

### **Path 3: Deep Link to Section**

```
Browser Address Bar or Link
    │
    └─ Type: /edit-plan/123?chapter=financials&section=cash-flow
       └─ Opens editor with Financials chapter and Cash Flow section selected
```

---

## 📊 Editor Interface Breakdown

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER BAR (Sticky)                                                │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ [← Back] My Business Plan                                   │   │
│  │ Executive Summary · Summary                                 │   │
│  │                                    [Dashboard] [Preview] [Export]│
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  TAB BAR                                                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ [Editor ✓] [Progress]                                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  MAIN CONTENT AREA                                                   │
│  ┌──────────────┬──────────────────────────────────────────────┐   │
│  │ LEFT SIDEBAR │  CENTER CONTENT                              │   │
│  │ (25% width)  │  (75% width)                                 │   │
│  │              │                                              │   │
│  │ Chapter Nav  │  Section Editor                              │   │
│  │ with         │  • Progress Bar                              │   │
│  │ Progress     │  • Action Buttons                            │   │
│  │ Indicators   │  • Text Editor                               │   │
│  │              │  • AI Features                               │   │
│  │              │  • Tips Panel                                │   │
│  └──────────────┴──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 State Flow Diagram

```
User Action                    System Response
───────────                    ───────────────

Click "Edit" on plan
    │
    ├──→ Navigate to /edit-plan/{id}
    │
    ├──→ Load BusinessPlanContext
    │       └─ Fetch plan data from localStorage/API
    │
    ├──→ Parse URL parameters
    │       └─ Set active chapter & section
    │
    ├──→ Render ChapterNavigation
    │       └─ Show all chapters with progress
    │
    └──→ Render SectionEditor
            └─ Load section content

User types in editor
    │
    ├──→ Update local state
    │
    ├──→ Calculate word count
    │
    ├──→ Update section status
    │
    └──→ Mark as dirty (needs save)

30 seconds pass (or user clicks Save)
    │
    ├──→ Save to localStorage
    │
    ├──→ Update lastSaved timestamp
    │
    └──→ Clear dirty flag

User clicks different section
    │
    ├──→ Update URL parameters
    │
    ├──→ Load new section content
    │
    └──→ Render new section editor
```

---

## 🎨 Visual Component Hierarchy

```
EditPlan (Page)
│
├─ BusinessPlanProvider (Context)
│   │
│   └─ EditPlanContent
│       │
│       ├─ Header
│       │   ├─ Back Button → /documents
│       │   ├─ Plan Name
│       │   ├─ Breadcrumb (Chapter · Section)
│       │   └─ Action Buttons
│       │       ├─ Dashboard
│       │       ├─ Preview
│       │       └─ Export
│       │
│       └─ Tabs
│           │
│           ├─ Editor Tab
│           │   ├─ ChapterNavigation (Left)
│           │   │   ├─ Chapter List
│           │   │   │   └─ Section List
│           │   │   └─ Progress Indicators
│           │   │
│           │   └─ SectionEditor (Right)
│           │       ├─ Section Header
│           │       ├─ Progress Bar
│           │       ├─ Action Buttons
│           │       │   ├─ AI Generate
│           │       │   ├─ Analyze
│           │       │   └─ Save
│           │       ├─ Text Editor
│           │       ├─ AI Features Panel
│           │       └─ Tips Panel
│           │
│           └─ Progress Tab
│               └─ ProgressDashboard
│                   ├─ Overall Progress
│                   ├─ Statistics Cards
│                   ├─ Chapter Breakdown
│                   ├─ Next Steps
│                   └─ Plan Metadata
```

---

## 🚀 Quick Reference Card

```
╔═══════════════════════════════════════════════════════════════╗
║                    QUICK NAVIGATION GUIDE                      ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  TO ACCESS BUSINESS PLANS:                                     ║
║  1. Click "Documents" in navbar                                ║
║  2. Find your business plan                                    ║
║  3. Click [⋮] → "Edit"                                        ║
║                                                                ║
║  OR use direct URL:                                            ║
║  /edit-plan/{id}                                               ║
║                                                                ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  DEEP LINKING:                                                 ║
║  /edit-plan/{id}?chapter={chapter}&section={section}          ║
║                                                                ║
║  Example:                                                      ║
║  /edit-plan/123?chapter=financials&section=cash-flow          ║
║                                                                ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  KEYBOARD SHORTCUTS:                                           ║
║  • Cmd/Ctrl + S  →  Save                                      ║
║  • Esc           →  Close dialogs                             ║
║                                                                ║
╠═══════════════════════════════════════════════════════════════╣
║                                                                ║
║  FEATURES:                                                     ║
║  ✓ 8 Chapters, 35+ Sections                                   ║
║  ✓ AI Content Generation                                      ║
║  ✓ Real-time Progress Tracking                                ║
║  ✓ Auto-save (every 30 seconds)                               ║
║  ✓ Writing Tips & Suggestions                                 ║
║  ✓ Content Analysis                                           ║
║                                                                ║
╚═══════════════════════════════════════════════════════════════╝
```

---

## 📱 Mobile Navigation Flow

```
Mobile View (< 768px)
│
├─ Hamburger Menu
│   ├─ Home
│   ├─ Documents → /documents
│   ├─ Funding
│   └─ More...
│
└─ Documents Hub (Responsive)
    ├─ Search Bar (Full width)
    ├─ Filter Chips (Horizontal scroll)
    └─ Document Cards (Single column)
        └─ Click Edit → /edit-plan/{id}

Editor on Mobile
│
├─ Collapsible Navigation
│   └─ Tap to expand/collapse
│
├─ Full-width Editor
│   └─ Optimized for touch
│
└─ Bottom Action Bar
    ├─ Save
    ├─ AI Generate
    └─ More...
```

---

## 🎯 User Journey Map

```
New User Journey:
─────────────────
1. Login → Dashboard
2. See "Create Business Plan" CTA
3. Click → AI Business Plan Generator
4. Answer questions
5. Generate plan
6. Redirected to /edit-plan/{new-id}
7. Edit and refine content

Returning User Journey:
──────────────────────
1. Login → Dashboard
2. See "Recent Plans" widget
3. Click on plan → /edit-plan/{id}
4. Continue editing

Power User Journey:
──────────────────
1. Bookmark: /edit-plan/123?chapter=financials
2. Direct access to specific section
3. Quick edits
4. Auto-save
5. Done!
```

---

**This diagram shows all possible navigation paths to access and use the Business Plan functionality!**
