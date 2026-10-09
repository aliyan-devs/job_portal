import { createContext, useContext, useMemo, useCallback } from "react";
import useFetchJobs from "../hooks/useFetchJobs.js";
import useLocalStorage from "../hooks/useLocalStorage.js";

const JobsContext = createContext(null);

export function JobsProvider({ children }) {
  const { jobs, loading, error, retry } = useFetchJobs();
  const [savedIds, setSavedIds] = useLocalStorage("jobportal:saved", []);
  const [applications, setApplications] = useLocalStorage(
    "jobportal:applications",
    []
  );

  const toggleSave = useCallback(
    (id) =>
      setSavedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      ),
    [setSavedIds]
  );

  const addApplication = useCallback(
    (app) => setApplications((prev) => [...prev, app]),
    [setApplications]
  );

  const value = useMemo(
    () => ({
      jobs,
      loading,
      error,
      retry,
      savedIds,
      toggleSave,
      isSaved: (id) => savedIds.includes(id),
      applications,
      addApplication,
      hasApplied: (id) => applications.some((a) => a.jobId === id),
    }),
    [jobs, loading, error, retry, savedIds, toggleSave, applications, addApplication]
  );

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
}

export function useJobs() {
  const ctx = useContext(JobsContext);
  if (!ctx) throw new Error("useJobs must be used inside <JobsProvider>");
  return ctx;
}
