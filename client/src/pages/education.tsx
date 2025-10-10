import { useQuery, useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Loader2, 
  Book, 
  Clock, 
  Target, 
  Award, 
  ChevronRight, 
  Moon, 
  Sun, 
  Play, 
  Users, 
  TrendingUp, 
  DollarSign,
  Lightbulb,
  Rocket,
  Building2,
  GraduationCap,
  Star,
  ExternalLink,
  CheckCircle,
  BarChart3,
  PieChart,
  FileText,
  Video,
  Headphones,
  Download
} from "lucide-react";

// Educational Module schema
const moduleSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().optional(),
  creatorId: z.number(),
  content: z.any().optional(), // JSON content for the module
  resources: z.any().optional(), // JSON resources for the module
  prerequisites: z.any().optional(), // JSON prerequisites for the module
});

type EducationalModule = {
  id: number;
  title: string;
  description: string | null;
  creatorId: number;
  content: any;
  resources: any;
  prerequisites: any;
  createdAt: string;
  updatedAt: string;
};

function EducationalModulesList() {
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // Create educational module form
  const form = useForm<z.infer<typeof moduleSchema>>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      title: "",
      description: "",
      creatorId: 5,
    },
  });

  // Curated educational content
  const educationalModules = [
    {
      id: 1,
      title: "Startup Fundamentals",
      description: "Master the essential building blocks of launching a successful startup from idea to execution.",
      category: "Foundation",
      level: "Beginner",
      duration: 45,
      sections: 6,
      rating: 4.8,
      completions: 2847,
      instructor: "Y Combinator",
      type: "video",
      thumbnail: "🚀",
      topics: ["Business Model", "Market Research", "MVP Development", "Team Building"]
    },
    {
      id: 2,
      title: "Fundraising Masterclass",
      description: "Complete guide to raising capital - from seed rounds to Series A and beyond.",
      category: "Funding",
      level: "Intermediate",
      duration: 120,
      sections: 12,
      rating: 4.9,
      completions: 1892,
      instructor: "Sequoia Capital",
      type: "course",
      thumbnail: "💰",
      topics: ["Pitch Decks", "Due Diligence", "Valuation", "Term Sheets"]
    },
    {
      id: 3,
      title: "Product-Market Fit",
      description: "Discover how to identify, achieve, and measure product-market fit for sustainable growth.",
      category: "Product",
      level: "Intermediate",
      duration: 85,
      sections: 8,
      rating: 4.7,
      completions: 1634,
      instructor: "Andreessen Horowitz",
      type: "workshop",
      thumbnail: "🎯",
      topics: ["Customer Discovery", "Metrics", "Iteration", "Scaling"]
    },
    {
      id: 4,
      title: "Growth Marketing Strategies",
      description: "Learn proven tactics to acquire, activate, and retain customers cost-effectively.",
      category: "Marketing",
      level: "Advanced",
      duration: 95,
      sections: 10,
      rating: 4.6,
      completions: 1456,
      instructor: "First Round Capital",
      type: "masterclass",
      thumbnail: "📈",
      topics: ["Customer Acquisition", "Viral Growth", "Retention", "Analytics"]
    },
    {
      id: 5,
      title: "Financial Planning & Analysis",
      description: "Build robust financial models and understand key metrics that drive startup success.",
      category: "Finance",
      level: "Intermediate",
      duration: 110,
      sections: 9,
      rating: 4.5,
      completions: 1203,
      instructor: "Bessemer Venture Partners",
      type: "course",
      thumbnail: "📊",
      topics: ["Financial Modeling", "Unit Economics", "Cash Flow", "KPIs"]
    },
    {
      id: 6,
      title: "Leadership & Team Building",
      description: "Develop the leadership skills needed to build and manage high-performing teams.",
      category: "Leadership",
      level: "Advanced",
      duration: 75,
      sections: 7,
      rating: 4.7,
      completions: 987,
      instructor: "Greylock Partners",
      type: "workshop",
      thumbnail: "👥",
      topics: ["Hiring", "Culture", "Performance Management", "Communication"]
    },
    {
      id: 7,
      title: "Legal Essentials for Startups",
      description: "Navigate the legal landscape with confidence - from incorporation to contracts.",
      category: "Legal",
      level: "Beginner",
      duration: 60,
      sections: 5,
      rating: 4.4,
      completions: 876,
      instructor: "Wilson Sonsini",
      type: "guide",
      thumbnail: "⚖️",
      topics: ["Incorporation", "Equity", "IP Protection", "Compliance"]
    },
    {
      id: 8,
      title: "Go-to-Market Strategy",
      description: "Create and execute winning go-to-market strategies for B2B and B2C products.",
      category: "Strategy",
      level: "Advanced",
      duration: 105,
      sections: 11,
      rating: 4.8,
      completions: 743,
      instructor: "Lightspeed Venture Partners",
      type: "masterclass",
      thumbnail: "🎯",
      topics: ["Market Positioning", "Sales Strategy", "Distribution", "Pricing"]
    }
  ];

  const categories = ["All", "Foundation", "Funding", "Product", "Marketing", "Finance", "Leadership", "Legal", "Strategy"];

  const filteredModules = selectedCategory === "All" 
    ? educationalModules 
    : educationalModules.filter(module => module.category === selectedCategory);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <Video className="h-4 w-4" />;
      case "course": return <Book className="h-4 w-4" />;
      case "workshop": return <Users className="h-4 w-4" />;
      case "masterclass": return <Star className="h-4 w-4" />;
      case "guide": return <FileText className="h-4 w-4" />;
      default: return <Book className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
            Educational Modules
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Curated content from top VCs and industry experts
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600">
              <GraduationCap className="mr-2 h-4 w-4" />
              Create Module
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Create New Educational Module</DialogTitle>
              <DialogDescription>
                Create a new educational module for startups and entrepreneurs.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Module Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Fundraising Fundamentals" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Learn the fundamentals of raising capital for your startup..."
                          className="min-h-32"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="submit">
                    Create Module
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="transition-all duration-200"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredModules.map((module) => (
          <Card key={module.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{module.thumbnail}</div>
                  <div>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {module.title}
                    </CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      {getTypeIcon(module.type)}
                      <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">{module.type}</span>
                    </div>
                  </div>
                </div>
                <Badge className={`${getLevelColor(module.level)} border-0`}>
                  {module.level}
                </Badge>
              </div>
              <CardDescription className="text-sm line-clamp-3 mt-2">
                {module.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-4">
              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">{module.duration} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Book className="h-4 w-4 text-teal-500" />
                  <span className="text-sm font-medium">{module.sections} sections</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">{module.rating}/5.0</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">{module.completions.toLocaleString()}</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  By <span className="font-semibold text-purple-600 dark:text-purple-400">{module.instructor}</span>
                </p>
              </div>

              {/* Topics */}
              <div className="flex flex-wrap gap-1">
                {module.topics.slice(0, 3).map((topic, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {topic}
                  </Badge>
                ))}
                {module.topics.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{module.topics.length - 3}
                  </Badge>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex justify-between border-t bg-gray-50/50 dark:bg-gray-800/50 p-4">
              <Button variant="outline" size="sm" className="flex-1 mr-2">
                <Play className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button size="sm" className="flex-1 bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600">
                Start Learning
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredModules.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-medium mb-2">No modules found</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Try selecting a different category or create your own module.
          </p>
          <Button onClick={() => setSelectedCategory("All")}>
            View All Modules
          </Button>
        </div>
      )}
    </div>
  );
}

function MentorshipsList() {
  const mentors = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Former VP Product at Stripe",
      expertise: ["Product Strategy", "Growth", "B2B SaaS"],
      bio: "Led product development for Stripe's fastest growing segments. 10+ years in product leadership.",
      rating: 4.9,
      sessions: 156,
      price: "$200/hour",
      available: true,
      image: "👩‍💼"
    },
    {
      id: 2,
      name: "Marcus Rodriguez",
      title: "3x Founder & Angel Investor",
      expertise: ["Fundraising", "Sales", "Operations"],
      bio: "Built and sold 2 companies. Now investing in early-stage startups. 15+ years experience.",
      rating: 4.8,
      sessions: 203,
      price: "$300/hour",
      available: true,
      image: "👨‍💼"
    },
    {
      id: 3,
      name: "Dr. Emily Foster",
      title: "Former McKinsey Partner",
      expertise: ["Strategy", "Market Entry", "Operations"],
      bio: "Specialized in scaling tech companies. Worked with 50+ startups in transformation.",
      rating: 4.9,
      sessions: 127,
      price: "$250/hour",
      available: false,
      image: "👩‍🎓"
    }
  ];

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent mb-2">
          Expert Mentorship
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Get 1-on-1 guidance from experienced entrepreneurs and industry leaders
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <Card key={mentor.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-start space-x-4">
                <div className="text-4xl">{mentor.image}</div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{mentor.name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{mentor.title}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium ml-1">{mentor.rating}</span>
                    </div>
                    <span className="text-gray-300">•</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{mentor.sessions} sessions</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                {mentor.bio}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {mentor.expertise.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {mentor.price}
                </span>
                <div className={`flex items-center space-x-1 ${mentor.available ? 'text-green-600' : 'text-gray-500'}`}>
                  <div className={`w-2 h-2 rounded-full ${mentor.available ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-sm">{mentor.available ? 'Available' : 'Busy'}</span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t bg-gray-50/50 dark:bg-gray-800/50 p-4">
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600"
                disabled={!mentor.available}
              >
                {mentor.available ? 'Book Session' : 'Join Waitlist'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Card className="max-w-2xl mx-auto bg-gradient-to-r from-purple-50 to-teal-50 dark:from-purple-900/20 dark:to-teal-900/20 border-0">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold mb-4">Become a Mentor</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Share your expertise and help the next generation of entrepreneurs succeed.
            </p>
            <Button variant="outline" className="mr-4">
              Learn More
            </Button>
            <Button className="bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600">
              Apply to Mentor
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LearningPathsList() {
  const learningPaths = [
    {
      id: 1,
      title: "Entrepreneur Essentials",
      description: "Complete journey from idea to launch for first-time founders",
      modules: 8,
      duration: "6-8 weeks",
      level: "Beginner",
      students: 1247,
      progress: 0,
      topics: ["Business Fundamentals", "Market Research", "MVP", "Launch Strategy"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      id: 2,
      title: "Scale-Up Success",
      description: "Advanced strategies for growing from startup to scale-up",
      modules: 12,
      duration: "8-10 weeks",
      level: "Advanced",
      students: 892,
      progress: 0,
      topics: ["Operations", "Team Building", "Growth Hacking", "Fundraising"],
      color: "from-purple-500 to-pink-500"
    },
    {
      id: 3,
      title: "Tech Startup Blueprint",
      description: "Specialized path for technology-focused startups",
      modules: 10,
      duration: "7-9 weeks",
      level: "Intermediate",
      students: 634,
      progress: 0,
      topics: ["Product Development", "Technical Leadership", "DevOps", "Security"],
      color: "from-green-500 to-teal-500"
    }
  ];

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent mb-2">
          Learning Paths
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Structured curriculum designed to take you from beginner to expert
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {learningPaths.map((path) => (
          <Card key={path.id} className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${path.color}`} />

            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <CardTitle className="text-xl group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {path.title}
                </CardTitle>
                <Badge className={`${path.level === 'Beginner' ? 'bg-green-100 text-green-800' : path.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'} border-0`}>
                  {path.level}
                </Badge>
              </div>
              <CardDescription className="line-clamp-2">
                {path.description}
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Book className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">{path.modules} modules</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-teal-500" />
                  <span className="text-sm font-medium">{path.duration}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">{path.students.toLocaleString()} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">{path.progress}% complete</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-4">
                {path.topics.map((topic, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {topic}
                  </Badge>
                ))}
              </div>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${path.color} transition-all duration-300`}
                  style={{ width: `${path.progress}%` }}
                />
              </div>
            </CardContent>

            <CardFooter className="border-t bg-gray-50/50 dark:bg-gray-800/50 p-4">
              <Button className="w-full bg-gradient-to-r from-purple-600 to-teal-500 hover:from-purple-700 hover:to-teal-600">
                {path.progress > 0 ? 'Continue Learning' : 'Start Path'}
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default function EducationPage() {
  const [darkMode, setDarkMode] = useState(false);
  const tabs = ["Modules", "Mentorships", "Learning Paths"];

  useEffect(() => {
    // Check if dark mode is already set
    if (localStorage.getItem('darkMode') === 'true' || 
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      {/* Dark mode toggle */}
      <div className="fixed top-24 right-4 z-50">
        <Card className="p-2 shadow-lg border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4 text-yellow-500" />
            <Switch checked={darkMode} onCheckedChange={toggleDarkMode} />
            <Moon className="h-4 w-4 text-purple-500" />
          </div>
        </Card>
      </div>

      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="h-10 w-10 text-purple-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-teal-500 bg-clip-text text-transparent">
              Learning Hub
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Learn from the best, grow with experts, and build the skills you need to succeed
          </p>
        </div>

        <Tabs defaultValue="Modules" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-0">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab} 
                  value={tab}
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-teal-500 data-[state=active]:text-white"
                >
                  {tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="Modules" className="space-y-4">
            <EducationalModulesList />
          </TabsContent>
          <TabsContent value="Mentorships" className="space-y-4">
            <MentorshipsList />
          </TabsContent>
          <TabsContent value="Learning Paths" className="space-y-4">
            <LearningPathsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}