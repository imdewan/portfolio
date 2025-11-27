import { useState, useRef } from "react";
import {
  Github,
  Linkedin,
  Twitter,
  Download,
  ExternalLink,
  Menu,
  X,
  MoveDownIcon,
  ArrowDown,
  Youtube,
} from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent } from "./components/ui/card";
import { motion, useScroll, useTransform, easeOut } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOut, delay },
  }),
};

export default function Portfolio() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((v) => !v);

  // Parallax for hero section
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 300], [0, 40]);
  const opacityHero = useTransform(scrollY, [0, 300], [1, 0.85]);

  return (
    <div className={` bg-black text-white max-w-screen`}>
      {/* Header */}
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "tween", duration: 0.5, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800"
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div
            className="text-2xl font-extrabold tracking-tight font-[Montserrat,Inter,sans-serif] cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            MRDSA.DEV
          </div>
          <nav className="hidden md:flex space-x-8">
            {["about", "experience", "projects", "contact"].map((id, i) => (
              <motion.a
                key={id}
                href={`#${id}`}
                className="hover:text-gray-300 transition-colors font-bold tracking-wide font-[Montserrat,Inter,sans-serif] relative group"
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                custom={0.1 + i * 0.05}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
                <span className="block h-0.5 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200" />
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
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="md:hidden bg-black border-t border-gray-800"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {["about", "experience", "projects", "contact"].map((id) => (
                <a
                  key={id}
                  href={`#${id}`}
                  className="hover:text-gray-300 transition-colors font-bold py-2"
                  onClick={toggleMenu}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </a>
              ))}
            </div>
          </motion.nav>
        )}
      </motion.header>

      {/* Hero Section */}
      <section className="min-h-[80vh] flex items-center justify-center px-4 pt-24">
        <motion.div
          style={{ y: yHero, opacity: opacityHero }}
          className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-12"
        >
          {/* Left: Image */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={0.1}
            className="flex-shrink-0"
          >
            <div className="relative w-64 h-80 rounded-3xl overflow-hidden shadow-2xl bg-gray-800 flex items-center justify-center border-2 border-white group">
              <img
                src="/me-portrait.webp"
                alt="Dewan Shakil Akhtar"
                className="object-cover "
              />
            </div>
          </motion.div>
          {/* Right: Text */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={0.2}
            className="flex-1 text-left"
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight font-[Montserrat,Inter,sans-serif] mb-4 leading-tight">
              Dewan Shakil <br className="hidden md:block" />
              Akhtar
            </h1>
            <p
              className="text-lg md:text-2xl text-gray-300 mb-8 font-extralight"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
              Full Stack Developer & Founder
            </p>
            <p
              className="text-lg md:text-xl text-gray-400 mb-4 font-extralight"
              style={{ fontFamily: "var(--font-plus-jakarta)" }}
            >
              <span className="font-bold text-white">Email me:</span>{" "}
              <a
                href="mailto:hi@mrdsa.dev"
                className=" font-semibold hover:text-blue-400 transition-colors text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                hi@mrdsa.dev
              </a>
            </p>
            <div className="flex flex-wrap gap-4 mb-8">
              {[
                {
                  label: "Resume",
                  icon: <Download className="mr-2 h-4 w-4" />,
                  onClick: () => window.open("/resume.pdf", "_blank"),
                  className: "bg-white text-black hover:bg-gray-700",
                },
                {
                  label: "GitHub",
                  icon: <Github className="mr-2 h-4 w-4" />,
                  onClick: () =>
                    window.open("https://github.com/imdewan", "_blank"),
                  className:
                    "bg-black text-white border-white hover:bg-gray-900 hover:text-white",
                },
                {
                  label: "LinkedIn",
                  icon: <Linkedin className="mr-2 h-4 w-4" />,
                  onClick: () =>
                    window.open("https://linkedin.com/in/mrdsa04", "_blank"),
                  className:
                    "bg-black text-white border-white hover:bg-gray-900 hover:text-white",
                },
                {
                  label: "Twitter",
                  icon: <Twitter className="mr-2 h-4 w-4" />,
                  onClick: () => window.open("https://x.com/mrdsa04", "_blank"),
                  className:
                    "bg-black text-white border-white hover:bg-gray-900 hover:text-white",
                },
                {
                  label: "YouTube",
                  icon: <Youtube className="mr-2 h-4 w-4" />,
                  onClick: () =>
                    window.open("https://youtube.com/@dewanshakilyt", "_blank"),
                  className:
                    "bg-black text-white border-white hover:bg-gray-900 hover:text-white",
                },
              ].map((btn, i) => (
                <motion.div
                  key={btn.label}
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  custom={0.3 + i * 0.07}
                >
                  <Button
                    variant="outline"
                    className={`${btn.className} transition-transform duration-200 hover:scale-105`}
                    onClick={btn.onClick}
                  >
                    {btn.icon}
                    {btn.label}
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="py-10 px-4 relative">
        <div className=" mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0.1}
          >
            <div className="w-full flex justify-center items-center mb-0 relative">
              <img
                src="/curve.svg"
                alt="Decorative Curve"
                className="w-full max-w-lg"
              />
              <button
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-gray-200 rounded-full w-8 h-8 flex items-center justify-center p-2 hover:bg-gray-100 transition"
                onClick={() => {
                  const aboutSection = document.getElementById("about");
                  if (aboutSection) {
                    aboutSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                aria-label="Scroll Down"
              >
                <ArrowDown className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <Card className="bg-white text-black shadow-xl relative overflow-visible mt-0 border-0 rounded-xl">
              <CardContent className="p-8 md:p-12">
                <div className="text-center">
                  <p
                    className="mb-8 leading-relaxed font-extralight mt-20 mb-20 text-2xl md:text-3xl"
                    style={{
                      fontFamily: "var(--font-plus-jakarta)",
                    }}
                  >
                    With years of experience in full-stack development, I have
                    built and scaled applications that serve thousands of users.
                    I specialize in modern web technologies and have a passion
                    for creating innovative solutions.
                  </p>

                  <div className="text-7xl z-10! md:text-9xl font-extrabold mb-4 mt-32 font-[Montserrat,Inter,sans-serif] tracking-tight">
                    S I N C E &nbsp;2 0 2 0
                  </div>
                  <div
                    className="bg-white -z-50 w-full h-8 border-t-2 border-gray-200 shadow-[0_-8px_16px_-8px_rgba(0,0,0,0.10)] hidden md:block"
                    style={{ transform: "translateY(-3rem)" }}
                  ></div>
                  <p
                    className="text-gray-600 font-extralight mb-8 text-xl md:text-xl"
                    style={{ fontFamily: "var(--font-plus-jakarta)" }}
                  >
                    I have worked with businesses of all sizes to create
                    engaging websites and robust applications that drive results
                    and user engagement.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            className="text-4xl md:text-6xl font-extrabold mb-12 text-center font-[Montserrat,Inter,sans-serif] tracking-tight"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0.1}
          >
            EXPERIENCE
          </motion.h2>
          <div className="space-y-8">
            {[
              {
                company: "NOOL",
                role: "Founding Engineer",
                desc: "Built React Native app with Convex backend",
              },
              {
                company: "LEDREF.COM",
                role: "Founder & Full Stack Developer",
                desc: "Newsletter Platform",
              },
              {
                company: "COLDPEN.IO",
                role: "Founder & Full Stack Developer",
                desc: "Cold Email Platform",
              },
              {
                company: "FREELANCER.COM",
                role: "Full Stack Developer",
                desc: "Various Projects",
              },
            ].map((exp, i) => (
              <motion.div
                key={exp.company}
                className="flex flex-col md:flex-row justify-between items-start md:items-center py-6 border-b border-gray-800"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={0.15 + i * 0.08}
              >
                <div>
                  <h3 className="text-2xl font-bold font-[Montserrat,Inter,sans-serif]">
                    {exp.company}
                  </h3>
                  <p
                    className="text-gray-400 font-extralight"
                    style={{ fontFamily: "var(--font-plus-jakarta)" }}
                  >
                    {exp.role}
                  </p>
                </div>
                <div
                  className="text-gray-400 mt-2 md:mt-0 font-extralight"
                  style={{ fontFamily: "var(--font-plus-jakarta)" }}
                >
                  {exp.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="py-10 px-4 relative">
        <div className="mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0.1}
          >
            <div className="w-full flex justify-center items-center mb-0 relative">
              <img
                src="/curve.svg"
                alt="Decorative Curve"
                className="w-full max-w-lg"
              />
              <button
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white border-2 border-gray-200 rounded-full w-8 h-8 flex items-center justify-center p-2 hover:bg-gray-100 transition"
                onClick={() => {
                  const projectsSection = document.getElementById("projects");
                  if (projectsSection) {
                    projectsSection.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                aria-label="Scroll Down"
              >
                <ArrowDown className="h-4 w-4 text-gray-600" />
              </button>
            </div>
            <Card className="bg-white text-black shadow-xl relative overflow-visible mt-0 border-0 rounded-xl">
              <CardContent className="p-8 md:p-12">
                <div className="text-center mb-24 mt-16">
                  <h2 className="text-4xl md:text-8xl font-extrabold mb-16 font-[Montserrat,Inter,sans-serif] tracking-tight">
                    MY STARTUPS
                  </h2>
                </div>
                <div className="grid md:grid-cols-2 gap-16 mb-32">
                  {[
                    {
                      img: "/images/ledref-screenshot.jpeg",
                      alt: "Ledref.com Screenshot",
                      title: "Ledref",
                      desc: "A powerful newsletter building platform with drag-and-drop editor, AI tools, and comprehensive analytics for everyone.",
                      url: "https://ledref.com",
                    },
                    {
                      img: "/images/coldpen-screenshot.png",
                      alt: "ColdPen.io Screenshot",
                      title: "ColdPen",
                      desc: "A simple, effective cold email platform designed for founders who want results without complicated dashboards or bloat.",
                      url: "https://coldpen.io",
                    },
                  ].map((proj, i) => (
                    <motion.div
                      key={proj.title}
                      className="space-y-8 p-6 border border-1 border-black rounded-2xl flex flex-col items-center pb-10"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      variants={fadeIn}
                      custom={0.2 + i * 0.08}
                    >
                      <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden shadow-lg w-full ">
                        <img
                          src={proj.img}
                          alt={proj.alt}
                          width={800}
                          height={450}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <h3 className="text-4xl font-bold font-[Montserrat,Inter,sans-serif]">
                        {proj.title}
                      </h3>
                      <p
                        className="text-gray-600 font-extralight text-lg  text-center"
                        style={{ fontFamily: "var(--font-plus-jakarta)" }}
                      >
                        {proj.desc}
                      </p>
                      <Button
                        variant="outline"
                        className="bg-black text-white transition-transform duration-200 hover:scale-105 px-8 py-4 text-lg"
                        onClick={() => window.open(proj.url, "_blank")}
                      >
                        <ExternalLink className="mr-2 h-5 w-5" />
                        Visit Site
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {/* Testimonials */}
                <div className="mb-32">
                  <h2 className="text-4xl md:text-8xl font-extrabold mb-16 font-[Montserrat,Inter,sans-serif] tracking-tight text-center">
                    TESTIMONIALS
                  </h2>
                  <div className="h-16" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {[
                      {
                        quote:
                          "Kind, polite, and a truly good freelancer. I want to hire him again. Dewan was always available for questions, responded quickly, and delivered exactly what I needed. Highly recommended for anyone looking for a reliable developer.",
                        name: "Ahmet Fuat Y.",
                        company: "Founder of Solar Curtain",
                        img: "/images/ahmel_client.webp",
                      },
                      {
                        quote:
                          "Dewan did well in removing all the bugs from my code and is available 24/7 to respond to enquiries. He is a very good developer and I will hire him again for my next project.",
                        name: "Abhi Patel",
                        company: "Via Freelancer",
                        img: "/images/abhi_client.webp",
                      },
                    ].map((t, i) => (
                      <motion.div
                        key={t.name}
                        className="flex flex-col md:flex-row gap-8 items-center md:items-start"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        custom={0.3 + i * 0.08}
                      >
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden shrink-0 mx-auto md:mx-0">
                          <img
                            src={t.img}
                            alt={t.name}
                            width={128}
                            height={128}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex flex-col">
                          <div className=" text-5xl font-bold  font-['Times_New_Roman',serif]">
                            “
                          </div>
                          <p
                            className="text-gray-700 text-lg md:text-xl mb-4"
                            style={{ fontFamily: "var(--font-plus-jakarta)" }}
                          >
                            {t.quote}
                          </p>
                          <div className="font-bold text-xl">{t.name}</div>
                          <div className="text-gray-500">{t.company}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {/* Rotating testimonials carousel */}
                  <motion.div
                    className="mt-24"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={fadeIn}
                    custom={0.4}
                  >
                    <div className="relative overflow-hidden py-8">
                      {/* Marquee effect: seamless, continuous left-to-right */}
                      <div className="flex gap-8 whitespace-nowrap relative">
                        <motion.div
                          className="flex gap-8"
                          style={{ minWidth: "100%" }}
                          animate={{ x: ["0%", "-50%"] }}
                          transition={{
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 18,
                            ease: "linear",
                          }}
                        >
                          {[
                            {
                              quote:
                                "Exceptional developer with incredible attention to detail.",
                              name: "Alex Johnson",
                              company: "Tech Innovators",
                            },
                            {
                              quote:
                                "Fast delivery and top-notch quality code.",
                              name: "Sarah Williams",
                              company: "Digital Solutions",
                            },
                            {
                              quote:
                                "A true professional who understands business needs.",
                              name: "Robert Chen",
                              company: "Growth Partners",
                            },
                          ]
                            .concat([
                              {
                                quote:
                                  "Exceptional developer with incredible attention to detail.",
                                name: "Alex Johnson",
                                company: "Tech Innovators",
                              },
                              {
                                quote:
                                  "Fast delivery and top-notch quality code.",
                                name: "Sarah Williams",
                                company: "Digital Solutions",
                              },
                              {
                                quote:
                                  "A true professional who understands business needs.",
                                name: "Robert Chen",
                                company: "Growth Partners",
                              },
                            ])
                            .map((item, i) => (
                              <div
                                key={`marquee-${i}`}
                                className="inline-flex shrink-0 items-center bg-gray-50 px-6 py-4 rounded-xl mx-2"
                              >
                                <p
                                  className="mr-4 font-medium"
                                  style={{
                                    fontFamily: "var(--font-plus-jakarta)",
                                  }}
                                >
                                  "{item.quote}"
                                </p>
                                <div className="shrink-0">
                                  <div className="font-bold text-sm">
                                    {item.name}
                                  </div>
                                  <div className="text-gray-500 text-xs">
                                    {item.company}
                                  </div>
                                </div>
                              </div>
                            ))}
                        </motion.div>
                      </div>
                      <div className="h-16" />
                    </div>
                  </motion.div>
                </div>

                {/* Questions / FAQ */}
                <div className="mb-16">
                  <h2 className="text-4xl md:text-8xl font-extrabold mb-12 font-[Montserrat,Inter,sans-serif] tracking-tight text-center">
                    QUESTIONS
                  </h2>
                  <div className="space-y-8">
                    {[
                      {
                        id: "001",
                        question: "How long do projects typically take?",
                        answer:
                          "Project timelines vary based on complexity, but most projects are completed within 2-6 weeks. We'll discuss your specific needs and set clear milestones.",
                      },
                      {
                        id: "002",
                        question: "What technologies do you specialize in?",
                        answer:
                          "I specialize in React, Next.js, Node.js, TypeScript, Python, and cloud platforms like AWS. I always choose the best stack for your project.",
                      },
                      {
                        id: "003",
                        question: "How do we get started?",
                        answer:
                          "Just reach out via email or LinkedIn! We'll schedule a call to discuss your goals, requirements, and next steps.",
                      },
                      {
                        id: "004",
                        question: "Do you offer ongoing support?",
                        answer:
                          "Yes, I offer maintenance and support packages to ensure your project continues to run smoothly after launch.",
                      },
                    ].map((faq, i) => {
                      const [open, setOpen] = useState(false);
                      return (
                        <div
                          key={faq.id}
                          className="border-b border-gray-200 last:border-0 bg-white/80  transition-shadow hover:shadow-lg"
                        >
                          <button
                            className="w-full flex items-center justify-between px-8 py-8 text-left focus:outline-none"
                            onClick={() => setOpen((v) => !v)}
                            aria-expanded={open}
                            aria-controls={`faq-${faq.id}`}
                          >
                            <span className="flex items-center gap-8">
                              <span className="text-gray-400 text-lg font-mono w-12">
                                {faq.id}
                              </span>
                              <span
                                className="text-2xl md:text-3xl text-black font-light"
                                style={{
                                  fontFamily: "var(--font-plus-jakarta)",
                                }}
                              >
                                {faq.question}
                              </span>
                            </span>
                            <span className="ml-4 text-black text-3xl font-thin">
                              {open ? "−" : "+"}
                            </span>
                          </button>
                          {open && (
                            <div
                              id={`faq-${faq.id}`}
                              className="px-20 pb-10 text-lg text-gray-700 font-extralight"
                              style={{ fontFamily: "var(--font-plus-jakarta)" }}
                            >
                              {faq.answer}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
      <div className="pt-20 pb-2 px-4 flex justify-center">
        <span className="text-4xl md:text-5xl font-extrabold font-[Montserrat,Inter,sans-serif] tracking-tight text-center">
          TECHNOLOGIES I USE
        </span>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-4 p-8 mb-16">
        <img
          width="50"
          src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/firebase.png"
          alt="Firebase"
          title="Firebase"
        />
        <img
          width="50"
          src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/supabase.png"
          alt="Supabase"
          title="Supabase"
        />
        <img
          width="50"
          src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/javascript.png"
          alt="JavaScript"
          title="JavaScript"
        />
        <img
          width="50"
          src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/react.png"
          alt="React"
          title="React"
        />
        <img
          width="50"
          src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/typescript.png"
          alt="TypeScript"
          title="TypeScript"
        />
        <img
          width="50"
          src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/node_js.png"
          alt="Node.js"
          title="Node.js"
        />
        <img
          width="50"
          src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/next_js.png"
          alt="Next.js"
          title="Next.js"
        />
        <img
          width="50"
          src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/c.png"
          alt="C"
          title="C"
        />
        <img
          width="50"
          src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/python.png"
          alt="Python"
          title="Python"
        />
        <img
          width="50"
          src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/php.png"
          alt="php"
          title="php"
        />
        <img
          width="50"
          src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/go.png"
          alt="Go"
          title="Go"
        />
        <img
          width="50"
          src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/flutter.png"
          alt="Flutter"
          title="Flutter"
        />
        <img
          width="50"
          src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/postgresql.png"
          alt="PostgreSQL"
          title="PostgreSQL"
        />
        <img
          width="50"
          src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/mysql.png"
          alt="MySQL"
          title="MySQL"
        />
        <img
          width="50"
          src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/mongodb.png"
          alt="mongoDB"
          title="mongoDB"
        />
        <img
          width="50"
          src="https://raw.githubusercontent.com/marwin1991/profile-technology-icons/refs/heads/main/icons/docker.png"
          alt="Docker"
          title="Docker"
        />
      </div>
      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            className="text-3xl md:text-5xl font-extrabold mb-8 font-[Montserrat,Inter,sans-serif] tracking-tight"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0.1}
          >
            GET IN TOUCH
          </motion.h2>
          <motion.p
            className="text-xl text-gray-400 mb-8 font-extralight"
            style={{ fontFamily: "var(--font-plus-jakarta)" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0.15}
          >
            Whether you have a project in mind, want to collaborate, or just
            want to say hello, I'd love to hear from you.
          </motion.p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={0.2}
            >
              <Button
                variant="outline"
                className="bg-white text-black  transition-transform duration-200 hover:scale-105"
                onClick={() => window.open("mailto:hi@mrdsa.dev", "_blank")}
              >
                Email Me
              </Button>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={0.25}
            >
              <Button
                variant="outline"
                className="bg-black text-white border-white hover:bg-gray-900 transition-transform duration-200 hover:scale-105"
                onClick={() =>
                  window.open("https://linkedin.com/in/mrdsa04", "_blank")
                }
              >
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-gray-800">
        <motion.div
          className="max-w-4xl mx-auto text-center text-gray-400 font-extralight"
          style={{ fontFamily: "var(--font-plus-jakarta)" }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          custom={0.1}
        >
          <p>&copy; 2024 Dewan Shakil Akhtar. All rights reserved. </p>
        </motion.div>
      </footer>
    </div>
  );
}
