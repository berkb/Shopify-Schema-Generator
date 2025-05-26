import { SchemaTemplate } from '@/types/schema';

export const templates: SchemaTemplate[] = [
  {
    id: 'hero-section',
    name: 'Hero Section',
    description: 'A complete hero section with heading, text, button, and background image',
    category: 'layout',
    schema: {
      name: 'Hero Section',
      tag: 'section',
      settings: [
        {
          id: 'heading',
          type: 'text',
          label: 'Heading',
          default: 'Welcome to our store'
        },
        {
          id: 'subheading',
          type: 'textarea',
          label: 'Subheading',
          default: 'Discover amazing products'
        },
        {
          id: 'button_text',
          type: 'text',
          label: 'Button Text',
          default: 'Shop Now'
        },
        {
          id: 'button_url',
          type: 'url',
          label: 'Button URL'
        },
        {
          id: 'background_image',
          type: 'image_picker',
          label: 'Background Image'
        },
        {
          id: 'text_color',
          type: 'color',
          label: 'Text Color',
          default: '#ffffff'
        }
      ],
      presets: [{
        name: 'Hero Section',
        category: 'Layout'
      }]
    }
  },
  {
    id: 'product-grid',
    name: 'Product Grid',
    description: 'Display products in a customizable grid layout',
    category: 'ecommerce',
    schema: {
      name: 'Product Grid',
      tag: 'section',
      settings: [
        {
          id: 'heading',
          type: 'text',
          label: 'Section Heading',
          default: 'Featured Products'
        },
        {
          id: 'collection',
          type: 'collection',
          label: 'Collection'
        },
        {
          id: 'products_per_row',
          type: 'range',
          label: 'Products per row',
          min: 2,
          max: 5,
          step: 1,
          default: 4
        },
        {
          id: 'show_vendor',
          type: 'checkbox',
          label: 'Show vendor',
          default: false
        },
        {
          id: 'show_price',
          type: 'checkbox',
          label: 'Show price',
          default: true
        }
      ],
      presets: [{
        name: 'Product Grid',
        category: 'E-commerce'
      }]
    }
  },
  {
    id: 'testimonials',
    name: 'Testimonials',
    description: 'Customer testimonials with star ratings and photos',
    category: 'content',
    schema: {
      name: 'Testimonials',
      tag: 'section',
      settings: [
        {
          id: 'heading',
          type: 'text',
          label: 'Section Heading',
          default: 'What our customers say'
        },
        {
          id: 'layout',
          type: 'select',
          label: 'Layout',
          options: [
            { value: 'grid', label: 'Grid' },
            { value: 'slider', label: 'Slider' },
            { value: 'single', label: 'Single' }
          ],
          default: 'grid'
        }
      ],
      blocks: [
        {
          type: 'testimonial',
          name: 'Testimonial',
          settings: [
            {
              id: 'customer_name',
              type: 'text',
              label: 'Customer Name'
            },
            {
              id: 'customer_photo',
              type: 'image_picker',
              label: 'Customer Photo'
            },
            {
              id: 'rating',
              type: 'range',
              label: 'Rating',
              min: 1,
              max: 5,
              step: 1,
              default: 5
            },
            {
              id: 'testimonial_text',
              type: 'textarea',
              label: 'Testimonial Text'
            }
          ]
        }
      ],
      presets: [{
        name: 'Testimonials',
        category: 'Content',
        blocks: [
          {
            type: 'testimonial',
            settings: {
              customer_name: 'John Doe',
              rating: 5,
              testimonial_text: 'Amazing product! Highly recommended.'
            }
          }
        ]
      }]
    }
  },
  {
    id: 'newsletter',
    name: 'Newsletter Signup',
    description: 'Email newsletter subscription form with customizable styling',
    category: 'basic',
    schema: {
      name: 'Newsletter Signup',
      tag: 'section',
      settings: [
        {
          id: 'heading',
          type: 'text',
          label: 'Heading',
          default: 'Subscribe to our newsletter'
        },
        {
          id: 'description',
          type: 'textarea',
          label: 'Description',
          default: 'Get the latest updates and offers'
        },
        {
          id: 'button_text',
          type: 'text',
          label: 'Button Text',
          default: 'Subscribe'
        },
        {
          id: 'background_color',
          type: 'color_background',
          label: 'Background Color',
          default: '#f8f9fa'
        }
      ],
      presets: [{
        name: 'Newsletter Signup',
        category: 'Basic'
      }]
    }
  },
  {
    id: 'image-gallery',
    name: 'Image Gallery',
    description: 'Responsive image gallery with lightbox functionality',
    category: 'content',
    schema: {
      name: 'Image Gallery',
      tag: 'section',
      settings: [
        {
          id: 'heading',
          type: 'text',
          label: 'Gallery Heading',
          default: 'Our Gallery'
        },
        {
          id: 'columns',
          type: 'range',
          label: 'Columns',
          min: 2,
          max: 6,
          step: 1,
          default: 3
        },
        {
          id: 'enable_lightbox',
          type: 'checkbox',
          label: 'Enable Lightbox',
          default: true
        },
        {
          id: 'spacing',
          type: 'select',
          label: 'Image Spacing',
          options: [
            { value: 'none', label: 'None' },
            { value: 'small', label: 'Small' },
            { value: 'medium', label: 'Medium' },
            { value: 'large', label: 'Large' }
          ],
          default: 'medium'
        }
      ],
      blocks: [
        {
          type: 'image',
          name: 'Image',
          settings: [
            {
              id: 'image',
              type: 'image_picker',
              label: 'Image'
            },
            {
              id: 'caption',
              type: 'text',
              label: 'Caption'
            },
            {
              id: 'link',
              type: 'url',
              label: 'Link (Optional)'
            }
          ]
        }
      ],
      presets: [{
        name: 'Image Gallery',
        category: 'Content',
        blocks: [
          { type: 'image' },
          { type: 'image' },
          { type: 'image' }
        ]
      }]
    }
  },
  {
    id: 'faq-section',
    name: 'FAQ Section',
    description: 'Frequently asked questions with collapsible answers',
    category: 'content',
    schema: {
      name: 'FAQ Section',
      tag: 'section',
      settings: [
        {
          id: 'heading',
          type: 'text',
          label: 'Section Heading',
          default: 'Frequently Asked Questions'
        },
        {
          id: 'description',
          type: 'textarea',
          label: 'Description',
          default: 'Find answers to common questions'
        },
        {
          id: 'layout',
          type: 'select',
          label: 'Layout',
          options: [
            { value: 'single', label: 'Single Column' },
            { value: 'two-column', label: 'Two Columns' }
          ],
          default: 'single'
        },
        {
          id: 'open_first',
          type: 'checkbox',
          label: 'Open First Question',
          default: true
        }
      ],
      blocks: [
        {
          type: 'faq',
          name: 'FAQ Item',
          settings: [
            {
              id: 'question',
              type: 'text',
              label: 'Question'
            },
            {
              id: 'answer',
              type: 'richtext',
              label: 'Answer'
            }
          ]
        }
      ],
      presets: [{
        name: 'FAQ Section',
        category: 'Content',
        blocks: [
          {
            type: 'faq',
            settings: {
              question: 'What is your return policy?',
              answer: 'We offer a 30-day return policy for all items.'
            }
          },
          {
            type: 'faq',
            settings: {
              question: 'How long does shipping take?',
              answer: 'Standard shipping takes 3-5 business days.'
            }
          }
        ]
      }]
    }
  },
  {
    id: 'contact-form',
    name: 'Contact Form',
    description: 'Customer contact form with customizable fields',
    category: 'basic',
    schema: {
      name: 'Contact Form',
      tag: 'section',
      settings: [
        {
          id: 'heading',
          type: 'text',
          label: 'Form Heading',
          default: 'Get in Touch'
        },
        {
          id: 'description',
          type: 'textarea',
          label: 'Description',
          default: 'We\'d love to hear from you'
        },
        {
          id: 'show_phone',
          type: 'checkbox',
          label: 'Show Phone Field',
          default: true
        },
        {
          id: 'show_company',
          type: 'checkbox',
          label: 'Show Company Field',
          default: false
        },
        {
          id: 'button_text',
          type: 'text',
          label: 'Submit Button Text',
          default: 'Send Message'
        },
        {
          id: 'success_message',
          type: 'text',
          label: 'Success Message',
          default: 'Thank you for your message!'
        }
      ],
      presets: [{
        name: 'Contact Form',
        category: 'Basic'
      }]
    }
  },
  {
    id: 'feature-cards',
    name: 'Feature Cards',
    description: 'Highlight key features or services with icon cards',
    category: 'content',
    schema: {
      name: 'Feature Cards',
      tag: 'section',
      settings: [
        {
          id: 'heading',
          type: 'text',
          label: 'Section Heading',
          default: 'Why Choose Us'
        },
        {
          id: 'description',
          type: 'textarea',
          label: 'Description'
        },
        {
          id: 'cards_per_row',
          type: 'range',
          label: 'Cards per Row',
          min: 2,
          max: 4,
          step: 1,
          default: 3
        },
        {
          id: 'card_style',
          type: 'select',
          label: 'Card Style',
          options: [
            { value: 'minimal', label: 'Minimal' },
            { value: 'bordered', label: 'Bordered' },
            { value: 'shadow', label: 'Shadow' }
          ],
          default: 'shadow'
        }
      ],
      blocks: [
        {
          type: 'feature',
          name: 'Feature Card',
          settings: [
            {
              id: 'icon',
              type: 'image_picker',
              label: 'Icon/Image'
            },
            {
              id: 'title',
              type: 'text',
              label: 'Title'
            },
            {
              id: 'description',
              type: 'textarea',
              label: 'Description'
            },
            {
              id: 'link',
              type: 'url',
              label: 'Link (Optional)'
            }
          ]
        }
      ],
      presets: [{
        name: 'Feature Cards',
        category: 'Content',
        blocks: [
          {
            type: 'feature',
            settings: {
              title: 'Fast Shipping',
              description: 'Quick delivery to your doorstep'
            }
          },
          {
            type: 'feature',
            settings: {
              title: 'Quality Products',
              description: 'Premium quality guaranteed'
            }
          },
          {
            type: 'feature',
            settings: {
              title: '24/7 Support',
              description: 'Always here to help you'
            }
          }
        ]
      }]
    }
  },
  {
    id: 'blog-posts',
    name: 'Blog Posts',
    description: 'Display recent blog posts with excerpts and featured images',
    category: 'content',
    schema: {
      name: 'Blog Posts',
      tag: 'section',
      settings: [
        {
          id: 'heading',
          type: 'text',
          label: 'Section Heading',
          default: 'Latest from our Blog'
        },
        {
          id: 'blog',
          type: 'blog',
          label: 'Blog'
        },
        {
          id: 'posts_to_show',
          type: 'range',
          label: 'Posts to Show',
          min: 2,
          max: 12,
          step: 1,
          default: 6
        },
        {
          id: 'show_excerpt',
          type: 'checkbox',
          label: 'Show Excerpt',
          default: true
        },
        {
          id: 'show_date',
          type: 'checkbox',
          label: 'Show Date',
          default: true
        },
        {
          id: 'show_author',
          type: 'checkbox',
          label: 'Show Author',
          default: false
        },
        {
          id: 'posts_per_row',
          type: 'range',
          label: 'Posts per Row',
          min: 1,
          max: 4,
          step: 1,
          default: 3
        }
      ],
      presets: [{
        name: 'Blog Posts',
        category: 'Content'
      }]
    }
  },
  {
    id: 'video-section',
    name: 'Video Section',
    description: 'Embed videos with customizable player options',
    category: 'content',
    schema: {
      name: 'Video Section',
      tag: 'section',
      settings: [
        {
          id: 'heading',
          type: 'text',
          label: 'Section Heading',
          default: 'Watch Our Video'
        },
        {
          id: 'description',
          type: 'textarea',
          label: 'Description'
        },
        {
          id: 'video_url',
          type: 'video_url',
          label: 'Video URL',
          accept: 'youtube, vimeo'
        },
        {
          id: 'video_alt',
          type: 'text',
          label: 'Video Alt Text'
        },
        {
          id: 'autoplay',
          type: 'checkbox',
          label: 'Autoplay',
          default: false
        },
        {
          id: 'show_controls',
          type: 'checkbox',
          label: 'Show Controls',
          default: true
        },
        {
          id: 'aspect_ratio',
          type: 'select',
          label: 'Aspect Ratio',
          options: [
            { value: '16:9', label: '16:9 (Widescreen)' },
            { value: '4:3', label: '4:3 (Standard)' },
            { value: '1:1', label: '1:1 (Square)' }
          ],
          default: '16:9'
        }
      ],
      presets: [{
        name: 'Video Section',
        category: 'Content'
      }]
    }
  },
  {
    id: 'collection-list',
    name: 'Collection List',
    description: 'Showcase multiple collections with images and links',
    category: 'ecommerce',
    schema: {
      name: 'Collection List',
      tag: 'section',
      settings: [
        {
          id: 'heading',
          type: 'text',
          label: 'Section Heading',
          default: 'Shop by Category'
        },
        {
          id: 'layout',
          type: 'select',
          label: 'Layout',
          options: [
            { value: 'grid', label: 'Grid' },
            { value: 'slider', label: 'Slider' },
            { value: 'list', label: 'List' }
          ],
          default: 'grid'
        },
        {
          id: 'collections_per_row',
          type: 'range',
          label: 'Collections per Row',
          min: 2,
          max: 5,
          step: 1,
          default: 3,
          visible_if: '{{ settings.layout == "grid" }}'
        },
        {
          id: 'show_collection_count',
          type: 'checkbox',
          label: 'Show Product Count',
          default: true
        }
      ],
      blocks: [
        {
          type: 'collection',
          name: 'Collection',
          settings: [
            {
              id: 'collection',
              type: 'collection',
              label: 'Collection'
            },
            {
              id: 'custom_image',
              type: 'image_picker',
              label: 'Custom Image (Optional)'
            },
            {
              id: 'custom_title',
              type: 'text',
              label: 'Custom Title (Optional)'
            }
          ]
        }
      ],
      presets: [{
        name: 'Collection List',
        category: 'E-commerce',
        blocks: [
          { type: 'collection' },
          { type: 'collection' },
          { type: 'collection' }
        ]
      }]
    }
  },
  {
    id: 'countdown-timer',
    name: 'Countdown Timer',
    description: 'Create urgency with a customizable countdown timer',
    category: 'advanced',
    schema: {
      name: 'Countdown Timer',
      tag: 'section',
      settings: [
        {
          id: 'heading',
          type: 'text',
          label: 'Heading',
          default: 'Limited Time Offer'
        },
        {
          id: 'end_date',
          type: 'text',
          label: 'End Date (YYYY-MM-DD)',
          placeholder: '2024-12-31'
        },
        {
          id: 'end_time',
          type: 'text',
          label: 'End Time (HH:MM)',
          placeholder: '23:59'
        },
        {
          id: 'timezone',
          type: 'select',
          label: 'Timezone',
          options: [
            { value: 'UTC', label: 'UTC' },
            { value: 'EST', label: 'Eastern Time' },
            { value: 'PST', label: 'Pacific Time' },
            { value: 'GMT', label: 'Greenwich Mean Time' }
          ],
          default: 'UTC'
        },
        {
          id: 'show_days',
          type: 'checkbox',
          label: 'Show Days',
          default: true
        },
        {
          id: 'show_hours',
          type: 'checkbox',
          label: 'Show Hours',
          default: true
        },
        {
          id: 'show_minutes',
          type: 'checkbox',
          label: 'Show Minutes',
          default: true
        },
        {
          id: 'show_seconds',
          type: 'checkbox',
          label: 'Show Seconds',
          default: true
        },
        {
          id: 'expired_message',
          type: 'text',
          label: 'Expired Message',
          default: 'Offer has expired'
        }
      ],
      presets: [{
        name: 'Countdown Timer',
        category: 'Advanced'
      }]
    }
  }
]; 