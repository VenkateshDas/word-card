# 🇩🇪 German Flashcard App

<div align="center">
  
  ![German Flag](https://img.shields.io/badge/🇩🇪-German%20Learning-red?style=for-the-badge)
  ![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![Vite](https://img.shields.io/badge/Vite-5.0.8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
  
  **Master German vocabulary with interactive flashcards featuring A1-level words, example sentences, and bidirectional learning**
  
  [🚀 Live Demo](#) • [📖 Features](#features) • [⚡ Quick Start](#quick-start) • [🛠️ Development](#development)
  
</div>

---

## ✨ Features

### 🎯 **Core Learning Features**
- **📚 Comprehensive A1 Vocabulary** - 400+ German words across 6 categories
- **🔄 Bidirectional Learning** - Switch between German→English and English→German modes
- **📝 Example Sentences** - Multiple contextual sentences for each word with translations
- **🎨 Interactive Flashcards** - Beautiful, responsive card interface with reveal/hide functionality
- **📊 Progress Tracking** - Visual progress indicators and word counters

### 🏷️ **Vocabulary Categories**
- 👥 **People & Family** - Family members, relationships, personal details
- 🍽️ **Food & Drink** - Meals, ingredients, dining vocabulary
- 🏠 **Home & Objects** - Household items, rooms, living spaces
- 🔢 **Numbers & Time** - Numbers, time expressions, temporal vocabulary
- 🌤️ **Days & Weather** - Weather conditions, days of the week
- 💼 **Work & Education** - Professional and academic terminology

### 🔧 **Technical Features**
- **⚡ Lightning Fast** - Built with Vite for optimal performance
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **🎨 Modern UI** - Beautiful gradient backgrounds and smooth animations
- **♿ Accessible** - Keyboard navigation and screen reader friendly
- **🌐 Progressive Web App** - Installable and works offline

---

## 🎮 How It Works

<div align="center">
  
  ```
  📖 Select Topic → 🔄 Choose Direction → 📝 Study Cards → 📊 Track Progress
  ```
  
</div>

1. **Choose a Topic**: Select from 6 vocabulary categories
2. **Set Learning Direction**: German→English or English→German
3. **Study Flashcards**: Click "Show Answer" to reveal translations
4. **Navigate Examples**: Browse multiple example sentences per word
5. **Track Progress**: Monitor your advancement through each category

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **npm** or **yarn**

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/german-flashcard-app.git
cd german-flashcard-app

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

---

## 🛠️ Development

### Project Structure

```
german-flashcard/
├── 📁 src/
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Application entry point
├── 📁 data/
│   ├── vocabularyData.js                    # Processed vocabulary data
│   ├── German_A1_Vocab_Categorized_With_Sentences_v2.csv  # Source data
│   └── German_A1_Vocab_For_Review.csv      # Review data
├── 📁 scripts/
│   └── process_german_vocab.py             # Data processing script
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite configuration
└── tsconfig.json        # TypeScript configuration
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

### Data Processing

The application includes a Python script for processing vocabulary data:

```bash
# Process new vocabulary data (requires OpenAI API key)
cd scripts
python process_german_vocab.py
```

**Features of the data processor:**
- 🤖 **AI-Powered**: Uses OpenAI GPT-4 to generate example sentences
- 📊 **Batch Processing**: Efficiently processes vocabulary in batches
- 🔄 **Format Conversion**: Converts CSV data to JavaScript modules
- ✅ **Quality Assurance**: Generates review files for manual verification

---

## 🎨 Design Philosophy

### Visual Design
- **🌈 Gradient Backgrounds** - Beautiful purple-blue gradients
- **🔮 Glassmorphism** - Modern frosted glass effects
- **🎯 Focused Interface** - Minimal distractions, maximum learning
- **📱 Mobile-First** - Responsive design for all devices

### User Experience
- **⚡ Instant Feedback** - Immediate visual responses to interactions
- **🎮 Gamification** - Progress bars and achievement tracking
- **🔄 Smooth Transitions** - Fluid animations between states
- **♿ Accessibility** - WCAG compliant design patterns

---

## 📊 Vocabulary Statistics

| Category | Words | Example Sentences |
|----------|-------|-------------------|
| People & Family | 65+ | 195+ |
| Food & Drink | 80+ | 240+ |
| Home & Objects | 75+ | 225+ |
| Numbers & Time | 90+ | 270+ |
| Days & Weather | 45+ | 135+ |
| **Total** | **400+** | **1200+** |

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **🍴 Fork** the repository
2. **🌿 Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **💾 Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **📤 Push** to the branch (`git push origin feature/amazing-feature`)
5. **🔄 Open** a Pull Request

### Areas for Contribution
- 📚 **Vocabulary Expansion** - Add more words and categories
- 🌍 **Internationalization** - Support for multiple languages
- 🎨 **UI Improvements** - Enhanced visual design
- 🔧 **Features** - New learning modes and tools
- 🐛 **Bug Fixes** - Report and fix issues

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **📖 Vocabulary Data** - Curated A1-level German vocabulary
- **🤖 OpenAI** - GPT-4 for generating example sentences
- **⚛️ React Team** - For the amazing React framework
- **⚡ Vite Team** - For the lightning-fast build tool
- **🎨 Design Inspiration** - Modern glassmorphism and gradient trends

---

<div align="center">
  
  **Made with ❤️ for German language learners**
  
  ⭐ **Star this repo if you found it helpful!** ⭐
  
  [Report Bug](https://github.com/yourusername/german-flashcard-app/issues) • [Request Feature](https://github.com/yourusername/german-flashcard-app/issues) • [Discussions](https://github.com/yourusername/german-flashcard-app/discussions)
  
</div> 