import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "Do I need prior coding experience?",
    answer: "No! This course starts from absolute zero. We cover the very basics of variables and syntax before moving into more advanced topics."
  },
  {
    question: "What frameworks do you use? React? Vue?",
    answer: "The whole idea of this course is that it will set you up for success no matter the framework you use. We focus on 'Just JavaScript' using the core language features."
  },
  {
    question: "How long do I have access to the course?",
    answer: "You get lifetime access! You can learn at your own pace and revisit the material whenever you need a refresher."
  },
  {
    question: "Is there a certificate of completion?",
    answer: "Yes, once you complete all the lessons and projects, you will receive a digital certificate that you can share on LinkedIn or your portfolio."
  }
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-gray-950/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-12 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="glass-card overflow-hidden">
                <button 
                  className="w-full px-6 py-5 flex items-center justify-between text-left"
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  <span className="text-lg font-semibold text-white">{faq.question}</span>
                  {openIndex === index ? <ChevronUp className="text-indigo-400" /> : <ChevronDown className="text-gray-500" />}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-400 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
