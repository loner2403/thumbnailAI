export default function LandingFooter() {
  return (
    <footer className="w-full py-6 bg-gray-400 text-black text-center text-sm mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto px-4 gap-2">
        <span>&copy; {new Date().getFullYear()} ThumbnailAI. All rights reserved.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
        </div>
      </div>
    </footer>
  );
} 