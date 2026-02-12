import React, { useState, useMemo } from 'react'
import { Input, Select, Button, Card } from '../../components/ui/index.js'
import PropertyCard from '../../components/Properties/PropertyCard/index.jsx'
import { propertiesMock, propertyTypes, propertyStatuses, bedroomOptions } from '../../mocks/propertiesMock.jsx'
import styles from './styles.module.css'
import { useI18n } from '../../i18n/index.jsx'

const Properties = () => {
  const { t } = useI18n()

  // Estado para filtros
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    bedrooms: '',
    minPrice: '',
    maxPrice: '',
    location: '',
  })

  const [showFilters, setShowFilters] = useState(false)

  // Função para atualizar filtros
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Função para limpar filtros
  const clearFilters = () => {
    setFilters({
      search: '',
      type: '',
      status: '',
      bedrooms: '',
      minPrice: '',
      maxPrice: '',
      location: '',
    })
  }

  // === Tradução dos options vindos do mock (sem quebrar estrutura) ===
  const typeOptions = useMemo(() => {
    return (propertyTypes || []).map((opt) => ({
      ...opt,
      // tenta traduzir por chave semântica; se não existir, cai no label original
      label: t(`properties.types.${String(opt.value || '').toLowerCase()}`, { defaultValue: opt.label }),
    }))
  }, [t])

  const statusOptions = useMemo(() => {
    return (propertyStatuses || []).map((opt) => ({
      ...opt,
      label: t(`properties.status.${String(opt.value || '').toLowerCase()}`, { defaultValue: opt.label }),
    }))
  }, [t])

  const bedroomsOpts = useMemo(() => {
    return (bedroomOptions || []).map((opt) => {
      // bedroomOptions geralmente vem tipo: {value:'1', label:'1'} etc
      // vamos traduzir apenas se tiver chaves específicas (ex: 4+)
      const v = String(opt.value || '')
      const key = v === '4' ? '4plus' : v
      return {
        ...opt,
        label: t(`properties.bedrooms.${key}`, { defaultValue: opt.label }),
      }
    })
  }, [t])

  // Lógica de filtragem no frontend
  const filteredProperties = useMemo(() => {
    return propertiesMock.filter((property) => {
      // Filtro de busca (título e localização)
      const searchMatch =
        !filters.search ||
        property.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        property.location.toLowerCase().includes(filters.search.toLowerCase())

      // Filtro de tipo
      const typeMatch = !filters.type || property.type === filters.type

      // Filtro de status
      const statusMatch = !filters.status || property.status === filters.status

      // Filtro de quartos
      const bedroomsMatch =
        !filters.bedrooms ||
        (filters.bedrooms === '4' ? property.bedrooms >= 4 : property.bedrooms === parseInt(filters.bedrooms))

      // Filtro de preço mínimo
      const minPriceMatch = !filters.minPrice || property.price >= parseInt(filters.minPrice)

      // Filtro de preço máximo
      const maxPriceMatch = !filters.maxPrice || property.price <= parseInt(filters.maxPrice)

      // Filtro de localização
      const locationMatch = !filters.location || property.location.toLowerCase().includes(filters.location.toLowerCase())

      return searchMatch && typeMatch && statusMatch && bedroomsMatch && minPriceMatch && maxPriceMatch && locationMatch
    })
  }, [filters])

  // Estatísticas dos resultados
  const stats = useMemo(() => {
    const total = propertiesMock.length
    const filtered = filteredProperties.length
    const available = filteredProperties.filter((p) => p.status === 'disponivel').length
    const featured = filteredProperties.filter((p) => p.featured).length

    return { total, filtered, available, featured }
  }, [filteredProperties])

  return (
    <div className={styles.propertiesPage}>
      {/* Header da página */}
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>{t('properties.title')}</h1>
          <p className={styles.pageSubtitle}>{t('properties.subtitle')}</p>
        </div>

        {/* Estatísticas */}
        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.filtered}</span>
            <span className={styles.statLabel}>{t('properties.stats.results')}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.available}</span>
            <span className={styles.statLabel}>{t('properties.stats.available')}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.featured}</span>
            <span className={styles.statLabel}>{t('properties.stats.featured')}</span>
          </div>
        </div>
      </div>

      {/* Área de filtros */}
      <Card className={styles.filtersSection}>
        <div className={styles.filtersHeader}>
          <h2 className={styles.filtersTitle}>{t('properties.filters.title')}</h2>

          <Button
            variant="outline"
            size="small"
            onClick={() => setShowFilters(!showFilters)}
            className={styles.toggleFilters}
          >
            {showFilters ? t('properties.filters.hide') : t('properties.filters.show')}
          </Button>
        </div>

        {/* Busca rápida (sempre visível) */}
        <div className={styles.quickSearch}>
          <Input
            placeholder={t('properties.filters.searchPlaceholder')}
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
                placeholder={t('properties.filters.type')}
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                options={typeOptions}
              />

              <Select
                placeholder={t('properties.filters.status')}
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                options={statusOptions}
              />

              <Select
                placeholder={t('properties.filters.bedrooms')}
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                options={bedroomsOpts}
              />

              <Input
                placeholder={t('properties.filters.minPrice')}
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />

              <Input
                placeholder={t('properties.filters.maxPrice')}
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />

              <Input
                placeholder={t('properties.filters.location')}
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>

            <div className={styles.filtersActions}>
              <Button variant="outline" onClick={clearFilters}>
                {t('properties.filters.clear')}
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
              <h3>{t('properties.empty.title')}</h3>
              <p>{t('properties.empty.subtitle')}</p>
              <Button onClick={clearFilters}>{t('properties.empty.action')}</Button>
            </div>
          </Card>
        ) : (
          <div className={styles.propertiesGrid}>
            {filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Properties
