import React from "react";
import Link from "next/link";
import { ChevronRight, Grid, Image as ImageIcon, Zap } from "lucide-react";
import { motion } from "framer-motion";

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const scaleUp = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 },
};

export default function Landing() {
  return (
    <motion.div
      className="min-h-screen text-gray-200 font-sans relative"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: "url('/Background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="absolute inset-0 bg-black bg-opacity-75 z-0" />

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          className="py-4 px-6 shadow-md bg-black bg-opacity-90 sticky top-0"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between">
            <motion.div
              className="flex items-center"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <img src="/Logo.png" alt="Logo" className="h-8" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold ml-4">
                Framework
              </h1>
            </motion.div>
            <nav className="hidden md:flex space-x-6 text-sm">
              {["features", "how-it-works", "about"].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item}`}
                  className="hover:text-gray-300 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </motion.a>
              ))}
            </nav>
          </div>
        </motion.header>

        {/* Hero Section */}
        <main className="text-center mt-16 px-4">
          <motion.section
            className="max-w-4xl mx-auto"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-300 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-200 to-gray-400"
              variants={fadeInUp}
            >
              Build Grids with Precision & Simplicity
            </motion.h1>
            <motion.p
              className="mt-6 text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto"
              variants={fadeInUp}
              transition={{ delay: 0.2 }}
            >
              Framework empowers artists to craft perfect grids and crop images
              effortlessly in a sleek, modern interface.
            </motion.p>
            <motion.div
              className="mt-8"
              variants={fadeInUp}
              transition={{ delay: 0.4 }}
            >
              <Link
                href="/gridmaker"
                className="px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-600 text-gray-200 text-lg font-semibold rounded-lg hover:from-gray-600 hover:to-gray-500 transition-all duration-300 inline-flex items-center group"
              >
                <motion.span
                  whileHover={{ x: 5 }}
                  className="flex items-center"
                >
                  Start Creating
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </motion.span>
              </Link>
            </motion.div>
          </motion.section>

          {/* Features Section */}
          <motion.section
            id="features"
            className="mt-32 mb-32"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold text-gray-300 mb-16"
              variants={fadeInUp}
            >
              Powerful Features for Creators
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
              {[
                {
                  icon: <Grid className="w-8 h-8 mb-4" />,
                  title: "Custom Grids",
                  description:
                    "Adjust the grid dimensions to match your canvas with precision and accuracy.",
                },
                {
                  icon: <ImageIcon className="w-8 h-8 mb-4" />,
                  title: "Image Cropping",
                  description:
                    "Crop images seamlessly without distortion or quality loss using our advanced tools.",
                },
                {
                  icon: <Zap className="w-8 h-8 mb-4" />,
                  title: "Intuitive Design",
                  description:
                    "A simple, modern interface designed for creators of all skill levels.",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  variants={scaleUp}
                  whileHover={{ scale: 1.05 }}
                  className="p-8 bg-gray-800 bg-opacity-80 shadow-lg rounded-xl transition-transform duration-300"
                >
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      initial={{ rotate: 0 }}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-300 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* How It Works Section */}
          <motion.section
            id="how-it-works"
            className="py-12 sm:py-16 md:py-20 bg-gray-900 bg-opacity-60"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
              <motion.h2
                className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-300 mb-8 sm:mb-12 md:mb-16 text-center"
                variants={fadeInUp}
              >
                How It Works
              </motion.h2>
              <motion.div
                className="space-y-8 sm:space-y-10 md:space-y-12"
                variants={staggerContainer}
              >
                {[
                  {
                    step: "01",
                    title: "Upload Your Image",
                    description:
                      "Start by uploading the image you want to work with. Our platform supports various image formats including JPG, PNG, and SVG files for maximum compatibility.",
                  },
                  {
                    step: "02",
                    title: "Configure Grid",
                    description:
                      "Set your desired grid dimensions and customize the layout. Adjust columns, rows, spacing, and other parameters to match your specific requirements.",
                  },
                  {
                    step: "03",
                    title: "Export & Share",
                    description:
                      "Download your finished work or share it directly with others. Export in multiple formats and resolutions to suit your needs.",
                  },
                ].map((step, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInUp}
                    className={`flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto ${
                      index % 2 === 1 ? "sm:flex-row-reverse" : ""
                    }`}
                  >
                    <motion.div
                      className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 flex items-center justify-center bg-gray-800 rounded-xl sm:rounded-2xl shrink-0"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium text-gray-400">
                        {step.step}
                      </div>
                    </motion.div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-xl sm:text-2xl font-medium text-gray-300 mb-2 sm:mb-3">
                        {step.title}
                      </h3>
                      <p className="text-base sm:text-lg text-gray-400">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* About Section */}
          <motion.section
            id="about"
            className="py-20"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="max-w-6xl mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <motion.div className="text-left" variants={fadeInUp}>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-300 mb-6">
                    About Framework
                  </h2>
                  <p className="text-gray-400 text-lg mb-6">
                    Framework was born from the need to simplify grid creation
                    for artists and designers. Our tool combines powerful
                    features with an intuitive interface, making
                    professional-grade grid creation accessible to everyone.
                  </p>
                </motion.div>
                <motion.div
                  className="rounded-xl overflow-hidden shadow-2xl"
                  variants={scaleUp}
                  whileHover={{ scale: 1.02 }}
                >
                  <img
                    src="/about.png"
                    alt="Framework in action"
                    className="w-90 h-full object-cover opacity-70"
                  />
                </motion.div>
              </div>
            </div>
          </motion.section>

          {/* Call to Action Section */}
          <motion.section
            className="py-20 bg-gradient-to-b from-gray-900 to-black"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="max-w-4xl mx-auto px-4 text-center">
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-gray-300 mb-6"
                variants={fadeInUp}
              >
                Ready to Start Creating?
              </motion.h2>
              <motion.p
                className="text-xl text-gray-400 mb-8"
                variants={fadeInUp}
              >
                Join thousands of creators who trust Framework for their
                grid-making needs.
              </motion.p>
              <motion.div
                variants={fadeInUp}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  href="/gridmaker"
                  className="px-8 py-4 bg-gray-200 text-gray-900 text-lg font-semibold rounded-lg hover:bg-gray-300 transition-all duration-300 inline-flex items-center group"
                >
                  Get Started Now
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </div>
          </motion.section>
        </main>

        {/* Footer */}
        <motion.footer
          className="py-8 bg-black bg-opacity-90 text-center border-t border-gray-800"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-500">
            © {new Date().getFullYear()} Framework. Built for creators with ❤️
          </p>
        </motion.footer>
      </div>
    </motion.div>
  );
}
