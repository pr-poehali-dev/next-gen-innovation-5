import { useReveal } from "@/hooks/use-reveal"
import { useNavigate } from "react-router-dom"

const games = [
  {
    number: "01",
    title: "Безопасный дом",
    category: "🏠 Правила поведения дома · Для детей 5–8 лет",
    label: "Играть →",
    direction: "left",
    path: "/game/safe-home",
    color: "group-hover:text-orange-300",
  },
  {
    number: "02",
    title: "Герой улицы",
    category: "🚦 Правила дорожного движения · Для детей 6–10 лет",
    label: "Играть →",
    direction: "right",
    path: "/game/street-hero",
    color: "group-hover:text-blue-300",
  },
  {
    number: "03",
    title: "Умный незнакомец",
    category: "🙅 Как вести себя с чужими · Для детей 7–11 лет",
    label: "Играть →",
    direction: "left",
    path: "/game/smart-stranger",
    color: "group-hover:text-violet-300",
  },
]

export function WorkSection() {
  const { ref, isVisible } = useReveal(0.3)
  const navigate = useNavigate()

  return (
    <section
      ref={ref}
      className="flex h-screen w-screen shrink-0 snap-start items-center px-6 pt-20 md:px-12 md:pt-0 lg:px-16"
    >
      <div className="mx-auto w-full max-w-7xl">
        <div
          className={`mb-12 transition-all duration-700 md:mb-16 ${
            isVisible ? "translate-x-0 opacity-100" : "-translate-x-12 opacity-0"
          }`}
        >
          <h2 className="mb-2 font-sans text-5xl font-light tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Игры
          </h2>
          <p className="font-mono text-sm text-foreground/60 md:text-base">/ Три истории про безопасность</p>
        </div>

        <div className="space-y-6 md:space-y-8">
          {games.map((game, i) => {
            const getRevealClass = () => {
              if (!isVisible) {
                return game.direction === "left" ? "-translate-x-16 opacity-0" : "translate-x-16 opacity-0"
              }
              return "translate-x-0 opacity-100"
            }

            return (
              <div
                key={i}
                onClick={() => navigate(game.path)}
                className={`group flex items-center justify-between border-b border-foreground/10 py-6 transition-all duration-700 hover:border-foreground/20 md:py-8 cursor-pointer ${getRevealClass()}`}
                style={{
                  transitionDelay: `${i * 150}ms`,
                  marginLeft: i % 2 === 0 ? "0" : "auto",
                  maxWidth: i % 2 === 0 ? "85%" : "90%",
                }}
              >
                <div className="flex items-baseline gap-4 md:gap-8">
                  <span className="font-mono text-sm text-foreground/30 transition-colors group-hover:text-foreground/50 md:text-base">
                    {game.number}
                  </span>
                  <div>
                    <h3 className={`mb-1 font-sans text-2xl font-light text-foreground transition-all duration-300 group-hover:translate-x-2 md:text-3xl lg:text-4xl ${game.color}`}>
                      {game.title}
                    </h3>
                    <p className="font-mono text-xs text-foreground/50 md:text-sm">{game.category}</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-foreground/30 transition-colors group-hover:text-foreground/70 md:text-sm">
                  {game.label}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
