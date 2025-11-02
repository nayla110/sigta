export default function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white">
      {/* Title */}
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>

      {/* Content */}
      <div className="text-sm text-gray-700">
        {children}
      </div>
    </div>
  );
}
