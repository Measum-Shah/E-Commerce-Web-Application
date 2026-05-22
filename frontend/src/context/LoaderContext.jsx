import { createContext, useContext, useState } from "react";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoader = () => setLoading(true);
  const hideLoader = () => setLoading(false);

  // Wrap any async function — shows loader while it runs, hides when done
  const withLoader = async (fn) => {
    try {
      showLoader();
      return await fn();
    } finally {
      hideLoader();
    }
  };

  return (
    <LoaderContext.Provider value={{ loading, showLoader, hideLoader, withLoader }}>
      {children}
    </LoaderContext.Provider>
  );
};

export const useLoader = () => useContext(LoaderContext);