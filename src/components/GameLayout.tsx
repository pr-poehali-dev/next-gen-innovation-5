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
  accentFrom: string
  accentTo: string
  accentBtn: string
  accentBtnHover: string
  accentBar: string
  starsColor: string
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

  const step = steps[currentStep]

  const handleAnswer = (index: number) => {
    if (selected !== null) return
    const answer = step.answers[index]
    setSelected(index)
    setIsCorrect(answer.correct)
    setFeedback(answer.feedback)
    if (answer.correct) setScore((s) => s + 1)
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

  return (
    <div className={`min-h-screen flex flex-col bg-gradient-to-br ${config.accentFrom} ${config.accentTo}`}
      style={{ fontFamily: "'Nunito', sans-serif" }}>

      {/* Декоративные кружки фона */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-5 py-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 hover:bg-white/25 transition-all text-white font-bold text-sm backdrop-blur-sm"
        >
          <Icon name="ArrowLeft" size={16} />
          Назад
        </button>

        <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-sm">
          <span className="text-xl">{config.emoji}</span>
          <span className="font-extrabold text-white text-sm">{config.title}</span>
        </div>

        <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white/15 backdrop-blur-sm">
          <span className="text-yellow-300 text-sm">⭐</span>
          <span className="font-extrabold text-white text-sm">{score}/{steps.length}</span>
        </div>
      </header>

      {/* Progress bar */}
      {!finished && (
        <div className="relative z-10 px-5 pb-2">
          <div className="flex gap-1.5 mb-1">
            {steps.map((_, i) => (
              <div key={i} className="relative h-3 flex-1 rounded-full bg-white/20 overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-700 ${config.accentBar}`}
                  style={{ width: i < currentStep ? "100%" : i === currentStep ? "50%" : "0%" }}
                />
              </div>
            ))}
          </div>
          <p className="text-white/60 text-xs font-bold text-center">
            Вопрос {currentStep + 1} из {steps.length}
          </p>
        </div>
      )}

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-6">
        {finished ? (
          /* ===== ФИНАЛЬНЫЙ ЭКРАН ===== */
          <div className="w-full max-w-md">
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 text-center border border-white/20 shadow-2xl">
              <div className="text-8xl mb-4 animate-bounce">
                {stars === 3 ? "🏆" : stars === 2 ? "🥈" : "🎖️"}
              </div>

              <h2 className="font-black text-white text-3xl mb-1">
                {score === steps.length ? "Супер!" : score >= Math.ceil(steps.length / 2) ? "Молодец!" : "Не сдавайся!"}
              </h2>

              <p className="text-white/70 font-bold text-sm mb-4">
                Правильных ответов: {score} из {steps.length}
              </p>

              <div className="flex justify-center gap-2 mb-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <span
                    key={i}
                    className={`text-4xl transition-all duration-500 ${i < stars ? "opacity-100 scale-110" : "opacity-20 grayscale"}`}
                    style={{ transitionDelay: `${i * 100}ms` }}
                  >
                    ⭐
                  </span>
                ))}
              </div>

              <p className="text-white/80 text-sm font-semibold leading-relaxed mb-8 bg-white/10 rounded-2xl px-4 py-3">
                {score === steps.length
                  ? "Ты настоящий чемпион безопасности! Расскажи друзьям эти правила 🎉"
                  : "Потренируйся ещё — и ты запомнишь все важные правила! 💪"}
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={handleRestart}
                  className={`w-full py-4 rounded-2xl font-black text-base transition-all active:scale-95 shadow-lg ${config.accentBtn} ${config.accentBtnHover}`}
                >
                  🔄 Играть снова!
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="w-full py-4 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-black text-base transition-all active:scale-95"
                >
                  🎮 Другие игры
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ===== ИГРОВОЙ ЭКРАН ===== */
          <div className="w-full max-w-2xl">
            {/* Карточка сцены */}
            <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 mb-5 border border-white/20 text-center shadow-xl">
              <div className="text-6xl mb-3">{step.emoji}</div>
              <p className="text-white font-bold text-base md:text-lg leading-relaxed mb-4">
                {step.scene}
              </p>
              <div className="bg-white/15 rounded-2xl px-4 py-3">
                <p className="text-white font-extrabold text-lg md:text-xl">
                  {step.question}
                </p>
              </div>
            </div>

            {/* Варианты ответов */}
            <div className="space-y-3 mb-5">
              {step.answers.map((answer, i) => {
                const letters = ["А", "Б", "В"]
                let cls = "w-full text-left px-5 py-4 rounded-2xl border-2 transition-all duration-300 font-bold text-sm md:text-base flex items-center gap-3 "

                if (selected === null) {
                  cls += "border-white/25 bg-white/10 text-white hover:bg-white/20 hover:border-white/40 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                } else if (i === selected) {
                  cls += answer.correct
                    ? "border-green-400 bg-green-500/30 text-white scale-[1.02]"
                    : "border-red-400 bg-red-500/30 text-white"
                } else if (answer.correct) {
                  cls += "border-green-400/50 bg-green-500/15 text-white/70"
                } else {
                  cls += "border-white/10 bg-white/5 text-white/30"
                }

                return (
                  <button key={i} className={cls} onClick={() => handleAnswer(i)}>
                    <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-sm">
                      {letters[i]}
                    </span>
                    <span className="flex-1">{answer.text}</span>
                    {selected !== null && i === selected && (
                      <span className="flex-shrink-0 text-xl">{answer.correct ? "✅" : "❌"}</span>
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
              <div className={`rounded-2xl px-5 py-4 mb-5 border-2 font-bold text-sm leading-relaxed ${
                isCorrect
                  ? "bg-green-500/20 border-green-400/50 text-white"
                  : "bg-red-500/20 border-red-400/50 text-white"
              }`}>
                <span className="mr-2">{isCorrect ? "✅" : "💡"}</span>
                {feedback}
              </div>
            )}

            {selected !== null && (
              <button
                onClick={handleNext}
                className={`w-full py-4 rounded-2xl font-black text-base transition-all active:scale-95 shadow-lg ${config.accentBtn} ${config.accentBtnHover}`}
              >
                {currentStep + 1 >= steps.length ? "🎉 Узнать результат!" : "Следующий вопрос →"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
