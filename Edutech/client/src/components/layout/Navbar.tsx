import { Link, useLocation } from "wouter";
import { BookOpen, LayoutDashboard, Library, BookMarked, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [location] = useLocation();
  const links = [
    { href: "/courses", label: "Catalog", icon: Library },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/enrollments", label: "My Learning", icon: BookMarked },
    { href: "/instructor", label: "Instructor", icon: GraduationCap },
  ];
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight">EduVerse</span>
        </Link>
        <nav className="hidden md:flex gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${location.startsWith(link.href) ? "text-primary" : "text-muted-foreground"}`}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden sm:flex gap-2" asChild>
            <Link href="/instructor">
              <GraduationCap className="h-4 w-4" />
              Instructor Portal
            </Link>
          </Button>
          <Button asChild>
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
