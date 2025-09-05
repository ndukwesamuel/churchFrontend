import { useState, useCallback } from "react";
import { Plus, Megaphone, Mail, Calendar, Heart, Users } from "lucide-react";
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
  const [channelFilter, setChannelFilter] = useState("all channel");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [selectedTemplate, setSelectedTemplate] = useState(null); // modal state

  const { data, isLoading, isError, error, refetch, isFetching } = useFetchData(
    "/api/v1/templates",
    "templates"
  );

  const templates = data?.data?.templates || [];
  const pagination = data?.data?.pagination;
  const { data: categoryData } = useFetchData(
    "/api/v1/categories/stats/counts",
    "categoriesStats"
  );
  const categoryStats = categoryData?.data || [];

  // Action Handlers
  const handleEdit = useCallback(
    (template) => {
      console.log("Editing template:", template);
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
            err.errors?.map((err) => err.message) ||
              err?.message ||
              "Failed to save template"
          );
        }
      }
    },
    [refetch]
  );

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      template.content?.toLowerCase().includes(searchTerm?.toLowerCase());
    const matchesChannel =
      channelFilter === "all channel" ||
      template.channel?.toLowerCase() === channelFilter?.toLowerCase();
    const matchesCategory =
      categoryFilter === "All categories" ||
      template.category === categoryFilter;

    return matchesSearch && matchesChannel && matchesCategory;
  });

  return (
    <DataStateHandler
      isLoading={isLoading}
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

          {/* Search and Filters */}
          <SearchAndFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            channelFilter={channelFilter}
            setChannelFilter={setChannelFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
          />
        </div>

        {/* Template Cards */}
        <div className="space-y-4">
          {filteredTemplates.map((template) => (
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

        {/* Empty State */}
        {filteredTemplates.length === 0 && !isLoading && (
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
                channelFilter !== "all channel" ||
                categoryFilter !== "All categories"
                  ? "Try adjusting your search or filters."
                  : "Get started by creating your first template."}
              </p>
              {!searchTerm &&
                channelFilter === "all channel" &&
                categoryFilter === "All categories" && (
                  <Link to="/templates/create">
                    <button className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors">
                      Create Your First Template
                    </button>
                  </Link>
                )}
            </div>
          </div>
        )}

        {/* Loading indicator for refetching */}
        {isFetching && !isLoading && (
          <div className="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-700"></div>
              <span className="text-sm text-gray-600">Updating...</span>
            </div>
          </div>
        )}
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
