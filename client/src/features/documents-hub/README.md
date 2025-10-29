# Documents Hub - IterativStartups

The Documents Hub is a comprehensive AI-powered business innovation platform that unifies four powerful modules: IterativPlans, IterativDecks, IterativProposals, and IterativForms into a central workspace for strategic documents.

## 🚀 Features

### Core Modules

#### 1. **IterativPlans** 📋
- **Fast Track Mode**: Generate complete business plans in minutes using AI
- **Validated Mode**: Follow Lean Design Thinking methodology to validate assumptions
- **Pivot Intelligence**: 10 structured pivot types based on validated learning
- **Experiment Framework**: Built-in tools for hypothesis testing

#### 2. **IterativDecks** 🎯
- **AI Deck Generation**: Create pitch decks from business plans
- **Style Templates**: Seed, Growth, and Internal pitch styles
- **Assumption Tracking**: Extract and validate key assumptions
- **Investor Matching**: Tailor decks to specific investor preferences

#### 3. **IterativProposals** 📄
- **RFP/RFI/RFQ Automation**: Streamlined response generation
- **Client Discovery**: Deep research tools for understanding client needs
- **Win Theme Generator**: Create compelling proposal narratives
- **Compliance Checking**: Ensure 100% requirement coverage

#### 4. **IterativForms** 📝
- **AI Application Filler**: Auto-fill accelerator and grant applications
- **Business Plan Sync**: Pull data directly from your business plan
- **Progress Tracking**: Monitor application status and deadlines
- **Template Library**: Common application templates

## 🏗️ Architecture

```
documents-hub/
├── components/          # Shared components
│   ├── HubHeader.tsx   # Main navigation header
│   ├── Footer.tsx      # App footer
│   ├── Toast.tsx       # Notification system
│   ├── Toaster.tsx     # Toast container
│   └── PivotModal.tsx  # Pivot types modal
├── modules/            # Feature modules
│   ├── plans/         # Business planning module
│   ├── decks/         # Pitch deck module
│   ├── proposals/     # Proposal module
│   └── forms/         # Application module
├── types/             # TypeScript definitions
├── constants/         # Shared constants
└── DocumentsHubApp.tsx # Main app component
```

## 🛠️ Technology Stack

- **Frontend**: React 18+ with TypeScript
- **UI Components**: Radix UI with Tailwind CSS
- **State Management**: React hooks and context
- **AI Integration**: Google Gemini API
- **Icons**: Lucide React
- **Build Tool**: Vite

## 📦 Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
API_KEY=your_google_genai_api_key
```

3. Start development server:
```bash
npm run dev
```

## 🔧 Usage

### Basic Implementation

```tsx
import DocumentsHubApp from '@/features/documents-hub/DocumentsHubApp';

export default function DocumentsHub() {
  return <DocumentsHubApp />;
}
```

### Module-Specific Implementation

```tsx
import PlansApp from '@/features/documents-hub/modules/plans/PlansApp';

function MyPlansPage() {
  const addToast = (message: string, type: ToastType) => {
    // Handle toast notifications
  };
  
  return <PlansApp addToast={addToast} />;
}
```

## 🎨 Customization

### Theme Configuration

The Documents Hub uses a consistent color scheme:
- Primary: Purple (600-700)
- Secondary: Blue (600-700)
- Accent: Cyan (600)
- Background: Slate (50-100)

### Adding New Modules

1. Create module directory: `modules/your-module/`
2. Add module to `HubModule` type
3. Update `hubModules` array in `HubHeader.tsx`
4. Add lazy import in `DocumentsHubApp.tsx`

## 🧪 Testing

Run tests:
```bash
npm test
```

## 📚 Methodology

The Documents Hub implements **Lean Design Thinking**, a hybrid methodology that combines:

- **Design Thinking**: Deep ethnographic problem discovery
- **Lean Startup**: Testable hypotheses and metrics
- **Continuous Learning**: Document every hypothesis, track every pivot

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of the IterativStartups platform. All rights reserved.

## 🙏 Acknowledgments

- Built with React and TypeScript
- UI components from Radix UI
- Icons from Lucide React
- AI powered by Google Gemini