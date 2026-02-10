import React, { useState, useMemo } from 'react';
import { Input, Select, Button, Card } from '../../components/ui/index.js';
import PropertyCard from '../../components/Properties/PropertyCard/index.jsx';
import { 
  propertiesMock, 
  propertyTypes, 
  propertyStatuses, 
  bedroomOptions 
} from '../../mocks/propertiesMock.jsx';
import styles from './styles.module.css';

const Properties = () => {
  // Estado para filtros
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    bedrooms: '',
    minPrice: '',
    maxPrice: '',
    location: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  // TODO - Implementar paginação com backend
  // TODO - Implementar ordenação de resultados

  // Função para atualizar filtros
  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Função para limpar filtros
  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      status: '',
      bedrooms: '',
      minPrice: '',
      maxPrice: '',
      location: ''
    });
  };

  // TODO - Aplicar filtros via backend quando API estiver disponível
  // Lógica de filtragem no frontend
  const filteredProperties = useMemo(() => {
    return propertiesMock.filter(property => {
      // Filtro de busca (título e localização)
      const searchMatch = !filters.search || 
        property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.location.toLowerCase().includes(filters.search.toLowerCase());

      // Filtro de tipo
      const typeMatch = !filters.type || property.type === filters.type;

      // Filtro de status
      const statusMatch = !filters.status || property.status === filters.status;

      // Filtro de quartos
      const bedroomsMatch = !filters.bedrooms || 
        (filters.bedrooms === '4' ? property.bedrooms >= 4 : property.bedrooms === parseInt(filters.bedrooms));

      // Filtro de preço mínimo
      const minPriceMatch = !filters.minPrice || property.price >= parseInt(filters.minPrice);

      // Filtro de preço máximo
      const maxPriceMatch = !filters.maxPrice || property.price <= parseInt(filters.maxPrice);

      // Filtro de localização
      const locationMatch = !filters.location || 
        property.location.toLowerCase().includes(filters.location.toLowerCase());

      return searchMatch && typeMatch && statusMatch && bedroomsMatch && minPriceMatch && maxPriceMatch && locationMatch;
    });
  }, [filters]);

  // Estatísticas dos resultados
  const stats = useMemo(() => {
    const total = propertiesMock.length;
    const filtered = filteredProperties.length;
    const available = filteredProperties.filter(p => p.status === 'disponivel').length;
    const featured = filteredProperties.filter(p => p.featured).length;

    return { total, filtered, available, featured };
  }, [filteredProperties]);

  return (
    <div className={styles.propertiesPage}>
      {/* Header da página */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>Catálogo de Imóveis</h1>
          <p className={styles.pageSubtitle}>
            Encontre o imóvel perfeito para você
          </p>
        </div>
        
        {/* Estatísticas */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.filtered}</span>
            <span className={styles.statLabel}>Resultados</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.available}</span>
            <span className={styles.statLabel}>Disponíveis</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.featured}</span>
            <span className={styles.statLabel}>Destaques</span>
          </div>
        </div>
      </div>

      {/* Área de filtros */}
      <Card className={styles.filtersSection}>
        <div className={styles.filtersHeader}>
          <h2 className={styles.filtersTitle}>Filtros</h2>
          <Button 
            variant="outline" 
            size="small"
            onClick={() => setShowFilters(!showFilters)}
            className={styles.toggleFilters}
          >
            {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
          </Button>
        </div>

        {/* Busca rápida (sempre visível) */}
        <div className={styles.quickSearch}>
          <Input
            placeholder="Buscar por título ou localização..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Filtros avançados */}
        {showFilters && (
          <div className={styles.advancedFilters}>
            <div className={styles.filtersGrid}>
              <Select
                placeholder="Tipo de imóvel"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                options={propertyTypes}
              />
              
              <Select
                placeholder="Status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                options={propertyStatuses}
              />
              
              <Select
                placeholder="Quartos"
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                options={bedroomOptions}
              />
              
              <Input
                placeholder="Preço mínimo"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
              
              <Input
                placeholder="Preço máximo"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
              
              <Input
                placeholder="Localização"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
            
            <div className={styles.filtersActions}>
              <Button variant="outline" onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Lista de imóveis */}
      <div className={styles.propertiesSection}>
        {filteredProperties.length === 0 ? (
          <Card className={styles.emptyState}>
            <div className={styles.emptyContent}>
              <span className={styles.emptyIcon}>🔍</span>
              <h3>Nenhum imóvel encontrado</h3>
              <p>Tente ajustar os filtros ou fazer uma nova busca.</p>
              <Button onClick={clearFilters}>
                Limpar Filtros
              </Button>
            </div>
          </Card>
        ) : (
          <div className={styles.propertiesGrid}>
            {filteredProperties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
