import { useLoader } from "../context/LoaderContext";

const Loader = () => {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-graphite-900/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Outer ring */}
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-4 border-graphite-700" />
          <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-velvet-light" />
          {/* Inner dot */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-2 w-2 animate-pulse rounded-full bg-velvet-light" />
          </div>
        </div>

        <p className="text-sm uppercase tracking-[0.3em] text-parchment-100/50">
          Loading
        </p>
      </div>
    </div>
  );
};

export default Loader;