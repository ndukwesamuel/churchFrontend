import { useState, useCallback, useMemo, useEffect } from "react";
import { Plus, Mail } from "lucide-react";
import { SearchAndFilters } from "./_components/searchAndFilters";
import { CategoryStats } from "./_components/categoryStats";
import { TemplateCard } from "./_components/templateCard";
import { Link, useNavigate } from "react-router-dom";
import { useFetchData, useMutateData } from "../../hook/Request";
import DataStateHandler from "../../components/DataStateHandler";
import { getChannelBadgeColor } from "../../utils/helpers";
import { TemplateModal } from "./_components/templateModal";
import { toast } from "sonner";

const TemplateManager = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [channelFilter, setChannelFilter] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     setDebouncedSearchTerm(searchTerm);
  //     // Reset to page 1 when search changes
  //     if (searchTerm !== debouncedSearchTerm) {
  //       setPage(1);
  //     }
  //   }, 300); // 300ms debounce

  //   return () => clearTimeout(timer);
  // }, [searchTerm]);

  // Memoize query params to prevent unnecessary re-renders
  const queryParams = useMemo(() => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      search: searchTerm || "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });

    if (
      channelFilter &&
      channelFilter !== "null" &&
      channelFilter !== " " &&
      channelFilter !== "all channel"
    ) {
      params.append("channel", channelFilter);
    }

    if (
      categoryFilter &&
      categoryFilter !== "All categories" &&
      categoryFilter !== "null" &&
      categoryFilter !== " "
    ) {
      params.append("category", categoryFilter);
    }

    return params.toString();
  }, [page, limit, searchTerm, channelFilter, categoryFilter]);

  // Stable query key to prevent unnecessary refetches
  const queryKey = useMemo(
    () => ["templates", page, limit, searchTerm, channelFilter, categoryFilter],
    [page, limit, searchTerm, channelFilter, categoryFilter]
  );

  const { data, isLoading, isError, error, refetch, isFetching } = useFetchData(
    `/api/v1/templates?${queryParams}`,
    queryKey
  );

  const templates = data?.data?.templates || [];
  const pagination = data?.data?.pagination;

  const { data: categoryData } = useFetchData(
    "/api/v1/categories/stats/counts",
    "categoriesStats"
  );
  const categoryStats = categoryData?.data || [];

  // Optimized filter handlers that reset page to 1
  const handleSearchChange = useCallback((newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setPage(1); // Reset to first page on search
  }, []);

  const handleChannelFilterChange = useCallback((newChannelFilter) => {
    setChannelFilter(newChannelFilter);
    setPage(1); // Reset to first page on filter change
  }, []);

  const handleCategoryFilterChange = useCallback((newCategoryFilter) => {
    setCategoryFilter(newCategoryFilter);
    setPage(1); // Reset to first page on filter change
  }, []);

  // Action Handlers (unchanged but memoized for better performance)
  const handleEdit = useCallback(
    (template) => {
      navigate(`/templates/${template._id}`);
    },
    [navigate]
  );

  const handleView = useCallback((template) => {
    setSelectedTemplate(template);
  }, []);

  const handleCopy = useCallback(async (template) => {
    try {
      const plainText =
        new DOMParser().parseFromString(template.content, "text/html").body
          .textContent || "";

      await navigator.clipboard.writeText(plainText);
      toast.success(`Template "${template.name}" copied to clipboard!`);
    } catch (error) {
      toast.error("Failed to copy template. Please try again.");
    }
  }, []);

  const { mutateAsync } = useMutateData("deleteTemplate", "DELETE");

  const handleDelete = useCallback(
    async (template) => {
      const confirmDelete = window.confirm(
        `Are you sure you want to delete "${template.name}"? This action cannot be undone.`
      );

      if (confirmDelete) {
        try {
          const response = await mutateAsync({
            url: `/api/v1/templates/${template._id}`,
          });
          toast.success(response.message || "Template deleted.");
          refetch();
        } catch (error) {
          toast.error(
            error.errors?.map((err) => err.message)?.join(", ") ||
              error?.message ||
              "Failed to delete template"
          );
        }
      }
    },
    [mutateAsync, refetch]
  );

  // Memoized pagination handlers
  const handlePreviousPage = useCallback(() => {
    setPage((prev) => Math.max(1, prev - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  // Show loading only on initial load, not during filtering/search
  const showInitialLoading = isLoading && !isFetching;
  const showUpdatingIndicator = isFetching && !isLoading;

  return (
    <DataStateHandler
      isLoading={showInitialLoading}
      isError={isError}
      error={error}
      refetch={refetch}
      loadingMessage="Loading templates..."
      errorMessage="Error loading template"
    >
      <div className="p-3 sm:p-6 max-w-7xl mx-auto bg-[#F2F4F7]">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">
            Template Manager
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Create and manage message templates for SMS, Email, and WhatsApp
          </p>
        </div>

        {/* Category Stats */}
        {categoryStats && categoryStats.length !== 0 ? (
          <CategoryStats categoryStats={categoryStats} />
        ) : (
          "No Template Category yet"
        )}

        {/* Message Templates Section */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Message Templates
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Manage your communication templates ({templates.length} total)
              </p>
            </div>
            <Link to="/templates/create">
              <button className="bg-purple-700 text-white px-4 py-2 rounded-full flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors w-full sm:w-auto">
                <Plus className="w-4 h-4" />
                <span>Create Template</span>
              </button>
            </Link>
          </div>

          {/* Search and Filters - Pass optimized handlers */}
          <SearchAndFilters
            searchTerm={searchTerm}
            setSearchTerm={handleSearchChange}
            channelFilter={channelFilter}
            setChannelFilter={handleChannelFilterChange}
            categoryFilter={categoryFilter}
            setCategoryFilter={handleCategoryFilterChange}
          />
        </div>

        {/* Template Cards with fade transition during updates */}
        <div
          className={`space-y-4 transition-opacity duration-200 ${
            showUpdatingIndicator ? "opacity-70" : "opacity-100"
          }`}
        >
          {templates.map((template) => (
            <TemplateCard
              key={template._id}
              template={template}
              getChannelBadgeColor={getChannelBadgeColor}
              onEdit={handleEdit}
              onView={handleView}
              onCopy={handleCopy}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="flex justify-center items-center gap-3 mt-6">
            <button
              disabled={page === 1 || showUpdatingIndicator}
              onClick={handlePreviousPage}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <span className="px-3 py-1 bg-white rounded-lg border">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              disabled={page === pagination.totalPages || showUpdatingIndicator}
              onClick={handleNextPage}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        )}

        {/* Empty State */}
        {templates.length === 0 &&
          !showInitialLoading &&
          !showUpdatingIndicator && (
            <div className="text-center py-8 sm:py-12">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-base sm:text-lg font-medium mb-2">
                  No templates found
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  {searchTerm ||
                  (channelFilter && channelFilter !== " ") ||
                  (categoryFilter && categoryFilter !== " ")
                    ? "Try adjusting your search or filters."
                    : "Get started by creating your first template."}
                </p>
                {!searchTerm &&
                  (!channelFilter || channelFilter === " ") &&
                  (!categoryFilter || categoryFilter === " ") && (
                    <Link to="/templates/create">
                      <button className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                        Create Your First Template
                      </button>
                    </Link>
                  )}
              </div>
            </div>
          )}

        {/* Subtle loading indicator for updates */}
        {showUpdatingIndicator && (
          <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg p-3 shadow-lg z-50">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-700"></div>
              <span className="text-sm text-gray-600">Updating...</span>
            </div>
          </div>
        )}

        {/* Template Modal */}
        <TemplateModal
          template={selectedTemplate}
          isOpen={!!selectedTemplate}
          onClose={() => setSelectedTemplate(null)}
        />
      </div>
    </DataStateHandler>
  );
};

export default TemplateManager;
