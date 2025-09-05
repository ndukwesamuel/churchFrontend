const DataStateHandler = ({
  isLoading,
  isError,
  error,
  refetch,
  loadingMessage = "Loading...",
  errorMessage = "Something went wrong",
  children,
}) => {
  if (isLoading) {
    return (
      <div className="p-3 sm:p-6 max-w-7xl mx-auto bg-[#F2F4F7] h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
          <p className="text-gray-600">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-3 sm:p-6 max-w-7xl mx-auto bg-[#F2F4F7] h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            {errorMessage}: {error?.message || ""}
          </p>
          {refetch && (
            <button
              onClick={refetch}
              className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default DataStateHandler;
