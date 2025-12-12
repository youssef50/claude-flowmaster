import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Category {
  id: string;
  icon: string;
  label: string;
  route: string;
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
    id: 'communications',
    icon: '📢',
    label: 'Team communications',
    route: '/workflows',
  },
  {
    id: 'notifications',
    icon: '🔔',
    label: 'Smart notifications',
    route: '/workflows/new',
  },
  {
    id: 'approvals',
    icon: '✅',
    label: 'Requests & approvals',
    route: '/workflows/new',
  },
  {
    id: 'reporting',
    icon: '📊',
    label: 'Team reporting',
    route: '/workflows',
  },
  {
    id: 'custom',
    icon: '⚙️',
    label: 'Create your own',
    route: '/workflows/new',
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (id: string) => {
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
    <div className="min-h-screen bg-white flex items-center justify-center p-8">
      <div className="max-w-7xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            A platform to optimize your workflow management
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Boost your team's efficiency and productivity through custom and automated workflows
          </p>
          <p className="text-lg text-gray-600 mb-12">Select what you'd like to manage:</p>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-12 max-w-6xl mx-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => toggleCategory(category.id)}
              className={`relative p-6 rounded-2xl border-2 transition-all hover:border-indigo-400 hover:shadow-md ${
                selectedCategories.includes(category.id)
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <div className="absolute top-4 left-4">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                    selectedCategories.includes(category.id)
                      ? 'border-indigo-500 bg-indigo-500'
                      : 'border-gray-400 bg-white'
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

              <div className="flex flex-col items-center justify-center pt-8">
                <div className="text-4xl mb-4 text-indigo-600">{category.icon}</div>
                <p className="text-sm font-medium text-gray-900 text-center">{category.label}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center">
          <button
            onClick={handleGetStarted}
            className="px-8 py-4 bg-indigo-600 text-white font-semibold text-lg rounded-full hover:bg-indigo-700 transition-colors flex items-center space-x-2 shadow-lg"
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
          <p className="text-sm text-gray-500 mt-4">Free forever. No credit card.</p>
        </div>
      </div>
    </div>
  );
};
