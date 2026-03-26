import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils";

/**
 * A statistics card component that displays data with an animated bar graph.
 */
export const UserStatsCard = ({
  title = "10,542",
  subtitle = "Registered Users",
  barData = [],
  timeLabels = ["Mon", "Wed", "Fri"],
  topItems = [],
  className,
}) => {
  // Normalize bar data to 0-1 range for height calculation
  const maxValue = Math.max(...barData, 1);
  const normalizedData = barData.map((value) => value / maxValue);

  // Animation variants for bars
  const barVariants = {
    hidden: { scaleY: 0 },
    visible: (i) => ({
      scaleY: 1,
      transition: {
        delay: i * 0.03,
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    }),
  };

  return (
    <div
      className={cn(
        "w-full max-w-lg rounded-3xl border bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20 text-gray-900 dark:text-gray-100 shadow-2xl px-6 py-5 backdrop-blur-md border-gray-200 dark:border-gray-800/50",
        className
      )}
    >
      <div className="flex flex-col sm:flex-row gap-8">
        {/* Left side - Main graph */}
        <div className="flex-1">
          {/* Total display */}
          <div className="mb-0 text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-blue-500 dark:from-primary-400 dark:to-blue-300">
            {title}
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">{subtitle}</p>

          {/* Bar graph */}
          <div className="relative mt-2">
            {/* Y-axis labels */}
            <div className="absolute -right-8 top-0 flex h-32 flex-col justify-between text-xs text-gray-400 font-semibold">
              <span>{Math.round(maxValue)}</span>
              <span>{Math.round(maxValue / 2)}</span>
              <span>0</span>
            </div>

            {/* Horizontal guide lines */}
            <div className="absolute inset-0 flex h-32 flex-col justify-between pointer-events-none">
              <div className="h-px border-t border-dashed border-gray-200 dark:border-gray-800" />
              <div className="h-px border-t border-dashed border-gray-200 dark:border-gray-800" />
              <div className="h-px border-t border-dashed border-gray-200 dark:border-gray-800" />
            </div>

            {/* Bars */}
            <div className="mb-2 flex h-32 items-end gap-[4px] relative z-10 mr-8">
              {normalizedData.map((height, index) => {
                const isHighlighted = height > 0.6;
                const barColor = isHighlighted
                  ? "bg-gradient-to-t from-primary-500 to-blue-400 shadow-lg shadow-primary-500/20"
                  : "bg-gray-200 dark:bg-gray-800";

                return (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={barVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className={cn(
                      "flex-1 rounded-t-md origin-bottom",
                      barColor
                    )}
                    style={{ height: `${height * 100}%` }}
                  />
                );
              })}
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between text-xs text-gray-400 font-semibold mr-8">
              {timeLabels.map((label, index) => (
                <span key={index}>{label}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Vertical divider */}
        <div className="hidden sm:block w-px bg-gray-200 dark:bg-gray-800 self-stretch relative" />
        <div className="block sm:hidden h-px bg-gray-200 dark:bg-gray-800 w-full relative" />

        {/* Right side - Top segments */}
        <div className="flex flex-col gap-4 justify-center sm:w-40">
          {topItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 + 0.2 }}
              className="flex items-center gap-3"
            >
              <div className="flex h-8 w-8 rounded-full bg-white dark:bg-gray-900 shadow-sm items-center justify-center text-gray-900 dark:text-white shrink-0">
                {item.icon}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-tight">{item.name}</span>
                <span className="text-sm font-bold leading-tight">{item.value}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
