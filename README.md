# JobHunt – React Job Portal

A responsive job portal built with **React 18 + Vite**, **React Router**, **Bootstrap 5** and the free **[Remotive](https://remotive.com/api/remote-jobs)** REST API.

## Features
- Fetch job listings from a REST API (cached in `sessionStorage` for 30 min)
- Pagination (9 jobs/page, page stored in URL)
- Debounced search + filters: job type, location, category (stored in URL, shareable)
- Job details page (`/jobs/:id`) with sanitized HTML description (DOMPurify)
- Save jobs to a list (`/saved`, persisted in `localStorage`)
- Application form with validation (`/jobs/:id/apply`): name, email, phone, optional URL, experience, cover letter, PDF resume (type + size)
- React Router multi-page app with 404 page
- Loading, error (with retry) and empty-result states
- Fully responsive (Bootstrap grid, mobile navbar)

## Hooks used
- `useState`, `useEffect`, `useMemo`, `useCallback`
- `useContext` via `JobsContext` (jobs, saved list, applications)
- Custom hooks: `useFetchJobs`, `useLocalStorage`, `useDebounce`

## Run locally
```bash
npm install
npm run dev
```
Build: `npm run build` → output in `dist/`.

## Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: job portal"
git branch -M main
git remote add origin https://github.com/<your-username>/job-portal.git
git push -u origin main
```

## Deploy
**Vercel:** import the GitHub repo → framework *Vite* → Deploy (`vercel.json` already handles SPA routing).
**Netlify:** build command `npm run build`, publish dir `dist` (`public/_redirects` handles routing).

## Project structure
```
src/
  components/  Navbar, Footer, JobCard, FilterBar, Pagination, Loader, ErrorMessage, EmptyState
  context/     JobsContext.jsx
  hooks/       useFetchJobs, useLocalStorage, useDebounce
  pages/       Home, Jobs, JobDetails, ApplyForm, SavedJobs, NotFound
  utils/       format.js
```
