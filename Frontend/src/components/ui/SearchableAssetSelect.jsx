import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, X, Check, Laptop, Monitor, Printer, HardDrive, MapPin, User, Hash } from 'lucide-react';

const getAssetTypeIcon = (type) => {
  switch ((type || '').toLowerCase()) {
    case 'laptop':
      return <Laptop size={15} className="asset-icon laptop" />;
    case 'printer':
      return <Printer size={15} className="asset-icon printer" />;
    case 'pc':
    case 'desktop':
      return <Monitor size={15} className="asset-icon pc" />;
    default:
      return <HardDrive size={15} className="asset-icon default" />;
  }
};

export default function SearchableAssetSelect({
  assets = [],
  value = '',
  onChange,
  placeholder = '-- Select Asset --',
  allowClear = true,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const selectedAsset = useMemo(() => {
    return assets.find(a => String(a.id) === String(value));
  }, [assets, value]);

  // Comprehensive filter prioritizing startsWith match
  const filteredAssets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return assets;

    const startsWithMatches = [];
    const containsMatches = [];

    assets.forEach((asset) => {
      const tag = (asset.tag || '').toLowerCase();
      const id = (asset.id || '').toLowerCase();
      const brand = (asset.brand || '').toLowerCase();
      const model = (asset.model || '').toLowerCase();
      const type = (asset.type || '').toLowerCase();
      const division = (asset.division || '').toLowerCase();
      const serial = (asset.serial || asset.serialNum || '').toLowerCase();
      const officer = (asset.officer || '').toLowerCase();
      const location = (asset.location || '').toLowerCase();

      // Words array for prefix checks
      const tagParts = tag.split(/[-_\s]+/);
      const isTagStart = tag.startsWith(q) || tagParts.some(p => p.startsWith(q));
      const isIdStart = id.startsWith(q);
      const isBrandStart = brand.startsWith(q);
      const isModelStart = model.startsWith(q);
      const isTypeStart = type.startsWith(q);
      const isOfficerStart = officer.startsWith(q);
      const isDivisionStart = division.startsWith(q);
      const isSerialStart = serial.startsWith(q);

      const isStartsWith =
        isTagStart ||
        isIdStart ||
        isBrandStart ||
        isModelStart ||
        isTypeStart ||
        isOfficerStart ||
        isDivisionStart ||
        isSerialStart;

      if (isStartsWith) {
        startsWithMatches.push(asset);
      } else if (
        tag.includes(q) ||
        id.includes(q) ||
        brand.includes(q) ||
        model.includes(q) ||
        type.includes(q) ||
        division.includes(q) ||
        serial.includes(q) ||
        officer.includes(q) ||
        location.includes(q)
      ) {
        containsMatches.push(asset);
      }
    });

    return [...startsWithMatches, ...containsMatches];
  }, [assets, searchQuery]);

  const handleSelect = (assetId) => {
    onChange(assetId);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
    setSearchQuery('');
  };

  return (
    <div className={`searchable-asset-container ${className}`} ref={containerRef}>
      {/* Trigger Button */}
      <div
        className={`searchable-asset-trigger ${isOpen ? 'active' : ''} ${selectedAsset ? 'has-value' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div className="searchable-asset-trigger-content">
          {selectedAsset ? (
            <div className="selected-asset-chip">
              <span className="selected-asset-icon">{getAssetTypeIcon(selectedAsset.type)}</span>
              <span className="selected-asset-tag">{selectedAsset.tag}</span>
              <span className="selected-asset-meta">
                {selectedAsset.brand} {selectedAsset.model} {selectedAsset.division ? `(${selectedAsset.division})` : ''}
              </span>
            </div>
          ) : (
            <span className="placeholder-text">{placeholder}</span>
          )}
        </div>

        <div className="searchable-asset-trigger-actions">
          {selectedAsset && allowClear && (
            <button
              type="button"
              className="clear-selection-btn"
              onClick={handleClear}
              title="Clear selection"
              aria-label="Clear selection"
            >
              <X size={14} />
            </button>
          )}
          <ChevronDown size={16} className={`dropdown-chevron ${isOpen ? 'open' : ''}`} />
        </div>
      </div>

      {/* Dropdown Popup */}
      {isOpen && (
        <div className="searchable-asset-dropdown">
          {/* Search Header Bar */}
          <div className="searchable-asset-search-box">
            <Search size={15} className="search-icon" />
            <input
              ref={inputRef}
              type="text"
              className="search-input"
              placeholder="Type to filter by Tag, Brand, Model, S/N..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
                title="Clear search"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Results List */}
          <div className="searchable-asset-list" role="listbox">
            {/* Optional / None Option */}
            <div
              className={`searchable-asset-item none-option ${!value ? 'selected' : ''}`}
              onClick={() => handleSelect('')}
              role="option"
              aria-selected={!value}
            >
              <span className="none-label">-- No Asset (None) --</span>
              {!value && <Check size={14} className="check-icon" />}
            </div>

            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => {
                const isSelected = String(asset.id) === String(value);
                return (
                  <div
                    key={asset.id}
                    className={`searchable-asset-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelect(asset.id)}
                    role="option"
                    aria-selected={isSelected}
                  >
                    <div className="asset-item-icon-wrapper">
                      {getAssetTypeIcon(asset.type)}
                    </div>
                    <div className="asset-item-info">
                      <div className="asset-item-header">
                        <span className="asset-tag">{asset.tag}</span>
                        {asset.type && (
                          <span className="asset-type-badge">{asset.type}</span>
                        )}
                        {asset.status && (
                          <span className={`asset-status-pill status-${(asset.status || '').toLowerCase()}`}>
                            {asset.status}
                          </span>
                        )}
                      </div>
                      <div className="asset-item-sub">
                        <span className="asset-desc">{asset.brand} {asset.model}</span>
                        {asset.division && (
                          <span className="asset-division">
                            <MapPin size={11} className="inline-icon" /> {asset.division}
                          </span>
                        )}
                        {asset.officer && (
                          <span className="asset-officer">
                            <User size={11} className="inline-icon" /> {asset.officer}
                          </span>
                        )}
                        {asset.serial && (
                          <span className="asset-serial">
                            <Hash size={11} className="inline-icon" /> {asset.serial}
                          </span>
                        )}
                      </div>
                    </div>
                    {isSelected && <Check size={16} className="check-icon" />}
                  </div>
                );
              })
            ) : (
              <div className="searchable-asset-empty">
                <p>No assets found matching <strong>"{searchQuery}"</strong></p>
                <span className="empty-hint">Try searching by asset tag (MOHE-PC...), brand (Dell, HP, Lenovo), or type.</span>
              </div>
            )}
          </div>

          {/* Footer count indicator */}
          <div className="searchable-asset-footer">
            <span>{filteredAssets.length} of {assets.length} assets available</span>
            {searchQuery && (
              <span className="search-filter-badge">Filtered</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
