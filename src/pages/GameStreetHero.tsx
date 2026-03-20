import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Icon from "@/components/ui/icon"

type Step = {
  id: number
  scene: string
  emoji: string
  question: string
  answers: { text: string; correct: boolean; feedback: string }[]
}

const steps: Step[] = [
  {
    id: 1,
    scene: "Ты стоишь у дороги. Светофор показывает красный сигнал для пешеходов.",
    emoji: "🚦",
    question: "Что ты будешь делать?",
    answers: [
      { text: "Подожду зелёного сигнала", correct: true, feedback: "Правильно! Красный — стой, зелёный — иди. Это главное правило пешехода." },
      { text: "Перебегу быстро — машин почти нет", correct: false, feedback: "Нельзя! Даже если машин мало, на красный переходить опасно." },
      { text: "Пойду, если взрослые рядом идут", correct: false, feedback: "Нельзя идти за взрослыми на красный. Жди зелёного сигнала!" },
    ],
  },
  {
    id: 2,
    scene: "Ты едешь на велосипеде по тротуару и хочешь пересечь дорогу.",
    emoji: "🚲",
    question: "Как правильно пересечь дорогу?",
    answers: [
      { text: "Слезу с велосипеда и перейду пешком", correct: true, feedback: "Молодец! При переходе дороги велосипедист должен спешиться." },
      { text: "Проеду быстро на велосипеде", correct: false, feedback: "Нельзя! На велосипеде дорогу не переезжают — нужно слезть и перейти пешком." },
      { text: "Посмотрю на машины и проеду", correct: false, feedback: "Нет! Даже при свободной дороге нужно слезть с велосипеда и перейти пешком." },
    ],
  },
  {
    id: 3,
    scene: "Ты идёшь по тротуару вдоль дороги. Нет тротуара — только обочина.",
    emoji: "🚶",
    question: "С какой стороны идти по обочине?",
    answers: [
      { text: "Навстречу движению машин (лицом к ним)", correct: true, feedback: "Верно! По обочине нужно идти навстречу машинам — так ты видишь транспорт." },
      { text: "По ходу движения машин (спиной к ним)", correct: false, feedback: "Неверно! Идя спиной к машинам, ты не видишь опасность сзади." },
      { text: "Посередине дороги", correct: false, feedback: "Очень опасно! Никогда не ходи по середине дороги." },
    ],
  },
  {
    id: 4,
    scene: "Ты вышел из автобуса. Нужно перейти дорогу на другую сторону.",
    emoji: "🚌",
    question: "Как правильно переходить?",
    answers: [
      { text: "Обойду автобус спереди и перейду", correct: false, feedback: "Нельзя! Спереди автобус закрывает обзор водителям, это опасно." },
      { text: "Подожду, пока автобус уедет, и перейду по зебре", correct: true, feedback: "Правильно! Нужно подождать, пока автобус уедет, и только тогда переходить." },
      { text: "Обойду сзади и перейду", correct: false, feedback: "Нельзя! Сзади автобуса тоже плохой обзор. Жди, пока он уедет." },
    ],
  },
  {
    id: 5,
    scene: "Ты потерялся в большом городе и не знаешь, где находишься.",
    emoji: "🆘",
    question: "Что нужно сделать в первую очередь?",
    answers: [
      { text: "Пойти искать дом самостоятельно", correct: false, feedback: "Не стоит! Ты можешь заблудиться ещё больше. Лучше попроси помощи у взрослых." },
      { text: "Обратиться к полицейскому или охраннику, позвонить родителям", correct: true, feedback: "Отлично! Полицейский или охранник помогут. Позвони родителям или на 112." },
      { text: "Попросить помощи у первого встречного", correct: false, feedback: "Лучше обратиться к полицейскому, охраннику или продавцу в магазине — это безопаснее." },
    ],
  },
]

export default function GameStreetHero() {
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

  const stars = score >= 5 ? 3 : score >= 3 ? 2 : 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-950 via-indigo-950 to-slate-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <Icon name="ArrowLeft" size={18} />
          <span className="font-mono text-sm">Назад</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚦</span>
          <span className="font-sans text-white font-medium">Герой улицы</span>
        </div>
        <div className="font-mono text-sm text-white/60">
          {score}/{steps.length} ✓
        </div>
      </header>

      {/* Progress */}
      {!finished && (
        <div className="px-6 pt-4">
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i < currentStep ? "bg-blue-400" : i === currentStep ? "bg-blue-400/60" : "bg-white/10"
                }`}
              />
            ))}
          </div>
          <p className="mt-2 font-mono text-xs text-white/40">Вопрос {currentStep + 1} из {steps.length}</p>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        {finished ? (
          <div className="text-center max-w-md">
            <div className="text-7xl mb-6">
              {stars === 3 ? "🏆" : stars === 2 ? "🥈" : "🎖️"}
            </div>
            <h2 className="font-sans text-4xl font-light text-white mb-2">
              {score === steps.length ? "Герой улицы!" : score >= 3 ? "Хорошая работа!" : "Учись дальше!"}
            </h2>
            <p className="text-white/60 font-mono text-sm mb-2">
              Правильных ответов: {score} из {steps.length}
            </p>
            <div className="flex justify-center gap-1 mb-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <span key={i} className={`text-3xl ${i < stars ? "opacity-100" : "opacity-20"}`}>⭐</span>
              ))}
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-8">
              {score === steps.length
                ? "Ты знаешь все правила дороги! Будь осторожен и внимателен на улице."
                : "Повторяй правила дорожного движения — это спасёт тебе жизнь!"}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={handleRestart}
                className="px-6 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-400 transition-colors"
              >
                Играть снова
              </button>
              <button
                onClick={() => navigate("/")}
                className="px-6 py-3 rounded-xl border border-white/20 text-white/80 font-medium hover:bg-white/10 transition-colors"
              >
                Другие игры
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-2xl">
            {/* Scene */}
            <div className="mb-8 text-center">
              <div className="text-6xl mb-4">{step.emoji}</div>
              <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-5 mb-6">
                <p className="text-white/90 text-base md:text-lg leading-relaxed">{step.scene}</p>
              </div>
              <h3 className="text-white font-sans text-xl md:text-2xl font-light">{step.question}</h3>
            </div>

            {/* Answers */}
            <div className="space-y-3 mb-6">
              {step.answers.map((answer, i) => {
                let btnClass = "w-full text-left px-5 py-4 rounded-xl border transition-all duration-300 font-sans text-sm md:text-base "
                if (selected === null) {
                  btnClass += "border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 cursor-pointer"
                } else if (i === selected) {
                  btnClass += answer.correct
                    ? "border-green-400 bg-green-500/20 text-white"
                    : "border-red-400 bg-red-500/20 text-white"
                } else if (answer.correct) {
                  btnClass += "border-green-400/40 bg-green-500/10 text-white/60"
                } else {
                  btnClass += "border-white/10 bg-white/3 text-white/30"
                }

                return (
                  <button key={i} className={btnClass} onClick={() => handleAnswer(i)}>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-white/40 shrink-0">{String.fromCharCode(65 + i)}</span>
                      <span>{answer.text}</span>
                      {selected !== null && i === selected && (
                        <span className="ml-auto shrink-0">{answer.correct ? "✅" : "❌"}</span>
                      )}
                      {selected !== null && answer.correct && i !== selected && (
                        <span className="ml-auto shrink-0">✅</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`rounded-xl px-5 py-4 mb-6 border ${isCorrect ? "bg-green-500/15 border-green-400/30" : "bg-red-500/15 border-red-400/30"}`}>
                <p className="text-white/90 text-sm leading-relaxed">{feedback}</p>
              </div>
            )}

            {selected !== null && (
              <div className="text-center">
                <button
                  onClick={handleNext}
                  className="px-8 py-3 rounded-xl bg-blue-500 text-white font-medium hover:bg-blue-400 transition-colors"
                >
                  {currentStep + 1 >= steps.length ? "Узнать результат" : "Следующий вопрос →"}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
