export default function ComingSoon() {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Decorative background glows with animation */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-700/10 blur-[120px] rounded-full animate-floatGlow"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-700/10 blur-[130px] rounded-full animate-floatGlow"></div>

      {/* Decorative glowing ring */}
      <div className="relative w-20 h-20 mb-8 z-10">
        <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
        <div className="absolute inset-0 border-l-4 border-t-4 border-purple-400 rounded-full animate-spin-slow"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-purple-400 rounded-full animate-ping"></div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold mb-3 text-white tracking-wide z-10">
        Coming&nbsp;Soon
      </h1>

      {/* Subtitle */}
      <p className="text-gray-400 text-lg text-center max-w-md mb-10 z-10">
        The feature you’re looking for is under construction.
        <br />
        Our engineers are sculpting code, brewing caffeine, and making magic 🪄
      </p>

      {/* Fun progress bar */}
      <div className="w-64 h-2 bg-gray-700 rounded-full overflow-hidden z-10">
        <div className="h-full bg-gradient-to-r from-purple-400 to-blue-500 animate-progress"></div>
      </div>
    </div>
  )
}
