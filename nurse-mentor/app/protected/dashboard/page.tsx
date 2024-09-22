import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, BookOpen, Brain, Trophy, Clock, ArrowUp, Zap } from "lucide-react";
import Link from "next/link";

export default function DashboardHome() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-primary">Welcome back, Nurse!</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Quick Study
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Total Study Time", icon: Clock, value: "24.5", unit: "hours", change: "+2.5", changeUnit: "hours" },
          { title: "Questions Answered", icon: Brain, value: "245", unit: "", change: "+35", changeUnit: "" },
          { title: "Current Streak", icon: Trophy, value: "7", unit: "days", change: "+2", changeUnit: "days" },
          { title: "Study Materials", icon: BookOpen, value: "12", unit: "", change: "+3", changeUnit: "" },
        ].map((item, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-muted">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-3xl font-bold">{item.value}<span className="text-lg font-normal text-muted-foreground ml-1">{item.unit}</span></div>
              <div className="flex items-center text-xs text-green-500 mt-1">
                <ArrowUp className="h-3 w-3 mr-1" />
                {item.change} {item.changeUnit} from last week
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={75} className="w-full h-3" />
              <p className="text-sm text-muted-foreground">75% of your study goals completed</p>
              <div className="flex justify-between text-sm">
                <span>Pharmacology</span>
                <span className="font-medium">85%</span>
              </div>
              <Progress value={85} className="w-full h-2" />
              <div className="flex justify-between text-sm">
                <span>Anatomy</span>
                <span className="font-medium">70%</span>
              </div>
              <Progress value={70} className="w-full h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start">
              <Link href="/protected/dashboard/practice">
                <Brain className="mr-2 h-4 w-4" /> Start Practice Session
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start">
              <Link href="/protected/dashboard/materials">
                <Upload className="mr-2 h-4 w-4" /> Upload New Study Material
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full justify-start">
              <Link href="/protected/dashboard/progress">
                <Trophy className="mr-2 h-4 w-4" /> View Detailed Progress
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {[
              { icon: BookOpen, text: "Completed \"Cardiovascular System\" quiz - 92% score", time: "2 hours ago" },
              { icon: Upload, text: "Uploaded \"Pediatric Nursing\" study guide", time: "Yesterday" },
              { icon: Brain, text: "Practiced 50 questions on \"Pharmacology\"", time: "2 days ago" },
            ].map((item, index) => (
              <li key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <item.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span>{item.text}</span>
                </div>
                <span className="text-sm text-muted-foreground">{item.time}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
