import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  FileText,
  DollarSign,
  Users,
  GraduationCap,
  Building2,
  PieChart,
  CreditCard,
  Rocket,
  Lightbulb,
  Target,
  Trophy,
  TrendingUp,
  Award,
  Book,
  Presentation,
  User,
  LogOut,
  Building,
  ChevronDown,
  Plus,
  Settings,
  Menu,
  X
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { useFeature } from "@/contexts/FeatureFlagsContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationCenter } from "@/components/ui/notification-center";
import { useAuth } from "@/hooks/use-auth";

const ListItem = ({ className, title, href, children, ...props }: any) => {
  return (
    <div>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-lg p-4 leading-none no-underline outline-none transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10 focus:bg-black/5 dark:focus:bg-white/10",
            className
          )}
          {...props}
        >
          <div className="text-sm font-semibold leading-none">{title}</div>
          <div className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
            {children}
          </div>
        </Link>
      </NavigationMenuLink>
    </div>
  );
};

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const globalSearchEnabled = useFeature('global_search_v1');

  const getUserInitials = (user: any) => {
    if (!user) return "U";
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || user.email?.charAt(0).toUpperCase() || "U";
  };

  const [location] = useLocation();

  useEffect(() => {
    if (!globalSearchEnabled) return;
    const open = () => setIsSearchOpen(true);
    window.addEventListener('global-search:open', open as EventListener);
    return () => window.removeEventListener('global-search:open', open as EventListener);
  }, [globalSearchEnabled]);

  return (
    <nav className="fixed top-0 w-full z-50 glass-container border-b border-white/10 shadow-sm safe-area-top">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          <div className="flex items-center space-x-4 sm:space-x-10">
            <Link href="/" className="flex items-center space-x-2 sm:space-x-3" data-testid="link-home">
              <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-indigo-500 via-purple-600 to-teal-500 rounded-xl flex items-center justify-center shadow-md touch-target">
                <span className="text-white font-semibold text-xs sm:text-sm tracking-tight">IS</span>
              </div>
              <span className="font-semibold text-lg sm:text-xl gradient-text tracking-tight hidden xs:inline">
                IterativStartups
              </span>
            </Link>

            {/* Desktop Navigation */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Documents</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                      <div className="row-span-4">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/documents"
                          >
                            <BarChart3 className="h-6 w-6" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Document Hub
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Overview of all your strategic documents and analytics
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                      <div className="grid gap-2">
                        <ListItem href="/business-plans" title="Business Plans">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="h-4 w-4 text-blue-600" />
                            <span className="text-xs font-medium text-blue-600">Strategic planning</span>
                          </div>
                          Create and manage comprehensive business plans
                        </ListItem>
                        <ListItem href="/proposals" title="Proposals">
                          <div className="flex items-center gap-2 mb-1">
                            <FileText className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-medium text-green-600">Grant & partnership</span>
                          </div>
                          Grant, partnership, and service proposals
                        </ListItem>
                        <ListItem href="/pitch-decks" title="Pitch Decks">
                          <div className="flex items-center gap-2 mb-1">
                            <Presentation className="h-4 w-4 text-purple-600" />
                            <span className="text-xs font-medium text-purple-600">Investor ready</span>
                          </div>
                          Investor presentations and demo day materials
                        </ListItem>
                        <ListItem href="/applications" title="Applications">
                          <div className="flex items-center gap-2 mb-1">
                            <Award className="h-4 w-4 text-orange-600" />
                            <span className="text-xs font-medium text-orange-600">Competitions</span>
                          </div>
                          Accelerator, grant, and competition applications
                        </ListItem>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Funding</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                      <div className="row-span-4">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/funding"
                          >
                            <DollarSign className="h-6 w-6" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Funding Hub
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Comprehensive funding tools and investor connections
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                      <div className="grid gap-2">
                        <ListItem href="/funding/equity" title="Equity Funding">
                          <div className="flex items-center gap-2 mb-1">
                            <Building className="h-4 w-4 text-blue-600" />
                            <span className="text-xs font-medium text-blue-600">Ownership stake</span>
                          </div>
                          Venture capital, angel investors, and equity-based investments
                        </ListItem>
                        <ListItem href="/funding/debt" title="Debt Funding">
                          <div className="flex items-center gap-2 mb-1">
                            <CreditCard className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-medium text-green-600">Loans & credit</span>
                          </div>
                          Business loans, lines of credit, and debt financing options
                        </ListItem>
                        <ListItem href="/funding/grants" title="Grant Funding">
                          <div className="flex items-center gap-2 mb-1">
                            <Trophy className="h-4 w-4 text-purple-600" />
                            <span className="text-xs font-medium text-purple-600">Non-dilutive</span>
                          </div>
                          Government grants, foundation funding, and non-repayable capital
                        </ListItem>
                        <ListItem href="/funding-matcher" title="Funding Matcher">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="h-4 w-4 text-orange-600" />
                            <span className="text-xs font-medium text-orange-600">Find matches</span>
                          </div>
                          Connect with relevant investors and funding opportunities
                        </ListItem>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Ecosystem</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 md:w-[600px] lg:w-[700px] lg:grid-cols-[1fr_1fr]">
                      <div className="row-span-3">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/ecosystem"
                          >
                            <Building2 className="h-6 w-6" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Ecosystem Hub
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Different ecosystem models for different startup journeys
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                      <div className="grid gap-2">
                        <ListItem href="/venture-studio" title="Venture Studio">
                          <div className="flex items-center gap-2 mb-1">
                            <Rocket className="h-4 w-4 text-purple-600" />
                            <span className="text-xs font-medium text-purple-600">Build with us</span>
                          </div>
                          Co-build companies from scratch with full-service support
                        </ListItem>
                        <ListItem href="/accelerator" title="Accelerator">
                          <div className="flex items-center gap-2 mb-1">
                            <Target className="h-4 w-4 text-teal-600" />
                            <span className="text-xs font-medium text-teal-600">Grow fast</span>
                          </div>
                          Intensive 12-week programs for existing startups
                        </ListItem>
                        <ListItem href="/incubator" title="Incubator">
                          <div className="flex items-center gap-2 mb-1">
                            <Lightbulb className="h-4 w-4 text-orange-600" />
                            <span className="text-xs font-medium text-orange-600">Nurture ideas</span>
                          </div>
                          Long-term support with flexible resources
                        </ListItem>
                        <ListItem href="/applications" title="Competition">
                          <div className="flex items-center gap-2 mb-1">
                            <Trophy className="h-4 w-4 text-yellow-600" />
                            <span className="text-xs font-medium text-yellow-600">Win prizes</span>
                          </div>
                          Competitive events for recognition and exposure
                        </ListItem>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Analytics</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                      <div className="row-span-4">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/analytics"
                          >
                            <BarChart3 className="h-6 w-6" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Analytics Hub
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Comprehensive analytics and insights for your business
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                      <div className="grid gap-2">
                        <ListItem href="/valuation" title="Valuation Analysis">
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-medium text-green-600">Track value</span>
                          </div>
                          Monitor your company's valuation and financial metrics
                        </ListItem>
                        <ListItem href="/competitive-advantage" title="Competitive Analysis">
                          <div className="flex items-center gap-2 mb-1">
                            <Target className="h-4 w-4 text-blue-600" />
                            <span className="text-xs font-medium text-blue-600">Analyze position</span>
                          </div>
                          Assess your competitive positioning and market advantages
                        </ListItem>
                        <ListItem href="/industry-analysis" title="Industry Analysis">
                          <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                            <span className="text-xs font-medium text-purple-600">Market insights</span>
                          </div>
                          Deep dive into industry trends and market opportunities
                        </ListItem>
                        <ListItem href="/startup-league" title="Startup League">
                          <div className="flex items-center gap-2 mb-1">
                            <Award className="h-4 w-4 text-orange-600" />
                            <span className="text-xs font-medium text-orange-600">Compare & rank</span>
                          </div>
                          Compare your startup against industry benchmarks
                        </ListItem>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Education</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 md:w-[500px] lg:w-[600px] lg:grid-cols-[.75fr_1fr]">
                      <div className="row-span-4">
                        <NavigationMenuLink asChild>
                          <Link
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                            href="/education"
                          >
                            <GraduationCap className="h-6 w-6" />
                            <div className="mb-2 mt-4 text-lg font-medium">
                              Learning Hub
                            </div>
                            <p className="text-sm leading-tight text-muted-foreground">
                              Comprehensive educational resources for entrepreneurs
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </div>
                      <div className="grid gap-2">
                        <ListItem href="/education/fundamentals" title="Startup Fundamentals">
                          <div className="flex items-center gap-2 mb-1">
                            <Book className="h-4 w-4 text-blue-600" />
                            <span className="text-xs font-medium text-blue-600">Foundation</span>
                          </div>
                          Master the essential building blocks of launching a startup
                        </ListItem>
                        <ListItem href="/education/funding" title="Fundraising Masterclass">
                          <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="text-xs font-medium text-green-600">Capital raising</span>
                          </div>
                          Complete guide to raising capital from seed to Series A
                        </ListItem>
                        <ListItem href="/education/product" title="Product Development">
                          <div className="flex items-center gap-2 mb-1">
                            <Target className="h-4 w-4 text-purple-600" />
                            <span className="text-xs font-medium text-purple-600">Build & scale</span>
                          </div>
                          Learn product-market fit and development strategies
                        </ListItem>
                        <ListItem href="/education/leadership" title="Leadership & Team">
                          <div className="flex items-center gap-2 mb-1">
                            <Users className="h-4 w-4 text-orange-600" />
                            <span className="text-xs font-medium text-orange-600">Team building</span>
                          </div>
                          Develop leadership skills and build high-performing teams
                        </ListItem>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>


              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-3">
            {globalSearchEnabled && (
              <>
                <Button
                  variant="ghost"
                  className="h-9 px-3 hidden sm:flex items-center gap-2"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <span className="text-sm">Search</span>
                  <kbd className="hidden md:inline text-[10px] bg-black/5 dark:bg-white/10 px-1.5 py-0.5 rounded">⌘K</kbd>
                </Button>
                <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                  <CommandInput placeholder="Search documents, pages, and resources..." />
                  <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Go to">
                      <CommandItem onSelect={() => { setIsSearchOpen(false); (window.location.href = '/documents'); }}>Documents</CommandItem>
                      <CommandItem onSelect={() => { setIsSearchOpen(false); (window.location.href = '/funding'); }}>Funding Hub</CommandItem>
                      <CommandItem onSelect={() => { setIsSearchOpen(false); (window.location.href = '/education'); }}>Learning Hub</CommandItem>
                      <CommandItem onSelect={() => { setIsSearchOpen(false); (window.location.href = '/analytics'); }}>Analytics</CommandItem>
                    </CommandGroup>
                  </CommandList>
                </CommandDialog>
              </>
            )}
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              className="lg:hidden h-9 w-9 p-0 touch-target"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <div className="hidden sm:flex items-center space-x-3">
              <ThemeToggle />
              <NotificationCenter />

              {/* Organization Switcher */}
              <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 px-3 text-xs bg-white/10 hover:bg-white/20">
                  <Building className="mr-2 h-3 w-3" />
                  <span className="hidden sm:inline">My Startup</span>
                  <ChevronDown className="ml-1 h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white/90 backdrop-blur-md border border-white/20">
                <DropdownMenuLabel>Organizations</DropdownMenuLabel>
                <DropdownMenuItem>
                  <Building className="mr-2 h-4 w-4" />
                  <span>My Startup</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Building className="mr-2 h-4 w-4" />
                  <span>TechCorp Inc.</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Create Organization</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

              {/* Collaboration Indicator */}
              <Button variant="ghost" className="h-8 w-8 p-0 relative touch-target">
                <Users className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border border-white"></span>
              </Button>
            </div>

            {/* User Menu - Always Visible */}
            {isLoading ? (
              <Button variant="ghost" className="font-medium text-sm hover:bg-black/5 dark:hover:bg-white/10 rounded-lg px-4 py-2">
                Loading...
              </Button>
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.profileImageUrl} alt={user?.firstName} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-teal-500 text-white">
                        {getUserInitials(user)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-white/90 backdrop-blur-md border border-white/20" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/team">
                      <Users className="mr-2 h-4 w-4" />
                      <span>Team Management</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/organizations">
                      <Building className="mr-2 h-4 w-4" />
                      <span>Organizations</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => logout()}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={login} className="mobile-button font-medium text-sm hover:bg-black/5 dark:hover:bg-white/10 rounded-lg px-4 py-2 sm:px-6 sm:py-3">
                  Sign In
                </Button>
                <Button onClick={login} className="safari-button mobile-button text-sm font-medium rounded-lg px-6 py-2 sm:px-8 sm:py-3">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/10 pb-4 safe-area-bottom animate-slide-up">
            <div className="px-4 pt-4 pb-3 space-y-3">
              <Link href="/" data-testid="link-mobile-dashboard">
                <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                  <BarChart3 className="mr-3 h-5 w-5" />
                  Dashboard
                </Button>
              </Link>
              
              <div className="space-y-2">
                <div className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Documents</div>
                <Link href="/documents" data-testid="link-mobile-documents">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <BarChart3 className="mr-3 h-5 w-5" />
                    Document Hub
                  </Button>
                </Link>
                <Link href="/business-plans" data-testid="link-mobile-business-plans">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <FileText className="mr-3 h-5 w-5" />
                    Business Plans
                  </Button>
                </Link>
                <Link href="/proposals" data-testid="link-mobile-proposals">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <FileText className="mr-3 h-5 w-5" />
                    Proposals
                  </Button>
                </Link>
                <Link href="/pitch-decks" data-testid="link-mobile-pitch-decks">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <Presentation className="mr-3 h-5 w-5" />
                    Pitch Decks
                  </Button>
                </Link>
                <Link href="/applications" data-testid="link-mobile-applications">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <Award className="mr-3 h-5 w-5" />
                    Applications
                  </Button>
                </Link>
              </div>

              <div className="space-y-2">
                <div className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Funding</div>
                <Link href="/funding" data-testid="link-mobile-funding-hub">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <DollarSign className="mr-3 h-5 w-5" />
                    Funding Hub
                  </Button>
                </Link>
                <Link href="/funding-matcher" data-testid="link-mobile-funding-matcher">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <DollarSign className="mr-3 h-5 w-5" />
                    Funding Matcher
                  </Button>
                </Link>
                <Link href="/funding/equity" data-testid="link-mobile-equity">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <Building className="mr-3 h-5 w-5" />
                    Equity Funding
                  </Button>
                </Link>
                <Link href="/funding/debt" data-testid="link-mobile-debt">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <CreditCard className="mr-3 h-5 w-5" />
                    Debt Funding
                  </Button>
                </Link>
                <Link href="/funding/grants" data-testid="link-mobile-grants">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <Trophy className="mr-3 h-5 w-5" />
                    Grant Funding
                  </Button>
                </Link>
                <Link href="/funding/credit-monitoring" data-testid="link-mobile-credit">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <CreditCard className="mr-3 h-5 w-5" />
                    Credit Monitoring
                  </Button>
                </Link>
              </div>

              <div className="space-y-2">
                <div className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ecosystem</div>
                <Link href="/ecosystem" data-testid="link-mobile-ecosystem-hub">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <Building2 className="mr-3 h-5 w-5" />
                    Ecosystem Hub
                  </Button>
                </Link>
                <Link href="/venture-studio" data-testid="link-mobile-venture-studio">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <Rocket className="mr-3 h-5 w-5" />
                    Venture Studio
                  </Button>
                </Link>
                <Link href="/accelerator" data-testid="link-mobile-accelerator">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <Target className="mr-3 h-5 w-5" />
                    Accelerator
                  </Button>
                </Link>
                <Link href="/incubator" data-testid="link-mobile-incubator">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <Lightbulb className="mr-3 h-5 w-5" />
                    Incubator
                  </Button>
                </Link>
                <Link href="/applications" data-testid="link-mobile-competition">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <Trophy className="mr-3 h-5 w-5" />
                    Competition
                  </Button>
                </Link>
              </div>

              <div className="space-y-2">
                <div className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Analytics</div>
                <Link href="/analytics" data-testid="link-mobile-analytics">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <BarChart3 className="mr-3 h-5 w-5" />
                    Analytics Hub
                  </Button>
                </Link>
                <Link href="/valuation" data-testid="link-mobile-valuation">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <DollarSign className="mr-3 h-5 w-5" />
                    Valuation Analysis
                  </Button>
                </Link>
                <Link href="/competitive-advantage" data-testid="link-mobile-competitive">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <Target className="mr-3 h-5 w-5" />
                    Competitive Analysis
                  </Button>
                </Link>
                <Link href="/industry-analysis" data-testid="link-mobile-industry">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <TrendingUp className="mr-3 h-5 w-5" />
                    Industry Analysis
                  </Button>
                </Link>
                <Link href="/startup-league" data-testid="link-mobile-league">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <Award className="mr-3 h-5 w-5" />
                    Startup League
                  </Button>
                </Link>
              </div>
              
              <div className="space-y-2">
                <div className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Education</div>
                <Link href="/education" data-testid="link-mobile-education">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <GraduationCap className="mr-3 h-5 w-5" />
                    Learning Hub
                  </Button>
                </Link>
                <Link href="/education/fundamentals" data-testid="link-mobile-fundamentals">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <Book className="mr-3 h-5 w-5" />
                    Startup Fundamentals
                  </Button>
                </Link>
                <Link href="/education/funding" data-testid="link-mobile-funding-ed">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <DollarSign className="mr-3 h-5 w-5" />
                    Fundraising Masterclass
                  </Button>
                </Link>
                <Link href="/education/product" data-testid="link-mobile-product">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <Target className="mr-3 h-5 w-5" />
                    Product Development
                  </Button>
                </Link>
                <Link href="/education/leadership" data-testid="link-mobile-leadership">
                  <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                    <Users className="mr-3 h-5 w-5" />
                    Leadership & Team
                  </Button>
                </Link>
              </div>
              
              <Link href="/team" data-testid="link-mobile-team">
                <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                  <Users className="mr-3 h-5 w-5" />
                  Team Management
                </Button>
              </Link>
              
              <Link href="/organizations" data-testid="link-mobile-organizations">
                <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                  <Building className="mr-3 h-5 w-5" />
                  Organizations
                </Button>
              </Link>
              
              <Link href="/settings" data-testid="link-mobile-settings">
                <Button variant="ghost" className="w-full justify-start touch-target" onClick={() => setIsMobileMenuOpen(false)}>
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </Button>
              </Link>


              {/* Mobile-only utility items */}
              <div className="pt-4 border-t border-white/10 sm:hidden">
                <div className="flex items-center justify-between px-4">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}