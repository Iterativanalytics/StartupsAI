# Quick Start: Navigating to Business Plan Editor

## 🎯 3 Simple Ways to Access Your Business Plans

---

## Method 1: From Documents Hub (Recommended) ⭐

### Step-by-Step:

```
1. Click "Documents" in the top navigation bar
   └─> You'll see: /documents

2. Find your business plan in the grid view
   └─> Look for cards with the FileText icon

3. Click the three-dot menu (⋮) on the business plan card

4. Select "Edit" from the dropdown

5. ✅ You're now in the Business Plan Editor!
   └─> URL: /edit-plan/{your-plan-id}
```

### Visual Flow:
```
┌─────────────────────────────────────────────────────────┐
│  Navbar: [Home] [Documents] [Funding] [Education]      │
│                    ↑ Click here                         │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Documents Hub                                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ 📄 My Plan   │  │ 📄 Plan 2    │  │ 📄 Plan 3    │ │
│  │ Business Plan│  │ Proposal     │  │ Pitch Deck   │ │
│  │ [⋮] ← Click  │  │ [⋮]          │  │ [⋮]          │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Dropdown Menu:                                         │
│  • 👁️  View                                             │
│  • ✏️  Edit    ← Click here                            │
│  • 🔗 Share                                             │
│  • 💾 Download                                          │
└─────────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────┐
│  Business Plan Editor - My Plan                         │
│  [← Back] [Dashboard] [Preview] [Export]               │
│  ┌─────────────┬─────────────────────────────────────┐ │
│  │ Chapters    │  Section Editor                     │ │
│  │ • Executive │  ┌─────────────────────────────────┐│ │
│  │ • Business  │  │ Write your content here...      ││ │
│  │ • Products  │  │                                 ││ │
│  └─────────────┴──┴─────────────────────────────────┴┘ │
└─────────────────────────────────────────────────────────┘
```

---

## Method 2: Direct URL Access 🔗

### If you know your plan ID:

```
Simply navigate to:
/edit-plan/{your-plan-id}

Examples:
• /edit-plan/123
• /edit-plan/abc-xyz-789
```

### With specific section:

```
/edit-plan/{id}?chapter={chapter-id}&section={section-id}

Examples:
• /edit-plan/123?chapter=executive-summary&section=summary
• /edit-plan/123?chapter=financials&section=cash-flow
```

---

## Method 3: From Dashboard (Custom Implementation) 📊

### Add this to your Dashboard:

```tsx
import { Link } from 'wouter';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

// In your Dashboard component
<div className="grid gap-4">
  <Button asChild>
    <Link href="/documents?filter=business-plan">
      <FileText className="h-4 w-4 mr-2" />
      View My Business Plans
    </Link>
  </Button>
</div>
```

---

## 📋 Chapter IDs Reference

When using URL parameters, use these chapter IDs:

| Chapter | ID |
|---------|-----|
| Executive Summary | `executive-summary` |
| The Business | `the-business` |
| Products/Services | `products-services` |
| Market Analysis | `market-analysis` |
| Strategy | `strategy` |
| Operations | `operations` |
| Financials | `financials` |
| Appendix | `appendix` |

### Example Section IDs:

**Executive Summary:**
- `summary`
- `our-mission`
- `company-management`
- `products-services`
- `opportunity`
- `financial-highlights`

**Financials:**
- `financial-data`
- `profit-loss`
- `balance-sheet`
- `cash-flow`

**Market Analysis:**
- `swot-analysis`
- `market-segments`
- `buyer-personas`
- `competitor-analysis`

---

## 🎨 What You'll See in the Editor

### Main Interface:

```
┌─────────────────────────────────────────────────────────────┐
│  Header: My Business Plan                                   │
│  [← Back] [Dashboard] [Preview] [Export]                    │
├─────────────────────────────────────────────────────────────┤
│  Tabs: [Editor] [Progress]                                  │
├──────────────┬──────────────────────────────────────────────┤
│ Navigation   │  Section Editor                              │
│              │  ┌────────────────────────────────────────┐  │
│ Executive ▼  │  │ Summary                                │  │
│ • Summary ✓  │  │ Progress: 250/300 words (83%)          │  │
│ • Mission    │  │ [AI Generate] [Analyze] [Save]         │  │
│ • Company    │  │                                        │  │
│              │  │ ┌────────────────────────────────────┐ │  │
│ Business     │  │ │ Write your content here...         │ │  │
│ • Description│  │ │                                    │ │  │
│ • Background │  │ │                                    │ │  │
│              │  │ └────────────────────────────────────┘ │  │
│ Products     │  │                                        │  │
│ Market       │  │ Tips:                                  │  │
│ Strategy     │  │ • Keep it concise                      │  │
│ Operations   │  │ • Focus on key points                  │  │
│ Financials   │  │ • Use specific data                    │  │
│ Appendix     │  └────────────────────────────────────────┘  │
└──────────────┴──────────────────────────────────────────────┘
```

### Progress Tab:

```
┌─────────────────────────────────────────────────────────────┐
│  Overall Progress: 45%                                       │
│  ████████████░░░░░░░░░░░░░░                                 │
│                                                              │
│  📊 Statistics                                               │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │    12    │ │    8     │ │    15    │ │  5,234   │      │
│  │ Complete │ │Progress  │ │Not Start │ │  Words   │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                              │
│  📈 Chapter Progress                                         │
│  Executive Summary    ████████████████░░ 80%                │
│  The Business        ████████░░░░░░░░░░ 40%                │
│  Products/Services   ████░░░░░░░░░░░░░░ 20%                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Actions

### Once in the Editor:

| Action | How To |
|--------|--------|
| **Switch Section** | Click section name in left navigation |
| **Generate Content** | Click "AI Generate" button |
| **Improve Content** | Click improvement options (Clarity, Length, etc.) |
| **Analyze Content** | Click "Analyze" button |
| **Save Changes** | Click "Save" or use Cmd/Ctrl+S |
| **View Progress** | Click "Progress" tab |
| **Go Back** | Click "← Back" button |

---

## 💡 Pro Tips

### 1. **Use URL Bookmarks**
Bookmark specific sections you work on frequently:
```
/edit-plan/123?chapter=financials&section=cash-flow
```

### 2. **Share Sections with Team**
Send direct links to specific sections:
```
"Hey team, please review the SWOT analysis:
/edit-plan/123?chapter=market-analysis&section=swot-analysis"
```

### 3. **Keyboard Shortcuts**
- `Cmd/Ctrl + S` - Save current section
- `Cmd/Ctrl + K` - Open search (if implemented)
- `Esc` - Close dialogs

### 4. **Auto-Save**
Your work is automatically saved every 30 seconds, but you can manually save anytime.

---

## ❓ Troubleshooting

### Can't find the Edit button?
- Make sure you're looking at a **business plan** document (not a proposal or pitch deck)
- Check that you have edit permissions for the document

### Page not loading?
- Verify the plan ID in the URL is correct
- Check your internet connection
- Try refreshing the page

### Changes not saving?
- Look for the "Last Saved" indicator
- Check browser console for errors
- Ensure you're logged in

---

## 📞 Need Help?

- **Full Documentation**: See `BUSINESS_PLAN_IMPROVEMENTS.md`
- **Navigation Details**: See `NAVIGATION_GUIDE.md`
- **Technical Issues**: Check browser console or contact support

---

## ✅ Checklist

Before you start editing:

- [ ] Navigate to Documents Hub (`/documents`)
- [ ] Find your business plan
- [ ] Click Edit from the dropdown menu
- [ ] Verify you're on the edit page (`/edit-plan/{id}`)
- [ ] Select the chapter and section you want to edit
- [ ] Start writing!

---

**Happy Planning! 🎉**

Your business plan is just a few clicks away. Start by navigating to the Documents Hub and selecting your plan.
