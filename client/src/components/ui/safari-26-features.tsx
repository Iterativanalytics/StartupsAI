import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Button } from './button';
import { Badge } from './badge';
import { 
  Globe, 
  Shield, 
  Zap, 
  Eye, 
  Download,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  Moon,
  Sun
} from 'lucide-react';

export function Safari26Features() {
  const [isOnline, setIsOnline] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(85);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Simulate online/offline detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Simulate battery level changes
    const batteryInterval = setInterval(() => {
      setBatteryLevel(prev => Math.max(20, prev + (Math.random() - 0.5) * 10));
    }, 3000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(batteryInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-6 space-y-8">
      {/* Safari 26.0 Header */}
      <section className="text-center py-12">
        <div className="max-w-4xl mx-auto">
          <Badge variant="outline" className="mb-4 bg-blue-50 text-blue-700 border-blue-200">
            <Globe className="w-3 h-3 mr-1" />
            Safari 26.0 Features
          </Badge>
          <h1 className="text-5xl font-bold gradient-text mb-6 leading-tight">
            Next-Generation Web Experience
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
            Enhanced performance, security, and user experience with Safari 26.0's 
            cutting-edge web technologies and Apple design principles.
          </p>
        </div>
      </section>

      {/* Performance & Security */}
      <section className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Zap className="w-5 h-5 mr-2 text-yellow-500" />
                Performance Enhancements
              </CardTitle>
              <CardDescription>
                Lightning-fast rendering and optimized resource management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">JavaScript Engine</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Nitro 2.0
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Rendering Engine</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    WebKit 26.0
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Memory Usage</span>
                  <span className="text-sm text-muted-foreground">-40% optimized</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                Enhanced Security
              </CardTitle>
              <CardDescription>
                Advanced privacy protection and security features
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Intelligent Tracking Prevention</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    ITP 3.0
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Privacy Report</span>
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Enhanced
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Secure Context</span>
                  <span className="text-sm text-green-600">✓ Enforced</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Device Integration */}
      <section className="max-w-6xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Device Integration</CardTitle>
            <CardDescription>
              Seamless integration with iOS and macOS features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-xl bg-white/50 border border-white/30">
                <div className="flex items-center justify-center mb-3">
                  {isOnline ? (
                    <Wifi className="w-8 h-8 text-green-500" />
                  ) : (
                    <WifiOff className="w-8 h-8 text-red-500" />
                  )}
                </div>
                <h3 className="font-semibold mb-1">Network Status</h3>
                <p className="text-sm text-muted-foreground">
                  {isOnline ? 'Connected' : 'Offline'}
                </p>
              </div>

              <div className="text-center p-4 rounded-xl bg-white/50 border border-white/30">
                <div className="flex items-center justify-center mb-3">
                  <Battery className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="font-semibold mb-1">Battery Level</h3>
                <p className="text-sm text-muted-foreground">
                  {Math.round(batteryLevel)}%
                </p>
              </div>

              <div className="text-center p-4 rounded-xl bg-white/50 border border-white/30">
                <div className="flex items-center justify-center mb-3">
                  <Signal className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="font-semibold mb-1">Signal Strength</h3>
                <p className="text-sm text-muted-foreground">Excellent</p>
              </div>

              <div className="text-center p-4 rounded-xl bg-white/50 border border-white/30">
                <div className="flex items-center justify-center mb-3">
                  {isDarkMode ? (
                    <Moon className="w-8 h-8 text-slate-500" />
                  ) : (
                    <Sun className="w-8 h-8 text-yellow-500" />
                  )}
                </div>
                <h3 className="font-semibold mb-1">Theme</h3>
                <p className="text-sm text-muted-foreground">
                  {isDarkMode ? 'Dark' : 'Light'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Web Standards Support */}
      <section className="max-w-6xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Web Standards Support</CardTitle>
            <CardDescription>
              Latest web technologies and standards implementation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">CSS Features</h3>
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-start">
                    <Eye className="w-3 h-3 mr-2" />
                    CSS Container Queries
                  </Badge>
                  <Badge variant="outline" className="w-full justify-start">
                    <Eye className="w-3 h-3 mr-2" />
                    CSS Grid Level 3
                  </Badge>
                  <Badge variant="outline" className="w-full justify-start">
                    <Eye className="w-3 h-3 mr-2" />
                    CSS Logical Properties
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">JavaScript APIs</h3>
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-start">
                    <Download className="w-3 h-3 mr-2" />
                    Web Streams API
                  </Badge>
                  <Badge variant="outline" className="w-full justify-start">
                    <Download className="w-3 h-3 mr-2" />
                    Web Locks API
                  </Badge>
                  <Badge variant="outline" className="w-full justify-start">
                    <Download className="w-3 h-3 mr-2" />
                    Web Animations API
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Performance</h3>
                <div className="space-y-2">
                  <Badge variant="outline" className="w-full justify-start">
                    <Zap className="w-3 h-3 mr-2" />
                    Service Workers
                  </Badge>
                  <Badge variant="outline" className="w-full justify-start">
                    <Zap className="w-3 h-3 mr-2" />
                    WebAssembly
                  </Badge>
                  <Badge variant="outline" className="w-full justify-start">
                    <Zap className="w-3 h-3 mr-2" />
                    WebGL 2.0
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Accessibility Features */}
      <section className="max-w-6xl mx-auto">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">Accessibility & Inclusivity</CardTitle>
            <CardDescription>
              Enhanced accessibility features for all users
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Visual Accessibility</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">High contrast mode support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Dynamic type scaling</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Color blind friendly palettes</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Motor Accessibility</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Voice control integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Switch control support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Touch accommodations</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto text-center py-12">
        <Card className="glass-card">
          <CardContent className="py-12">
            <h2 className="text-3xl font-bold mb-4">Experience Safari 26.0</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover the future of web browsing with enhanced performance, 
              security, and user experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="safari-button">
                <Globe className="w-5 h-5 mr-2" />
                Try Safari 26.0
              </Button>
              <Button variant="glass" size="lg">
                <Download className="w-5 h-5 mr-2" />
                Download Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
