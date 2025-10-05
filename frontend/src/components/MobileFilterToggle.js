import { useState } from 'react';
import { FiFilter, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import TicketFilters from './TicketFilters';

const MobileFilterToggle = ({ filters, onChange, onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700"
      >
        <div className="flex items-center gap-2">
          <FiFilter className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span className="font-semibold text-gray-900 dark:text-white">Filters</span>
        </div>
        {isOpen ? (
          <FiChevronUp className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <FiChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>
      
      {isOpen && (
        <div className="mt-3">
          <TicketFilters
            filters={filters}
            onChange={onChange}
            onSearch={onSearch}
          />
        </div>
      )}
    </div>
  );
};

export default MobileFilterToggle;
