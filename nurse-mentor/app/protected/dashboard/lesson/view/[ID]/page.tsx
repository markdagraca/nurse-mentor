'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Database } from '@/database.types'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BookOpen, Brain, Clock, ArrowUp, Trash2, Upload, Loader2 } from "lucide-react"

type Lesson = Database['public']['Tables']['nurse_mentor_lessons']['Row']

interface StorageFile {
  name: string;
  size: number;
  created_at: string;
}

export default function LessonPage({params}: {params: {ID: string}}) {
  const { ID } = params
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [testsTaken, setTestsTaken] = useState(0)
  const [lastScore, setLastScore] = useState<number | null>(null)
  const [averageScore, setAverageScore] = useState<number | null>(null)
  const [files, setFiles] = useState<StorageFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchLessonData = async () => {
      const supabase = createClient()
      const { data: lessonData, error: lessonError } = await supabase
        .from('nurse_mentor_lessons')
        .select('*')
        .eq('id', ID)
        .single()

      if (lessonError) {
        console.error('Error fetching lesson:', lessonError)
      } else {
        setLesson(lessonData)
      }

      // Fetch files from storage
      const { data: filesData, error: filesError } = await supabase
        .storage
        .from('nurse-mentor-lessons')
        .list(`${lessonData?.created_by}/${ID}`)

      if (filesError) {
        console.error('Error fetching files:', filesError)
      } else {
        setFiles(filesData || [])
      }

      // Mock data for demonstration
      setTestsTaken(5)
      setLastScore(85)
      setAverageScore(78.6)
    }

    fetchLessonData()
  }, [ID])

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFiles = Array.from(e.dataTransfer.files)
    uploadFiles(droppedFiles)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      uploadFiles(selectedFiles)
    }
  }

  const uploadFiles = async (filesToUpload: File[]) => {
    setIsUploading(true)
    const supabase = createClient()

    for (const file of filesToUpload) {
      try {
        const { data, error } = await supabase.storage
          .from('nurse-mentor-lessons')
          .upload(`${lesson?.created_by}/${ID}/${file.name}`, file)

        if (error) {
          console.error('Error uploading file:', error)
        } else {
          setFiles(prev => [...prev, { name: file.name, size: file.size, created_at: new Date().toISOString() }])
        }
      } catch (error) {
        console.error('Error in upload process:', error)
      }
    }

    setIsUploading(false)
  }

  const deleteFile = async (fileName: string) => {
    const supabase = createClient()
    const { error } = await supabase.storage
      .from('nurse-mentor-lessons')
      .remove([`${lesson?.created_by}/${ID}/${fileName}`])

    if (error) {
      console.error('Error deleting file:', error)
    } else {
      setFiles(prev => prev.filter(file => file.name !== fileName))
    }
  }

  if (!lesson) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-primary">{lesson.title}</h1>
        <Button className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          Take New Test
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Taken</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{testsTaken}</div>
            <p className="text-xs text-muted-foreground">+2 from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Score</CardTitle>
            <ArrowUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lastScore}%</div>
            <p className="text-xs text-muted-foreground">+5% from previous test</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageScore?.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Across all tests</p>
          </CardContent>
        </Card>
      </div>

    

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Lesson Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer mb-4"
          >
            <p>Drag and drop files here, or click to select files</p>
            <input
              type="file"
              multiple
              onChange={handleFileInput}
              className="hidden"
              ref={fileInputRef}
            />
            <Button 
              type="button" 
              variant="outline" 
              className="mt-2"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
          </div>
          {isUploading && (
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Uploading...</span>
            </div>
          )}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.name}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>{(file.size / 1024).toFixed(2)} KB</TableCell>
                  <TableCell>{new Date(file.created_at).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => deleteFile(file.name)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
