'use client'; // Este componente necesita ser un Client Component para usar useState y useRouter

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import Input from '@/app/globals/components/atoms/Input';
import Button from '@/app/globals/components/atoms/Button';
import Modal from '@/app/globals/components/atoms/Modal'; 
import type { SearchResult, SearchResponse, SearchError } from '@/app/modules/types';
import { searchUniversal, detectSearchType } from '@/app/globals/lib/api';
import { Search, AlertCircle, FileText, Layers, Folder, ExternalLink, Loader2 } from 'lucide-react'; 

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [searchError, setSearchError] = useState<SearchError | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Detect search type and update placeholder
  const getPlaceholder = () => {
    const searchType = searchTerm ? detectSearchType(searchTerm) : 'general';
    switch (searchType) {
      case 'pt':
        return 'Código PT detectado...';
      case 'md':
        return 'Código MD detectado...';
      case 'collection':
        return 'Búsqueda de colección...';
      default:
        return 'Buscar PT, MD, colecciones...';
    }
  };

  const handleSearch = async (query?: string) => {
    const searchQuery = query || searchTerm.trim();
    
    if (!searchQuery) {
      setSearchError({
        message: "Por favor, ingresa un término de búsqueda",
        code: 'EMPTY_QUERY',
        suggestions: ['Ejemplos: PT003112, MD003422, Winter']
      });
      setIsModalOpen(true);
      return;
    }

    setIsLoading(true);
    setSearchError(null);
    setIsDropdownOpen(true);

    try {
      console.log(`[SearchBar] Searching for: "${searchQuery}"`);
      const result = await searchUniversal(searchQuery);

      if ('message' in result) {
        // It's an error
        setSearchError(result);
        setSearchResults([]);
        setIsModalOpen(true);
        setIsDropdownOpen(false);
      } else {
        // It's a successful response
        setSearchResults(result.results);
        setSearchError(null);
        
        // Auto-navigate if only one result and it's a PT reference
        if (result.results.length === 1 && result.searchType === 'pt') {
          setTimeout(() => {
            router.push(result.results[0].url);
            setIsDropdownOpen(false);
          }, 500);
        }
      }
    } catch (error) {
      console.error('[SearchBar] Search error:', error);
      setSearchError({
        message: `Error inesperado: ${(error as Error).message}`,
        code: 'UNEXPECTED_ERROR',
        suggestions: ['Verifica tu conexión a internet', 'Intenta nuevamente']
      });
      setSearchResults([]);
      setIsModalOpen(true);
      setIsDropdownOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setHighlightedIndex(-1);
    
    // Auto-search after a short delay for PT/MD codes
    if (value.length >= 2) {
      const searchType = detectSearchType(value);
      if (searchType === 'pt' || searchType === 'md') {
        // Debounce search for code patterns
        setTimeout(() => {
          if (value === searchTerm) {
            handleSearch(value);
          }
        }, 300);
      }
    } else {
      setIsDropdownOpen(false);
      setSearchResults([]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (highlightedIndex >= 0 && searchResults[highlightedIndex]) {
        handleResultClick(searchResults[highlightedIndex]);
      } else {
        handleSearch();
      }
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex(prev => 
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex(prev => 
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    } else if (event.key === 'Escape') {
      setIsDropdownOpen(false);
      setHighlightedIndex(-1);
      inputRef.current?.blur();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    console.log(`[SearchBar] Navigating to: ${result.url}`);
    router.push(result.url);
    setIsDropdownOpen(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'reference':
        return <FileText className="w-4 h-4 text-primary-600" />;
      case 'collection':
        return <Layers className="w-4 h-4 text-accent-600" />;
      case 'phase':
        return <Folder className="w-4 h-4 text-success-600" />;
      default:
        return <Search className="w-4 h-4 text-secondary-600" />;
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSearchError(null);
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="flex items-center bg-secondary-50 border border-secondary-200 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-primary-500 focus-within:border-primary-500 transition-all duration-200">
        <Input
          ref={inputRef}
          placeholder={getPlaceholder()}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (searchResults.length > 0) setIsDropdownOpen(true);
          }}
          className="border-0 bg-transparent focus:ring-0 focus:border-0 flex-1 min-w-0"
        />
        <Button
          onClick={() => handleSearch()}
          disabled={isLoading}
          className="m-1 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white rounded-md transition-colors duration-200 flex items-center gap-2 text-sm font-medium"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span className="hidden sm:inline">
            {isLoading ? 'Buscando...' : 'Buscar'}
          </span>
        </Button>
      </div>

      {/* Search Results Dropdown */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-secondary-200 rounded-lg shadow-lg max-h-80 overflow-y-auto z-50 animate-slide-up">
          {isLoading ? (
            <div className="p-4 text-center">
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-primary-600" />
              <p className="text-sm text-secondary-600">Buscando...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="p-3 border-b border-secondary-100">
                <p className="text-xs font-medium text-secondary-500 uppercase tracking-wide">
                  {searchResults.length} resultado{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="py-2">
                {searchResults.map((result, index) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className={`w-full px-4 py-3 text-left hover:bg-secondary-50 transition-colors duration-200 flex items-start gap-3 ${
                      highlightedIndex === index ? 'bg-primary-50 border-r-2 border-primary-500' : ''
                    }`}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getResultIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-secondary-900 truncate">
                        {result.title}
                      </h4>
                      <p className="text-xs text-secondary-600 truncate">
                        {result.description}
                      </p>
                      {result.collection && (
                        <span className="inline-block mt-1 px-2 py-0.5 bg-secondary-100 text-xs text-secondary-700 rounded-full">
                          {result.collection}
                        </span>
                      )}
                    </div>
                    <div className="flex-shrink-0">
                      <ExternalLink className="w-3 h-3 text-secondary-400" />
                    </div>
                  </button>
                ))}
              </div>
              <div className="p-3 border-t border-secondary-100 bg-secondary-50">
                <p className="text-xs text-secondary-500">
                  💡 Usa las flechas ↑↓ para navegar y Enter para seleccionar
                </p>
              </div>
            </>
          ) : (
            <div className="p-6 text-center">
              <Search className="w-8 h-8 text-secondary-400 mx-auto mb-2" />
              <p className="text-sm text-secondary-600 mb-1">No se encontraron resultados</p>
              <p className="text-xs text-secondary-500">
                Intenta con códigos PT (PT003112) o nombres de colecciones
              </p>
            </div>
          )}
        </div>
      )}

      {/* Enhanced Error Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Resultado de Búsqueda"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-error-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                {searchError?.message}
              </h3>
              
              {searchError?.suggestions && searchError.suggestions.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-secondary-700 mb-2">
                    Sugerencias:
                  </h4>
                  <ul className="space-y-1">
                    {searchError.suggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-secondary-600 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-primary-500 rounded-full flex-shrink-0"></div>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="mt-6 flex gap-3">
                <button
                  onClick={closeModal}
                  className="btn-primary text-sm"
                >
                  Entendido
                </button>
                <button
                  onClick={() => {
                    closeModal();
                    inputRef.current?.focus();
                  }}
                  className="btn-secondary text-sm"
                >
                  Intentar de nuevo
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
