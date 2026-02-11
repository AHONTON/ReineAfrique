
const Wrapper = ({ children, className = "" }) => {
  return (
    <div
      className={`
        w-full overflow-x-hidden relative
        px-4 sm:px-6 md:px-8 lg:px-10
        max-w-7xl mx-auto box-border
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export default Wrapper;
