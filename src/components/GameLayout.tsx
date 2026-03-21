import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Icon from "@/components/ui/icon"

export type GameStep = {
  id: number
  scene: string
  emoji: string
  question: string
  answers: { text: string; correct: boolean; feedback: string }[]
}

type GameConfig = {
  title: string
  emoji: string
  bgColor: string
  cardColor: string
  btnColor: string
  btnText: string
  barColor: string
  dotColor: string
  mascot: string
  mascotImg: string
  mascotName: string
  mascotPhrase: string
}

type Props = {
  steps: GameStep[]
  config: GameConfig
}

export function GameLayout({ steps, config }: Props) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [feedback, setFeedback] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [finished, setFinished] = useState(false)
  const [showPop, setShowPop] = useState(false)

  const step = steps[currentStep]

  const handleAnswer = (index: number) => {
    if (selected !== null) return
    const answer = step.answers[index]
    setSelected(index)
    setIsCorrect(answer.correct)
    setFeedback(answer.feedback)
    if (answer.correct) {
      setScore((s) => s + 1)
      setShowPop(true)
      setTimeout(() => setShowPop(false), 600)
    }
  }

  const handleNext = () => {
    if (currentStep + 1 >= steps.length) {
      setFinished(true)
    } else {
      setCurrentStep((s) => s + 1)
      setSelected(null)
      setFeedback("")
      setIsCorrect(null)
    }
  }

  const handleRestart = () => {
    setCurrentStep(0)
    setScore(0)
    setSelected(null)
    setFeedback("")
    setIsCorrect(null)
    setFinished(false)
  }

  const stars = score >= steps.length ? 3 : score >= Math.ceil(steps.length / 2) ? 2 : 1
  const letters = ["А", "Б", "В"]

  return (
    <div className={`min-h-screen flex flex-col ${config.bgColor} relative overflow-hidden`}>

      {/* Декоративные облака-кружки */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-16 -left-16 w-48 h-48 rounded-full bg-white/30" />
        <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white/20" />
        <div className="absolute bottom-20 -left-10 w-40 h-40 rounded-full bg-white/25" />
        <div className="absolute -bottom-10 right-20 w-56 h-56 rounded-full bg-white/20" />
        <div className="absolute top-1/3 left-1/2 w-24 h-24 rounded-full bg-white/15" />
        {/* Звёздочки */}
        <div className="absolute top-16 left-1/4 text-2xl float" style={{ animationDelay: "0s" }}>⭐</div>
        <div className="absolute top-32 right-1/4 text-xl float" style={{ animationDelay: "1s" }}>✨</div>
        <div className="absolute bottom-40 right-10 text-2xl float" style={{ animationDelay: "0.5s" }}>🌟</div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-4 pb-2">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white font-black text-sm cartoon-border cartoon-press"
          style={{ color: "#2d1b69" }}
        >
          <Icon name="ArrowLeft" size={16} />
          Назад
        </button>

        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white cartoon-border">
          <span className="text-xl">{config.emoji}</span>
          <span className="font-black text-sm" style={{ color: "#2d1b69" }}>{config.title}</span>
        </div>

        <div className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl ${config.btnColor} cartoon-border`}>
          <span className="text-lg">⭐</span>
          <span className={`font-black text-sm ${config.btnText}`}>
            {score}/{steps.length}
          </span>
          {showPop && <span className="pop-in text-base">+1</span>}
        </div>
      </header>

      {/* Progress */}
      {!finished && (
        <div className="relative z-10 px-4 py-2">
          <div className="flex gap-2 mb-1">
            {steps.map((_, i) => (
              <div key={i} className="relative h-4 flex-1 rounded-full bg-white cartoon-border-sm overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${config.barColor}`}
                  style={{ width: i < currentStep ? "100%" : i === currentStep ? "55%" : "0%" }}
                />
              </div>
            ))}
          </div>
          <p className="text-center text-xs font-black" style={{ color: "#2d1b69" }}>
            Вопрос {currentStep + 1} из {steps.length}
          </p>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-4">
        {finished ? (
          /* ===== ФИНАЛЬНЫЙ ЭКРАН ===== */
          <div className="w-full max-w-md pop-in">
            <div className="bg-white rounded-3xl p-8 text-center cartoon-border shadow-none">
              {/* Персонаж */}
              <div className="relative mx-auto w-32 h-32 mb-2 float">
                <img
                  src={config.mascotImg}
                  alt={config.mascotName}
                  className="w-full h-full object-contain drop-shadow-lg"
                />
              </div>
              <div className="text-5xl mb-3 animate-bounce">
                {stars === 3 ? "🏆" : stars === 2 ? "🥈" : "🎖️"}
              </div>

              <h2 className="font-black text-3xl mb-1" style={{ color: "#2d1b69" }}>
                {score === steps.length ? "Ура! Супер!" : score >= Math.ceil(steps.length / 2) ? "Молодец!" : "Не сдавайся!"}
              </h2>

              <p className="font-bold text-sm mb-4" style={{ color: "#5b4299" }}>
                Правильных ответов: {score} из {steps.length}
              </p>

              <div className="flex justify-center gap-3 mb-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-4xl stars-rain ${i < stars ? "opacity-100" : "opacity-20 grayscale"}`}
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    ⭐
                  </span>
                ))}
              </div>

              <div
                className="rounded-2xl px-4 py-3 mb-6 cartoon-border-sm"
                style={{ background: "#fef9c3" }}
              >
                <p className="font-bold text-sm leading-relaxed" style={{ color: "#2d1b69" }}>
                  {score === steps.length
                    ? "Ты настоящий чемпион безопасности! Расскажи друзьям эти правила 🎉"
                    : "Потренируйся ещё — и ты запомнишь все важные правила! 💪"}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleRestart}
                  className={`w-full py-4 rounded-2xl font-black text-base cartoon-border cartoon-press ${config.btnColor} ${config.btnText}`}
                >
                  🔄 Играть снова!
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full py-4 rounded-2xl bg-white font-black text-base cartoon-border cartoon-press"
                  style={{ color: "#2d1b69" }}
                >
                  🎮 Другие игры
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ===== ИГРОВОЙ ЭКРАН ===== */
          <div className="w-full max-w-2xl">
            {/* Персонаж с репликой */}
            <div className="flex items-end gap-3 mb-3">
              <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 float">
                <img
                  src={config.mascotImg}
                  alt={config.mascotName}
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <div className="relative bg-white rounded-3xl rounded-bl-sm px-4 py-3 cartoon-border flex-1">
                {/* хвостик пузыря */}
                <div className="absolute -left-3 bottom-3 w-4 h-4 bg-white border-l-[3px] border-b-[3px] border-[#2d1b69]"
                  style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />
                <p className="font-black text-xs md:text-sm" style={{ color: "#2d1b69" }}>
                  {config.mascotPhrase}
                </p>
              </div>
            </div>

            {/* Карточка сцены */}
            <div className="bg-white rounded-3xl p-5 mb-4 cartoon-border text-center">
              <div className="text-5xl mb-3 wiggle">{step.emoji}</div>
              <p className="font-bold text-sm md:text-base leading-relaxed mb-3" style={{ color: "#2d1b69" }}>
                {step.scene}
              </p>
              <div className="rounded-2xl px-4 py-3 cartoon-border-sm" style={{ background: "#fef9c3" }}>
                <p className="font-black text-base md:text-lg" style={{ color: "#2d1b69" }}>
                  {step.question}
                </p>
              </div>
            </div>

            {/* Варианты ответов */}
            <div className="space-y-3 mb-4">
              {step.answers.map((answer, i) => {
                let cardBg = "bg-white"
                let textColor = "text-[#2d1b69]"
                let borderStyle = "cartoon-border"
                let extra = ""

                if (selected !== null) {
                  if (i === selected && answer.correct) {
                    cardBg = "bg-green-100"
                    textColor = "text-green-800"
                    borderStyle = ""
                    extra = "border-4 border-green-500 shadow-[4px_4px_0px_#16a34a]"
                  } else if (i === selected && !answer.correct) {
                    cardBg = "bg-red-100"
                    textColor = "text-red-800"
                    borderStyle = ""
                    extra = "border-4 border-red-500 shadow-[4px_4px_0px_#dc2626]"
                  } else if (answer.correct) {
                    cardBg = "bg-green-50"
                    textColor = "text-green-700"
                    borderStyle = ""
                    extra = "border-2 border-green-400 shadow-[2px_2px_0px_#86efac] opacity-80"
                  } else {
                    cardBg = "bg-white"
                    textColor = "text-gray-400"
                    borderStyle = ""
                    extra = "border-2 border-gray-200 shadow-[2px_2px_0px_#e5e7eb] opacity-50"
                  }
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(i)}
                    disabled={selected !== null}
                    className={`w-full text-left px-4 py-4 rounded-2xl flex items-center gap-3 font-bold text-sm md:text-base transition-transform duration-150 ${cardBg} ${textColor} ${borderStyle} ${extra} ${selected === null ? "hover:scale-[1.02] cartoon-press cursor-pointer" : ""}`}
                  >
                    <span
                      className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm ${config.btnColor} ${config.btnText} cartoon-border-sm`}
                    >
                      {letters[i]}
                    </span>
                    <span className="flex-1">{answer.text}</span>
                    {selected !== null && i === selected && (
                      <span className="flex-shrink-0 text-xl pop-in">{answer.correct ? "✅" : "❌"}</span>
                    )}
                    {selected !== null && answer.correct && i !== selected && (
                      <span className="flex-shrink-0 text-xl">✅</span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Фидбек */}
            {feedback && (
              <div
                className={`rounded-2xl px-4 py-4 mb-4 cartoon-border-sm font-bold text-sm leading-relaxed pop-in ${
                  isCorrect ? "bg-green-100" : "bg-red-50"
                }`}
                style={{ color: "#2d1b69" }}
              >
                <span className="mr-2 text-lg">{isCorrect ? "🎉" : "💡"}</span>
                {feedback}
              </div>
            )}

            {selected !== null && (
              <button
                onClick={handleNext}
                className={`w-full py-4 rounded-2xl font-black text-base cartoon-border cartoon-press ${config.btnColor} ${config.btnText} pop-in`}
              >
                {currentStep + 1 >= steps.length ? "🎉 Узнать результат!" : "Вперёд! →"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}