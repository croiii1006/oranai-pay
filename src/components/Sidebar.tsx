import React from 'react';
import { X, FileText, Users, BookOpen, Briefcase, Code, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  const menuItems = [
    { icon: FileText, label: t('sidebar.resources'), href: '#' },
    { icon: Users, label: t('sidebar.aboutUs'), href: '#' },
    { icon: BookOpen, label: t('sidebar.blog'), href: '#' },
    { icon: Briefcase, label: t('sidebar.careers'), href: '#' },
    { icon: Code, label: t('sidebar.docs'), href: '#' },
    { icon: Shield, label: t('sidebar.privacy'), href: '#' },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-background/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-80 glass-strong transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border/50">
            <span className="text-xl font-light tracking-tight">OranAI</span>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-accent transition-colors duration-200"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.href}
                    className="flex items-center space-x-4 px-4 py-3 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 group"
                    onClick={onClose}
                  >
                    <item.icon className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-6 border-t border-border/50">
            <p className="text-xs text-muted-foreground">
              © 2024 OranAI
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
