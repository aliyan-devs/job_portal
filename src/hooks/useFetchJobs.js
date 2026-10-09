import { useState, useEffect, useCallback } from "react";

const API_URL = "https://remotive.com/api/remote-jobs?limit=200";
const CACHE_KEY = "jobportal:jobs-cache";
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes (API asks for light usage)

function readCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { time, jobs } = JSON.parse(raw);
    return Date.now() - time < CACHE_TTL ? jobs : null;
  } catch {
    return null;
  }
}

export default function useFetchJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const cached = attempt === 0 ? readCache() : null;

    if (cached) {
      setJobs(cached);
      setLoading(false);
      setError(null);
      return;
    }

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(API_URL, { signal: controller.signal });
        if (!res.ok) throw new Error(`Server responded with ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data.jobs) ? data.jobs : [];
        setJobs(list);
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ time: Date.now(), jobs: list })
          );
        } catch {
          /* cache is optional */
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Failed to load jobs");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { jobs, loading, error, retry };
}
