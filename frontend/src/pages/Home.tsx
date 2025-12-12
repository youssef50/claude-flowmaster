import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ProductCard {
  id: string;
  icon: string;
  label: string;
  description: string;
  route: string;
}

interface ProductCategory {
  title: string;
  products: ProductCard[];
}

const productCategories: ProductCategory[] = [
  {
    title: 'Project Management',
    products: [
      {
        id: 'projects',
        icon: '📋',
        label: 'Project Board',
        description: 'Manage client projects & phases',
        route: '/projects',
      },
      {
        id: 'teams',
        icon: '👥',
        label: 'Teams',
        description: 'Organize your teams',
        route: '/teams',
      },
      {
        id: 'engineers',
        icon: '👨‍💻',
        label: 'Engineers',
        description: 'Engineer directory',
        route: '/engineers',
      },
    ],
  },
  {
    title: 'Automation & Workflows',
    products: [
      {
        id: 'workflows',
        icon: '🔄',
        label: 'Workflows',
        description: 'Automate your processes',
        route: '/workflows',
      },
      {
        id: 'runbooks',
        icon: '📖',
        label: 'Runbooks',
        description: 'Document procedures',
        route: '/runbooks',
      },
    ],
  },
  {
    title: 'Integrations',
    products: [
      {
        id: 'slack',
        icon: '💬',
        label: 'Slack',
        description: 'Team communications',
        route: '/settings',
      },
      {
        id: 'notifications',
        icon: '🔔',
        label: 'Notifications',
        description: 'Smart alerts',
        route: '/workflows/new',
      },
    ],
  },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Header with Kirro Branding */}
      <div className="border-b border-slate-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Kirro
            </h1>
          </div>
          <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            Sign In
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-slate-900 mb-4">
            Your Complete Platform for
            <span className="block mt-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Project & Workflow Management
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto mt-6">
            Streamline operations, automate workflows, and manage teams—all in one place
          </p>
        </div>

        {/* Product Categories */}
        <div className="space-y-12">
          {productCategories.map((category) => (
            <div key={category.title}>
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                <span className="w-1 h-6 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full mr-3"></span>
                {category.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.products.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleCardClick(product.route)}
                    className="group relative p-6 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 text-left"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {product.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-semibold text-slate-900 mb-1">
                          {product.label}
                        </h4>
                        <p className="text-sm text-slate-500">{product.description}</p>
                      </div>
                      <svg
                        className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all flex-shrink-0"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-500">
            Phase 1: Foundation • Coming soon: Advanced project planning with roles & authentication
          </p>
        </div>
      </div>
    </div>
  );
};
