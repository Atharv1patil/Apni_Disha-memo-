"use client"

import { useState, useEffect } from "react"
import { ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"
import { useUser } from "@clerk/clerk-react"

const slides = [
  {
    id: 0,
    title: "Welcome",
    subtitle: "Let's create your profile",
    message: "We'll gather some information to help personalize your experience.",
    type: "intro",
  },
  {
    id: 1,
    title: "Full Name",
    subtitle: "What should we call you?",
    message: "Enter your full name as you'd like it displayed.",
    type: "input",
    field: "name",
    placeholder: "Enter your full name",
  },
  {
    id: 2,
    title: "Email Address",
    subtitle: "How can we reach you?",
    message: "We'll use this to send you important updates.",
    type: "input",
    field: "email",
    placeholder: "your@email.com",
  },
  {
    id: 3,
    title: "Current Class",
    subtitle: "What level are you at?",
    message: "Select your current class level.",
    type: "input",
    field: "class",
    placeholder: "9, 10, 11, 12",
  },
  {
    id: 4,
    title: "Academic Grade",
    subtitle: "Your current or target grade",
    message: "What grade are you aiming for?",
    type: "input",
    field: "grade",
    placeholder: "A+, A, B, C",
  },
  {
    id: 5,
    title: "Educational Institution",
    subtitle: "Where do you study?",
    message: "Enter the name of your school or college.",
    type: "input",
    field: "school",
    placeholder: "School Name",
  },
  {
    id: 6,
    title: "Hobbies & Interests",
    subtitle: "What do you enjoy?",
    message: "Share your hobbies and creative pursuits.",
    type: "input",
    field: "hobbies",
    placeholder: "Drawing, Gaming, Reading",
  },
  {
    id: 7,
    title: "Extracurricular Activities",
    subtitle: "What clubs or teams are you in?",
    message: "Tell us about your involvement outside the classroom.",
    type: "input",
    field: "extracurriculars",
    placeholder: "Debate Club, Football Team",
  },
  {
    id: 8,
    title: "Key Interests",
    subtitle: "What subjects fascinate you?",
    message: "Which fields or topics capture your curiosity?",
    type: "input",
    field: "interests",
    placeholder: "Science, Technology, Arts",
  },
  {
    id: 9,
    title: "Sports & Recreation",
    subtitle: "What sports do you play?",
    message: "Share the physical activities you participate in.",
    type: "input",
    field: "sports",
    placeholder: "Cricket, Badminton, Basketball",
  },
  {
    id: 10,
    title: "Profile Complete",
    subtitle: "You're all set!",
    message: "Your profile has been successfully created.",
    type: "success",
  },
]

export default function ProfileFormPage() {
  const navigate = useNavigate()
  const { user, isLoaded } = useUser()

  const [currentSlide, setCurrentSlide] = useState(0)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    class: "",
    grade: "",
    school: "",
    hobbies: "",
    extracurriculars: "",
    interests: "",
    sports: "",
  })

  const slide = slides[currentSlide]

  useEffect(() => {
    if (!isLoaded || !user) return

    const checkProfile = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8080/api/students/check/${user.id}`)
        const data = await res.json()

        console.log("🔍 Backend check profile:", data)

        if (data.exists) {
          console.log("➡️ Profile exists → redirect home")
          navigate("/", { replace: true })
        }
      } catch (err) {
        console.error("❌ Profile check error:", err)
      }
    }

    checkProfile()
  }, [user, isLoaded, navigate])

  const handleInputChange = (e) => {
    setFormData((p) => ({
      ...p,
      [e.target.name]: e.target.value,
    }))
  }

  const isInputValid = () => {
    if (slide.type !== "input") return true
    return formData[slide.field]?.trim() !== ""
  }

  const handleNext = async () => {
    if (currentSlide < slides.length - 1) {
      return setCurrentSlide((prev) => prev + 1)
    }

    try {
      const payload = {
        user_id: user.id,
        ...formData,
      }

      console.log("📤 Sending to backend:", payload)

      const res = await fetch("http://127.0.0.1:8080/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      console.log("📥 Backend response:", data)

      localStorage.setItem("apnidisha_student_profile", JSON.stringify(payload))
      console.log("💾 Saved to localStorage!")

      navigate("/", { replace: true })
    } catch (err) {
      console.error("❌ Profile submit error:", err)
    }
  }

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide((prev) => prev - 1)
  }

  const progress = Math.round(((currentSlide + 1) / slides.length) * 100)

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-3 text-xs font-semibold text-slate-600">
            <p>
              Step {currentSlide + 1} of {slides.length}
            </p>
            <p>{progress}%</p>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="h-full bg-blue-600 transition-all duration-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-12">
          {/* INTRO */}
          {slide.type === "intro" && (
            <div className="text-center space-y-6 py-8">
              <h1 className="text-4xl font-bold text-slate-900">{slide.title}</h1>
              <p className="text-lg text-slate-600 font-medium">{slide.subtitle}</p>
              <p className="text-base text-slate-500">{slide.message}</p>
            </div>
          )}

          {/* INPUT SLIDE */}
          {slide.type === "input" && (
            <div className="space-y-7 py-6">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">{slide.title}</h2>
                <p className="text-slate-600 font-medium mt-2">{slide.subtitle}</p>
              </div>

              <Input
                type={slide.field === "email" ? "email" : "text"}
                name={slide.field}
                placeholder={slide.placeholder}
                value={formData[slide.field]}
                onChange={handleInputChange}
                className="h-12 rounded-lg text-base border border-slate-300 focus:border-blue-500 focus:ring-blue-50 transition-colors"
              />
            </div>
          )}

          {/* SUCCESS */}
          {slide.type === "success" && (
            <div className="text-center py-8 space-y-6">
              <CheckCircle2 className="w-20 h-20 text-blue-600 mx-auto" />
              <h1 className="text-4xl font-bold text-slate-900">{slide.title}</h1>
              <p className="text-lg text-slate-600 font-medium">{slide.subtitle}</p>
              <p className="text-base text-slate-500">{slide.message}</p>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-12 gap-4">
            <Button
              onClick={handlePrev}
              disabled={currentSlide === 0}
              variant="outline"
              className="px-6 py-2 text-slate-700 border-slate-300 hover:bg-slate-50 bg-transparent"
            >
              <ChevronLeft className="w-5 h-5" /> Back
            </Button>

            <Button
              onClick={handleNext}
              disabled={!isInputValid()}
              className="px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
            >
              {currentSlide === slides.length - 1 ? (
                "Finish"
              ) : (
                <>
                  Next <ChevronRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mt-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`rounded-full transition-all duration-300 ${
                i === currentSlide ? "bg-blue-600 w-8 h-2" : "bg-slate-300 w-2 h-2 hover:bg-slate-400"
              }`}
            />
          ))}
        </div>
      </div>
    </main>
  )
}
