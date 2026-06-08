# adibmz.github.io

Personal portfolio website for **Adib Mezouar** — Full-Stack Web Developer.

🔗 **Live:** [adibmz.me](https://adibmz.me)

## ✨ Features

- **Dynamic GitHub Integration** — Profile stats (repos, followers, following) and project cards are fetched live from the GitHub API
- **Animated Counters** — Smooth ease-out cubic number animations on scroll
- **Ambient Cursor Glow** — Subtle radial light that follows the mouse (desktop)
- **Scroll Reveal Animations** — Sections fade in as they enter the viewport
- **Responsive Design** — Mobile-first layout with collapsible navigation
- **Active Nav Tracking** — Highlights the current section in the navbar on scroll
- **Topic Tags & Language Dots** — Project cards display GitHub topics and linguist-colored language indicators

## 🛠 Tech Stack

| Layer     | Technologies                     |
| --------- | -------------------------------- |
| Structure | HTML5, Semantic elements         |
| Styling   | Vanilla CSS, Custom Properties   |
| Logic     | Vanilla JavaScript (ES6+)        |
| Data      | GitHub REST API                  |
| Hosting   | GitHub Pages + Custom Domain     |

## 📁 Project Structure

```
adibmz.github.io/
├── index.html   # Main page structure & SEO meta
├── style.css    # Design system, layout, animations
├── script.js    # GitHub API, interactions, scroll effects
├── CNAME        # Custom domain (adibmz.me)
└── README.md
```

## 🚀 Development

No build tools required — open `index.html` directly in a browser or serve locally:

```bash
# Using Python
python3 -m http.server 8000

# Using Node
npx serve .
```

## 📄 License

© Adib Mezouar. All rights reserved.