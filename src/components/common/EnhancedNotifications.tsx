import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, Loader2, XCircle } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';

interface NotificationOptions {
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  description?: string;
}

// Enhanced notification functions
export const showSuccessNotification = (
  title: string, 
  options: NotificationOptions = {}
) => {
  toast.success(title, {
    description: options.description,
    duration: options.duration || 4000,
    action: options.action,
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
  });
};

export const showErrorNotification = (
  title: string, 
  error?: Error | string,
  options: NotificationOptions = {}
) => {
  const description = error 
    ? (typeof error === 'string' ? error : error.message)
    : options.description;

  toast.error(title, {
    description,
    duration: options.duration || 6000,
    action: options.action,
    icon: <XCircle className="w-5 h-5 text-red-500" />,
  });
};

export const showInfoNotification = (
  title: string, 
  options: NotificationOptions = {}
) => {
  toast.info(title, {
    description: options.description,
    duration: options.duration || 4000,
    action: options.action,
    icon: <Info className="w-5 h-5 text-blue-500" />,
  });
};

export const showWarningNotification = (
  title: string, 
  options: NotificationOptions = {}
) => {
  toast.warning(title, {
    description: options.description,
    duration: options.duration || 5000,
    action: options.action,
    icon: <AlertCircle className="w-5 h-5 text-yellow-500" />,
  });
};

export const showLoadingNotification = (
  title: string,
  description?: string
) => {
  return toast.loading(title, {
    description,
    icon: <Loader2 className="w-5 h-5 animate-spin" />,
  });
};

// Card-specific notifications
export const showCardCreatedNotification = (cardTitle: string) => {
  showSuccessNotification('Card Created Successfully!', {
    description: `"${cardTitle}" has been added to your collection`,
    action: {
      label: 'View Card',
      onClick: () => {
        // Navigate to card view
        window.location.href = '/gallery';
      }
    }
  });
};

export const showCardSavedNotification = (cardTitle: string) => {
  showSuccessNotification('Card Saved!', {
    description: `Changes to "${cardTitle}" have been saved`,
  });
};

export const showCardDeletedNotification = (cardTitle: string) => {
  showSuccessNotification('Card Deleted', {
    description: `"${cardTitle}" has been removed from your collection`,
  });
};

export const showCardUploadNotification = (fileName: string, success: boolean) => {
  if (success) {
    showSuccessNotification('Upload Successful!', {
      description: `${fileName} has been processed and added to your collection`,
    });
  } else {
    showErrorNotification('Upload Failed', {
      description: `Failed to process ${fileName}. Please try again.`,
    });
  }
};

// Marketplace notifications
export const showListingCreatedNotification = (title: string) => {
  showSuccessNotification('Listing Created!', {
    description: `"${title}" is now live on the marketplace`,
    action: {
      label: 'View Listing',
      onClick: () => {
        window.location.href = '/marketplace';
      }
    }
  });
};

export const showBidPlacedNotification = (amount: number, isWinning: boolean) => {
  const message = isWinning 
    ? `Your bid of $${amount} is now the highest!`
    : `Bid of $${amount} placed successfully`;

  showSuccessNotification('Bid Placed!', {
    description: message,
  });
};

export const showPurchaseNotification = (title: string, price: number) => {
  showSuccessNotification('Purchase Successful!', {
    description: `"${title}" has been added to your collection for $${price}`,
    action: {
      label: 'View Collection',
      onClick: () => {
        window.location.href = '/gallery';
      }
    }
  });
};

// Error notifications with context
export const showNetworkErrorNotification = () => {
  showErrorNotification('Connection Error', {
    description: 'Please check your internet connection and try again',
    action: {
      label: 'Retry',
      onClick: () => {
        window.location.reload();
      }
    }
  });
};

export const showValidationErrorNotification = (fieldName: string, error: string) => {
  showErrorNotification('Validation Error', {
    description: `${fieldName}: ${error}`,
  });
};

export const showPermissionErrorNotification = () => {
  showErrorNotification('Permission Denied', {
    description: 'You don\'t have permission to perform this action',
  });
};

// Progress notifications
export const showProgressNotification = (
  title: string,
  progress: number,
  total: number
) => {
  const percentage = Math.round((progress / total) * 100);
  
  toast.loading(`${title} (${percentage}%)`, {
    description: `${progress} of ${total} completed`,
  });
};

// Custom notification component
interface CustomNotificationProps {
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  className?: string;
}

export const CustomNotification: React.FC<CustomNotificationProps> = ({
  type,
  title,
  description,
  action,
  onClose,
  className = ''
}) => {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-500/20';
      case 'error':
        return 'border-red-500/20';
      case 'warning':
        return 'border-yellow-500/20';
      case 'info':
        return 'border-blue-500/20';
    }
  };

  return (
    <div className={cn(
      'bg-crd-darker border rounded-lg p-4 shadow-lg',
      getBorderColor(),
      className
    )}>
      <div className="flex items-start space-x-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-crd-white">
            {title}
          </h4>
          {description && (
            <p className="text-sm text-crd-lightGray mt-1">
              {description}
            </p>
          )}
          {action && (
            <button
              onClick={action.onClick}
              className="text-sm text-crd-blue hover:text-crd-blue/80 mt-2 font-medium"
            >
              {action.label}
            </button>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-crd-lightGray hover:text-crd-white"
          >
            <XCircle className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}; 