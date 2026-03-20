import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Mail, Phone, Linkedin } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

// Custom icons for social platforms
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
  </svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/>
  </svg>
);

const WeChatIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 01.213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.32.32 0 00.167-.054l1.903-1.114a.864.864 0 01.717-.098 10.16 10.16 0 002.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178A1.17 1.17 0 014.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 01-1.162 1.178 1.17 1.17 0 01-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 01.598.082l1.584.926a.272.272 0 00.14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 01-.023-.156.49.49 0 01.201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-2.036 2.891c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 01-.969.983.976.976 0 01-.969-.983c0-.542.434-.982.969-.982z"/>
  </svg>
);

const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { t } = useLanguage();
  const [aboutDialogOpen, setAboutDialogOpen] = useState(false);

  const footerLinks = [
    { label: t('nav.solution'), action: () => setActiveTab('solution') },
    { label: t('nav.models'), action: () => setActiveTab('models') },
    { label: t('nav.products'), action: () => setActiveTab('products') },
    { label: t('sidebar.resources'), action: () => {} },
    { label: t('nav.library'), action: () => setActiveTab('library') },
    { label: t('sidebar.aboutUs'), action: () => setAboutDialogOpen(true) },
  ];

  const socialLinks = [
    { icon: XIcon, href: 'https://x.com/oranai', label: 'X' },
    { icon: FacebookIcon, href: 'https://facebook.com/oranai', label: 'Facebook' },
    { icon: PinterestIcon, href: 'https://pinterest.com/oranai', label: 'Pinterest' },
    { icon: Linkedin, href: 'https://linkedin.com/company/oranai', label: 'LinkedIn' },
    { icon: DiscordIcon, href: 'https://discord.gg/oranai', label: 'Discord' },
    { icon: WeChatIcon, href: '#', label: 'WeChat' },
  ];

  return (
    <>
      <footer className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-5 md:space-y-0">
            {/* Logo */}
            <div className="cursor-pointer">
              <img 
                src="/logo_dark.svg" 
                alt="OranAI" 
                className="h-6 dark:hidden"
              />
              <img 
                src="/logo.svg" 
                alt="OranAI" 
                className="h-6 hidden dark:block"
              />
            </div>

            {/* Links */}
            <nav className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
              {footerLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={link.action}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 link-underline"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contact Us Section */}
          <div className="mt-8 pt-6">
            <div className="flex flex-col items-end gap-4">
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 rounded-xl bg-muted/50 hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all duration-200"
                    aria-label={social.label}
                  >
                    <social.icon />
                  </a>
                ))}
              </div>

              {/* Contact Info */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{t('footer.contactUs')}: hey@photog.art</span>
                </div>
                <span className="hidden sm:inline">|</span>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>{t('footer.phone')}: +86 19946254041</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-6 pt-5 text-center">
            <p className="text-xs text-muted-foreground">
              {t('footer.copyright')}
            </p>
          </div>
        </div>
      </footer>

      {/* About Us Dialog */}
      <Dialog open={aboutDialogOpen} onOpenChange={setAboutDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{t('about.title')}</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {t('about.subtitle')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-6 space-y-6">
            {/* Company Introduction */}
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('about.whoWeAre')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.whoWeAreDesc')}
              </p>
            </div>

            {/* Mission */}
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('about.mission')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('about.missionDesc')}
              </p>
            </div>

            {/* Values */}
            <div>
              <h3 className="text-lg font-semibold mb-2">{t('about.values')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <h4 className="font-medium mb-1">{t('about.innovation')}</h4>
                  <p className="text-sm text-muted-foreground">{t('about.innovationDesc')}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <h4 className="font-medium mb-1">{t('about.excellence')}</h4>
                  <p className="text-sm text-muted-foreground">{t('about.excellenceDesc')}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <h4 className="font-medium mb-1">{t('about.collaboration')}</h4>
                  <p className="text-sm text-muted-foreground">{t('about.collaborationDesc')}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <h4 className="font-medium mb-1">{t('about.integrity')}</h4>
                  <p className="text-sm text-muted-foreground">{t('about.integrityDesc')}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Footer;
