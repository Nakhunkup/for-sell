import React from "react";
import { cn } from "../../lib/utils";
import { Sparkles } from "lucide-react";

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-primary-300" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-primary-500",
  titleClassName = "text-primary-500",
}) {
  return (
    <div
      className={cn(
        "relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md px-4 py-3 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-transparent dark:after:from-gray-900/50 after:to-transparent after:content-[''] hover:border-primary-500/50 hover:bg-white dark:hover:bg-gray-800 [&>*]:flex [&>*]:items-center [&>*]:gap-2 shadow-xl",
        className
      )}
    >
      <div>
        <span className="relative inline-block rounded-full bg-primary-100 dark:bg-primary-900/50 p-1.5 shadow-sm text-primary-600 dark:text-primary-300">
          {icon}
        </span>
        <p className={cn("text-lg font-bold text-gray-900 dark:text-white", titleClassName)}>{title}</p>
      </div>
      <p className="text-base font-medium text-gray-700 dark:text-gray-200 leading-snug">{description}</p>
      <p className="text-gray-500 dark:text-gray-400 text-sm font-semibold">{date}</p>
    </div>
  );
}

export default function DisplayCards({ cards }) {
  const defaultCards = [
    {
      className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/50 dark:before:bg-gray-900/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className: "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-white/50 dark:before:bg-gray-900/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
