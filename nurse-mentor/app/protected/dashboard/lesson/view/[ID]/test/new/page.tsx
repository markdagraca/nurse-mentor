'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type QuestionType = 'multiple_choice' | 'true_false' | 'select_all'
type TestType = 'normal' | 'nclex_next_gen'

export default function GenerateTestPage({ params }: { params: { ID: string } }) {
  const { ID } = params
  const router = useRouter()
  const [testTitle, setTestTitle] = useState('')
  const [numQuestions, setNumQuestions] = useState(10)
  const [questionTypes, setQuestionTypes] = useState<QuestionType[]>(['multiple_choice'])
  const [testType, setTestType] = useState<TestType>('normal')
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleQuestionTypeChange = (type: QuestionType) => {
    setQuestionTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (questionTypes.length === 0) {
      setError("Please select at least one question type.")
      return
    }

    if (!testTitle.trim()) {
      setError("Please enter a test title.")
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId: ID,
          testTitle,
          testType,
          numQuestions,
          questionTypes,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate test')
      }

      const data = await response.json()
      
      // Redirect to the new test page
      router.push(`/protected/dashboard/lesson/${ID}/test/${data.testId}`)
    } catch (error) {
      console.error('Error generating test:', error)
      setError(error instanceof Error ? error.message : "An error occurred while generating the test. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Generate New Test</h1>
      <Card>
        <CardHeader>
          <CardTitle>Test Options</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="testTitle">Test Title</Label>
              <Input
                id="testTitle"
                value={testTitle}
                onChange={(e) => setTestTitle(e.target.value)}
                placeholder="Enter test title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Test Type</Label>
              <RadioGroup defaultValue="normal" onValueChange={(value) => setTestType(value as TestType)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="normal" id="normal" />
                  <Label htmlFor="normal">Normal</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="nclex_next_gen" id="nclex_next_gen" />
                  <Label htmlFor="nclex_next_gen">NCLEX Next Gen</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="numQuestions">Number of Questions (max 30)</Label>
              <Slider
                id="numQuestions"
                min={1}
                max={30}
                step={1}
                value={[numQuestions]}
                onValueChange={(value) => setNumQuestions(value[0])}
              />
              <div className="text-right">{numQuestions}</div>
            </div>

            <div className="space-y-2">
              <Label>Question Types</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="multiple_choice"
                    checked={questionTypes.includes('multiple_choice')}
                    onCheckedChange={() => handleQuestionTypeChange('multiple_choice')}
                  />
                  <Label htmlFor="multiple_choice">Multiple Choice</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="true_false"
                    checked={questionTypes.includes('true_false')}
                    onCheckedChange={() => handleQuestionTypeChange('true_false')}
                  />
                  <Label htmlFor="true_false">True / False</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="select_all"
                    checked={questionTypes.includes('select_all')}
                    onCheckedChange={() => handleQuestionTypeChange('select_all')}
                  />
                  <Label htmlFor="select_all">Select All That Apply</Label>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Test...
                </>
              ) : (
                'Generate Test'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}