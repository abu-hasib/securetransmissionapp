import { useState } from "react";

export function Tabs({ tabs, activeTab, setActiveTab }) {

  return (
    <div className="w-full flex flex-col h-full">
      {/* Tab Headers */}
      <div className="flex gap-2 border-b border-gray-700/50 mb-6">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-3 font-semibold text-sm transition-all relative ${
              activeTab === index
                ? "text-primary-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              {tab.icon && tab.icon}
              {tab.label}
            </div>
            {activeTab === index && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-t" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1">{tabs[activeTab] && tabs[activeTab].content}</div>
    </div>
  );
}

export default Tabs;
