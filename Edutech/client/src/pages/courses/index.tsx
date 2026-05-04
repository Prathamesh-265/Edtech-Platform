import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Search, BookOpen, Users, PlayCircle, Filter } from "lucide-react";
import { useListCourses } from "@/lib/api";
import { PageTransition, staggerContainer, staggerItem } from "@/components/layout/PageTransition";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function Courses() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [level, setLevel] = useState<string>("all");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const validLevel = level !== "all" ? (level as "beginner" | "intermediate" | "advanced") : undefined;
  const { data: courses, isLoading } = useListCourses({
    search: debouncedSearch || undefined,
    category: category !== "all" ? category : undefined,
    level: validLevel,
  });

  return (
    <PageTransition>
      <div className="bg-muted/30 border-b">
        <div className="container mx-auto px-6 lg:px-10 py-16">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Course Catalog</h1>
          <p className="text-xl text-muted-foreground max-w-2xl">Discover top-tier content across development, design, and data science.</p>
        </div>
      </div>
      <div className="container mx-auto px-6 lg:px-10 py-12">
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input placeholder="Search courses..." className="pl-10 h-12 text-base bg-background" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="flex gap-4">
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px] h-12"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Data Science">Data Science</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
              </SelectContent>
            </Select>
            <Select value={level} onValueChange={setLevel}>
              <SelectTrigger className="w-[180px] h-12"><SelectValue placeholder="Level" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Card key={i} className="overflow-hidden border-0 shadow-md">
                <Skeleton className="h-44 w-full rounded-none" />
                <CardContent className="p-5 space-y-4">
                  <Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" />
                  <div className="pt-4 flex justify-between"><Skeleton className="h-6 w-20" /><Skeleton className="h-6 w-20" /></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : courses && courses.length > 0 ? (
          <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course: any) => (
              <motion.div key={course.id} variants={staggerItem}>
                <Card className="group overflow-hidden border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {course.thumbnailUrl ? (
                      <img src={course.thumbnailUrl} alt={course.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-10 w-10 text-primary/40" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge variant="secondary" className="bg-background/90 backdrop-blur text-xs font-semibold">{course.level}</Badge>
                    </div>
                  </div>
                  <CardContent className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-3">
                      <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">{course.category}</Badge>
                      <span className="font-bold text-lg">${course.price}</span>
                    </div>
                    <Link href={`/courses/${course.id}`} className="block mb-2 group-hover:text-primary transition-colors">
                      <h3 className="text-lg font-bold tracking-tight line-clamp-2 leading-tight">{course.title}</h3>
                    </Link>
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-6 flex-1">{course.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50 mt-auto">
                      <div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /><span>{course.enrollmentCount} learners</span></div>
                      <div className="flex items-center gap-1.5"><PlayCircle className="h-3.5 w-3.5" /><span>{course.lessonCount} lessons</span></div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-24 bg-muted/20 rounded-xl border border-dashed">
            <Filter className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">We couldn't find any courses matching your filters.</p>
            <Button variant="outline" onClick={() => { setSearch(""); setCategory("all"); setLevel("all"); }}>Clear all filters</Button>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
