import { motion, AnimatePresence } from "framer-motion";
import { useLoading } from "../../contexts/LoadingContext";

const PageTransition = ({ children }) => {
  const { isPageLoading } = useLoading();

  return (
    <>
      <AnimatePresence mode="wait">
        {isPageLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[9998] h-1 bg-gray-200"
          >
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-red-500"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              exit={{ width: "100%" }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default PageTransition;
