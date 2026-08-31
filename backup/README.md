# Academic Website - TypeScript Conversion# Portfolio Website

Portfolio website repository of me.

This directory contains the TypeScript conversion of the original Jekyll-based academic website. All JavaScript and Python functionality has been converted to TypeScript for better type safety, maintainability, and modern development practices.

## Running locally

## 📁 Directory Structure

When you are initially working your website, it is very useful to be able to preview the changes locally before pushing them to GitHub. To work locally you will need to:

```

typescript_convert/1. Clone the repository and made updates as detailed above.

├── src/                          # TypeScript source files1. Make sure you have ruby-dev, bundler, and nodejs installed

│   ├── assets/    

│   │   └── js/                   # Converted JavaScript files    On most Linux distribution and [Windows Subsystem Linux](https://learn.microsoft.com/en-us/windows/wsl/about) the command is:

│   │       ├── _main.ts          # Main jQuery functionality    ```bash

│   │       ├── collapse.ts       # Collapsible sections    sudo apt install ruby-dev ruby-bundler nodejs

│   │       └── plugins/    ```

│   │           └── jquery.greedy-navigation.ts  # Navigation plugin    On MacOS the commands are:

│   ├── talkmap/                  # Talk map generation    ```bash

│   │   ├── talkmap.ts           # Main map generator (from Python)    brew install ruby

│   │   └── org-locations.ts     # Location data    brew install node

│   ├── markdown_generator/       # Markdown file generators (from Python)    gem install bundler

│   │   ├── publications.ts      # Publications generator    ```

│   │   └── talks.ts             # Talks generator1. Run `bundle install` to install ruby dependencies. If you get errors, delete Gemfile.lock and try again.

│   ├── types/                   # Type definitions1. Run `jekyll serve -l -H localhost` to generate the HTML and serve it from `localhost:4000` the local server will automatically rebuild and refresh the pages on change.

│   │   └── global.d.ts          # Global type declarations

│   └── index.ts                 # Main entry pointIf you are running on Linux it may be necessary to install some additional dependencies prior to being able to run locally: `sudo apt install build-essential gcc make`

├── dist/                        # Compiled output (generated)

├── tsconfig.json               # TypeScript configuration## Using Docker

├── webpack.config.js           # Webpack configuration

├── package.json                # Updated dependenciesWorking from a different OS, or just want to avoid installing dependencies? You can use the provided `Dockerfile` to build a container that will run the site for you if you have [Docker](https://www.docker.com/) installed.

└── README.md                   # This file

```Start by build the container:



## 🚀 Features Converted```bash

docker build -t jekyll-site .

### JavaScript to TypeScript```

- ✅ **Main Scripts** (`_main.js` → `_main.ts`)

  - jQuery-based DOM manipulationNext, run the container:

  - Sticky footer functionality```bash

  - Smooth scrollingdocker run -p 4000:4000 --rm -v $(pwd):/usr/src/app jekyll-site

  - Image lightbox (Magnific Popup)```

  - Responsive menu handling

To run the `docker run` command on Windows, you need to adjust the syntax for the volume mapping (`-v`) as Windows uses different path formats. Here's how to run your command on Windows:

- ✅ **Greedy Navigation** (`jquery.greedy-navigation.js` → `jquery.greedy-navigation.ts`)

  - Responsive navigation menu### Steps for Windows:

  - Automatic menu item hiding/showing1. **Check Docker Installation**: Ensure Docker is installed and running.

  - Type-safe jQuery interactions2. **Adjust Path for Volume Mapping**:



- ✅ **Collapse Functionality** (`collapse.js` → `collapse.ts`)   - On Windows, replace `$(pwd)` with the full absolute path to your current directory. For example:

  - Expandable/collapsible sections

  - Smooth animations     ```bash

     -v C:\path\to\your\site:/usr/src/app

### Python to TypeScript     ```

- ✅ **Talk Map Generator** (`talkmap.py` → `talkmap.ts`)

  - Geocoding functionality using Nominatim API### Full Command Example:

  - Leaflet map generation```bash

  - Location data processingdocker run -p 4000:4000 --rm -v C:\path\to\your\site:/usr/src/app jekyll-site

  - HTML/JS output generation```



- ✅ **Publications Generator** (`publications.py` → `publications.ts`)
  - TSV parsing for publication data
  - Markdown file generation
  - YAML frontmatter creation
  - HTML escaping

- ✅ **Talks Generator** (`talks.py` → `talks.ts`)
  - TSV parsing for talk data
  - Location extraction for mapping
  - Markdown file generation

## 🛠️ Setup and Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Install TypeScript types:**
```bash
npm install --save-dev @types/jquery @types/node typescript
```

3. **Install additional dependencies:**
```bash
npm install webpack webpack-cli ts-loader
```

### Build Commands

- **Compile TypeScript:**
```bash
npm run build:ts
```

- **Bundle with Webpack:**
```bash
npm run build:js
```

- **Development watch mode:**
```bash
npm run dev
```

- **Build optimized production bundle:**
```bash
npm run watch:js
```

## 📋 Usage Examples

### Using the Publications Generator

```typescript
import { PublicationsGenerator, processPublications } from './src/markdown_generator/publications';

// Process TSV data
const tsvContent = `pub_date	title	venue	excerpt	citation	site_url	paper_url	url_slug
2024-01-01	My Paper	Conference	Description	Citation	https://site.com	https://paper.pdf	my-paper`;

const files = processPublications(tsvContent);
console.log('Generated files:', files);
```

### Using the Talk Map Generator

```typescript
import { TalkMapGenerator, generateTalkMap } from './src/talkmap/talkmap';

const markdownFiles = [
  {
    name: 'talk1.md',
    content: 'location: "New York, NY"'
  }
];

generateTalkMap(markdownFiles).then(result => {
  console.log('Generated map data:', result);
});
```

### Using the Main Application

```typescript
import { AcademicWebsiteApp } from './src/index';

const app = new AcademicWebsiteApp();
await app.init();
```

## 🔧 Configuration

### TypeScript Configuration (`tsconfig.json`)
- Target: ES2020
- Strict mode enabled
- Source maps generated
- Declaration files created

### Webpack Configuration
- Entry points for main scripts
- TypeScript loader
- External jQuery dependency
- Production optimization

## 🌐 Browser Compatibility

The converted TypeScript code targets:
- Modern browsers (ES2020+)
- jQuery 3.7.1+
- Leaflet 1.7.1+

## 📦 Dependencies

### Runtime Dependencies
- `jquery` - DOM manipulation
- `fitvids` - Responsive videos
- `jquery-smooth-scroll` - Smooth scrolling
- `magnific-popup` - Image lightbox

### Development Dependencies
- `typescript` - TypeScript compiler
- `@types/jquery` - jQuery type definitions
- `@types/node` - Node.js type definitions
- `webpack` - Module bundler
- `ts-loader` - TypeScript loader for Webpack

## 🔄 Migration from Original

### JavaScript Files
- Original files preserved in `assets/js/`
- TypeScript versions in `src/assets/js/`
- Module exports added for better organization
- Type safety improvements

### Python Scripts
- Complete rewrite in TypeScript
- Browser-compatible versions created
- API-based geocoding (no server dependencies)
- File download functionality for browser use

### Key Improvements
1. **Type Safety** - All variables and functions are typed
2. **Modern ES6+** - Uses modern JavaScript features
3. **Modular Design** - Proper module exports and imports
4. **Error Handling** - Better error handling and logging
5. **Browser Compatible** - No server-side dependencies
6. **Development Tools** - Webpack, source maps, watch mode

## 🐛 Known Issues

1. **jQuery Types** - Some jQuery plugins may need additional type definitions
2. **Global Variables** - Legacy code assumes global jQuery availability
3. **File API** - File operations in browser require user interaction

## 🤝 Contributing

When adding new features:
1. Add proper TypeScript types
2. Include JSDoc comments
3. Follow the existing module pattern
4. Update this README

## 📄 License

Same license as the original academic website template (MIT).

## 🔗 Related Files

- Original JavaScript files: `../assets/js/`
- Original Python scripts: `../markdown_generator/`, `../talkmap.py`
- Jekyll configuration: `../_config.yml`
- Package configuration: `../package.json`