import React, { useState, useMemo, useCallback } from "react";
import "./index.css";
import FilterComponent from "../../components/FilterComponent";

const COLUMNS_CONSIDERED = [
  { key: "Country", name: "Country Name" },
  { key: "NewConfirmed", name: "New Confirmed" },
  { key: "TotalConfirmed", name: "Total Confirmed" },
  { key: "NewDeaths", name: "New Deaths" },
  { key: "TotalDeaths", name: "Total Deaths" },
  { key: "NewRecovered", name: "New Recovered" },
  { key: "TotalRecovered", name: "Total Recovered" },
];
const COLUMN_KEYS = COLUMNS_CONSIDERED.map((column) => column.key);

export default function CountryWiseSummary(props) {
  const { apiData: { Countries: countries = [] } = {} } = props;
  const [appliedFilters, setAppliedFilters] = useState({});
  const [appliedSort, setAppliedSort] = useState(COLUMN_KEYS[0]);
  const [isSortAscending, setIsSortAscending] = useState(true);

  const availableFilterValues = useMemo(() => {
    return countries.reduce((acc, row) => {
      const mAcc = { ...acc };
      COLUMN_KEYS.forEach((columnKey) => {
        if (row[columnKey] || row[columnKey] === 0) {
          if (mAcc[columnKey]) {
            mAcc[columnKey] = mAcc[columnKey].includes(row[columnKey])
              ? mAcc[columnKey]
              : [...mAcc[columnKey], row[columnKey]];
          } else {
            mAcc[columnKey] = [row[columnKey]];
          }
        }
      });
      return mAcc;
    }, {});
  }, [countries]);

  const appliedFilterKeys = Object.keys(appliedFilters);

  const sortedCountries = useMemo(() => {
    const countriesData = [...countries];
    countriesData.sort(
      ({ [appliedSort]: aSortValue }, { [appliedSort]: bSortValue }) => {
        if (typeof aSortValue === "string") {
          var nameA = aSortValue.toUpperCase();
          var nameB = bSortValue.toUpperCase();
          if (nameA < nameB) {
            return isSortAscending ? -1 : 1;
          }
          return isSortAscending ? 1 : -1;
        }
        return isSortAscending
          ? aSortValue - bSortValue
          : bSortValue - aSortValue;
      }
    );

    return countriesData;
  }, [appliedSort, countries, isSortAscending]);

  const sortAndFilteresCountries = useMemo(() => {
    return sortedCountries.filter((countrObj) => {
      let flag = true;
      for (let i = 0; i < appliedFilterKeys.length && flag; i++) {
        const { [appliedFilterKeys[i]]: filterValues } = appliedFilters;
        const { [appliedFilterKeys[i]]: presentValue } = countrObj;

        if (!filterValues.includes(presentValue)) {
          flag = false;
        }
      }
      return flag;
    });
  }, [sortedCountries, appliedFilters, appliedFilterKeys]);

  const handleFilterApply = useCallback(
    (filterKey, updatedFilterValues) => {
      setAppliedFilters({
        ...appliedFilters,
        [filterKey]: updatedFilterValues,
      });
    },
    [appliedFilters]
  );

  return (
    <div className="country_wise_container">
      <div className="country_wise_heading">Country Wise Summary</div>
      <div className="country_wise_table_container">
        <table className="country_wise_table">
          <tr className="country_wise_row">
            {COLUMNS_CONSIDERED.map(({ name, key }, index) => {
              return (
                <th
                  key={`${key}-${appliedSort}-${isSortAscending}-${JSON.stringify(
                    appliedFilters
                  )}`}
                  className={`country_wise_row_head ${
                    index !== 0 ? "text_right" : ""
                  }`}
                >
                  <div
                    onClick={(event) => {
                      event.stopPropagation();
                      if (appliedSort === key) {
                        setIsSortAscending(!isSortAscending);
                      } else {
                        setAppliedSort(key);
                        setIsSortAscending(true);
                      }
                    }}
                  >
                    <div className="country_wise_sort">
                      {appliedSort === key && (isSortAscending ? "Asc" : "Des")}
                    </div>
                    <div className={`country_wise_row_head_name`}>{name}</div>
                  </div>
                  <div className="country_wise_filter">
                    <FilterComponent
                      availableFilterValues={availableFilterValues}
                      filterKey={key}
                      onFilterApply={handleFilterApply}
                      appliedFilters={appliedFilters}
                      filterIndex={index}
                      maxFilterIndex={COLUMNS_CONSIDERED.length}
                    />
                  </div>
                </th>
              );
            })}
          </tr>
          {sortAndFilteresCountries.map((country) => {
            return (
              <tr
                key={JSON.stringify(country)}
                className="country_wise_value_container"
              >
                {COLUMN_KEYS.map((key, index) => {
                  const { [key]: value } = country;
                  return (
                    <td
                      key={`${index}-${value}`}
                      className={`country_wise_value ${
                        typeof value === "number" ? "text_right" : ""
                      }`}
                    >
                      {typeof value === "number"
                        ? value.toLocaleString("hi")
                        : value}
                    </td>
                  );
                })}
              </tr>
            );
          })}
          {sortAndFilteresCountries.length === 0 && <div>No Data</div>}
        </table>
      </div>
    </div>
  );
}
