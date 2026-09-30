# Sudarshan Sinha - Portfolio

Plain HTML, CSS and JavaScript. No build step.

## Structure
- `index.html` - page content (search for `ADD` comments to find where links go)
- `css/style.css` - styles, colors and dark mode
- `js/script.js` - track switcher, theme toggle, live stats (`CONFIG` and `LINKS` at the top and bottom)
- `assets/` - put your resume PDF here

## Setup
1. Open `js/script.js`. `CONFIG` already holds the usernames found in your resume; check that each one opens your profile.
2. Fill `LINKS` with your profile URLs (GitHub, LeetCode, GFG, Trailblazer).
3. Add remaining links in `index.html` where the `<!-- ADD ... -->` comments are.
4. Open `index.html` in a browser to test.

## Deploy on GitHub Pages
Push this folder to a repo, then Settings > Pages > Deploy from branch (main, root).


## Track-specific resumes
The hero **Download resume** button is linked to the active portfolio track:
- **Software and AI** → `assets/Sudarshan_Sinha_Software_AI_Resume.pdf`
- **Security (SOC)** → `assets/Sudarshan_Sinha_Security_Sales_Resume.pdf`
- **Salesforce Admin** → `assets/Sudarshan_Sinha_Salesforce_Admin_Resume.pdf`

The mapping is controlled by `RESUMES` in `js/script.js`. Clicking a track updates the PDF URL and the browser download filename immediately.
