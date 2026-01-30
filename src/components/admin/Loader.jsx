const Loader = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className="flex items-center justify-center" role="status" aria-live="polite">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-b-2 border-orange-500`}
      >
        <span className="sr-only">Chargement en cours</span>
      </div>
    </div>
  );
};

export default Loader;
