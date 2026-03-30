import { useCallback, useMemo } from "react";
import { useSearch, useLocation } from "wouter";

export interface GlobalFilters {
  dateRange: string;
  platform: string;
  topic: string;
  competitor: string;
  region: string;
}

const DEFAULTS: GlobalFilters = {
  dateRange: "7d",
  platform: "",
  topic: "",
  competitor: "",
  region: "",
};

export function useGlobalFilters() {
  const searchString = useSearch();
  const [, navigate] = useLocation();

  const filters = useMemo(() => {
    const params = new URLSearchParams(searchString);
    return {
      dateRange: params.get("dateRange") || DEFAULTS.dateRange,
      platform: params.get("platform") || DEFAULTS.platform,
      topic: params.get("topic") || DEFAULTS.topic,
      competitor: params.get("competitor") || DEFAULTS.competitor,
      region: params.get("region") || DEFAULTS.region,
    };
  }, [searchString]);

  const setFilter = useCallback(
    (key: keyof GlobalFilters, value: string) => {
      const params = new URLSearchParams(searchString);
      if (value && value !== DEFAULTS[key]) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      const qs = params.toString();
      const currentPath = window.location.pathname;
      navigate(qs ? `${currentPath}?${qs}` : currentPath);
    },
    [searchString, navigate],
  );

  const clearFilter = useCallback(
    (key: keyof GlobalFilters) => {
      const params = new URLSearchParams(searchString);
      params.delete(key);
      const qs = params.toString();
      const currentPath = window.location.pathname;
      navigate(qs ? `${currentPath}?${qs}` : currentPath);
    },
    [searchString, navigate],
  );

  const clearAll = useCallback(() => {
    const currentPath = window.location.pathname;
    navigate(currentPath);
  }, [navigate]);

  const filterParams = useMemo(() => {
    const p: Record<string, string> = {};
    if (filters.dateRange !== DEFAULTS.dateRange)
      p.dateRange = filters.dateRange;
    if (filters.platform) p.platform = filters.platform;
    if (filters.topic) p.topic = filters.topic;
    if (filters.competitor) p.competitor = filters.competitor;
    if (filters.region) p.region = filters.region;
    return p;
  }, [filters]);

  const activeCount = Object.values(filterParams).filter(Boolean).length;

  return {
    filters,
    filterParams,
    setFilter,
    clearFilter,
    clearAll,
    activeCount,
  };
}
