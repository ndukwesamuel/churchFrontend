export const CategoryStats = ({ categoryStats }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6 sm:mb-8">
      {categoryStats.map((category, index) => {
        const IconComponent = category.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3">
              <div className="flex-shrink-0 bg-gray-50 p-2 rounded-md border border-gray-300">
                <IconComponent className="w-4 h-4 text-gray-600" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                  {category.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-500">
                  {category.count} templates
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
