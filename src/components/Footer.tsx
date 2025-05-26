'use client';

import { useState, useEffect } from 'react';
import { Heart, ExternalLink, Share2, Linkedin, Github, Facebook } from 'lucide-react';

// X (Twitter) icon component since lucide doesn't have the new X logo
const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export function Footer() {
  const [mounted, setMounted] = useState(false);
  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = 'Check out this amazing Shopify Schema Generator tool!';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleShare = (platform: string) => {
    const urls = {
      x: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    };
    
    if (urls[platform as keyof typeof urls]) {
      window.open(urls[platform as keyof typeof urls], '_blank', 'width=600,height=400');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Shopify Schema Generator',
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  return (
    <footer className="bg-white dark:bg-dark-800 border-t border-gray-200 dark:border-dark-600 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Site Info */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Shopify Schema Generator
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Modern, powerful Shopify theme schema generator with real-time preview, 
              validation, and export features.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>for Shopify developers</span>
            </div>
          </div>

          {/* Developer Info */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Developer
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <img
                  src="/me.png"
                  alt="Berk Belcioglu"
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    Berk Belcioglu
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Shopify Developer
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <a
                  href="https://berkb.netlify.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <ExternalLink className="w-3 h-3" />
                  Personal Website
                </a>
                <a
                  href="https://www.linkedin.com/in/berkbelcioglu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Linkedin className="w-3 h-3" />
                  LinkedIn
                </a>
                <a
                  href="https://github.com/berkb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Github className="w-3 h-3" />
                  GitHub
                </a>
                <a
                  href="mailto:berk.belcioglu@gmail.com"
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Contact
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Resources
            </h3>
            <div className="space-y-2">
              <a
                href="https://shopify.dev/docs/themes/architecture/sections/section-schema"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  Schema Documentation
                </div>
              </a>
              <a
                href="https://shopify.dev/docs/themes/liquid"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  Liquid Documentation
                </div>
              </a>
              <a
                href="https://shopify.dev/docs/api/shopify-cli/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-3 h-3" />
                  Shopify CLI
                </div>
              </a>
            </div>
          </div>

          {/* Share */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Share This Tool
            </h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Help other developers discover this tool
              </p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => handleShare('x')}
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <XIcon className="w-3 h-3" />
                  Share on X
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Linkedin className="w-3 h-3" />
                  Share on LinkedIn
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <Facebook className="w-3 h-3" />
                  Share on Facebook
                </button>
                {mounted && 'share' in navigator && (
                  <button
                    onClick={handleNativeShare}
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    <Share2 className="w-3 h-3" />
                    Native Share
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 dark:border-dark-600 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Shopify Schema Generator. All rights reserved.
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <span>Built with Next.js & TypeScript</span>
              <span>•</span>
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 