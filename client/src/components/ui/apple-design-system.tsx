import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { Progress } from './progress';
import { 
  CheckCircle, 
  Star, 
  Heart, 
  Zap, 
  Shield, 
  Sparkles,
  ArrowRight,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

export function AppleDesignSystem() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 space-y-8">
      {/* Hero Section - Emotional Connection */}
      <section className="text-center py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold gradient-text mb-6 leading-tight">
            Safari 26.0 Design System
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Built with Apple's core design principles: usability, communication, functionality, 
            aesthetics, emotional connections, attention to detail, consistency, and minimalism.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="safari-button">
              <Sparkles className="w-5 h-5 mr-2" />
              Experience Design
            </Button>
            <Button variant="glass" size="lg">
              <Play className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Typography Hierarchy - Attention to Detail */}
      <section className="max-w-4xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Typography Hierarchy</CardTitle>
            <CardDescription>
              SF Pro Display and SF Pro Text with precise spacing and letter-spacing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Large Title</h1>
              <h2 className="text-3xl font-semibold">Title 1</h2>
              <h3 className="text-2xl font-medium">Title 2</h3>
              <h4 className="text-xl font-medium">Title 3</h4>
              <p className="text-base leading-relaxed text-muted-foreground">
                Body text with optimal line height and letter spacing for enhanced readability. 
                This demonstrates Apple's attention to detail in typography.
              </p>
              <p className="text-sm text-muted-foreground">
                Caption text with appropriate contrast ratios meeting WCAG AAA standards.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Interactive Elements - Usability & Communication */}
      <section className="max-w-4xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Interactive Elements</CardTitle>
            <CardDescription>
              Clear visual feedback and intuitive interactions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Button className="safari-button w-full">
                <Zap className="w-4 h-4 mr-2" />
                Primary Action
              </Button>
              <Button variant="glass" className="w-full">
                <Shield className="w-4 h-4 mr-2" />
                Secondary
              </Button>
              <Button variant="outline" className="w-full">
                <ArrowRight className="w-4 h-4 mr-2" />
                Tertiary
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Badge variant="default" className="bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Success
              </Badge>
              <Badge variant="secondary">Information</Badge>
              <Badge variant="outline">Neutral</Badge>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Progress & Feedback - Functionality */}
      <section className="max-w-4xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Progress & Feedback</CardTitle>
            <CardDescription>
              Clear communication of system state and user progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Upload Progress</span>
                  <span>75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm">Online</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Syncing</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Emotional Connections */}
      <section className="max-w-4xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Emotional Connections</CardTitle>
            <CardDescription>
              Engaging interactions that create positive emotional responses
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200">
                <Heart className="w-12 h-12 text-pink-500 mx-auto mb-4 animate-pulse" />
                <h3 className="font-semibold mb-2">Loved by Users</h3>
                <p className="text-sm text-muted-foreground">
                  Create meaningful connections through thoughtful design
                </p>
              </div>
              
              <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                <Star className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Excellence</h3>
                <p className="text-sm text-muted-foreground">
                  Every detail crafted with care and precision
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Consistency & Minimalism */}
      <section className="max-w-4xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Consistency & Minimalism</CardTitle>
            <CardDescription>
              Unified design language with purposeful simplicity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-white/50 border border-white/30">
                <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2"></div>
                <span className="text-sm font-medium">Primary</span>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/50 border border-white/30">
                <div className="w-8 h-8 bg-green-500 rounded-lg mx-auto mb-2"></div>
                <span className="text-sm font-medium">Success</span>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/50 border border-white/30">
                <div className="w-8 h-8 bg-orange-500 rounded-lg mx-auto mb-2"></div>
                <span className="text-sm font-medium">Warning</span>
              </div>
              <div className="text-center p-4 rounded-lg bg-white/50 border border-white/30">
                <div className="w-8 h-8 bg-red-500 rounded-lg mx-auto mb-2"></div>
                <span className="text-sm font-medium">Error</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Aesthetics - Visual Appeal */}
      <section className="max-w-4xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Aesthetics</CardTitle>
            <CardDescription>
              Beautiful design that enhances functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="h-32 rounded-xl bg-gradient-to-br from-purple-400 via-pink-400 to-red-400 flex items-center justify-center">
                  <span className="text-white font-semibold">Gradient 1</span>
                </div>
                <div className="h-32 rounded-xl bg-gradient-to-br from-blue-400 via-cyan-400 to-teal-400 flex items-center justify-center">
                  <span className="text-white font-semibold">Gradient 2</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-32 rounded-xl bg-gradient-to-br from-green-400 via-emerald-400 to-teal-400 flex items-center justify-center">
                  <span className="text-white font-semibold">Gradient 3</span>
                </div>
                <div className="h-32 rounded-xl bg-gradient-to-br from-orange-400 via-yellow-400 to-amber-400 flex items-center justify-center">
                  <span className="text-white font-semibold">Gradient 4</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
