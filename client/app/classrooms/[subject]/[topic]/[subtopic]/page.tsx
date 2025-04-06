"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import {
  PlayCircle,
  PauseCircle,
  Volume2,
  VolumeX,
  Mic,
  MessageCircle,
  ThumbsUp,
  Star,
  ChevronLeft,
  Send,
  Info,
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ModelBAssessmentPanel } from "@/components/model-b-assessment-panel"
import { useToast } from "@/hooks/use-toast"

export default function ClassroomPage() {
  const router = useRouter()
  const params = useParams()
  const { subject, topic, subtopic } = params
  const { toast } = useToast()

  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [lessonCompleted, setLessonCompleted] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [videoEnded, setVideoEnded] = useState(false)
  const [comment, setComment] = useState("")
  const [rating, setRating] = useState(0)
  const [mentorRating, setMentorRating] = useState(0)

  // Model B assessment availability
  const [isModelBAvailable, setIsModelBAvailable] = useState(false)
  const [lecturesRemaining, setLecturesRemaining] = useState(2)

  // This would come from the backend in a real app
  const totalLecturesInTopic = 3
  const currentLectureNumber = 1

  // Format the topic and subtopic for display
  const formattedTopic = (topic as string)?.replace(/-/g, " ")
  const formattedSubtopic = (subtopic as string)?.replace(/-/g, " ")

  // Format time display (mm:ss)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  useEffect(() => {
    // Show toast notification about Model B availability
    if (lecturesRemaining > 0) {
      toast({
        title: "Model B Assessment",
        description: `Complete ${lecturesRemaining} more ${lecturesRemaining === 1 ? "lecture" : "lectures"} to unlock the Model B assessment for this topic.`,
        variant: "info",
      })
    } else {
      toast({
        title: "Model B Assessment Available",
        description: "You can now take the Model B assessment to test your understanding of this topic.",
        variant: "success",
      })
    }

    // Set Model B availability based on lectures remaining
    setIsModelBAvailable(lecturesRemaining === 0)
  }, [lecturesRemaining, toast])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateTime = () => {
      setCurrentTime(video.currentTime)
    }

    const handleVideoEnd = () => {
      setVideoEnded(true)
      setIsPlaying(false)
      // After 1 second, set lesson completed to trigger Model B
      setTimeout(() => {
        setLessonCompleted(true)

        // Update lectures remaining (in a real app, this would be handled by the backend)
        setLecturesRemaining((prev) => Math.max(0, prev - 1))

        // If this was the last lecture needed, make Model B available
        if (lecturesRemaining === 1) {
          setIsModelBAvailable(true)
        }
      }, 1000)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration)
    }

    video.addEventListener("timeupdate", updateTime)
    video.addEventListener("ended", handleVideoEnd)
    video.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      video.removeEventListener("timeupdate", updateTime)
      video.removeEventListener("ended", handleVideoEnd)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [lecturesRemaining])

  const togglePlayPause = () => {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return

    video.muted = !video.muted
    setIsMuted(!isMuted)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return

    const newTime = Number.parseFloat(e.target.value)
    video.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleAskQuestion = () => {
    // For demo purposes, we'll just switch to the discussion tab
    setActiveTab("discussion")
  }

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, we would post this comment to the backend
    // For demo purposes, we'll just clear the input
    setComment("")
  }

  const handleGoToAssessment = () => {
    // Navigate to the assessment page for this topic
    router.push(`/assessment/${subject}/${topic}/${subtopic}`)
  }

  // Community doubts (sample data)
  const communityDoubts = [
    {
      id: "1",
      user: "Priya S.",
      content:
        "I'm having trouble understanding the difference between convex and concave lenses. Can someone explain?",
      timestamp: "2 days ago",
      replies: [
        {
          id: "1-1",
          user: "Model A",
          content:
            "Great question! Convex lenses are thicker in the middle and thinner at the edges, causing light rays to converge. They form real images (if the object is beyond the focal point) or virtual images (if the object is within the focal point). Concave lenses are thinner in the middle and thicker at the edges, causing light rays to diverge. They always form virtual, upright, and diminished images. The key difference is in how they bend light rays!",
          timestamp: "2 days ago",
          isPinned: true,
        },
        {
          id: "1-2",
          user: "Rahul P.",
          content: "I found it helpful to remember: Convex Converges, Concave Caves in!",
          timestamp: "1 day ago",
        },
      ],
    },
    {
      id: "2",
      user: "Amit J.",
      content: "Can someone explain the formula for magnification again? I missed that part.",
      timestamp: "1 day ago",
      replies: [
        {
          id: "2-1",
          user: "Model A",
          content:
            "The magnification (m) is the ratio of image height to object height. It can be calculated using m = -v/u where v is the image distance and u is the object distance. The negative sign indicates that if the image is real, it will be inverted relative to the object. If m is positive, the image is virtual and erect. If |m| > 1, the image is larger than the object, and if |m| < 1, the image is smaller.",
          timestamp: "1 day ago",
          isPinned: true,
        },
      ],
    },
  ]

  return (
    <div className="container mx-auto px-4 py-6">
      {!lessonCompleted ? (
        // MODEL A VIEW - Learning mode with video content
        <div className="space-y-6">
          <div className="flex items-center mb-4">
            <Link
              href="/subjects"
              className="flex items-center text-sm hover:underline mr-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Subjects
            </Link>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {subject} / {formattedTopic} / {formattedSubtopic}
            </div>
            <Badge className="ml-auto" variant="outline">
              <Info className="h-3 w-3 mr-1" />
              Lecture {currentLectureNumber} of {totalLecturesInTopic}
            </Badge>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-3/4 space-y-6">
              <div className="relative rounded-xl overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-auto"
                  poster="data:image/jpeg;base64,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"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src="/placeholder.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {videoEnded && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
                    <h3 className="text-2xl font-bold mb-4">
                      Lecture Completed!
                    </h3>
                    <p className="mb-6 text-center max-w-md">
                      Great job! Continue to the next lecture to progress
                      through this topic.
                    </p>
                    <Button
                      onClick={() =>
                        router.push(
                          `/classroom/${subject}/${topic}/${subtopic}-2`
                        )
                      }
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Next Lecture
                    </Button>
                  </div>
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={togglePlayPause}
                        >
                          {isPlaying ? (
                            <PauseCircle className="h-6 w-6" />
                          ) : (
                            <PlayCircle className="h-6 w-6" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={toggleMute}
                        >
                          {isMuted ? (
                            <VolumeX className="h-6 w-6" />
                          ) : (
                            <Volume2 className="h-6 w-6" />
                          )}
                        </Button>
                        <div className="text-white text-sm">
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </div>
                      </div>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="text-xs"
                        onClick={handleAskQuestion}
                      >
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Ask a Question
                      </Button>
                    </div>
                    <div className="flex-1">
                      <input
                        type="range"
                        min="0"
                        max={duration || 100}
                        value={currentTime}
                        onChange={handleSeek}
                        className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h1 className="text-2xl font-bold mb-2 capitalize">
                  {formattedSubtopic}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Taught by Model A (AI Teacher)
                </p>
              </div>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="space-y-4"
              >
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="discussion">Discussion</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="rating">Rating</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">About this lesson</h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        This lesson covers the fundamental concepts of{" "}
                        {formattedSubtopic} in {formattedTopic}. You'll learn
                        the key principles, formulas, and applications that are
                        essential for understanding this topic.
                      </p>

                      <h3 className="font-semibold mt-4 mb-2">
                        What you'll learn
                      </h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-600 dark:text-gray-400">
                        <li>Core principles of {formattedSubtopic}</li>
                        <li>Important formulas and their derivations</li>
                        <li>Real-world applications and examples</li>
                        <li>Problem-solving techniques</li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="discussion" className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-4">Ask a Question</h3>
                    <form onSubmit={handleSubmitComment} className="space-y-4">
                      <Textarea
                        placeholder="Type your question here..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="min-h-[100px]"
                      />
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="mr-2"
                          >
                            <Mic className="h-4 w-4" />
                          </Button>
                          <span className="text-sm text-gray-500">
                            or record your question
                          </span>
                        </div>
                        <Button type="submit">
                          <Send className="h-4 w-4 mr-2" />
                          Submit Question
                        </Button>
                      </div>
                    </form>
                  </div>

                  <div className="space-y-6">
                    <h3 className="font-semibold">Community Doubts</h3>

                    {communityDoubts.map((doubt) => (
                      <div
                        key={doubt.id}
                        className="border rounded-lg p-4 space-y-4"
                      >
                        <div className="flex items-start gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {doubt.user.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div className="font-medium">{doubt.user}</div>
                              <div className="text-xs text-gray-500">
                                {doubt.timestamp}
                              </div>
                            </div>
                            <p className="mt-1 text-gray-700 dark:text-gray-300">
                              {doubt.content}
                            </p>
                            <div className="flex gap-2 mt-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2"
                              >
                                <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                                Helpful
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2"
                              >
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="pl-10 space-y-4">
                          {doubt.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className="flex items-start gap-3"
                            >
                              <Avatar>
                                <AvatarImage
                                  src="ddata:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxIQERMREBIVFRUVFRcWFxgVFhUWFhoXGBcWGBcZHRgYHSghGx0lHRgYIT0hJikrLjAuGCA1ODMtNyktLi0BCgoKDg0OGxAQGy0mICUtLS8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALQBFwMBEQACEQEDEQH/xAAbAAEAAgMBAQAAAAAAAAAAAAAABQYBAwQHAv/EAEwQAAIBAwIDBAYFBgwDCQEAAAECAwAEERIhBTFBBhMiURQyYXGBkQcjQlKxFTNTcoKhFiRDRGJjg5KissHRNHOTNVV0hKOzwsPSJf/EABsBAQADAQEBAQAAAAAAAAAAAAADBAUCAQYH/8QAMxEAAgICAQMDAgUDAwUBAAAAAAECAwQREgUhMRNBUSJhFDJxgZEVobEzQlIGI9Hh8WL/2gAMAwEAAhEDEQA/APcaAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUBxcU4rBaxmW5lSJBtqdgoz5DPM+wUBT7z6Tov5pbTT+TMBbp85PHj9mo5XQj5Zbqwb7PEf5I5PpLulbVLYx92NyI52eUDqQGjVWPsyK4WRBvRNLpl8Y77Ho1jeJPGk0TBkkUOrDkVYZBqczjooBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUBC9rO0ScPhEro0jO4jjjXALuwJAydgAAST0ANeNpLbOoQc5KMfLPH+LcWa7ujPcjVLjEUEYeYwx+wKudTHJLYGdhyFVLJTs/J4NrGrpxe9zXL48nfa8Gv5vzdjMB96YpCvyZtf+GuFiyflks+rVLtFNmOMcDvbIQyXQh0Sv3eIi7lHKlkLOwAIOkrsOZG5zXU8dRjtM5x+pytu4yS0yyfRNesj3Fj/JIqTQj7gkZxIg/o6hqA6az7Knosco9zO6hRGq18fDPSKmKIoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKA8t+lm9czxhIXljtIWuJipUaDKe7jPiIycLJsMncVHbBzjpFrDujTZzkjH0fcTeC3xb2jzyySsbh2ZLb67TqMEaz4Z2jQBeQGxOeeOoxUVpENtjsm5MnZu30U31VntLolklaeOURwJBtKzAAd4ytgaEbrzG2eiMjO1ov5YlsGEF212jvDJGptjC0Oh1kZXZwygleRB6Y3rxra0exlxltEZ9HkUsNzZXcrp//AEIZoxCinMYi+sDl8+MHBB2ABdRvXMIKC0ifJyZXz5SPW67K5mgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoCg/SZw2dIp722AcGBUuIycExwuZUlTzZcuCvVW8wKA6ouFXqO7WnobxTSm5ilm7wyxNKmHKoq4fYnB1rsxB9oHD2a4S0wIiaa1msZpokd48tKkxV5ZJEdQjCSQFxoO2BvzFATg4YtkJ+IXM7zypC/jkCqscajWVRFACgkAk7k4G+woDl+j/sj6DBC87tLciBY9TY0xJz7qNQBpXPM82IyTyAAuFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgNc8QdWRhkMCpHsIwaA8/7IdtLBLX0G5u0jktzJasWZkBETPGjLKQBkooOxzQErw22s4Sk/wCU5ZUjB0iW8DRjbGWwRr2+8T586AgvpD49NdW8SWKK8Es8SNJIWRJ/Hq7qPbUyEISZMaSvq6snHqTb0cykorbLR2e7YQ3TdzIrW9zjJhl5n2xuPDKvtU5HUCvZRcX3EJxmtoslcnQoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKApPbfjLyP+TrZirMoa5lXYxxNnCKekr9Purk+VSVV82Q33KuO/crEUM1pd26WPcxJdKLWQyIXRe6DvCwUEZbHeIMncsKlyK1HuiDEtctpkD257JJFeshYTGSO1MskihZE7y47kmNYgqLkb7jbT1qBLabLUpakkWvtHw6SG+soDdSzQqk06pNoZkZFESnvAoZhiU+tk+2pMeO5kOXLVb+5tvrKOdNEqBhnIzzB6MpG6keYwavyipeTKhOUHuLOzs3x6a1mS1u5DLDKdEE7+urn1YZT9rODpfmTsd8E0LanB/Y1aMhWLv5L8KhLJmgFAKAUBjNAZoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAj+K8Zt7RC9zMkSgZ8bAHy2HM77YAoEUriX0kO2RZW23SS4JQH2iJQXx+tpNQTyIxNCnpt1ndrRDfwz4rnPfWv6voz6fn32ai/Fr4LX9Hl/y/t/7Jvgn0kgSCLiCJDlSwmQsYdiq+MEZi3Ybkkb4zmrFdimtmflYkseSUmWV+2vDV539qPfPH/vUhVODi30g2EcLtBcwTy4xHFFIju8jHCKAp6kjfoK9S32R43pbZRrDjlpb60nu4jO0jNOxJGqY+vvyAGygZ2CgVdrlXBa33My6u218+Pb2OviE0V5Ay208bSbPEyOrFZUIeM7H7yj99d2anFrZHUpVzTaI/jHGFvRe3yfZtbUleqvErzuh8iCcY9lVa4/RIvXS1ZBHf2p7TQDikjMzOUtIUjjjBdiZGeVyANl27rdiByryqyNe3I7ux7L9QrW2RNxxm7mPgCWyfCWX5+ov+KoLOpe0EaGN/089crX+x18MhkueGfWyF3dXdJDjUCHZoW2wMjCH4VfhudX1GFbqvIfDwmWnhH0gTTW8Uo4bcMXRST3lsqk43I1yhsE+YFZE8umD05eDYVM5eEfdz2+mj9exEeeXe3lsn4E14suuX5dv9j10yXk+4e2N5INUdlAR5+mBh81iNcTz6oed/wdRx5M+x2k4gf5raj33Ep/CKov6pT9zr8LMHj/ETyjtB+3Mf/iK5/qtfwz38JL5Phe03EU9e0tpR17ud0b4CSPHzIruPU6X52jx4s0WDs/2hivQ4QMkkZAlikGmRCRkZHIg9GUkHB32NX4zUlyj4K7TT0yYro8FAKAUAoBQCgFAKAUAoBQCgFADQFW7YcckjZLO1YC4mBYtgHuIRs0xB2Jz4VB2LewGob7lTDkzuuDm9I8k9ChkuWuVXUFJWN3JeRyDh5mdt2LHYdAoGOdU5Wz46k+/ubuBhw/1H+3/k76gNgwzAAkkADck7AAczXumzxtJbZe/o67Pj0eW4uEybtQoRxytwCEUg/eyzkf0gOlalVfCOj5LMyPWscvb2I634YlnO1g6KVC95bMyqS0GcGMkjxPGcDPMqyE75rJ6jVOD9SL7Mkxpprizj4lbI19bKEUCKOWbZQPGdESch0DSfHFW+hxcnKcmUuqy4wSRU3vVimu49LkR3DFiqsURZSrKzNyUFnI51Pl0ydjaNTpOZVDHjXPyb7nh8Un5yJG96g/vqipyXhm7Oiqa+qKIySw9HKxW0jxRXDlZUU5DDu2OxYEqSBjIPI1bryrFGXcycrpdDti0vLJSys44V0RIEXyHX3nr8aqSnKXk16qYVLUESHZnhEd9eyWtw0wRrfvE7pwi+F9MgYgasnWmN8bGreNGLjtruY3VLbYWaUuzX/wBN1vci0srgFi6Wz3EERONTrFI0UQ25sSAvtrZhPVW2fJW17v1E+b3ibW0Vvw6J9M4t1MjDBKKoVdgdtROefIAnyr5OulWSldJdt9j6vHr5yVaf6kRFw6JSToBY+sz+N2PmWbJNWHZJ/p9jYhi1Q8IytkqN3kOYZPvxYU/Eeq49jAinPl2l3X3OLcOqfdLT+UW7s1xk3CvHKAJosawvqsrZ0yLnocEY6EEe2s3KoVbUl4ZluMoScJeUTdVT0UBF8UjeGRL63XM0AIZRzlgJBkh9+2pfJlHma0MDK9KXF+GVsirmtryj0Dh17HcRRzRNqSRQ6kdQRkV9EZx00AoBQCgFAKAUAoBQCgFAKAUBy8Uv47aGSeU4SNSzH2Dy8z0xQHlnFJJUtLu8lytzcrnzMQfEcMQ9iBs/rFj1rDsu9fJil+VGhXXxh92QsMQRVRdgoAHuAwKkb2z6auKjFJGSTlVRS7uwREXGWZuQGdhyJydgATXVcHN6RFkXxphzkWXhPYG5mlX05YkgUhmjSQyNLjcIfCAEzjPPIGORNXq8dQe2YOX1F3Q4RWkej8QsUnjMUmdJwfCzIfCQwwykEbgVYMwi+2HDIZ7cvLIITBmVJ9vqmUHLHPNSMgr1BxXE4KceMvB7FtPaPPnkndba/wC5bIjeOaJQdZjZgUkRTvsVDaDvpcjmKz8DIrxb5Vt9vklzaJZFSfuaLPilrNYceQYckd6BhlbLQRxx5DAEFZU+Ga1rZRlJyXgq0RlGKi/JHRggAHngZ9+N6xZeT7mtNQW/g4uK+vbH+vH745BXdfiX6FfJ/NB/c76iLZ0dneNw2F8Z7jVhrVo4tIZiZe8Q92FHNn2xn7pq9jSSizA6xCXOL9j4seGTRxwy34DMJC0FpF4mkuZGZxrJ2ZgWOw8K4LE7VDbmTyH6NXj3Zmwx41N2y8stx7HiSD0eUEXrZuvSQmYlmOE7oNzKBAqaeqjPPlcjVGMFBeDyF0oz5op1zwy7tCi3yIplDsmg6lXQd42bkW04YHqCfI1Vuo4raNzC6h6snGz9j4VgRkEEHqNxVbXfTNVST7o3cGYrfwEfbSWNvaNIkHyKfvNR3rlRL7aMzqCSnGX6l7rJKooBQGvsdc+i3Ulido5tVxb+QbP8YiHs1MJAP6beVfSYGR6ten5RmZEOMt/JeavEAoBQCgFAKAUAoBQCgFAKAwaAoXaG+9OuhAhzbWrhpT9mW4GCkYPVY/WP9LSPsms7qGT6cOC8ss49fJ7fgi+2y5spD91omPuWVCf3Vk4X+sv3L8u2v1RXTV430YjneGWC4jAZoJVkCk41DDI656Eo7AHocVNRNQl3Kedju+rivK7o9c7OdpLe/VzAWDRkCRHUq6E7jIPMHowyDg71pJp90fLThKD4yXc7eKXjwprSF5jkArGUDAHm3jZQceWc16clY7Y3LT2cAeJ4u9u4VMcmnVpWTXuEYjBCZxnkagyZcapNfBJUtzR818oapRe3FqhvLd3yBJDJGSCyh2WSN1RyuNQxk6TsdPLatbBsl6Ukn7iquqV65/t+pqqQ30R/F/5E+VxF+8lf9akq9/0KuV4i/wD9L/J3MwAJJAA3JOwqNJssykl5PrgULXVzBJGhMETNI0hBCFgjKgTPr7tnI2251zfJV1yTfdmRlZEbWlDwizcYhkikS9tpCky93FgqjxsjzIGUhhlc6vWQg7DniounZDjP0/Zmfk1prkX0cSb0juPR5sfpsJ3Pq6uerVz8Pq8/nW+Z5z9qOHWc0Ie/RGigbv8ALkhVKA+I4O4wSNJyDnGDQLz2PJbmeOWeaa3iMMUjAohAU7KAz6B6mojOn54JNZ2TJOXY+l6XVOFf1+/g6uy8BlvGkHqW6FM9DLLpOPeqD/1BVLKlxq4+7/wR5lnO1RXiJdKyiAV6BQEV2iRxGLiAZmtnE8Y+8VzrT9uMuv7VXcG707e/hkF8OUD0Lh94k8Uc0Z1JIiup81YAg/I19KZh0UAoBQCgFAKAUAoBQCgFAVXtnxl1KWVq2meZSWcb9zCDhpf1j6q/0t+SmoMi+NMHJklcHOWkRfD7KO3jWKJdKKMAczzyST1JJJJ6k18vZZKyTlLyakIqK0hxKzE8MsLcpEZD+0CM0qnwmpfAktrRQbGRmQaxh1yjjydDpYfMZ9xFbMkt7Xg2MW31K0zfXBYO3s3xxbC8Ero7rPGYcRgFi4YPGMEgfpBknr7au4jb+kwes161Z+zLm3bx/s8NuiPa9op+XfGtH0Z/B89+Ir+SG4x2l9Nu7OF7ea3VGeYGbu8SSiNkSNTGzKcK8jbkHwjAqh1BThQ+xaxJwnNaZME4518ukzW3o5eKJA0TekiMxAZbvQpQAdTq2+NS1eopahvZzPjruVaLgVtM5FpcXELY1BHVjGVzjUqzrqK56q2OVaM7rqknbBa/ueV3y3/25s5OI8Fu4gNcK3KhlIMHhYMDlSY3O2D1DHz2rqvIql4en9y3+MlrVkd6+CS4X2T1kS3+HI3WAHMK+RfP5xvf4R5HnVe3MUfpq/kgssnc9z8fBbAMbCs9vb2zxdiB7a3jxW6CJdcjzwqiZxqKuJSM9PDG2/Sr/To8rt/BXypqNbbLAn0gKPztlcr5sncyqPgsms/Ba+g5oyVfB+5X/pD7aWtxBBBFNp7ydWkWRXiISMM4BDgc3EYx13rmxvi9F3D4Sujya0VqxjlvDptcac4acjMa+YX9I/sGw6nocyco1L6/4N6/N39NX8+xeeFcOjtolhiB0r1JyzE7szHqxO5NZNtsrZcmUYrSOuozoUAoBQH19H9x3Jn4eeUJ72D/AMPKSdI/UfWuOg0V9TiXerUn7+5lXQ4TaLnVkiFAKAUAoBQCgFAKAUBx8W4jHawyTynCRqWbqdhyA6k8gPM14Ch8FhkPeXVwPr7lu8cHfu0/koR7EU49pLHrXzmdkerZpeEaePXxjt+STqj57k4oCs9p+CJ9ZdpKIGVdUpZdUbhRsWUEEMBtqU55ZztV/FyH2ra38HislTucX+pWY57hFhNzb913x0riRX30lvEuxXYHzxWvdhyrjy2TYfWI5Fnpa7nzxt9MDyDnHiVf1o2Dj8MfGoceXGxaLfUYKeNNM9BbnX1CPzZ+SO49Zma3kVThwNcbdVkTxRsPcwH76itrjODT9yWix1zTR8397FcQWJl0iO6ntgysfCyudZQ+YJAGOtfIYVXHKa+Nn1N8t1L7lp4F2Git2DTSNcCNiYEkAEcK5JUKg2ZlGwdskDlitqNUIycku7KTnJruypfSLwk2M8fEY2jGJMAOJ3lkaQMGWScsRFCoYsF2UafcK8urVlbiz2uXGSZZDXyetdjWQrw9FAVi+m768YfYtk0f20gDOfgmgfttW3g1cK+Xu/8ABi9Tu7qCN9XDIMEZ5707nqbXg0cAIgungXaOZDKij1RIhAlAHTIZGx5hj1qh1GvlBT912Nrptze4MtFY5rCgFAKAUPCL4xI1u0V9GDqtiTIBza3bAnX4ABx7YxWj06/07OD8Mr5NfKO0eiwTK6q6EFWAZSORBGQR8K+gM42V6BQCgFAKAUAoBQCgKD2nu/TbwWy7wWjLJN5PcbNFH7QgOsj7xTyNZ/UMj06+K8v/AAWMevlLb8I6a+dNEUPRQFf7THvZLW15rI5lkH9XBpYD4yGL5GtnotHO3k/YzepW+nVr5IjtKc3kI6LBIw97SRrn5D99bPU5dkjz/puCdkn9iNvou90W45zOqfsA6pD/AHFb5iqGHXytWjd6xeqsaW/LL4TX0p+dgUCKb2Z4V6QmLtVeK2aW3gjYZXwuytIwOxbGlR5BT51n42JCM5Ta8s0srKk4xhF+xP217dw3MdpaXTJH3LSusiifQodUQIznUNRLbEkYTYCq/UbY40eSXdlnA5X7TJG64c04IurmedTzjZljiI8ikKrqHsYtWBZ1K2Xjsa0caC8ncBjYVnPb7ssaM0PT5dgASeQBJ9w3NepbejxvS2U7s9loBMfWnZ5znn9adSj4LpHwr6ZRUUo/CPlsmfOxs75plQanYKPNiAPmaa2QpNnEvHLY+pKH/wCWGk/yA0fbySKix+InJxHiyK0MyrLqhlVvzM4yjfVyDdPuOT+yKjsUbIOO13+6LeLXbVYm12LpZXsc6CSGRZEPJkII25j3+yvnp1yg9SWjfUlLwdFcHQr0CgFAYIzsaJ6ezzR0fR3OVims2/mspRP+Q4EkP91W0f2dfV41vqVqRk2R4yaLdU5wKAUAoBQCgFAKAi+1HEzaWdzcquowwvIB5lVJHwzQFQ4LYiCFE1a2OXdzzeRzqdz72JPyr5TJtdljkzWrioxSR3VXJDFAarq5SJGkkYKiAszHkAOtdwg5y1E8k+K2ypLxSWa6a4jsrl4+5WOI6EjyS5aQ4ldcA4THuNfRdOtqw4NWSWzIzqbMnXBEbxq7kN5G08DW4W2lPjkibI72Mk/VsQuPaamysmGTFen8l3otEsacub9jq4HwS8lf0tZI4VZNMQkiaWQRk5L41qFL7HBycActxVSPUI40uMVtnWdD8ZLbeo+xOycLvBul4hP3ZLdQp9mUYEe/evYddnv6o9ijLpNeuzNnCr4zK2tdEkbmORM5CuoB2PVSCrA+TCvoqLo3QU4mHkUuqfFnJ2fPiu0+7dP/AIljf8WruHv+p5b4i/sdHZ1Ncl1cH7cndIf6uEaf3yGU/Kvk+tXc7uPwfR9Np4UpvyydrGNAV4BXp6Q3a6YpZzAc5AsI98zLED/jq1hQ5XIhyJca2yJv2dRFBBgPK4iQkZCKFLM5HXSik46nArcnNQi5v2PnMer1rNG6Dhcet1trVLh4Tia5u3AjjbAbBdwSWwc6UGFyBtVSqq/IXOctJ+yNluun6Yo+jxWMHSeL2wPLRZ2ctyR+0rN/lFT/AIChfnf8s89eb8I7Yp5ESC4S8S7tppe4J7gwSRudQBIzv4hpKsoIznPSoMnAqjW5w8o7qvk5cZHFdX8FjfnvXEa3UIbkdJliYgnYesUZd+ukVTjCd9Gl3af9mTOUYT7+5IntJa9JSf1Ypm/BKiWDf/xOvXr+TV/Cm26d+fda3Z/+qu107I/4/wB0efiK/k2x8eRjhILtvdaXIHzZAK6XTb/j+55+JrOj02XpZXh/sgP8zCu/6Xb9jz8VA1m9uvs8MvD8Ldf80orpdKs+UcvKiS/Y3h1wtxc3VxCYBLHDGsbOjue7MpLt3ZKjPeAYyT4a1cSh018W9lW2znLki4VZIhQCgFAKAUAoBQHxJGGBVgCCCCDuCDzBFAVc/R9ZD8338Q6LFc3CIPYFD4A9gqN1QflI6U5L3PodhYByuLwf+alP4k1y8ep/7Ue+pP5MnsVH0urwf2+fxWufwtP/ABR760/kq3Huz6x39pCbi4lQRy3DpLIGTMbRrGSAo+0+d/u+yquZGFFW4LTfYlpcrJ/UzLXjSC5nkmaC1gkEIMSLJcTzZAKoHDKBqIQDSSTncYqLFwa3Wp2dzu2+XLUSs3nZq6uroyyI7W/dhVjurkJIG1ask20Z2B30gjfG+1drLxafpgjxV3S8klc8K9HRp7i1gnjjBd0E98ZCg3YqZJCpYDJwQM45ilWdTOajx1v9DyVE4reyct7dLe8nt4C3cGGCeNSzMFMhlVgpYkhToU46HPnUPVK4x4ySJMWbe0cViMXd6OheFviYVH+grZ6L3x0Y3Vv9VMcRnWAHuUDTztiNB60kpAUE+wAAluirWnZKMFso1Vytkl7ImOE9g7mCCOIcRbKjc9xEwySS2M74yTz3rDsw6rJcpLub0LpRWkdX8Erz/vBfjap/+6j/AKdR8HX4mwz/AARu+vEB8LWP/VjT+nUfA/E2GD2MuTz4nKP1YLYfihr1dPoX+0fiLPk0330evPGY5eJXTA4PqWo3VgynaIHYgHY9KlrxaoPlGOjiVspLTZBy8EubTiFss8scsZjnKMqFHLDuwda5K8jzHmdqrdQjxoehh1RjZtHLaRiWCwgcZjkvOJSyKeTtFNNo1D7QBYHB6qPKvcibhi7j8IkrSlb3LQihRhQAPIbCvnnJt9zR19iAXeCVB140h+UcUh/A/OvoE9YX7Ge1/wB79yX4Z/2vbbD/AIS6+H1lr8qh6T+WX7HeX5Rfq1ymZoBQGKAUAoDNAKAUAoBQCgFAKAUAoBQCgKDxnLcYk8lsYAPe89wT8wg+VZXVX9EV9y3iLuyCtXzb8OQfyvEr+Vh5iJ7wj5NoqfJfHEf6IjrW7f3LNXzZpkR2ulK2N0Rz7lwP1mGlR8yKsYkeV0V9yK56gzfGg9PvAOUKWtsP2IjIf/eHyrQ6tLvGJXxF2bKfxyPU/E7uCaSN4ECBo28JaKHWyMpBVsEgeYya1emVtYvJ9jOzpp3qOt7PUuyvZaC1VJsNJcNGuuaVjJJuAWAJ2Rc/ZUAVM5N+TqMVHskWOvDoUAoBQHy7gAkkAAZJPICgPMO3PbKxF3ZMlwriNplkMYaRU1IAMsgI9YAY571VzK5WVOMfJJTNRntkJa8WjW2srmMtJGnEb6PMaszFZxNIuFODzK1xbTKzH4e+kdRsjCzl7Er/AAlkY4Synx5yPDGPlrLfurNXTX/ukjuXUqkR9rPcSxDTHGJm4yoCFz3f/CdX059UZzjn0rWjQvQ9LfsQq5Sl6iPQuzXZpoJnurmUSzundjQpWOKPOoogJJOTglid8DYYxXdFEaY8Yiyxze2WWpjgUAoBQCgFAKAUAoBQCgFAKAUAoBQCgBoCl9ouEXS3xu7eITJJbpE6d4sbq8ckjK2X2KkSEeYx1qpl4vrpLetE1NvptlHjuZ0ThBigEj93xF2QyBApedMnXg5wSRy31VJZiu6v0kyL8QqXzZLek8Rf7NpF+1LMfwQVFDoEV5kcS6wvZHHxC2vJDbxzXETJJdW6siQFMgSq+NRkYj1c/CrC6XVj/WvJxDqEr3x12N0Vk0tzfytNII5bqQBEbQPqwsRYsuGydGNiOVWYYdVupzWyC/MsrfGDPu/4KvoUtpbBYw8bouc4BYbkncknz3NXXBcOMSjG1+pzl3J2LtndxYa6s0aMDxNbStI4xzbunjXI5nAJPsNU5USiaMMquT0XSwu4540liYOjqGVhyKkZBqEsnRQCgBoDy7tndm+vZbZz/FrUoGj+zLOyrJlx9pUDLhTtknyFR2S0ivkWOK0jWuwwNgOg2FQP5KDbIuVNNrf45wXtndgDokmiOQ/4ZT8DU8e8TQg+VRKYqAz/ALGjgcqq8LMygHjJySQANNg2dz7dqsw8GlSvoR6xDKrjUjBh5ggj5iuiU2UAoBQCgFAKAUAoBQCgFAKAUAoBQCgFADQFe4l2xtYJmgPeySJjWIYZZQpIyAzIpAbGDjOcEedcSnGP5meqLfhHl1hxXQOGkxytqtLraNGdlJus7qNx6uPfU1d0KnuTIL6ZWx4x8k03G/u2123ugcf5sVK+o46/3FRdPv8Ag1QcRMl9w5XhmhX0hnLTKqJ4LeZgM6jvnf4VHPLquWoMnpxLKnuaOTs1c3jQd4tnqWSSaZGMyoWSWV5FOkjbZutQ/wBUpp+h+USW9Pna+aO/8ryI6Jc2skPeOEVtcUiF25DwNqGfPTirVHUKrnxj5Kl/T7K1yZLVeKCZK/Rgf4ky9EurpF9ii4kwB7BWXNfUzdr/ACL9C3VydigFAeSyD+OcQ8/S2z/0ocfuxUFn5ihk/mICLtCJBk3NnbbnwyGSWYYJGGjXSFO3LJqCcnF9otlivDra3KRrn4xEicRjWaS69MsxGndwPpWVDIFXAGy/WFsnPXflU2POTj9cdE7jXX2i+xsWCMqqhOJ3GABl5RbofflkY/I1WfrtvvFDlix762c9rwy4VhGbS3Nqs0k8cMspfEkiKmWOlgwGGIBHNue1Tz3Kvjy7/KI/xVUZbSL/APRHC6/lDUI1HpKAJCuiJT3EROlf2hk9SCamqWoJHanz+r5PQqkPRQCgFAKAUAoBQCgFAKAUAoBQCgFAKAGgPPO2XZueHvbmwuLhXuLiItEkUUqBnMcbyeKMsAEXJ3wNNQzxqrZJzR0rZwT4kLZdj7mE5ju7seEpvDC3hLtIR4oz9p2Px8gKt2YVFi4yfYoxzb4vaj/Y7PyDen1ry8PuigX8Iaij0zDXx/J08/Jft/Y0X3YpbhQtyLqYA5xI8uM+eFwOpqxXiY0Py6IZZWTLyn/B9r2LiAC9zcEAYAM12VwNgMa8Yrv0Mfe9I4eRk613/g32XZSGBxJFZhXH2hGxbfn4iCaliqo+NIinK+XnZ3zW8iqzd1IdIJwI3JOBnAAGSfZXbsjryRxqnvWn/BYOwlg1vYW6SKVkZe9kB2IklJkcH3FiPhWa3tm3FaWifrw9FAKA8xv+GzDiF/iGQo8kUiMEcqdUEathgMEho22HLI86isWypkwbaaRn8nzfoZP+m/8AtUXFlbjP4Zn0Cb9FL/cf/anFnnCfwzH5Pm/Qyf3H/wBqcX8D05fDH5Pm/Qyf3H/2pxe/B7wl8Fh+jizeOCd5I2jaW6lbDqVbC4jU4O+CqA+7FWYrSNGtaikWyvTsUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAYoDNAKAh+KcZMTiNY2LaouekBleRUYLlhlgGHsGRnnQGgdqEYRmKN2MjAAeBSAWhBO7f1y/I0B8w9qVKgtBNq7pZDpVWUas6V16tOTjqRzHKgNs/aIId4pAFMmvPd6lCLqzp1bg4OD1xmgNN12nVVYrG4MbxrJqCnTql0MuEclmwGI05HL2igO+840kQVmVyDE0pxoOlF05J8W+7AeHNAccvamNSwMM2Uzr/NeEgSsR6+50xOdsjYDntQErPdYVyo3VQ2Xyse+ft45DG/lQEX+XHUK0kYAKkkAtqHi0oxBHhVzjGrfc59U4A+Iu0LmJZDEp1QRugjfVqldgmgEqAF1MBqPtyBjcD5uO0ThWaNEcdw8q+NlyYwhdW8J0nxHbyA89gOi94w8cjphMLGzqckk6SilcD7WXAx7RzzsBusOIyPKYpFQHuw+UYsMg6XXl0P4igJWgFAKAUAoBQCgFAKAUAoBQCgFAKAUAoBQCgFAKAUBoa2QtrKKW2GrSNWAcjfnsd6A1/k6Hf6mPfAPgXcLjT06YHyFAZFhCDnuo87jOhc4JJPTqd/fQGTZRbnu03bUfCu7EYLcueNs0BhLCEaSIoxpGFwijSM5wNthnf30Bn0GLb6pPDy8C7badtttgB7hQBbGIDSIkAxjARQMYYYxjyZv7x86A2zQq6lHUMpGCrAFSPIg7GgOeDhsCMHSGNWAwGVFBA32BAz1PzoDL8PhJyYYydOjJRSdP3eXq+ygDcOhOQYYzqUKcou6rjCnbcDA29lAfUdjEpysSA+Hkij1MaOnTAx5YoD7jgRWZlRQzY1EAAtjlk9aA3UAoBQCgFAKAUAoBQCgFAf/9k="
                                  alt="Model A"
                                />
                                <AvatarFallback>
                                  {reply.user !== "Model A" &&
                                    reply.user.charAt(0)}
                                </AvatarFallback>
                              </Avatar>

                              <div className="flex-1">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <div className="font-medium">
                                      {reply.user}
                                    </div>
                                    {reply.user === "Model A" && (
                                      <Badge className="ml-2 bg-purple-600">
                                        Teacher
                                      </Badge>
                                    )}
                                    {reply.isPinned && (
                                      <Badge className="ml-2 bg-green-600">
                                        Best Answer
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {reply.timestamp}
                                  </div>
                                </div>
                                <p className="mt-1 text-gray-700 dark:text-gray-300">
                                  {reply.content}
                                </p>
                                <div className="flex gap-2 mt-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2"
                                  >
                                    <ThumbsUp className="h-3.5 w-3.5 mr-1" />
                                    Helpful
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="notes" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-4">Lecture Notes</h3>
                      <Textarea
                        placeholder="Take notes while watching the lecture..."
                        className="min-h-[300px]"
                      />
                      <div className="flex justify-end mt-4">
                        <Button>Save Notes</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="rating" className="space-y-4">
                  <Card>
                    <CardContent className="pt-6 space-y-6">
                      <div>
                        <h3 className="font-semibold mb-4">Rate this lesson</h3>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="focus:outline-none"
                              onClick={() => setRating(star)}
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  rating >= star
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-4">
                          Rate Model A (Teacher)
                        </h3>
                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              className="focus:outline-none"
                              onClick={() => setMentorRating(star)}
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  mentorRating >= star
                                    ? "text-yellow-500 fill-yellow-500"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-2">
                          Feedback (Optional)
                        </h3>
                        <Textarea
                          placeholder="Tell us how we can improve this lesson..."
                          className="min-h-[100px]"
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button>Submit Feedback</Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="lg:w-1/4">
              <div className="sticky top-20 space-y-6">
                {/* Model B Assessment Panel */}
                <ModelBAssessmentPanel
                  isAvailable={true}
                  lecturesRemaining={lecturesRemaining}
                  subject={subject as string}
                  topic={topic as string}
                  subtopic={subtopic as string}
                />

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4">Related Topics</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href="#"
                          className="text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          Introduction to {formattedTopic}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#"
                          className="text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          Advanced {formattedSubtopic}
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#"
                          className="text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          Applications of {formattedSubtopic}
                        </Link>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-4">Resources</h3>
                    <ul className="space-y-2">
                      <li>
                        <Link
                          href="#"
                          className="text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          Download Slides
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#"
                          className="text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          Practice Problems
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="#"
                          className="text-purple-600 dark:text-purple-400 hover:underline"
                        >
                          Reference Materials
                        </Link>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Redirect message
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Redirecting to Next Lecture
            </h2>
            <p className="mb-4">
              You'll be redirected to the next lecture momentarily...
            </p>
            <Button
              onClick={() =>
                router.push(`/classroom/${subject}/${topic}/${subtopic}-2`)
              }
            >
              Continue Learning
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

