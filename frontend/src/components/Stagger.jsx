import { motion } from "framer-motion";

/**
 * StaggerGroup + StaggerItem — true "wave" reveal for sibling grids.
 *
 * Wrap a grid of items with <StaggerGroup>. Each direct child wrapped in
 * <StaggerItem> will animate one after another with a 0.1s delay between
 * siblings when the GROUP enters the viewport.
 *
 * Spec per item: opacity 0 → 1, translateY 30px → 0, duration 0.6s, ease-out.
 */
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const StaggerGroup = ({ children, className = "", margin = "-80px", ...rest }) => (
  <motion.div
    variants={containerVariants}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, margin }}
    className={className}
    {...rest}
  >
    {children}
  </motion.div>
);

export const StaggerItem = ({ children, className = "", ...rest }) => (
  <motion.div variants={itemVariants} className={className} {...rest}>
    {children}
  </motion.div>
);

export default StaggerGroup;
