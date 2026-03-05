import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

export const StatusIndicator = ({ status, message, isMitm }) => {
  const statusConfig = {
    idle: {
      icon: null,
      label: 'Ready',
      color: 'text-gray-400',
      bgColor: 'bg-gray-600/20',
      borderColor: 'border-gray-600/30',
    },
    loading: {
      icon: Clock,
      label: 'Decrypting...',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-600/20',
      borderColor: 'border-yellow-600/30',
    },
    success: {
      icon: CheckCircle,
      label: isMitm ? 'Authenticated (MITM Attack)' : 'Authenticated',
      color: 'text-primary-400',
      bgColor: 'bg-primary-600/20',
      borderColor: 'border-primary-600/30',
    },
    error: {
      icon: AlertCircle,
      label: 'Invalid Key',
      color: 'text-red-400',
      bgColor: 'bg-red-600/20',
      borderColor: 'border-red-600/30',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`flex items-center gap-3 px-4 py-2 rounded-lg border ${config.bgColor} ${config.borderColor} transition-all`}
    >
      {Icon ? (
        <motion.div
          animate={status === 'loading' ? { rotate: 360 } : {}}
          transition={status === 'loading' ? { duration: 2, repeat: Infinity, ease: 'linear' } : {}}
        >
          <Icon className={`w-5 h-5 ${config.color}`} />
        </motion.div>
      ) : (
        <div className={`w-2 h-2 rounded-full ${config.color}`} />
      )}
      <div className="flex flex-col gap-0.5">
        <span className={`text-sm font-semibold ${config.color}`}>
          {config.label}
        </span>
        {message && (
          <span className={`text-xs ${config.color}/70`}>
            {message}
          </span>
        )}
      </div>
    </motion.div>
  );
};
