import { FiAlertCircle, FiCheckCircle, FiInfo } from 'react-icons/fi';

export function Alert({ type = 'info', message, onClose }) {
  const bgColor = {
    error: 'bg-red-50 border-red-200',
    success: 'bg-green-50 border-green-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  }[type];

  const textColor = {
    error: 'text-red-800',
    success: 'text-green-800',
    warning: 'text-yellow-800',
    info: 'text-blue-800',
  }[type];

  const Icon = {
    error: FiAlertCircle,
    success: FiCheckCircle,
    warning: FiAlertCircle,
    info: FiInfo,
  }[type];

  return (
    <div className={`${bgColor} border rounded-lg p-4 flex items-center gap-3 mb-4`}>
      <Icon className={textColor} size={20} />
      <div className={`${textColor} flex-1`}>{message}</div>
      {onClose && (
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          Close
        </button>
      )}
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  ...props
}) {
  const baseClasses = 'font-medium rounded-lg transition focus:outline-none focus:ring-2';

  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    success: 'bg-green-600 text-white hover:bg-green-700 focus:ring-green-500',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500',
  }[variant];

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }[size];

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
      disabled={loading}
      {...props}
    >
      {loading && <div className="animate-spin h-4 w-4 border-b-2 border-current rounded-full" />}
      {children}
    </button>
  );
}
