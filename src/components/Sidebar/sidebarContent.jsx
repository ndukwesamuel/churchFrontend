import { LogOut } from "lucide-react";
import { assets } from "../../assets/assets";
import { tabs } from "../../routes";

export default function SidebarContent({
  isActiveLink,
  handleTabClick,
  handleLogout,
  isCustomersExpanded,
  setIsCustomersExpanded,
  isMobile = false,
}) {
  return (
    <div className="flex flex-col  h-screen">
      {/* Logo */}
      <div
        className={`flex items-center mb-8 ${
          isMobile ? "px-4 pt-4" : "px-4 pt-2"
        }`}
      >
        <img src={assets.logo} alt="App Logo" className="h-10 w-40" />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4">
        <ul className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = isActiveLink(tab.path);

            return (
              <li key={tab.path}>
                <button
                  onClick={() => handleTabClick(tab.path)}
                  className={`flex items-center w-full ${
                    isMobile ? "px-4 py-3" : "px-3 py-2.5"
                  } rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-paleBlue text-deepPurple shadow-sm border border-vanessa"
                      : "text-blueBayoux hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 mr-3 flex-shrink-0 ${
                      isActive ? "text-deepPurple" : "text-blueBayoux"
                    }`}
                  />
                  <span className="truncate">{tab.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Customers Section */}
        {/* <div className="mt-6">
          <button
            onClick={() => setIsCustomersExpanded(!isCustomersExpanded)}
            className={`flex items-center justify-between w-full ${
              isMobile ? "px-4 py-3" : "px-3 py-2.5"
            } text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors duration-200`}
          >
            <div className="flex items-center min-w-0">
              <Users className="w-5 h-5 mr-3 flex-shrink-0 text-gray-400" />
              <span className="truncate">Customers</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
                isCustomersExpanded ? "rotate-180" : ""
              }`}
            />
          </button>

          {isCustomersExpanded && (
            <div className="ml-8 mt-2 space-y-1">
              <button
                onClick={() => handleTabClick("/customers/all")}
                className={`block w-full text-left ${
                  isMobile ? "px-4" : "px-3"
                } py-2 text-sm rounded-lg transition-colors duration-200 ${
                  isActiveLink("/customers/all")
                    ? "text-deepPurple bg-paleBlue"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                All Customers
              </button>
              <button
                onClick={() => handleTabClick("/customers/active")}
                className={`block w-full text-left ${
                  isMobile ? "px-4" : "px-3"
                } py-2 text-sm rounded-lg transition-colors duration-200 ${
                  isActiveLink("/customers/active")
                    ? "text-deepPurple bg-paleBlue"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                Active Members
              </button>
            </div>
          )}
        </div> */}
      </nav>

      {/* Bottom Section - Log Out */}
      <div
        className={`border-t border-gray-100 ${
          isMobile ? "p-4" : "px-4 pb-4 pt-4"
        }`}
      >
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-5 h-5 mr-3 flex-shrink-0" />
          <span className="truncate">Log Out</span>
        </button>
      </div>
    </div>
  );
}
