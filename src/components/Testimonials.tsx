import { Quote, Star } from 'lucide-react';

const testimonials = [
  {
    name: "Enyel Sequeira",
    role: "Full Stack Developer",
    content: "I had started learning from Adrian 6 months ago, and although I am attending an expensive web development bootcamp I always feel Adrian does a much better and more efficient job.",
    avatar: "https://i.pravatar.cc/150?u=enyel"
  },
  {
    name: "Sarah Jenkins",
    role: "Frontend Engineer",
    content: "This course completely changed my understanding of Asynchronous JavaScript. The event loop explanation was a game changer for me.",
    avatar: "https://i.pravatar.cc/150?u=sarah"
  },
  {
    name: "Michael Chen",
    role: "Junior Developer",
    content: "The best part is the community. Being able to ask questions and get feedback from expert developers made my learning process 10x faster.",
    avatar: "https://i.pravatar.cc/150?u=michael"
  }
];

const Testimonials = () => {
  return (
    <section id="reviews" className="py-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Loved by Developers</h2>
          <p className="text-gray-400">Join thousands of developers who have mastered JavaScript with us.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card p-8 hover:bg-white/10 transition-colors">
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <Quote className="text-indigo-500 mb-4 opacity-50" size={32} />
              <p className="text-gray-300 mb-8 italic">"{t.content}"</p>
              <div className="flex items-center gap-4">
                <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-indigo-500/30" />
                <div>
                  <h4 className="text-white font-bold">{t.name}</h4>
                  <p className="text-gray-500 text-sm">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
