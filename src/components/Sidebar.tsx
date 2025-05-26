'use client';

import { Code, Eye, Library, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: 'builder' | 'preview' | 'templates';
  onTabChange: (tab: 'builder' | 'preview' | 'templates') => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  const tabs = [
    {
      id: 'builder' as const,
      label: 'Schema Builder',
      icon: Code,
      description: 'Build your schema'
    },
    {
      id: 'preview' as const,
      label: 'Code Preview',
      icon: Eye,
      description: 'Preview generated code'
    },
    {
      id: 'templates' as const,
      label: 'Templates',
      icon: Library,
      description: 'Browse templates'
    }
  ];

  const handleTabChange = (tab: 'builder' | 'preview' | 'templates') => {
    onTabChange(tab);
    onClose(); // Close sidebar on mobile after selection
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed md:relative z-50 md:z-auto
        w-64 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 
        h-[calc(100vh-73px)] md:h-[calc(100vh-73px)]
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-shopify-50 dark:bg-shopify-900/20 text-shopify-700 dark:text-shopify-300 border border-shopify-200 dark:border-shopify-700'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-700'
                  }`}
                >
                  <Icon size={18} />
                  <div>
                    <div className="font-medium">{tab.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {tab.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
} 