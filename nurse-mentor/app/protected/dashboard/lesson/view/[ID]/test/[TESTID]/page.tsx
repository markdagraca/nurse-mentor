'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { Database } from '@/database.types'

type Question = Database['public']['Tables']['nurse_mentor_questions']['Row']

export default function TestPage({ params }: { params: { TESTID: string } }) {
  const { TESTID } = params
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({})
  const [showResults, setShowResults] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true)
      const { data, error } = await supabase
        .from('nurse_mentor_questions')
        .select('*')
        .eq('test_id', TESTID)

      if (error) {
        setError('Failed to fetch questions')
        setLoading(false)
        return
      }

      const shuffledQuestions = data.sort(() => Math.random() - 0.5)
      setQuestions(shuffledQuestions)
      setLoading(false)
    }

    fetchQuestions()
  }, [TESTID])

  const handleAnswer = (answer: string | string[]) => {
    setUserAnswers(prev => ({
      ...prev,
      [questions[currentQuestionIndex].id]: answer
    }))
  }

  const handleNext = () => {
    const currentQuestionId = questions[currentQuestionIndex].id
    const currentAnswer = userAnswers[currentQuestionId]

    if (!currentAnswer || (Array.isArray(currentAnswer) && currentAnswer.length === 0)) {
      return
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    } else {
      setShowResults(true)
    }
  }

  const calculateScore = () => {
    let score = 0
    questions.forEach((question) => {
      const userAnswer = userAnswers[question.id]
      const correctAnswer = question.correctAnswer ? JSON.parse(question.correctAnswer) : []
      if (Array.isArray(userAnswer) && Array.isArray(correctAnswer)) {
        if (userAnswer.length === correctAnswer.length &&
            userAnswer.every(answer => correctAnswer.includes(answer))) {
          score++
        }
      } else if (userAnswer === correctAnswer[0]) {
        score++
      }
    })
    return score
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (showResults) {
    const score = calculateScore()
    return (
      <Card className="w-full max-w-3xl mx-auto mt-8">
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold mb-4">Your Score: {score} / {questions.length}</p>
          {questions.map((question, index) => (
            <div key={question.id} className="mb-6">
              <h3 className="font-semibold mb-2">Question {index + 1}: {question.question}</h3>
              <p className="mb-2">Your answer: {Array.isArray(userAnswers[question.id]) ? (userAnswers[question.id] as any).join(', ') : (userAnswers[question.id] || 'Not answered')}</p>
              <p className="mb-2">
                {Array.isArray(userAnswers[question.id]) && question.correctAnswer ? 
                  (areArraysEqualIgnoreOrder(userAnswers[question.id] as string[], JSON.parse(question.correctAnswer)) ? 
                    'Correct' : 'Incorrect') 
                  : userAnswers[question.id] === question.correctAnswer ? 
                    'Correct' : userAnswers[question.id] ? 'Incorrect' : 'Not answered'}
              </p>
              <p className="text-sm text-gray-600">{question.explanation}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const options = currentQuestion.options as string[] || []

  return (
    <Card className="w-full max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Question {currentQuestionIndex + 1} of {questions.length}</CardTitle>
        <Progress value={(currentQuestionIndex + 1) / questions.length * 100} className="w-full" />
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">{currentQuestion.question}</h2>
        {currentQuestion.type === 'select_all' ? (
          options.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <Checkbox
                id={`option-${index}`}
                checked={(userAnswers[currentQuestion.id] as string[] || []).includes(option)}
                onCheckedChange={(checked) => {
                  const currentAnswers = userAnswers[currentQuestion.id] as string[] || []
                  if (checked) {
                    handleAnswer([...currentAnswers, option])
                  } else {
                    handleAnswer(currentAnswers.filter(a => a !== option))
                  }
                }}
              />
              <Label htmlFor={`option-${index}`}>{option}</Label>
            </div>
          ))
        ) : (
          <RadioGroup
            value={userAnswers[currentQuestion.id] as string}
            onValueChange={handleAnswer}
          >
            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 mb-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleNext} 
          className="w-full"
          disabled={!userAnswers[currentQuestion.id] || (Array.isArray(userAnswers[currentQuestion.id]) && userAnswers[currentQuestion.id].length === 0)}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
        </Button>
      </CardFooter>
    </Card>
  )
}

function areArraysEqualIgnoreOrder(arr1: string[], arr2: string[]): boolean {
  return arr1.length === arr2.length && arr1.every(item => arr2.includes(item));
}