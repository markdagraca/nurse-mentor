"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Check, AlertCircle, Loader2 } from "lucide-react";
import { v4 as uuidv4 } from 'uuid';
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

interface FileWithStatus extends File {
  status: 'uploading' | 'success' | 'error';
  progress: number;
  name: string; // Ensure name is explicitly included
}

export default function NewLessonPage() {
  const [lessonName, setLessonName] = useState("");
  const [files, setFiles] = useState<FileWithStatus[]>([]);
  const [lessonId, setLessonId] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLessonId(uuidv4());
    const fetchUserId = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    fetchUserId();
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files)
      .filter(file => file.type === 'application/pdf' || file.type === 'text/plain')
      .map(file => ({ 
        ...file, 
        status: 'uploading' as const, 
        progress: 0,
        name: file.name // Explicitly set the name
      }));
    setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
    droppedFiles.forEach(uploadFile);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
        .filter(file => file.type === 'application/pdf' || file.type === 'text/plain')
        .map(file => ({ 
          ...file, 
          status: 'uploading' as const, 
          progress: 0,
          name: file.name // Explicitly set the name
        }));
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
      selectedFiles.forEach(uploadFile);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: FileWithStatus) => {
    if (!userId) {
      console.error('User ID not available');
      return;
    }

    if (!file.name) {
      console.error('File name is undefined');
      return;
    }

    const supabase = createClient();
    console.log('Uploading file:', file.name); // Log the file name
    
    try {
      const { data, error } = await supabase.storage
        .from('nurse-mentor-lessons')
        .upload(`${userId}/${lessonId}/${file.name}`, file, {
          contentType: file.type,
        });

      if (error) {
        console.error('Error uploading file:', error);
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.name === file.name ? { ...f, status: 'error', progress: 100 } : f
          )
        );
      } else {
        console.log('File uploaded successfully:', file.name);
        setFiles(prevFiles => 
          prevFiles.map(f => 
            f.name === file.name ? { ...f, status: 'success', progress: 100 } : f
          )
        );
      }
    } catch (error) {
      console.error('Error in upload process:', error);
      setFiles(prevFiles => 
        prevFiles.map(f => 
          f.name === file.name ? { ...f, status: 'error', progress: 100 } : f
        )
      );
    }

    // Note: Progress tracking is removed in this version
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent multiple submissions
    if (files.some(file => file.status === 'uploading')) {
      alert('Please wait for all files to finish uploading.');
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from('nurse_mentor_lessons')
        .insert({
          id: lessonId,
          title: lessonName,
          created_by: userId,
        })
        .select();

      if (error) throw error;

      console.log("Lesson created successfully:", data);

      // Redirect to the new lesson page
      router.push(`/lesson/${lessonId}`);

    } catch (error) {
      console.error("Error creating lesson:", error);
      alert("Error creating lesson. Please try again.");
      setIsSubmitting(false); // Re-enable submit button on error
    }
  };

  const handleSelectFiles = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New Lesson</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="lessonName" className="block text-sm font-medium mb-2">
            Lesson Name
          </label>
          <Input
            id="lessonName"
            value={lessonName}
            onChange={(e) => setLessonName(e.target.value)}
            placeholder="Enter lesson name"
            required
          />
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer"
            >
              <p>Drag and drop files here, or click to select files</p>
              <input
                type="file"
                multiple
                accept=".pdf,.txt"
                onChange={handleFileInput}
                className="hidden"
                id="fileInput"
                ref={fileInputRef}
              />
              <Button 
                type="button" 
                variant="outline" 
                className="mt-2"
                onClick={handleSelectFiles}
              >
                Select Files
              </Button>
            </div>
            {files.length > 0 && (
              <ul className="mt-4 space-y-2">
                {files.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                    <span className="text-sm">{file.name}</span>
                    <div className="flex items-center">
                      {file.status === 'uploading' && (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          <span className="text-sm mr-2">{file.progress.toFixed(0)}%</span>
                        </>
                      )}
                      {file.status === 'success' && <Check className="h-4 w-4 text-green-500 mr-2" />}
                      {file.status === 'error' && <AlertCircle className="h-4 w-4 text-red-500 mr-2" />}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Button 
          type="submit" 
          disabled={isSubmitting || files.some(file => file.status === 'uploading')}
        >
          {isSubmitting ? 'Creating Lesson...' : 'Create Lesson'}
        </Button>
      </form>
    </div>
  );
}
