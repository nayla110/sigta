"use client";

type DashboardCardProps = {
  title: string;
  value: number;
};

export default function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <div className="
      bg-gradient-to-br from-[#5ba6ff] to-[#3c8efc]
      text-white text-center rounded-2xl p-6 
      shadow-lg hover:shadow-2xl transition-all duration-300 
      transform hover:-translate-y-1
      w-64
    ">
      <h2 className="font-semibold text-lg mb-2 tracking-wide drop-shadow-sm">
        {title}
      </h2>
      <p className="text-5xl font-extrabold drop-shadow-md">
        {value}
      </p>
      <div className="mt-3 w-12 h-1 bg-white/70 rounded-full mx-auto"></div>
    </div>
  );
}
