"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Menu,
  X,
  Home,
  BookOpen,
  Trophy,
  BarChart3,
  MessageSquare,
  LogOut,
  Search,
  Flame,
  User,
  UserPlus,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/auth-context";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Current streak (would come from user data in a real app)
  const currentStreak = 12;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 p-1 text-white">
              <BookOpen className="h-6 w-6" />
            </div>
            <span className="text-xl font-bold">AscendAI</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative w-64">
            <Input
              type="text"
              placeholder="Search topics..."
              className="pl-8"
            />
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          </div>
          <nav className="flex items-center gap-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Dashboard
                </Link>
                <Link
                  href="/subjects"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Subjects
                </Link>
                <Link
                  href="/ai-chat"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  AI Chat
                </Link>
                <Link
                  href="/resources"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  Resources
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Streak Button (only show if authenticated) */}
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex items-center gap-1 bg-orange-50 text-orange-600 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 dark:hover:bg-orange-900/30"
            >
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="font-medium">{currentStreak}</span>
              <span className="text-xs ml-0.5">days</span>
            </Button>
          )}

          <ThemeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src="/placeholder.svg?height=32&width=32"
                      alt="User"
                    />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "user@example.com"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <Home className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/subjects">
                    <BookOpen className="mr-2 h-4 w-4" />
                    <span>My Courses</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/competitions">
                    <Trophy className="mr-2 h-4 w-4" />
                    <span>Competitions</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/progress">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    <span>Progress</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/ai-chat">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    <span>AI Chat</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                asChild
              >
                <Link href="/auth/signup">Sign Up</Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 space-y-2">
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Search topics..."
                className="pl-8"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>

            {/* Streak display for mobile (only show if authenticated) */}
            {isAuthenticated && (
              <div className="flex items-center justify-between py-2 px-1">
                <div className="flex items-center">
                  <Flame className="h-5 w-5 mr-2 text-orange-500" />
                  <span>Learning Streak</span>
                </div>
                <Badge
                  variant="outline"
                  className="bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"
                >
                  {currentStreak} days
                </Badge>
              </div>
            )}

            <Link
              href="/"
              className="flex items-center py-2"
              onClick={toggleMenu}
            >
              <Home className="mr-2 h-5 w-5" />
              <span>Home</span>
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center py-2"
                  onClick={toggleMenu}
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/subjects"
                  className="flex items-center py-2"
                  onClick={toggleMenu}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  <span>Subjects</span>
                </Link>
                <Link
                  href="/ai-chat"
                  className="flex items-center py-2"
                  onClick={toggleMenu}
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  <span>AI Chat</span>
                </Link>
                <Link
                  href="/resources"
                  className="flex items-center py-2"
                  onClick={toggleMenu}
                >
                  <BookOpen className="mr-2 h-5 w-5" />
                  <span>Resources</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center py-2"
                  onClick={toggleMenu}
                >
                  <User className="mr-2 h-5 w-5" />
                  <span>My Profile</span>
                </Link>
                <button
                  className="flex items-center py-2 w-full text-left"
                  onClick={() => {
                    logout();
                    toggleMenu();
                  }}
                >
                  <LogOut className="mr-2 h-5 w-5" />
                  <span>Log out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center py-2"
                  onClick={toggleMenu}
                >
                  <User className="mr-2 h-5 w-5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  href="/auth/signup"
                  className="flex items-center py-2"
                  onClick={toggleMenu}
                >
                  <UserPlus className="mr-2 h-5 w-5" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
