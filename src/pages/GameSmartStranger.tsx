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
    scene: "На улице к тебе подходит незнакомый мужчина и говорит: «Садись в машину, я отвезу тебя домой, я знаю твоих родителей».",
    emoji: "🚗",
    question: "Что ты сделаешь?",
    answers: [
      { text: "Сяду — он же знает моих родителей", correct: false, feedback: "Нельзя! Незнакомцы могут говорить что угодно. Никогда не садись в машину к чужим людям." },
      { text: "Откажусь, отойду к людям и позвоню родителям", correct: true, feedback: "Правильно! Откажись, уйди в людное место и сразу позвони маме или папе." },
      { text: "Спрошу, откуда он знает моих родителей", correct: false, feedback: "Не вступай в разговор. Просто уйди в сторону людей и позвони родителям." },
    ],
  },
  {
    id: 2,
    scene: "Незнакомая женщина предлагает тебе конфеты и говорит: «Пойдём, я покажу тебе кое-что интересное».",
    emoji: "🍬",
    question: "Как ты поступишь?",
    answers: [
      { text: "Возьму конфеты, но никуда не пойду", correct: false, feedback: "Не стоит брать угощения у незнакомцев. Откажись вежливо и уйди." },
      { text: "Скажу «нет» и уйду к взрослым или в людное место", correct: true, feedback: "Молодец! Незнакомцы не должны угощать детей. Смело говори «нет» и уходи." },
      { text: "Пойду посмотреть — вдруг что-то интересное", correct: false, feedback: "Нельзя! Никогда не ходи с незнакомцами, даже если они обещают что-то интересное." },
    ],
  },
  {
    id: 3,
    scene: "Ты потерялся в торговом центре. Рядом стоит незнакомый мужчина и предлагает помочь найти родителей.",
    emoji: "🏬",
    question: "Кого лучше попросить о помощи?",
    answers: [
      { text: "Попрошу этого мужчину — он предложил помочь", correct: false, feedback: "Осторожно! Лучше обратись к охраннику, продавцу или администратору в магазине." },
      { text: "Найду охранника или сотрудника магазина", correct: true, feedback: "Правильно! Охранник или работник магазина — надёжная помощь. Они помогут найти родителей." },
      { text: "Буду стоять и плакать", correct: false, feedback: "Не паникуй! Ищи охранника, продавца или другую маму с детьми — они помогут." },
    ],
  },
  {
    id: 4,
    scene: "Незнакомец в интернете пишет тебе: «Ты такой умный! Давай встретимся, я тебе кое-что подарю».",
    emoji: "💻",
    question: "Что нужно сделать?",
    answers: [
      { text: "Договорюсь о встрече — он добрый", correct: false, feedback: "Нельзя! В интернете люди могут притворяться добрыми. Никогда не встречайся с незнакомцами из сети." },
      { text: "Расскажу родителям и заблокирую этого человека", correct: true, feedback: "Правильно! Всегда рассказывай родителям о странных сообщениях в интернете и блокируй таких людей." },
      { text: "Спрошу, что он хочет подарить", correct: false, feedback: "Не продолжай разговор. Расскажи маме или папе — это важно!" },
    ],
  },
  {
    id: 5,
    scene: "Незнакомец говорит: «Твоя мама попала в больницу, она просила меня забрать тебя».",
    emoji: "🏥",
    question: "Что ты сделаешь?",
    answers: [
      { text: "Пойду с ним — вдруг мама правда в больнице", correct: false, feedback: "Нельзя! Это классическая уловка. Сначала позвони маме или папе и проверь информацию." },
      { text: "Позвоню маме прямо сейчас и проверю", correct: true, feedback: "Умница! Всегда проверяй такую информацию сам — позвони родителям или другому близкому взрослому." },
      { text: "Спрошу, как выглядит мама, и если угадает — пойду", correct: false, feedback: "Нельзя! Незнакомец может знать, как выглядит мама. Только звонок родителям поможет проверить правду." },
    ],
  },
]

export default function GameSmartStranger() {
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
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-950 to-slate-950 flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors">
          <Icon name="ArrowLeft" size={18} />
          <span className="font-mono text-sm">Назад</span>
        </button>
        <div className="flex items-center gap-2">
          <span className="text-2xl">🙅</span>
          <span className="font-sans text-white font-medium">Умный незнакомец</span>
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
                  i < currentStep ? "bg-violet-400" : i === currentStep ? "bg-violet-400/60" : "bg-white/10"
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
              {score === steps.length ? "Ты умный!" : score >= 3 ? "Хорошо!" : "Учись дальше!"}
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
                ? "Ты умеешь защитить себя! Помни: при любой опасности звони родителям или на 112."
                : "Запомни главное правило: незнакомец — это тот, кого ты не знаешь. Будь осторожен!"}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={handleRestart}
                className="px-6 py-3 rounded-xl bg-violet-500 text-white font-medium hover:bg-violet-400 transition-colors"
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
                  className="px-8 py-3 rounded-xl bg-violet-500 text-white font-medium hover:bg-violet-400 transition-colors"
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
