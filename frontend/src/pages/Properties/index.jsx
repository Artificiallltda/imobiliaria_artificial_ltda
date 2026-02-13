import React, { useState, useEffect, useMemo } from 'react';
import { Input, Select, Button, Card } from '../../components/ui/index.js';
import PropertyCard from '../../components/Properties/PropertyCard/index.jsx';
import { getProperties, validateFilters } from '../../services/propertiesService.js';
import styles from './styles.module.css';

const Properties = () => {
  // Estados da aplicação
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  
  // Estado para filtros
  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    status: ''
  });

  const [showFilters, setShowFilters] = useState(false);

  // TODO - Implementar paginação com backend
  // TODO - Implementar ordenação de resultados

  // Função para buscar imóveis da API
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Valida e limpa os filtros
      const validFilters = validateFilters(filters);
      
      // Busca dados da API
      const response = await getProperties(validFilters);
      
      setProperties(response.data);
      setTotal(response.total);
      
    } catch (err) {
      setError(err.message);
      setProperties([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // Efeito para carregar dados quando os filtros mudam
  useEffect(() => {
    fetchProperties();
  }, [filters]);

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
      city: '',
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      status: ''
    });
  };

  // Estatísticas dos resultados
  const stats = useMemo(() => {
    const available = properties.filter(p => p.status === 'AVAILABLE').length;
    const sold = properties.filter(p => p.status === 'SOLD').length;
    const reserved = properties.filter(p => p.status === 'RESERVED').length;

    return { total, available, sold, reserved };
  }, [properties, total]);

  // Opções para os selects
  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'AVAILABLE', label: 'Disponível' },
    { value: 'SOLD', label: 'Vendido' },
    { value: 'RESERVED', label: 'Reservado' }
  ];

  const bedroomOptions = [
    { value: '', label: 'Qualquer' },
    { value: '1', label: '1 quarto' },
    { value: '2', label: '2 quartos' },
    { value: '3', label: '3 quartos' },
    { value: '4', label: '4+ quartos' }
  ];

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
            <span className={styles.statNumber}>{stats.total}</span>
            <span className={styles.statLabel}>Resultados</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.available}</span>
            <span className={styles.statLabel}>Disponíveis</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.reserved}</span>
            <span className={styles.statLabel}>Reservados</span>
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
            placeholder="Buscar por cidade..."
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {/* Filtros avançados */}
        {showFilters && (
          <div className={styles.advancedFilters}>
            <div className={styles.filtersGrid}>
              <Select
                placeholder="Status"
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                options={statusOptions}
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
        {loading ? (
          <Card className={styles.loadingState}>
            <div className={styles.loadingContent}>
              <span className={styles.loadingIcon}>⏳</span>
              <h3>Carregando imóveis...</h3>
              <p>Buscando as melhores oportunidades para você.</p>
            </div>
          </Card>
        ) : error ? (
          <Card className={styles.errorState}>
            <div className={styles.errorContent}>
              <span className={styles.errorIcon}>❌</span>
              <h3>Erro ao carregar imóveis</h3>
              <p>{error}</p>
              <Button onClick={fetchProperties}>
                Tentar Novamente
              </Button>
            </div>
          </Card>
        ) : properties.length === 0 ? (
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
            {properties.map(property => (
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
