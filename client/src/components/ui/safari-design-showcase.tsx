
export function Safari26DesignShowcase() {
  return (
    <div className="space-y-8 p-6">
      {/* Typography Hierarchy */}
      <section className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-semibold">Safari 26 Typography System</h3>
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Large Title - SF Pro Display</h1>
          <h2 className="text-2xl font-semibold">Title 1 - Semantic Hierarchy</h2>
          <h3 className="text-xl font-medium">Title 2 - Clear Structure</h3>
          <p className="text-base leading-relaxed">
            Body text using SF Pro Text with optimal line height of 1.47058824 
            and letter-spacing of -0.022em for enhanced readability.
          </p>
          <p className="text-sm text-muted-foreground">
            Caption text with appropriate contrast ratios meeting WCAG AAA standards.
          </p>
        </div>
      </section>

      {/* Interactive Elements */}
      <section className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-semibold">Authentic Apple Buttons</h3>
        <div className="flex flex-wrap gap-3">
          <button className="safari-button">Primary Action</button>
          <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md border border-border hover:bg-secondary/80 transition-colors">
            Secondary
          </button>
          <button className="px-4 py-2 text-primary hover:bg-primary/10 rounded-md transition-colors">
            Tertiary
          </button>
        </div>
      </section>

      {/* Glass Morphism Cards */}
      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Spatial Depth & Glass Morphism</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-container p-4">
            <h4 className="font-medium mb-2">Glass Container</h4>
            <p className="text-sm text-muted-foreground">
              Enhanced backdrop blur with brightness adjustment for authentic depth.
            </p>
          </div>
          <div className="glass-card p-4">
            <h4 className="font-medium mb-2">Glass Card</h4>
            <p className="text-sm text-muted-foreground">
              Refined shadow system with inset highlights for realistic glass effect.
            </p>
          </div>
        </div>
      </section>

      {/* Color System */}
      <section className="glass-card p-6 space-y-4">
        <h3 className="text-lg font-semibold">WCAG AAA Color System</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="aspect-square rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-medium">Primary</span>
          </div>
          <div className="aspect-square rounded-lg bg-secondary flex items-center justify-center">
            <span className="text-secondary-foreground text-xs font-medium">Secondary</span>
          </div>
          <div className="aspect-square rounded-lg bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-xs font-medium">Muted</span>
          </div>
          <div className="aspect-square rounded-lg bg-accent flex items-center justify-center">
            <span className="text-accent-foreground text-xs font-medium">Accent</span>
          </div>
        </div>
      </section>
    </div>
  );
}
