// Custom loggers that won't log in production
export const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.log(message, data || '');
  }
};

export const logError = (message: string, error?: any) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(message, error || '');
  }
}; 