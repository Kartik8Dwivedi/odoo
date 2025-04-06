"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  learningCapability?: number;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (
    name: string,
    email: string,
    password: string,
    role: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated on initial load
    const storedAuth = localStorage.getItem("isAuthenticated");
    const storedUser = localStorage.getItem("user");

    if (storedAuth === "true" && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Redirect logic
    if (!isLoading) {
      const isAuthRoute = pathname?.startsWith("/auth");

      if (!isAuthenticated && !isAuthRoute && pathname !== "/") {
        // Redirect to login if not authenticated and not on auth page or homepage
        router.push("/auth/login");
      } else if (isAuthenticated && isAuthRoute) {
        // Redirect to dashboard if authenticated and on auth page
        router.push("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would be an API call to your authentication endpoint
      // For demo purposes, we'll simulate a successful login after a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful login
      const userData = {
        id: "user123",
        name: "Aaryan Tripathi",
        email,
        learningCapability: 0.85, // This would come from the backend in a real app
      };

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      toast({
        title: "Login Successful",
        description: "Welcome back to AscendAI!",
        variant: "success",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signup = async (
    name: string,
    email: string,
    password: string,
    role: string
  ) => {
    try {
      // In a real app, this would be an API call to your registration endpoint
      // For demo purposes, we'll simulate a successful registration after a delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate successful registration
      const userData = {
        id: "user123",
        name,
        email,
        role,
        learningCapability: 0.75, // This would be determined later in a real app
      };

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(userData));

      setUser(userData);
      setIsAuthenticated(true);

      toast({
        title: "Registration Successful",
        description: "Welcome to AscendAI!",
        variant: "success",
      });

      router.push("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description:
          "There was an error creating your account. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
