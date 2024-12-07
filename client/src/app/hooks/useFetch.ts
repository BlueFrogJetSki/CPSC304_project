import { useEffect, useState } from 'react';

const useFetch = <T>(url: string, options?: RequestInit, maxRetries = 1) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (retryCount > maxRetries) {
        setError('Maximum retries exceeded');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        console.log("fetching data")
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const result: T = await response.json();
        setData(result);
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        if (retryCount < maxRetries) {
          setRetryCount((prev) => prev + 1);
        }
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchData();
    }
  }, [url,retryCount]); // Add retryCount and maxRetries to dependencies

  return { data, setData, error, setError, loading };
};

export default useFetch;