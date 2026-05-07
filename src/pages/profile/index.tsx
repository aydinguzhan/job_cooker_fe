import ExperienceSection from "./particals/ExperinceSection";
import ProfileHeader from "./particals/ProfileHeader";
import ReferencesSection from "./particals/ReferencesSetion";
import SkillsSection from "./particals/SkillsSection";

const user = {
  firstName: "Oğuzhan",
  lastName: "Aydın",
  title: "Fullstack JavaScript Developer",
  description:
    "React, TypeScript, Next.js ve Node.js ile modern web uygulamaları geliştiren yazılım geliştirici.",
};

// 🔥 Daha fazla veri ile test
const skills = [
  { name: "React.js", level: 5 },
  { name: "TypeScript", level: 5 },
  { name: "Next.js", level: 5 },
  { name: "Node.js", level: 4 },
  { name: "Express.js", level: 4 },
  { name: "NestJS", level: 3 },
  { name: "Tailwind CSS", level: 5 },
  { name: "SCSS", level: 4 },
  { name: "Redux", level: 4 },
  { name: "Zustand", level: 3 },
  { name: "React Query", level: 4 },
  { name: "MySQL", level: 4 },
  { name: "PostgreSQL", level: 3 },
  { name: "MongoDB", level: 3 },
  { name: "Redis", level: 3 },
  { name: "Docker", level: 3 },
  { name: "Git", level: 5 },
  { name: "CI/CD", level: 3 },
];

const experiences = [
  {
    role: "Senior Fullstack Developer",
    company: "Tech Corp",
    period: "2025 - Devam",
    description: "Yüksek trafikli sistemlerde performans optimizasyonu ve microservice mimarisi geliştirme.",
  },
  {
    role: "Fullstack Developer",
    company: "Lotec Technology",
    period: "2024 - 2025",
    description: "Next.js + Node.js ile enterprise uygulamalar geliştirme.",
  },
  {
    role: "Frontend Developer",
    company: "FONET",
    period: "2022 - 2023",
    description: "Kurumsal dashboard ve component mimarisi geliştirme.",
  },
  {
    role: "Junior Developer",
    company: "Startup XYZ",
    period: "2021 - 2022",
    description: "React öğrenme ve küçük feature geliştirmeleri.",
  },
  {
    role: "Intern",
    company: "Software House",
    period: "2020 - 2021",
    description: "Frontend temelleri ve UI geliştirme.",
  },
];

const references = [
  { name: "Ahmet Yılmaz", email: "ahmet.yilmaz@example.com" },
  { name: "Ayşe Demir", email: "ayse.demir@example.com" },
  { name: "Mehmet Kaya", email: "mehmet@example.com" },
];






export default function Profile() {
  return (
    <main className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <ProfileHeader user={user}  onSave={(val)=>console.log(val)} />

        <SkillsSection skills={skills} />

        <ExperienceSection experiences={experiences} />

        <ReferencesSection references={references} />
      </div>
    </main>
  );
}
