"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, FileText, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Database } from "@/database.types";

type Lesson = Database['public']['Tables']['nurse_mentor_lessons']['Row'];

export default function LessonPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [sortColumn, setSortColumn] = useState<"title" | "created_at">("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const router = useRouter();

  useEffect(() => {
    const fetchLessons = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('nurse_mentor_lessons')
        .select('*')
        .order(sortColumn, { ascending: sortDirection === 'asc' });

      if (error) {
        console.error('Error fetching lessons:', error);
      } else {
        setLessons(data || []);
      }
    };

    fetchLessons();
  }, [sortColumn, sortDirection]);

  const toggleSort = (column: "title" | "created_at") => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleRowClick = (lessonId: string) => {
    router.push(`/protected/dashboard/lesson/view/${lessonId}`);
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lessons</h1>
        <Link href="/protected/dashboard/lesson/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create New Lesson
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Lessons</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60%] cursor-pointer" onClick={() => toggleSort("title")}>
                  Lesson Title
                  {sortColumn === "title" && (sortDirection === "asc" ? " ↑" : " ↓")}
                </TableHead>
                <TableHead className="w-[30%] cursor-pointer" onClick={() => toggleSort("created_at")}>
                  Created Date
                  {sortColumn === "created_at" && (sortDirection === "asc" ? " ↑" : " ↓")}
                </TableHead>
                <TableHead className="w-[10%] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lessons.map((lesson) => (
                <TableRow 
                  key={lesson.id} 
                  onClick={() => handleRowClick(lesson.id)}
                  className="cursor-pointer hover:bg-muted/50"
                >
                  <TableCell className="font-medium">{lesson.title}</TableCell>
                  <TableCell>{new Date(lesson.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => handleActionClick(e, () => router.push(`/protected/dashboard/lesson/view/${lesson.id}`))}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => handleActionClick(e, () => console.log('Edit lesson', lesson.id))}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => handleActionClick(e, () => console.log('Delete lesson', lesson.id))}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
