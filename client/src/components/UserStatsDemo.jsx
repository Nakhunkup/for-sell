import React from "react";
import { UserStatsCard } from "./ui/user-stats-card";
import { Users, GraduationCap, BookOpen, MonitorPlay } from "lucide-react";

export default function UserStatsDemo() {
  const sampleBarData = [
    120, 150, 100, 80, 120, 250, 350, 450, 600, 750, 800, 850,
    700, 650, 550, 500, 600, 750, 800, 950, 850, 750, 600, 500
  ];

  const topItems = [
    {
      icon: <Users className="h-4 w-4 text-primary-500" strokeWidth={2.5} />,
      name: "นักเรียนใหม่",
      value: "+1,204",
    },
    {
      icon: <GraduationCap className="h-4 w-4 text-orange-500" strokeWidth={2.5} />,
      name: "ผู้สอน",
      value: "145",
    },
    {
      icon: <BookOpen className="h-4 w-4 text-purple-500" strokeWidth={2.5} />,
      name: "คอร์สเรียน",
      value: "89",
    },
    {
      icon: <MonitorPlay className="h-4 w-4 text-blue-500" strokeWidth={2.5} />,
      name: "กำลังออนไลน์",
      value: "450",
    },
  ];

  return (
    <UserStatsCard
      title="12,500+"
      subtitle="ผู้ใช้งาน"
      barData={sampleBarData}
      timeLabels={["Jan", "Mar", "Jun", "Now"]}
      topItems={topItems}
    />
  );
}
