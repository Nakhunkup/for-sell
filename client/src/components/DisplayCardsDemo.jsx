import React from "react";
import DisplayCards from "./ui/display-cards";
import { Sparkles, Dna, FlaskConical, Bot } from "lucide-react";

export default function DisplayCardsDemo() {
  const customCards = [
    {
      icon: <FlaskConical className="size-4 text-emerald-500" />,
      title: "Chemistry World",
      description: "Explore molecular structures and reactions",
      date: "New Course",
      iconClassName: "text-emerald-500",
      titleClassName: "text-emerald-500",
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/50 dark:before:bg-gray-900/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Dna className="size-4 text-cyan-500" />,
      title: "Advanced Biology",
      description: "Deep dive into genetics and cells",
      date: "Trending",
      iconClassName: "text-cyan-500",
      titleClassName: "text-cyan-500",
      className:
        "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/50 dark:before:bg-gray-900/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <Bot className="size-4 text-purple-500" />,
      title: "AI in Science",
      description: "How artificial intelligence accelerates research",
      date: "Featured",
      iconClassName: "text-purple-500",
      titleClassName: "text-purple-500",
      className:
        "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
    },
  ];

  return (
    <div className="flex w-full items-center justify-center py-10 overflow-visible relative z-30">
      <div className="w-full max-w-3xl flex justify-center translate-x-[-30px]">
        <DisplayCards cards={customCards} />
      </div>
    </div>
  );
}
