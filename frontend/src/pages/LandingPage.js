import { Link } from 'react-router-dom';
import { FiCheck, FiArrowRight, FiClock, FiUsers, FiBarChart2, FiFileText, FiBell, FiShield } from 'react-icons/fi';

const LandingPage = () => {
  const features = [
    {
      icon: FiFileText,
      title: 'Ticket Management',
      description: 'Create, track, and resolve tickets with an intuitive workflow system.'
    },
    {
      icon: FiClock,
      title: 'SLA Tracking',
      description: 'Automatic deadline monitoring with real-time visual indicators.'
    },
    {
      icon: FiUsers,
      title: 'Team Collaboration',
      description: 'Work together with comments, mentions, and assignments.'
    },
    {
      icon: FiBarChart2,
      title: 'Analytics Dashboard',
      description: 'Real-time insights into ticket distribution and team performance.'
    },
    {
      icon: FiBell,
      title: 'Smart Notifications',
      description: 'Stay updated with instant notifications on ticket changes.'
    },
    {
      icon: FiShield,
      title: 'Role-Based Access',
      description: 'Secure access control for users, agents, and administrators.'
    }
  ];

  const stats = [
    { value: '24/7', label: 'Support Tracking' },
    { value: '3', label: 'Priority Levels' },
    { value: 'Real-time', label: 'Updates' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-2">
                <FiFileText className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">HelpDesk</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-md hover:shadow-lg"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Support Tickets Made
              <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Simple & Efficient
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Track, manage, and resolve customer issues with our powerful ticketing system.
              Built for teams that value speed and clarity.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/signup"
                className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-xl hover:shadow-2xl flex items-center gap-2"
              >
                <span>Start Free Today</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 bg-white text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg border border-gray-200"
              >
                Sign In
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-indigo-600">{stat.value}</div>
                  <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to streamline your support workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 border border-gray-100 hover:border-indigo-200 hover:shadow-xl transition-all"
              >
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl p-3 w-fit mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-indigo-200 max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Account',
                description: 'Sign up and set up your team with role-based access control.'
              },
              {
                step: '02',
                title: 'Submit Tickets',
                description: 'Create tickets with priorities, attachments, and automatic SLA tracking.'
              },
              {
                step: '03',
                title: 'Track & Resolve',
                description: 'Monitor progress, collaborate with comments, and close tickets efficiently.'
              }
            ].map((item, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
                <div className="text-5xl font-bold text-white/30 mb-4">{item.step}</div>
                <h3 className="text-2xl font-semibold text-white mb-3">{item.title}</h3>
                <p className="text-indigo-200">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose HelpDesk?
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Built with modern teams in mind, our platform delivers the tools you need without the complexity you don't.
              </p>
              
              <div className="space-y-4">
                {[
                  'Priority-based SLA deadlines with visual indicators',
                  'Real-time analytics and performance tracking',
                  'Seamless team collaboration with comments',
                  'Smart auto-assignment for balanced workload',
                  'File attachments for better context',
                  'Secure role-based access control'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="bg-green-100 rounded-full p-1 mt-1">
                      <FiCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-40"></div>
                
                <div className="relative space-y-4">
                  {[
                    { status: 'High Priority', color: 'red', time: '4h left' },
                    { status: 'Medium Priority', color: 'orange', time: '24h left' },
                    { status: 'Low Priority', color: 'green', time: '48h left' }
                  ].map((ticket, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full bg-${ticket.color}-500`}></div>
                          <span className="font-medium text-gray-900">{ticket.status}</span>
                        </div>
                        <span className="text-sm text-gray-600">{ticket.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Ready to Transform Your Support?
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join teams already managing their tickets more efficiently with HelpDesk.
          </p>
          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-xl hover:shadow-2xl"
          >
            <span>Get Started Free</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-2">
                <FiFileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-white">HelpDesk</span>
            </div>
            <div className="text-center md:text-left">
              <p>© 2025 HelpDesk. Built for efficient support management.</p>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;
