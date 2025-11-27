import { useState } from "react";
import {
  Github,
  Linkedin,
  Twitter,
  Download,
  ExternalLink,
  Menu,
  X,
  Youtube,
  Mail,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay },
  }),
};

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((v) => !v);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10"
      >
        <div className="container mx-auto px-6 lg:px-12 py-6 flex justify-between items-center">
          <div
            className="text-xl font-bold tracking-tight cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            mrDSA.dev
          </div>
          <nav className="hidden md:flex space-x-10">
            {["About", "Experience", "Work", "Contact"].map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm uppercase tracking-wider hover:text-white/60 transition-colors"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                custom={i * 0.1}
              >
                {item}
              </motion.a>
            ))}
          </nav>
          <button
            className="md:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        {isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-black border-t border-white/10"
          >
            <div className="container mx-auto px-6 py-6 flex flex-col space-y-4">
              {["About", "Experience", "Work", "Contact"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm uppercase tracking-wider hover:text-white/60 transition-colors"
                  onClick={toggleMenu}
                >
                  {item}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </motion.header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 lg:px-12 pt-24 pb-12">
        <div className="max-w-7xl w-full">
          <div className="grid lg:grid-cols-[1.2fr,1fr] gap-16 items-center">
            {/* Left - Text Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              className="space-y-10 order-2 lg:order-1"
            >
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <p className="text-sm uppercase tracking-widest text-white/80 mb-4">
                    Full Stack Developer & Founder
                  </p>
                  <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1]">
                    Dewan Shakil
                    <br />
                    Akhtar
                  </h1>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-lg md:text-xl text-white/60 leading-relaxed max-w-xl"
                >
                  Building scalable applications and digital products that solve
                  real problems. Specialized in modern web technologies and
                  startup development.
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <Button
                  variant="outline"
                  className="bg-white text-black hover:bg-gray-700 border-0 h-12 px-6"
                  onClick={() => window.open("/resume.pdf", "_blank")}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Resume
                </Button>
                <Button
                  variant="outline"
                  className="bg-black text-white border-2 border-white/20 hover:bg-white/10 h-12 px-6"
                  onClick={() => window.open("mailto:hi@mrdsa.dev", "_blank")}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  hi@mrdsa.dev
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex items-center gap-6 pt-2"
              >
                <span className="text-xs uppercase tracking-widest text-white/30">
                  Connect
                </span>
                <div className="flex gap-5">
                  {[
                    {
                      icon: Github,
                      url: "https://github.com/imdewan",
                      label: "GitHub",
                    },
                    {
                      icon: Linkedin,
                      url: "https://linkedin.com/in/mrdsa04",
                      label: "LinkedIn",
                    },
                    {
                      icon: Twitter,
                      url: "https://x.com/mrdsa04",
                      label: "Twitter",
                    },
                    {
                      icon: Youtube,
                      url: "https://youtube.com/@dewanshakilyt",
                      label: "YouTube",
                    },
                  ].map((social) => (
                    <motion.a
                      key={social.label}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/40 hover:text-white transition-colors"
                      whileHover={{ scale: 1.15, y: -2 }}
                      aria-label={social.label}
                    >
                      <social.icon size={22} />
                    </motion.a>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Profile Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex justify-center lg:justify-end order-1 lg:order-2"
            >
              <div className="relative group">
                {/* Decorative border effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-white/20 to-white/5 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative w-64 h-80 md:w-80 md:h-[500px] lg:w-96 lg:h-[550px] rounded-3xl overflow-hidden border border-white/20 bg-gradient-to-br from-white/5 to-transparent">
                  <img
                    src="/me-portrait.webp"
                    alt="Dewan Shakil Akhtar"
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-700"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="py-32 px-6 lg:px-12 border-t border-white/10"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="grid md:grid-cols-2 gap-16"
          >
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">About</h2>
              <div className="w-16 h-1 bg-white mb-8" />
            </div>
            <div className="space-y-6 text-lg text-white/70 leading-relaxed">
              <p>
                With years of experience in full-stack development, I specialize
                in building modern web applications that scale. My focus is on
                creating clean, efficient solutions that solve real problems.
              </p>
              <p>
                I've founded multiple successful startups and worked with
                clients across the globe, delivering high-quality products that
                drive results and user engagement.
              </p>
              <div className="pt-6">
                <p className="text-white font-semibold text-2xl">Since 2020</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section
        id="experience"
        className="py-32 px-6 lg:px-12 border-t border-white/10"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            Experience
          </motion.h2>
          <div className="space-y-2">
            {[
              {
                company: "NOOL",
                role: "Founding Engineer",
                desc: "React Native app with Convex backend",
                url: "https://thenool.com",
              },
              {
                company: "Ledref",
                role: "Founder & Full Stack Developer",
                desc: "Newsletter Platform",
                url: "https://ledref.com",
              },
              {
                company: "ColdPen",
                role: "Founder & Full Stack Developer",
                desc: "Cold Email Platform",
                url: "https://coldpen.io",
              },
              {
                company: "Freelance",
                role: "Full Stack Developer",
                desc: "Various client projects",
                url: null,
              },
            ].map((exp, i) => (
              <motion.div
                key={exp.company}
                className="group py-8 border-b border-white/10 last:border-0"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={i * 0.1}
              >
                <div className="grid md:grid-cols-3 gap-6 items-start">
                  <div>
                    {exp.url ? (
                      <a
                        href={exp.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-2xl font-bold hover:text-white/60 transition-colors inline-flex items-center gap-2"
                      >
                        {exp.company}
                        <ArrowUpRight
                          size={20}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </a>
                    ) : (
                      <h3 className="text-2xl font-bold">{exp.company}</h3>
                    )}
                  </div>
                  <div className="text-white/60">{exp.role}</div>
                  <div className="text-white/40 text-sm md:text-right">
                    {exp.desc}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Work/Projects Section */}
      <section
        id="work"
        className="py-32 px-6 lg:px-12 border-t border-white/10"
      >
        <div className="max-w-6xl mx-auto">
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            Selected Work
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                title: "Ledref",
                desc: "Newsletter platform with drag-and-drop editor, AI tools, and analytics.",
                url: "https://ledref.com",
                img: "/images/ledref-screenshot.jpeg",
              },
              {
                title: "ColdPen",
                desc: "Simple cold email platform for founders who want results.",
                url: "https://coldpen.io",
                img: "/images/coldpen-screenshot.png",
              },
            ].map((project, i) => (
              <motion.a
                key={project.title}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block space-y-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={i * 0.1}
              >
                <div className="aspect-video bg-white/5 rounded-lg overflow-hidden border border-white/10">
                  <img
                    src={project.img}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 group-hover:text-white/60 transition-colors flex items-center gap-2">
                    {project.title}
                    <ArrowUpRight
                      size={20}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </h3>
                  <p className="text-white/60">{project.desc}</p>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Testimonials */}
          <div className="mt-32">
            <h3 className="text-3xl font-bold mb-12">Testimonials</h3>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  quote:
                    "Kind, polite, and a truly good freelancer. Dewan was always available for questions, responded quickly, and delivered exactly what I needed.",
                  name: "Ahmet Fuat Y.",
                  company: "Founder of Solar Curtain",
                },
                {
                  quote:
                    "Dewan did well in removing all the bugs from my code and is available 24/7 to respond to enquiries. He is a very good developer.",
                  name: "Abhi Patel",
                  company: "Client",
                },
              ].map((testimonial, i) => (
                <motion.div
                  key={testimonial.name}
                  className="p-8 border border-white/10 rounded-lg"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  custom={i * 0.1}
                >
                  <p className="text-white/70 mb-6 italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-white/40 text-sm">
                      {testimonial.company}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-32">
            <h3 className="text-3xl font-bold mb-12">Technologies</h3>
            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-8">
              {[
                {
                  name: "Firebase",
                  icon: "https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/firebase.png",
                },
                {
                  name: "Supabase",
                  icon: "https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/supabase.png",
                },
                {
                  name: "JavaScript",
                  icon: "https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/javascript.png",
                },
                {
                  name: "React",
                  icon: "https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/react.png",
                },
                {
                  name: "TypeScript",
                  icon: "https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/typescript.png",
                },
                {
                  name: "Node.js",
                  icon: "https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/node_js.png",
                },
                {
                  name: "Next.js",
                  icon: "https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/next_js.png",
                },
                {
                  name: "Expo",
                  icon: "https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/expo.png",
                },
                {
                  name: "Python",
                  icon: "https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/python.png",
                },
                {
                  name: "PHP",
                  icon: "https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/php.png",
                },
                {
                  name: "Go",
                  icon: "https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/go.png",
                },
                {
                  name: "Flutter",
                  icon: "https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/flutter.png",
                },
                {
                  name: "PostgreSQL",
                  icon: "https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/postgresql.png",
                },
                {
                  name: "MySQL",
                  icon: "https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/mysql.png",
                },
                {
                  name: "Arduino",
                  icon: "https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/arduino.png",
                },
                {
                  name: "Docker",
                  icon: "https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/docker.png",
                },
              ].map((tech, i) => (
                <motion.div
                  key={tech.name}
                  className="flex flex-col items-center gap-3 opacity-60 hover:opacity-100 transition-opacity"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  custom={i * 0.05}
                >
                  <img
                    src={tech.icon}
                    alt={tech.name}
                    className={`w-12 h-12 ${tech.name === "Expo" ? "bg-white rounded-lg p-2" : ""}`}
                  />
                  <span className="text-xs text-white/60">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        id="contact"
        className="py-32 px-6 lg:px-12 border-t border-white/10"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            className="space-y-8"
          >
            <h2 className="text-4xl md:text-5xl font-bold">
              Let's Work Together
            </h2>
            <p className="text-xl text-white/60 max-w-2xl">
              Have a project in mind? Let's discuss how we can work together to
              bring your ideas to life.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button
                variant="outline"
                className="bg-white text-black hover:bg-gray-700 border-0 text-lg px-8 py-6"
                onClick={() => window.open("mailto:hi@mrdsa.dev", "_blank")}
              >
                <Mail className="mr-2 h-5 w-5" />
                Get in Touch
              </Button>
              <Button
                variant="outline"
                className="bg-black text-white border border-white/20 hover:bg-white/10 text-lg px-8 py-6"
                onClick={() =>
                  window.open("https://linkedin.com/in/mrdsa04", "_blank")
                }
              >
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-12 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/40 text-sm">
            &copy; 2024 Dewan Shakil Akhtar. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[
              {
                icon: Github,
                url: "https://github.com/imdewan",
                label: "GitHub",
              },
              {
                icon: Linkedin,
                url: "https://linkedin.com/in/mrdsa04",
                label: "LinkedIn",
              },
              { icon: Twitter, url: "https://x.com/mrdsa04", label: "Twitter" },
            ].map((social) => (
              <a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-white transition-colors"
                aria-label={social.label}
              >
                <social.icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
