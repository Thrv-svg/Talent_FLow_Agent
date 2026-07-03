import React from 'react';
import { Compass, Book, Target, Award, ArrowRight, Zap, Briefcase } from 'lucide-react';
import { UserProfile } from '../types';

interface CareerRoadmapProps {
  profile: UserProfile;
  psychResults?: any;
}

export default function CareerRoadmap({ profile, psychResults }: CareerRoadmapProps) {
  // We determine career suggestions based on their stats
  const stats = profile.stats || { ovr: 0, acd: 0, spd: 0, con: 0, str: 0, com: 0, ldr: 0, dtl: 0 };
  const discScores = psychResults?.disc?.scores || { D: 0, I: 0, S: 0, C: 0 };

  const suggestions = [];

  // Suggest based on dominant characteristics
  if (stats.acd > 85 && stats.dtl >= 70) {
    suggestions.push({
      role: 'Data Scientist / ML Engineer',
      description: 'Your high academic score and attention to detail make you well-suited for a career dealing with large datasets and complex algorithms.',
      skillsToLearn: ['Python', 'SQL', 'TensorFlow', 'Data Visualization'],
      matchScore: 95,
      icon: Target
    });
  }

  if (stats.ldr >= 75 && (discScores.D > 20 || discScores.I > 20)) {
    suggestions.push({
      role: 'Product Manager / Tech Lead',
      description: 'Your leadership score combined with your DISC profile shows great potential in leading teams and managing product lifecycles.',
      skillsToLearn: ['Agile Methodologies', 'Scrum', 'System Design', 'Business Strategy'],
      matchScore: 92,
      icon: Compass
    });
  }

  if (stats.spd >= 80 && stats.con >= 80) {
    suggestions.push({
      role: 'Software Engineer / Backend Developer',
      description: 'Your high processing speed and consistency on the Kraepelin test is perfect for high-performance software engineering tasks.',
      skillsToLearn: ['Node.js', 'Go', 'Distributed Systems', 'Cloud Architecture'],
      matchScore: 88,
      icon: Zap
    });
  }
  
  if (discScores.I > 25 && stats.com >= 70) {
    suggestions.push({
      role: 'Developer Advocate / Tech Sales',
      description: 'With your strong communication skills and influential personality, you would thrive in roles connecting engineering teams with clients or the community.',
      skillsToLearn: ['Public Speaking', 'Technical Writing', 'CRM', 'Networking'],
      matchScore: 85,
      icon: Award
    });
  }

  // Fallback if no specific high traits match
  if (suggestions.length === 0) {
    suggestions.push({
      role: 'Frontend Developer',
      description: 'A great starting point for many tech careers. Focus on building user-centric interfaces and improving your core programming logic.',
      skillsToLearn: ['React', 'TypeScript', 'CSS/Tailwind', 'UX Principles'],
      matchScore: 80,
      icon: Briefcase
    });
    suggestions.push({
      role: 'QA Engineer',
      description: 'Leverage your foundational skills by ensuring software quality and writing automated test suites.',
      skillsToLearn: ['Cypress', 'Jest', 'Selenium', 'CI/CD pipelines'],
      matchScore: 75,
      icon: Target
    });
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-200 dark:border-gray-700 rounded-3xl p-6 md:p-8 space-y-4">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-display flex items-center gap-2">
          <Compass className="w-6 h-6 text-teal-400" /> Career Roadmap
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out max-w-2xl">
          Based on your psychometric assessments and academic scores, we have curated specific career paths where your natural traits and skills will give you a competitive edge.
        </p>

        {stats.ovr === 0 ? (
          <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-700 transition-colors duration-300 ease-in-out rounded-2xl border border-gray-300 text-center">
            <Book className="w-8 h-8 text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ">Complete Assessments to Unlock</h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out mt-2">
              Finish your Academic Quizzes, Kraepelin, DISC, and PAPI tests to receive personalized career recommendations.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
             {suggestions.map((sug, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-900 transition-colors duration-300 ease-in-out /50 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-teal-500/30 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center shrink-0 border border-teal-500/20">
                      <sug.icon className="w-6 h-6 text-teal-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                         <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out ">{sug.role}</h3>
                         <span className="flex items-center gap-1 text-xs font-bold px-2 py-1 bg-teal-500/10 text-teal-400 rounded-md">
                           {sug.matchScore}% Match
                         </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out mb-4">{sug.description}</p>
                      
                      <div className="space-y-2">
                        <span className="text-[10px] uppercase font-bold text-gray-500 dark:text-gray-400 transition-colors duration-300 ease-in-out ">Recommended Skills to Master:</span>
                        <div className="flex flex-wrap gap-2">
                          {sug.skillsToLearn.map((skill, sIdx) => (
                            <span key={sIdx} className="px-3 py-1 bg-white dark:bg-gray-800 transition-colors duration-300 ease-in-out border border-gray-300 rounded-full text-xs font-medium text-gray-800">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
             ))}
          </div>
        )}
      </div>

      {stats.ovr > 0 && (
         <div className="bg-gradient-to-r from-teal-900/40 to-blue-900/40 border border-teal-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
           <div>
             <h3 className="text-lg font-bold text-gray-900 dark:text-white transition-colors duration-300 ease-in-out mb-1">Ready to step up?</h3>
             <p className="text-xs text-gray-600 dark:text-gray-400 transition-colors duration-300 ease-in-out ">Discover internships currently hiring for these roles.</p>
           </div>
           <button className="shrink-0 flex items-center gap-2 px-6 py-3 bg-teal-500 text-gray-900 dark:text-white transition-colors duration-300 ease-in-out font-bold rounded-xl hover:bg-teal-400 transition-colors">
             View Opportunities <ArrowRight className="w-4 h-4" />
           </button>
         </div>
      )}
    </div>
  );
}
