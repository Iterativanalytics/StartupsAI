import React, { useState, useEffect, useCallback } from 'react';
import { SearchQuery, SearchResult, SearchSuggestion, DocumentFilters } from '../../types/search.types';
import { BaseDocument } from '../../types/document.types';
import { SemanticSearchEngine } from '../search/SemanticSearchEngine';

interface SearchInterfaceProps {
  onSearch?: (results: SearchResult) => void;
  onDocumentSelect?: (document: BaseDocument) => void;
  placeholder?: string;
  autoFocus?: boolean;
  showFilters?: boolean;
  showSuggestions?: boolean;
  maxSuggestions?: number;
  searchEngine?: SemanticSearchEngine;
}

export const SearchInterface: React.FC<SearchInterfaceProps> = ({
  onSearch,
  onDocumentSelect,
  placeholder = "Search documents...",
  autoFocus = false,
  showFilters = true,
  showSuggestions = true,
  maxSuggestions = 10,
  searchEngine
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [filters, setFilters] = useState<DocumentFilters>({});
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);

  // Initialize search engine
  const engine = searchEngine || new SemanticSearchEngine();

  // Handle search input changes
  const handleQueryChange = useCallback(async (value: string) => {
    setQuery(value);
    
    if (value.length > 2 && showSuggestions) {
      try {
        const newSuggestions = await engine.getSearchSuggestions(value, {
          limit: maxSuggestions,
          includeFilters: true,
          includeFacets: true
        });
        setSuggestions(newSuggestions);
        setShowSuggestionsList(true);
      } catch (error) {
        console.error('Failed to get suggestions:', error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestionsList(false);
    }
  }, [engine, showSuggestions, maxSuggestions]);

  // Handle search execution
  const handleSearch = useCallback(async (searchQuery?: string) => {
    const queryText = searchQuery || query;
    if (!queryText.trim()) return;

    setIsSearching(true);
    setShowSuggestionsList(false);

    try {
      const searchQueryObj: SearchQuery = {
        text: queryText,
        filters,
        options: {
          limit: 50,
          highlight: true,
          fuzzy: true
        }
      };

      const results = await engine.search(searchQueryObj);
      setSearchResults(results);
      onSearch?.(results);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  }, [query, filters, engine, onSearch]);

  // Handle suggestion selection
  const handleSuggestionSelect = useCallback((suggestion: SearchSuggestion) => {
    setQuery(suggestion.text);
    setShowSuggestionsList(false);
    handleSearch(suggestion.text);
  }, [handleSearch]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestionsList || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSearch();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
          handleSuggestionSelect(suggestions[selectedSuggestionIndex]);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowSuggestionsList(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  }, [showSuggestionsList, suggestions, selectedSuggestionIndex, handleSuggestionSelect, handleSearch]);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilters: DocumentFilters) => {
    setFilters(newFilters);
  }, []);

  // Handle document selection
  const handleDocumentClick = useCallback((document: BaseDocument) => {
    onDocumentSelect?.(document);
  }, [onDocumentSelect]);

  // Clear search
  const handleClear = useCallback(() => {
    setQuery('');
    setSearchResults(null);
    setSuggestions([]);
    setShowSuggestionsList(false);
  }, []);

  return (
    <div className="search-interface">
      {/* Search Input */}
      <div className="search-input-container">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestionsList(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestionsList(false), 200)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="search-input"
            disabled={isSearching}
          />
          <div className="search-input-actions">
            {query && (
              <button
                onClick={handleClear}
                className="clear-button"
                type="button"
              >
                ✕
              </button>
            )}
            <button
              onClick={() => handleSearch()}
              className="search-button"
              type="button"
              disabled={isSearching || !query.trim()}
            >
              {isSearching ? '⟳' : '🔍'}
            </button>
          </div>
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestionsList && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className={`suggestion-item ${
                  index === selectedSuggestionIndex ? 'selected' : ''
                }`}
                onClick={() => handleSuggestionSelect(suggestion)}
                onMouseEnter={() => setSelectedSuggestionIndex(index)}
              >
                <span className="suggestion-text">{suggestion.text}</span>
                <span className="suggestion-type">{suggestion.type}</span>
                {suggestion.confidence && (
                  <span className="suggestion-confidence">
                    {Math.round(suggestion.confidence * 100)}%
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <SearchFilters
          filters={filters}
          onFiltersChange={handleFilterChange}
        />
      )}

      {/* Search Results */}
      {searchResults && (
        <SearchResults
          results={searchResults}
          onDocumentSelect={handleDocumentClick}
          isSearching={isSearching}
        />
      )}
    </div>
  );
};

// Search Filters Component
interface SearchFiltersProps {
  filters: DocumentFilters;
  onFiltersChange: (filters: DocumentFilters) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: keyof DocumentFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="search-filters">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="filters-toggle"
      >
        Filters {hasActiveFilters && `(${Object.keys(filters).length})`}
        {isExpanded ? '▲' : '▼'}
      </button>

      {isExpanded && (
        <div className="filters-panel">
          {/* Document Type Filter */}
          <div className="filter-group">
            <label>Document Type</label>
            <select
              value={filters.documentTypes?.[0] || ''}
              onChange={(e) => handleFilterChange('documentTypes', e.target.value ? [e.target.value as any] : undefined)}
            >
              <option value="">All Types</option>
              <option value="business-plan">Business Plan</option>
              <option value="proposal">Proposal</option>
              <option value="pitch-deck">Pitch Deck</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div className="filter-group">
            <label>Date Range</label>
            <div className="date-range-inputs">
              <input
                type="date"
                value={filters.dateRange?.start.toISOString().split('T')[0] || ''}
                onChange={(e) => {
                  const start = e.target.value ? new Date(e.target.value) : undefined;
                  handleFilterChange('dateRange', start ? {
                    start,
                    end: filters.dateRange?.end || new Date()
                  } : undefined);
                }}
                placeholder="Start Date"
              />
              <input
                type="date"
                value={filters.dateRange?.end.toISOString().split('T')[0] || ''}
                onChange={(e) => {
                  const end = e.target.value ? new Date(e.target.value) : undefined;
                  handleFilterChange('dateRange', end ? {
                    start: filters.dateRange?.start || new Date(0),
                    end
                  } : undefined);
                }}
                placeholder="End Date"
              />
            </div>
          </div>

          {/* AI Generated Filter */}
          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={filters.aiGenerated === true}
                onChange={(e) => handleFilterChange('aiGenerated', e.target.checked ? true : undefined)}
              />
              AI Generated Only
            </label>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="clear-filters-button"
            >
              Clear All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// Search Results Component
interface SearchResultsProps {
  results: SearchResult;
  onDocumentSelect: (document: BaseDocument) => void;
  isSearching: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  onDocumentSelect,
  isSearching
}) => {
  if (isSearching) {
    return (
      <div className="search-results loading">
        <div className="loading-spinner">⟳</div>
        <p>Searching...</p>
      </div>
    );
  }

  if (results.documents.length === 0) {
    return (
      <div className="search-results empty">
        <p>No documents found matching your search.</p>
        <p>Try adjusting your search terms or filters.</p>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="results-header">
        <h3>Search Results ({results.total})</h3>
        <p>Found {results.total} documents in {results.processingTime}ms</p>
      </div>

      <div className="results-list">
        {results.documents.map((document) => (
          <div
            key={document.id}
            className="result-item"
            onClick={() => onDocumentSelect(document)}
          >
            <div className="result-header">
              <h4 className="result-title">{document.title}</h4>
              <span className="result-type">{document.type}</span>
            </div>
            <p className="result-description">{document.description}</p>
            <div className="result-metadata">
              <span className="result-author">{document.lastModifiedBy}</span>
              <span className="result-date">
                {new Date(document.updatedAt).toLocaleDateString()}
              </span>
              {document.ai.autoGenerated && (
                <span className="ai-badge">AI Generated</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Facets */}
      {results.facets && Object.keys(results.facets).length > 0 && (
        <div className="search-facets">
          <h4>Filter by:</h4>
          {Object.entries(results.facets).map(([key, values]) => (
            <div key={key} className="facet-group">
              <h5>{key}</h5>
              {Object.entries(values).map(([value, count]) => (
                <div key={value} className="facet-item">
                  <span>{value}</span>
                  <span>({count})</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Suggestions */}
      {results.suggestions && results.suggestions.length > 0 && (
        <div className="search-suggestions">
          <h4>Related Searches:</h4>
          <div className="suggestions-list">
            {results.suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="suggestion-button"
                onClick={() => {/* Handle suggestion click */}}
              >
                {suggestion.text}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInterface;
