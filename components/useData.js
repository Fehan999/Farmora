"use client";
import { useEffect, useState, useCallback, useRef } from "react";

export default function useData(loader, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const loaderRef = useRef(loader);
  const requestRef = useRef(0);
  loaderRef.current = loader;

  const run = useCallback(async (silent) => {
    const request = ++requestRef.current;
    if (!silent) setLoading(true);
    const result = await loaderRef.current();
    if (request !== requestRef.current) return;
    setData(result);
    setLoading(false);
  }, deps);

  useEffect(() => { run(false); }, [run]);

  useEffect(() => {
    const onChange = () => run(true);
    window.addEventListener("farmora:data", onChange);
    return () => window.removeEventListener("farmora:data", onChange);
  }, [run]);

  const reload = useCallback(() => run(true), [run]);
  return { data, loading, reload, setData };
}
