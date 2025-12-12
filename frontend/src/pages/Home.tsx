import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  icon: string;
  label: string;
  route: string;
  isPlaceholder?: boolean;
}

const categories: Category[] = [
  {
    id: 'projects',
    icon: '📋',
    label: 'Project Board',
    route: '/projects',
  },
  {
    id: 'workflows',
    icon: '🔄',
    label: 'Workflow automation',
    route: '/workflows',
  },
  {
    id: 'teams',
    icon: '👥',
    label: 'Team management',
    route: '/teams',
  },
  {
    id: 'runbooks',
    icon: '📖',
    label: 'Runbooks',
    route: '/runbooks',
  },
  {
    id: 'engineers',
    icon: '👨‍💻',
    label: 'Engineer directory',
    route: '/engineers',
  },
  {
    id: 'slack',
    icon: '💬',
    label: 'Slack integration',
    route: '/settings',
  },
  {
    id: 'poc',
    icon: '🧪',
    label: 'POC Projects',
    route: '#',
    isPlaceholder: true,
  },
  {
    id: 'demo',
    icon: '🎯',
    label: 'Demo Projects',
    route: '#',
    isPlaceholder: true,
  },
  {
    id: 'ai-tools',
    icon: '🤖',
    label: 'AI Tools',
    route: '#',
    isPlaceholder: true,
  },
  {
    id: 'analytics',
    icon: '📊',
    label: 'Analytics',
    route: '#',
    isPlaceholder: true,
  },
  {
    id: 'custom',
    icon: '⚙️',
    label: 'Custom Workflows',
    route: '/workflows/new',
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (id: string, isPlaceholder?: boolean) => {
    if (isPlaceholder) return; // Don't allow selection of placeholders
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const handleGetStarted = () => {
    // Navigate to the first selected category's route, or default to workflows
    if (selectedCategories.length > 0) {
      const firstSelected = categories.find((cat) => cat.id === selectedCategories[0]);
      navigate(firstSelected?.route || '/workflows');
    } else {
      navigate('/workflows');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 flex items-center justify-center p-8">
      <div className="max-w-7xl w-full">
        {/* Kirro Branding Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-[#8d75e6] to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-7 h-7 text-white"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#8d75e6] to-purple-600 bg-clip-text text-transparent">
              Kirro
            </h1>
          </div>
          <h2 className="text-5xl font-bold text-slate-900 mb-6">
            A platform to optimize your workflow management
          </h2>
          <p className="text-xl text-slate-700 mb-8">
            Boost your team's efficiency and productivity through custom and automated workflows
          </p>
          <p className="text-lg text-slate-600 mb-12">Select what you'd like to manage:</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12 max-w-6xl mx-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id, category.isPlaceholder)}
              disabled={category.isPlaceholder}
              className={`relative p-6 rounded-2xl border-2 transition-all ${category.isPlaceholder
                  ? 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                  : selectedCategories.includes(category.id)
                    ? 'border-[#8d75e6] bg-purple-50 hover:shadow-md'
                    : 'border-slate-300 bg-white hover:border-[#8d75e6] hover:shadow-md'
                }`}
            >
              {!category.isPlaceholder && (
                <div className="absolute top-4 left-4">
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center ${selectedCategories.includes(category.id)
                        ? 'border-[#8d75e6] bg-[#8d75e6]'
                        : 'border-slate-400 bg-white'
                      }`}
                  >
                    {selectedCategories.includes(category.id) && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </div>
                </div>
              )}

              {category.isPlaceholder && (
                <div className="absolute top-4 right-4">
                  <span className="text-xs font-medium text-slate-500 bg-slate-200 px-2 py-1 rounded-full">
                    Soon
                  </span>
                </div>
              )}

              <div className="flex flex-col items-center justify-center pt-8">
                <div className={`text-4xl mb-4 ${category.isPlaceholder ? 'grayscale' : ''}`}>
                  {category.icon}
                </div>
                <p className={`text-sm font-medium text-center ${category.isPlaceholder ? 'text-slate-500' : 'text-slate-900'}`}>
                  {category.label}
                </p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-[#8d75e6] text-white font-semibold text-lg rounded-full hover:bg-purple-600 transition-colors flex items-center space-x-2 shadow-lg"
          >
            <span>Get Started</span>
            <svg
              className="w-5 h-5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
            </svg>
          </button>
          <p className="text-sm text-slate-500 mt-4">Free forever. No credit card.</p>
        </div>
      </div>
    </div>
  );
};
