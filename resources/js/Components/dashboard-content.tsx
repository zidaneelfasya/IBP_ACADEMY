import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card"
import { Progress } from "@/Components/ui/progress"
import { Badge } from "@/Components/ui/badge"
import { Button } from "@/Components/ui/button"
import { Bell, BookOpen, CalendarIcon, Clock, TrendingUp, Award, CheckCircle } from "lucide-react"

export function DashboardContent() {
  const courses = [
    {
      name: "Advanced React Development",
      progress: 75,
      dueTasks: 2,
      color: "bg-blue-500",
      nextDeadline: "Assignment due in 3 days",
    },
    {
      name: "Data Structures & Algorithms",
      progress: 60,
      dueTasks: 1,
      color: "bg-green-500",
      nextDeadline: "Quiz tomorrow",
    },
    {
      name: "UI/UX Design Principles",
      progress: 90,
      dueTasks: 0,
      color: "bg-purple-500",
      nextDeadline: "All caught up!",
    },
    {
      name: "Database Management",
      progress: 45,
      dueTasks: 3,
      color: "bg-orange-500",
      nextDeadline: "Project due in 1 week",
    },
  ]

  const notifications = [
    {
      title: "New assignment posted",
      course: "Advanced React Development",
      time: "2 hours ago",
      type: "assignment",
    },
    {
      title: "Grade updated",
      course: "UI/UX Design Principles",
      time: "1 day ago",
      type: "grade",
    },
    {
      title: "Upcoming deadline reminder",
      course: "Data Structures & Algorithms",
      time: "2 days ago",
      type: "reminder",
    },
  ]

  const upcomingEvents = [
    { title: "React Workshop", time: "10:00 AM", date: "Today" },
    { title: "Algorithm Quiz", time: "2:00 PM", date: "Tomorrow" },
    { title: "Design Review", time: "11:00 AM", date: "Friday" },
    { title: "Project Presentation", time: "3:00 PM", date: "Next Week" },
  ]

  return (
    <div className="flex-1 space-y-6 p-6 bg-gray-50/50">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-primary">Welcome back, John!</h1>
        <p className="text-gray-600">{"Here's what's happening with your courses today."}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">4</div>
            <p className="text-xs text-gray-500">2 assignments due</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">23</div>
            <p className="text-xs text-gray-500">+3 from last week</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Grade</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">87%</div>
            <p className="text-xs text-gray-500">+5% improvement</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Certificates</CardTitle>
            <Award className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">2</div>
            <p className="text-xs text-gray-500">1 in progress</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Course Progress Section */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-primary">Course Progress</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {courses.map((course, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-base font-medium text-primary line-clamp-2">{course.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${course.color}`} />
                        <span className="text-sm text-gray-500">{course.progress}% complete</span>
                      </div>
                    </div>
                    {course.dueTasks > 0 && (
                      <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
                        {course.dueTasks} due
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Progress value={course.progress} className="h-2" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{course.nextDeadline}</span>
                    <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
                      Continue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Calendar Widget */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-primary flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-primary">{event.title}</p>
                    <p className="text-xs text-gray-500">
                      {event.date} at {event.time}
                    </p>
                  </div>
                  <Clock className="h-4 w-4 text-gray-400" />
                </div>
              ))}
              <Button variant="outline" className="w-full mt-3 bg-transparent" size="sm">
                View Full Calendar
              </Button>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-primary flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Recent Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((notification, index) => (
                <div key={index} className="space-y-2 p-3 rounded-lg bg-gray-50/50">
                  <div className="flex items-start justify-between">
                    <p className="text-sm font-medium text-primary">{notification.title}</p>
                    <span className="text-xs text-gray-500">{notification.time}</span>
                  </div>
                  <p className="text-xs text-gray-600">{notification.course}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full mt-3 bg-transparent" size="sm">
                View All Notifications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
