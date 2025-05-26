'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { SchemaBuilder } from '@/components/SchemaBuilder';
import { CodePreview } from '@/components/CodePreview';
import { TemplateLibrary } from '@/components/TemplateLibrary';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'builder' | 'preview' | 'templates'>('builder');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex flex-col">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="flex flex-1 relative">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 p-3 md:p-6 pb-96 min-h-screen">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'builder' && <SchemaBuilder />}
            {activeTab === 'preview' && <CodePreview />}
            {activeTab === 'templates' && <TemplateLibrary />}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
} 