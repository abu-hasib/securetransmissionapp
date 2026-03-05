export default function Loading() {
  return (
    <div className="flex gap-2">
      <div className="w-2 h-2 bg-primary-500 rounded-full animate-pulse" />
      <div
        className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"
        style={{ animationDelay: "0.2s" }}
      />
      <div
        className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"
        style={{ animationDelay: "0.4s" }}
      />
    </div>
  );
}
