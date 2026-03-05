import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export const TransmissionAnimation = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const dotVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="flex items-center justify-center gap-4 py-8">
      {/* Left Signal */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex gap-1"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`left-${i}`}
            variants={dotVariants}
            className="w-2 h-2 bg-gradient-to-t from-primary-500 to-primary-300 rounded-full"
          />
        ))}
      </motion.div>

      {/* Arrow and Animation */}
      <motion.div
        animate={{
          x: [0, 8, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="flex items-center gap-2"
      >
        <ArrowRight className="w-5 h-5 text-primary-500/60" />
      </motion.div>

      {/* Transmission Pulse */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="w-3 h-3 bg-primary-500 rounded-full absolute"
        style={{ left: '50%', marginLeft: -6 }}
      />

      {/* Right Signal */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex gap-1"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={`right-${i}`}
            variants={dotVariants}
            className="w-2 h-2 bg-gradient-to-t from-primary-500 to-primary-300 rounded-full"
            style={{ animationDelay: `${0.1 * i}s` }}
          />
        ))}
      </motion.div>

      {/* Floating label */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 whitespace-nowrap"
      >
        Encrypted transmission
      </motion.div>
    </div>
  );
};
