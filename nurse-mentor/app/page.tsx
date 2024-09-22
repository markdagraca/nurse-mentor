import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Index() {
  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="flex flex-col gap-16 items-center">
        <h1 className="sr-only">Nursing Mentor</h1>
        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
        <div className="flex flex-col gap-8 items-center">
          <div className="flex flex-col items-center mb-8 text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-4">Nursing Mentor</h1>
            <p className="text-xl sm:text-2xl text-muted-foreground max-w-[600px]">
              Your digital companion for nursing excellence
            </p>
          </div>
          <div className="w-full max-w-2xl p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/upload">Upload Documents</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/practice">Start Practicing</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <ol className="list-decimal list-inside space-y-4">
          <li className="text-lg">Upload your nursing study materials (PDFs, documents)</li>
          <li className="text-lg">Our AI generates relevant nursing questions from your content</li>
          <li className="text-lg">Practice with personalized quizzes tailored to your materials</li>
          <li className="text-lg">Track your progress and improve your nursing knowledge</li>
        </ol>
      </div>

      <div className="w-full max-w-3xl">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-4">
          <li className="text-lg">Personalized question generation from your own materials</li>
          <li className="text-lg">Adaptive learning based on your performance</li>
          <li className="text-lg">Comprehensive progress tracking and analytics</li>
          <li className="text-lg">Mobile-friendly interface for learning on-the-go</li>
        </ul>
      </div>
    </div>
  );
}
