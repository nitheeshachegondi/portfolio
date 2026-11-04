# Nitheesha Chegondi — "Give my work a role to think about"

A portfolio that reads a job description and answers honestly: **strong**, **transferable**, **partial**, or **not demonstrated**.

## The one source of truth
Everything the site says comes from **`js/profile.js`**. Edit that one file:
- `skills`: things you have directly done (strong)
- `bridges`: related skills under a different name (transferable)
- `partials`: some exposure, not depth
- `gaps`: things you have not done
- `projects[].evidence`: add screenshots/links, e.g. `{type:"image", src:"assets/kaizoi-1.png", label:"Home"}`
- `links`: fill in `email`, `linkedin`, `github` (empty ones are hidden)

Skills marked `unlinked: true` are on your resume without a project attached. In **Strict mode** they count as *partial* until you link a project. Anything a JD asks for that is in none of the lists is shown as **"This requirement is not currently demonstrated in my work."**

## Groq: the creative voice
`api/narrate.js` asks Groq to write the headline, overall read and one-liners per requirement.
- The key is **only** read from the `GROQ_API_KEY` environment variable. It is never in the browser code.
- The server re-runs the strict matcher itself, so the model only sees facts and levels computed on the server.
- The AI cannot change a level, gets nothing for "not demonstrated" requirements, and any output with invented numbers or hype words (expert, extensive, "years of"…) is dropped.
- If there is no key or Groq is down, the page quietly falls back to the matcher's own sentences.

### Run locally
```
cp .env.example .env      # put your Groq key (starts with gsk_) in GROQ_API_KEY
node server.js            # http://localhost:3000
```

### Deploy on Vercel
Import the folder, add `GROQ_API_KEY` under Project → Settings → Environment Variables, deploy. (`vercel.json` is included.)

## Voice mode
The "Speak the role" button uses the browser's speech recognition (Chrome/Edge/Safari).
