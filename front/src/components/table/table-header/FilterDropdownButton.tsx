import { ChangeEvent, useCallback, useState } from 'react';
import DropdownButton from './DropdownButton';
import {
  FilterConfigType,
  FilterOperandType,
  FilterableFieldsType,
  SelectedFilterType,
} from '../../../interfaces/filters/interface';
import {
  SearchConfigType,
  SearchableType,
} from '../../../interfaces/search/interface';

type OwnProps<TData extends FilterableFieldsType> = {
  isFilterSelected: boolean;
  availableFilters: FilterConfigType<TData>[];
  filterSearchResults?: {
    results: {
      render: (value: SearchableType) => string;
      value: SearchableType;
    }[];
    loading: boolean;
  };
  onFilterSelect: (filter: SelectedFilterType<TData>) => void;
  onFilterSearch: (
    filter: SearchConfigType<any> | null,
    searchValue: string,
  ) => void;
};

export const FilterDropdownButton = <TData extends FilterableFieldsType>({
  availableFilters,
  filterSearchResults,
  onFilterSearch,
  onFilterSelect,
  isFilterSelected,
}: OwnProps<TData>) => {
  const [isUnfolded, setIsUnfolded] = useState(false);

  const [isOptionUnfolded, setIsOptionUnfolded] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState<
    FilterConfigType<TData> | undefined
  >(undefined);

  const [selectedFilterOperand, setSelectedFilterOperand] = useState<
    FilterOperandType<TData> | undefined
  >(undefined);

  const resetState = useCallback(() => {
    setIsOptionUnfolded(false);
    setSelectedFilter(undefined);
    setSelectedFilterOperand(undefined);
    onFilterSearch(null, '');
  }, [onFilterSearch]);

  const renderSelectOptionItems = selectedFilter?.operands.map(
    (filterOperand, index) => (
      <DropdownButton.StyledDropdownItem
        key={`select-filter-operand-${index}`}
        onClick={() => {
          setSelectedFilterOperand(filterOperand);
          setIsOptionUnfolded(false);
        }}
      >
        {filterOperand.label}
      </DropdownButton.StyledDropdownItem>
    ),
  );

  const renderSearchResults = (
    filterSearchResults: NonNullable<OwnProps<TData>['filterSearchResults']>,
    selectedFilter: FilterConfigType<TData>,
    selectedFilterOperand: FilterOperandType<TData>,
  ) => {
    if (filterSearchResults.loading) {
      return (
        <DropdownButton.StyledDropdownItem data-testid="loading-search-results">
          Loading
        </DropdownButton.StyledDropdownItem>
      );
    }

    return filterSearchResults.results.map((result, index) => (
      <DropdownButton.StyledDropdownItem
        key={`fields-value-${index}`}
        onClick={() => {
          onFilterSelect({
            key: selectedFilter.key,
            label: selectedFilter.label,
            value: result.value,
            displayValue: result.render(result.value),
            icon: selectedFilter.icon,
            operand: selectedFilterOperand,
          });
          setIsUnfolded(false);
          setSelectedFilter(undefined);
        }}
      >
        {result.render(result.value)}
      </DropdownButton.StyledDropdownItem>
    ));
  };

  const renderSelectFilterITems = availableFilters.map((filter, index) => (
    <DropdownButton.StyledDropdownItem
      key={`select-filter-${index}`}
      onClick={() => {
        setSelectedFilter(filter);
        setSelectedFilterOperand(filter.operands[0]);
        onFilterSearch(filter.searchConfig, '');
      }}
    >
      <DropdownButton.StyledIcon>{filter.icon}</DropdownButton.StyledIcon>
      {filter.label}
    </DropdownButton.StyledDropdownItem>
  ));

  function renderFilterDropdown(
    selectedFilter: FilterConfigType<TData>,
    selectedFilterOperand: FilterOperandType<TData>,
  ) {
    return (
      <>
        <DropdownButton.StyledDropdownTopOption
          key={'selected-filter-operand'}
          onClick={() => setIsOptionUnfolded(true)}
        >
          {selectedFilterOperand.label}

          <DropdownButton.StyledDropdownTopOptionAngleDown />
        </DropdownButton.StyledDropdownTopOption>
        <DropdownButton.StyledSearchField key={'search-filter'}>
          <input
            type="text"
            placeholder={selectedFilter.label}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onFilterSearch(selectedFilter.searchConfig, event.target.value)
            }
          />
        </DropdownButton.StyledSearchField>
        {filterSearchResults &&
          renderSearchResults(
            filterSearchResults,
            selectedFilter,
            selectedFilterOperand,
          )}
      </>
    );
  }

  return (
    <DropdownButton
      label="Filter"
      isActive={isFilterSelected}
      isUnfolded={isUnfolded}
      setIsUnfolded={setIsUnfolded}
      resetState={resetState}
    >
      {selectedFilter && selectedFilterOperand
        ? isOptionUnfolded
          ? renderSelectOptionItems
          : renderFilterDropdown(selectedFilter, selectedFilterOperand)
        : renderSelectFilterITems}
    </DropdownButton>
  );
};