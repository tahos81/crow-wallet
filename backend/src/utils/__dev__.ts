export const __dev__ = () => {
  return process.env.APP_VERSION === 'development';
};