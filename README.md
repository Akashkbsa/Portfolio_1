# Akash's Developer Portfolio

> A modern, highly interactive personal portfolio built from scratch to showcase full-stack development and AI/Data Science projects.

**Live Demo**: [Insert Your Vercel/Netlify Link Here]

![Portfolio Preview](./images/PHOTO.jpg)

## ⚡ Overview

This portfolio is a completely custom-built static website designed to be fast, accessible, and visually striking. It avoids heavy frontend frameworks in favor of semantic HTML5, modern vanilla CSS3, and optimized JavaScript.

The design features a dark-themed glassmorphism aesthetic with engaging micro-interactions, an interactive canvas-based mind map, and a fully functional serverless contact form.

## 🛠️ Built With

- **HTML5:** Semantic structure, ARIA accessibility attributes
- **CSS3:** Custom properties (variables), CSS Grid & Flexbox, keyframe animations, responsive design
- **JavaScript (Vanilla):** DOM manipulation, Canvas API, Intersection Observer API for scroll animations, async `fetch` requests
- **Form API:** Web3Forms (Serverless email forwarding)
- **Fonts:** Google Fonts (Syne, Sora, DM Mono, Dancing Script)

## ✨ Key Features

1. **Custom Canvas Mind Map:** An interactive, animated routing map built directly on the HTML `<canvas>` element. Draws bezier curves and glowing nodes on hover, clicking navigates to the respective section.
2. **Intersection Animations:** Skill progress bars and elements seamlessly animate into view as the user scrolls down the page.
3. **Scroll-Spy Navigation:** The fixed header navigation automatically updates its active state based on the current scroll position.
4. **Serverless Contact Form:** Fully functional contact section powered by Web3Forms. Handles form submissions asynchronously via AJAX (no page reloads) and includes hidden honeypot spam protection.
5. **No Dependencies:** Zero npm packages, zero libraries (no React, no Tailwind, no jQuery). Pure standard web technologies for maximum performance.

## 📂 Project Structure

```text
/
├── index.html         # Main HTML structure
├── style.css          # All styling and CSS variables
├── script.js          # Interactivity and API logic
├── images/            # Static image assets
│   └── PHOTO.jpg      # Profile picture
└── assets/            # Standalone, reusable UI components exported from the site
    ├── a-animation.html
    ├── color-palette.css
    └── mind-map.html
```

## 🚀 Setup & Run Locally

Because this project uses vanilla web technologies, there is no build step required.

1. Clone the repository:
   ```bash
   git clone https://github.com/Akashkbsa/portfolio.git
   ```
2. Navigate to the directory:
   ```bash
   cd portfolio
   ```
3. Open `index1.html` directly in any modern web browser, or use a local development server like VS Code's Live Server extension.

## 📧 Contact

**Akash**

- GitHub: [@Akashkbsa](https://github.com/Akashkbsa)
- LinkedIn: [akashk06](https://www.linkedin.com/in/akashk06)
- X (Twitter): [@Akash_K_01](https://x.com/Akash_K_01)
