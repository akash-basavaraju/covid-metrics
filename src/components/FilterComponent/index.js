import React, { useState } from "react";
import "./index.css";

export default function FilterComponent(props) {
  const {
    availableFilterValues,
    filterKey,
    onFilterApply,
    appliedFilters,
    filterIndex,
    maxFilterIndex,
  } = props;

  const [tempAppliedFilters, setTempAppliedFilters] = useState(
    appliedFilters[filterKey] || []
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <div className="filter_container">
      <div
        onClick={(event) => {
          event.stopPropagation();
          setIsFilterOpen(!isFilterOpen);
        }}
        className="filter_key"
      >
        Filter
      </div>
      {isFilterOpen && (
        <div
          className={`filter_modal ${
            filterIndex < Math.floor(maxFilterIndex / 2)
              ? "filter_left"
              : "filter_right"
          }`}
        >
          <div
            onClick={(event) => {
              event.stopPropagation();
              setIsFilterOpen(false);
            }}
            className="filter_close"
          >
            x
          </div>
          <div className="filter_labels">
            {availableFilterValues[filterKey].map((value, index) => {
              return (
                <div key={`${index}=${value}`} className="filter_label">
                  <label>
                    <input
                      type="checkbox"
                      value={value}
                      defaultChecked={(
                        appliedFilters[filterKey] || []
                      ).includes(value)}
                      onChangeCapture={(event) => {
                        event.stopPropagation();

                        setTempAppliedFilters([...tempAppliedFilters, value]);
                      }}
                      className="filter_input"
                    />
                    {value}
                  </label>
                </div>
              );
            })}
          </div>
          <button
            onClick={(event) => {
              event.stopPropagation();
              onFilterApply(filterKey, tempAppliedFilters);
            }}
            className="filter_apply"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
