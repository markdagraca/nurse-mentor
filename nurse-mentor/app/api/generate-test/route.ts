// app/api/generate-test/route.ts

import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import OpenAI from 'openai'

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Define the request body structure
interface GenerateTestRequestBody {
  lessonId: string
  testTitle: string
  testType: 'normal' | 'nclex_next_gen'
  numQuestions: number
  questionTypes: ('multiple_choice' | 'true_false' | 'select_all')[]
}

// Define the question structure
interface Question {
  type: 'multiple_choice' | 'true_false' | 'select_all'
  text: string
  options: string[]
  correctAnswer: string | string[]
  explanation: string
}

// Define the response structure
interface GenerateTestResponse {
  message: string
  testId?: string
}

export async function POST(request: Request) {
  console.log('POST request received for test generation');
  try {
    const { lessonId, testTitle, testType, numQuestions, questionTypes } = (await request.json()) as GenerateTestRequestBody
    console.log('Request body:', { lessonId, testTitle, testType, numQuestions, questionTypes });

    // Input validation
    if (!lessonId || !testTitle || !testType || !numQuestions || !questionTypes.length) {
      console.log('Missing required fields');
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    // Initialize Supabase client
    const supabase = createClient()
    console.log('Supabase client initialized');

    // Fetch lesson details from Supabase
    console.log('Fetching lesson details for lessonId:', lessonId);
    const { data: lesson, error: lessonError } = await supabase
      .from('nurse_mentor_lessons')
      .select('id, created_by')
      .eq('id', lessonId)
      .single()

    if (lessonError || !lesson) {
      console.error('Error fetching lesson:', lessonError);
      return NextResponse.json({ error: 'Lesson not found.' }, { status: 404 })
    }
    console.log('Lesson details fetched:', lesson);

    // Fetch files from Supabase storage
    console.log(`Fetching files for lesson ${lessonId} created by ${lesson.created_by}`);
    const { data: files, error: filesError } = await supabase
      .storage
      .from('nurse-mentor-lessons')
      .list(`${lesson.created_by}/${lessonId}`)

    if (filesError) {
      console.error('Error fetching files:', filesError)
      return NextResponse.json({ error: 'Error fetching lesson files.' }, { status: 500 })
    }
    console.log('Files fetched:', files);

    // Download and read file contents
    console.log('Downloading and reading file contents');
    const fileContents = await Promise.all(files.map(async (file) => {
      console.log(`Downloading file: ${file.name}`);
      const { data, error } = await supabase
        .storage
        .from('nurse-mentor-lessons')
        .download(`${lesson.created_by}/${lessonId}/${file.name}`)

      if (error) {
        console.error(`Error downloading file ${file.name}:`, error)
        return ''
      }

      const content = await data.text()
      console.log(`File ${file.name} downloaded and read, content length: ${content.length}`);
      return content
    }))

    // Combine all file contents
    const lessonContent = fileContents.join('\n\n')
    console.log('All file contents combined, total length:', lessonContent.length);

    // Generate questions using OpenAI
    console.log('Generating questions using OpenAI');
    const prompt = `
      Generate ${numQuestions} questions for a ${testType} test based on the following lesson content:

      ${lessonContent}

      Include a mix of the following question types: ${questionTypes.join(', ')}.
      
      Format each question as a JSON object with the following structure:
      {
        "type": "question_type",
        "text": "Question text",
        "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "correctAnswer": "Correct option(s)",
        "explanation": "Detailed explanation of why this is the correct answer"
      }

      For true/false questions, use only two options: ["True", "False"].
      For select all that apply, include all correct options in the correctAnswer field as an array.

      Separate each question object with a newline character.
    `
    console.log('Prompt created, length:', prompt.length);

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 3000,
      temperature: 0.7,
    })

    const generatedContent = completion.choices[0].message.content?.trim()
    console.log('Generated content length:', generatedContent?.length);
    if (!generatedContent) {
      throw new Error('Failed to generate questions.')
    }

    // Parse the generated content
    console.log('Parsing generated content');
    const questions: Question[] = generatedContent.split('\n')
      .filter(line => line.trim() !== '')
      .map(line => JSON.parse(line))
    console.log('Number of questions parsed:', questions.length);

    // Validate and clean up the parsed questions
    console.log('Validating and cleaning up parsed questions');
    const validatedQuestions = questions.map(q => ({
      type: q.type,
      text: q.text,
      options: q.options,
      correctAnswer: Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer],
      explanation: q.explanation
    }))
    console.log('Number of validated questions:', validatedQuestions.length);

    // Insert test into Supabase
    console.log('Inserting test into Supabase');
    const { data: testData, error: testError } = await supabase
      .from('nurse_mentor_tests')
      .insert({
        lesson_id: lessonId,
        title: testTitle,
        type: testType,
        questions: validatedQuestions,
      })
      .select()
      .single()

    if (testError) {
      console.error('Error inserting test into Supabase:', testError);
      throw new Error(testError.message)
    }
    console.log('Test inserted successfully, testId:', testData?.id);

    const response: GenerateTestResponse = {
      message: 'Test generated successfully.',
      testId: testData?.id,
    }

    console.log('Sending response:', response);
    return NextResponse.json(response)
  } catch (error) {
    console.error('Error generating test:', error)
    return NextResponse.json({ error: 'Failed to generate test.' }, { status: 500 })
  }
}
