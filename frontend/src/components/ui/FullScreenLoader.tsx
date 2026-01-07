export function FullScreenLoader() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900 dark:bg-gray-900">
      <div className="w-10 h-10 border-3 border-blue-200 dark:border-blue-800 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin" />
    </div>
  );
}

export default FullScreenLoader;
