import { useState, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { TemplateEditor } from "./templateEditor";
import { TemplateForm } from "./templateForm";
import { useNavigate } from "react-router-dom";
import { useMutateData } from "../../../hook/Request";
import { toast } from "sonner";
const CreateTemplate = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
    setValue,
    watch,
    getValues,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      selectedChannels: [],
      category: "",
      note: "",
      templateName: "",
      content: "",
    },
  });

  // Watch form values for step validation
  const watchedValues = watch();
  const { selectedChannels, category, note, templateName, content } =
    watchedValues;

  const variables = useMemo(
    () => [
      { placeholder: "{{firstName}}", description: "Recipient's first name" },
      { placeholder: "{{lastName}}", description: "Recipient's last name" },
      { placeholder: "{{churchName}}", description: "Church name" },
      { placeholder: "{{pastorName}}", description: "Pastor's name" },
      { placeholder: "{{serviceTime}}", description: "Service time" },
      { placeholder: "{{eventDate}}", description: "Event date" },
      { placeholder: "{{phoneNumber}}", description: "Phone number" },
      { placeholder: "{{address}}", description: "Church address" },
    ],
    []
  );

  // Extract used variables from content
  const extractUsedVariables = useCallback(
    (content) => {
      if (!content || !variables) return [];
      return variables.filter((variable) =>
        content.includes(variable.placeholder)
      );
    },
    [variables]
  );

  // Memoized used variables
  const usedVariables = useMemo(
    () => extractUsedVariables(content),
    [content, extractUsedVariables]
  );
  const { mutateAsync, isLoading, isError, error, isSuccess, data } =
    useMutateData("createTemplate", "POST");

  const onSubmit = useCallback(
    async (formData) => {
      const finalTemplateData = {
        name: formData.templateName,
        channels: formData.selectedChannels,
        category: formData.category,
        note: formData.note,
        content: formData.content,
        variables: extractUsedVariables(formData.content),
      };

      try {
        const response = await mutateAsync({
          url: "/api/v1/templates",
          data: finalTemplateData,
        });
        toast.success(response.message);
        navigate("/templates");
      } catch (err) {
        toast.error(
          err.errors?.map((err) => err.message) ||
            err?.message ||
            "Failed to save template"
        );
      }
    },
    [extractUsedVariables]
  );

  // Step validation
  const canProceedToStep2 = useMemo(
    () => selectedChannels?.length > 0 && category,
    [selectedChannels, category]
  );

  const canSave = useMemo(
    () => templateName?.trim() && content?.trim() && canProceedToStep2,
    [templateName, content, canProceedToStep2]
  );

  // Helper functions for updating form values
  const updateSelectedChannels = useCallback(
    (channels) => {
      setValue("selectedChannels", channels, { shouldValidate: true });
    },
    [setValue]
  );

  const updateCategory = useCallback(
    (category) => {
      setValue("category", category, { shouldValidate: true });
    },
    [setValue]
  );

  const updateNote = useCallback(
    (note) => {
      setValue("note", note, { shouldValidate: true });
    },
    [setValue]
  );

  const updateTemplateName = useCallback(
    (name) => {
      setValue("templateName", name, { shouldValidate: true });
    },
    [setValue]
  );

  const updateContent = useCallback(
    (content) => {
      setValue("content", content, { shouldValidate: true });
    },
    [setValue]
  );

  const handleStepTwo = useCallback(() => {
    setCurrentStep(2);
  }, []);

  const handleStepOne = useCallback(() => {
    setCurrentStep(1);
  }, []);

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Go back to template list"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Create Template
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Design a reusable email template for messages, campaigns, or
              newsletters.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Progress Indicator */}
      <div className="lg:hidden mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 1
                  ? "bg-purple-600 text-white"
                  : canProceedToStep2
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {canProceedToStep2 && currentStep !== 1 ? "✓" : "1"}
            </div>
            <div
              className={`h-1 w-8 ${
                currentStep === 2 ? "bg-purple-600" : "bg-gray-200"
              }`}
            ></div>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === 2
                  ? "bg-purple-600 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
          </div>
          <span className="text-sm text-gray-500">Step {currentStep} of 2</span>
        </div>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
          {/* Step 1: Template Form */}
          <div
            className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 ${
              currentStep === 2 && "lg:block hidden"
            }`}
          >
            <TemplateForm
              selectedChannels={selectedChannels || []}
              setSelectedChannels={updateSelectedChannels}
              category={category || ""}
              setCategory={updateCategory}
              note={note || ""}
              setNote={updateNote}
              errors={errors}
            />

            {/* Mobile Next Button */}
            <div className="mt-6 pt-6 border-t border-gray-200 lg:hidden">
              {currentStep === 1 && (
                <button
                  type="button"
                  onClick={handleStepTwo}
                  disabled={!canProceedToStep2}
                  className="w-full bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next: Message Content
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              {/* Show validation errors on mobile */}
              {!canProceedToStep2 && currentStep === 1 && (
                <div className="mt-2 text-sm text-red-500">
                  {selectedChannels?.length === 0 && (
                    <p>• Please select at least one channel</p>
                  )}
                  {!category && <p>• Please select a category</p>}
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Template Editor */}
          <div
            className={`bg-white rounded-lg border border-gray-200 p-4 sm:p-6 ${
              currentStep === 1 && "lg:block hidden"
            }`}
          >
            {/* Mobile Back Button */}
            <div className="flex items-center justify-between mb-6 lg:hidden">
              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={handleStepOne}
                  className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              )}
            </div>

            <TemplateEditor
              templateName={templateName || ""}
              setTemplateName={updateTemplateName}
              content={content || ""}
              setContent={updateContent}
              variables={variables}
              usedVariables={usedVariables}
              errors={errors}
              canSave={canSave}
              isLoading={isLoading}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateTemplate;
