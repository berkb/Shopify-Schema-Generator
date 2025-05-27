'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { SchemaBuilder } from '@/components/SchemaBuilder';
import { CodePreview } from '@/components/CodePreview';
import { TemplateLibrary } from '@/components/TemplateLibrary';
import { Footer } from '@/components/Footer';
import { useSchemaStore } from '@/store/schemaStore';

export default function Home() {
  const [activeTab, setActiveTab] = useState<'builder' | 'preview' | 'templates'>('builder');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { hasUnsavedChanges } = useSchemaStore();

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = 'Kaydedilmemiş değişiklikleriniz var. Sayfayı kapatmak istediğinizden emin misiniz?';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

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