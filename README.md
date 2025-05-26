# Shopify Schema Generator

A modern, powerful tool for Shopify theme developers to create and manage section schemas with real-time preview and validation.

## Features

### Schema Management
- **Visual Schema Builder**: Create section schemas with an intuitive interface
- **Real-time Preview**: See your schema changes instantly
- **JSON/Liquid Export**: Export schemas in both JSON and Liquid formats
- **Schema Validation**: Automatic validation against Shopify's schema specifications

### Block Management
- **Custom Blocks**: Create and manage section blocks with full settings control
- **Block Settings**: Add, edit, and reorder block settings with drag & drop
- **Block Limits**: Set maximum instances for each block type
- **Field Types**: Support for all Shopify field types with appropriate configurations

### Advanced Features
- **Conditional Settings**: Create dynamic fields with `visible_if` conditions
- **Template Restrictions**: Control where sections can appear using `enabled_on`/`disabled_on`
- **Localization**: Manage translations with the locales system
- **Default Values**: Set default configurations for static rendering
- **Preset Library**: Ready-to-use section templates for common use cases

### Developer Experience
- **Dark Mode Support**: Comfortable coding in any lighting condition
- **Keyboard Shortcuts**: Efficient workflow with keyboard navigation
- **Responsive Design**: Works seamlessly on all screen sizes
- **Local Storage**: Auto-save and restore your work in progress

## Getting Started

### Prerequisites
- Node.js 18.0.0 or higher
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/berkb/shopify-schema-generator.git

# Navigate to project directory
cd shopify-schema-generator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Usage

1. **Create a New Schema**
   - Set basic section properties (name, tag, class)
   - Add settings fields with appropriate types
   - Configure block types and their settings

2. **Add Blocks**
   - Create custom blocks with unique types
   - Add block-specific settings
   - Set block limits and conditions

3. **Preview & Export**
   - View real-time schema preview
   - Copy schema as JSON or Liquid
   - Download schema file

## Template Library

Ready-to-use templates for common section types:
- Image Gallery
- FAQ Section
- Contact Form
- Feature Cards
- Blog Posts
- Video Section
- Collection List
- Countdown Timer

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

**Berk Belcioglu**  
Shopify Developer  
[LinkedIn](https://www.linkedin.com/in/berkbelcioglu) | [GitHub](https://github.com/berkb)  
Contact: berk.belcioglu@gmail.com

## Acknowledgments

- Built with Next.js 14 and TypeScript
- UI powered by Tailwind CSS
- Icons by Lucide Icons
- Drag & Drop by dnd-kit 