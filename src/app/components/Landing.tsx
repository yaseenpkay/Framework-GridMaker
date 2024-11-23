import Link from "next/link";

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-gray-200 font-sans">
      {/* Header */}
      <header className="py-4 px-6 shadow-md bg-opacity-90 bg-black sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between">
          <div className="flex items-center mb-1 md:mb-0">
            <img src="/Logo.png" alt="Logo" className="h-12 w-11" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold ml-4">
              Framework
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="text-center mt-16 px-4">
        <section className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-300 leading-tight">
            Build Grids with Precision & Simplicity
          </h1>
          <p className="mt-6 text-base md:text-lg text-gray-400 leading-relaxed">
            Framework empowers artists to craft perfect grids and crop images
            effortlessly in a sleek, modern interface.
          </p>
          <div className="mt-8">
            <Link
              href="/gridmaker"
              className="px-6 py-3 bg-gray-700 text-gray-200 text-lg font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300 inline-block"
            >
              Start Creating
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-300 mb-10">
            Features
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-6 bg-gray-800 shadow-md rounded-lg transition-transform duration-300 hover:scale-105">
              <h3 className="text-lg md:text-xl font-bold text-gray-300">
                Custom Grids
              </h3>
              <p className="mt-2 text-sm md:text-base text-gray-400">
                Adjust the grid dimensions to match your canvas with precision.
              </p>
            </div>
            <div className="p-6 bg-gray-800 shadow-md rounded-lg transition-transform duration-300 hover:scale-105">
              <h3 className="text-lg md:text-xl font-bold text-gray-300">
                Image Cropping
              </h3>
              <p className="mt-2 text-sm md:text-base text-gray-400">
                Crop images seamlessly without distortion or quality loss.
              </p>
            </div>
            <div className="p-6 bg-gray-800 shadow-md rounded-lg transition-transform duration-300 hover:scale-105">
              <h3 className="text-lg md:text-xl font-bold text-gray-300">
                Intuitive Design
              </h3>
              <p className="mt-2 text-sm md:text-base text-gray-400">
                A simple, modern interface designed for creators of all levels.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-20 py-6 bg-gray-900 text-center border-t border-gray-700">
        <p className="text-gray-500 text-sm sm:text-base">
          © {new Date().getFullYear()} Framework. Built for creators with ❤️.
        </p>
      </footer>
    </div>
  );
}
