import { useNavigate } from 'react-router-dom'
import { Home, StickyNote, Zap, Lock, Share2, Layers, Download, Palette } from 'lucide-react'
import Footer from '@/components/Footer'

export default function AboutPage() {
  const navigate = useNavigate()

  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Instant Setup',
      description: 'No sign-up, no login. Create a board and start organizing in seconds.',
    },
    {
      icon: <Share2 className="w-6 h-6" />,
      title: 'Easy Sharing',
      description: 'Share your board URL with anyone. Real-time collaboration made simple.',
    },
    {
      icon: <Layers className="w-6 h-6" />,
      title: 'Kanban & Grid Views',
      description: 'Toggle between kanban boards and grid layouts to suit your workflow.',
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: 'Beautiful Design',
      description: 'Colorful sticky notes with tags, todos, and rich text descriptions.',
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: 'Export & Import',
      description: 'Backup your notes as JSON files and import them whenever needed.',
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Privacy Conscious',
      description: 'No tracking, no ads. Your data stays with you.',
    },
  ]

  const faqs = [
    {
      question: 'Why was The Last Sticky Note created?',
      answer: 'We built this tool because existing solutions were too complicated for quick brainstorming sessions. Sometimes you just need a simple board to organize thoughts with your team—no account creation, no complex permissions, just instant collaboration.',
    },
    {
      question: 'Is my data secure?',
      answer: 'The Last Sticky Note is designed for convenience, not security. Anyone with your board URL can view and edit it. Do not store sensitive information like passwords, personal data, or confidential business information on your boards.',
    },
    {
      question: 'Do I need to create an account?',
      answer: 'No! That\'s the beauty of it. Simply create a board and you\'ll get a unique URL. Share that URL with anyone you want to collaborate with. No email, no password, no hassle.',
    },
    {
      question: 'How long do boards last?',
      answer: 'Boards are stored in our database and remain available as long as you have the URL. However, we recommend regularly exporting your important boards as JSON backups.',
    },
    {
      question: 'Can I use this for sensitive information?',
      answer: 'No. This tool is built for speed and ease of use, not security. Anyone with the board link can access it. Use it for brainstorming, quick planning, and non-sensitive collaboration only.',
    },
    {
      question: 'Is this free?',
      answer: 'Yes! The Last Sticky Note is completely free to use. No hidden costs, no premium tiers.',
    },
    {
      question: 'Can I customize my notes?',
      answer: 'Absolutely! Each note can have a title, short description, detailed description, color theme, tags, and a todo list. Drag and drop to organize them however you like.',
    },
    {
      question: 'What are the different views?',
      answer: 'The Last Sticky Note offers two views: Grid View for a visual board of sticky notes, and Kanban View for organizing notes by status (New, Todo, Ongoing, Closed).',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 flex flex-col">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </button>
            <div className="flex items-center gap-2 text-amber-500">
              <StickyNote className="w-6 h-6" />
              <span className="font-bold text-lg hidden sm:inline">The Last Sticky Note</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto px-4 py-12 w-full">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <StickyNote className="w-20 h-20 text-amber-400" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            About The Last Sticky Note
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The simplest way to organize your thoughts and collaborate with your team. 
            No login required. No complexity. Just sticky notes.
          </p>
        </div>

        {/* Why We Built This */}
        <section className="mb-16 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Why We Built This</h2>
          <div className="prose prose-lg text-gray-700 space-y-4">
            <p>
              In today's world, most productivity tools require you to sign up, learn complex interfaces, 
              and manage permissions before you can even start working. We asked ourselves: 
              <strong> "What if it didn't have to be that way?"</strong>
            </p>
            <p>
              The Last Sticky Note was born from a simple need: a digital sticky note board that you can 
              create and share instantly. Whether you're brainstorming with your team, planning a project, 
              or organizing your personal tasks, you should be able to start immediately—not after filling 
              out forms or setting up accounts.
            </p>
            <p>
              We believe in <strong>friction-free collaboration</strong>. Create a board, get a link, 
              share it. That's it. Real-time updates, beautiful design, and zero barriers to entry.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="text-amber-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-bold text-gray-800 mb-3">{faq.question}</h3>
                <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-16 bg-gradient-to-r from-purple-100 via-pink-100 to-yellow-100 rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Perfect For</h2>
          <div className="grid md:grid-cols-2 gap-4 text-gray-700">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">✓</span>
                <span>Quick team brainstorming sessions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">✓</span>
                <span>Personal task management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">✓</span>
                <span>Project planning and tracking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">✓</span>
                <span>Event planning coordination</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">✓</span>
                <span>Meeting notes and action items</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">✓</span>
                <span>Content calendar management</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">✓</span>
                <span>Student study organization</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-1">✓</span>
                <span>Creative idea collection</span>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center bg-white rounded-xl shadow-lg p-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Create your first board in seconds. No signup required.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-yellow-300 via-amber-300 to-orange-300 hover:from-yellow-400 hover:via-amber-400 hover:to-orange-400 text-gray-800 font-bold py-4 px-12 rounded-full text-xl shadow-lg transform transition hover:scale-105 border border-amber-400"
          >
            Create Your Board Now
          </button>
        </section>
      </div>

      <Footer />
    </div>
  )
}
