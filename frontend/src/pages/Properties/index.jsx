import { useEffect, useMemo, useState } from 'react'
import { Input, Select, Button, Card } from '../../components/ui/index.js'
import PropertyCard from '../../components/Properties/PropertyCard/index.jsx'
import { getProperties, validateFilters } from '../../services/propertiesService.js'
import styles from './styles.module.css'
import { useI18n } from '../../i18n/index.jsx'

export default function Properties() {
  const { t } = useI18n()

  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [total, setTotal] = useState(0)

  const [filters, setFilters] = useState({
    city: '',
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    status: '',
  })
  const [showFilters, setShowFilters] = useState(false)

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const clearFilters = () => {
    setFilters({ city: '', minPrice: '', maxPrice: '', bedrooms: '', status: '' })
  }

  const fetchProperties = async () => {
    try {
      setLoading(true)
      setError(null)

      const validFilters = validateFilters(filters)
      const response = await getProperties(validFilters)

      setProperties(response?.data ?? [])
      setTotal(response?.total ?? 0)
    } catch (err) {
      setError(err?.message || 'Erro ao carregar imóveis')
      setProperties([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.city, filters.minPrice, filters.maxPrice, filters.bedrooms, filters.status])

  const stats = useMemo(() => {
    const available = properties.filter((p) => p.status === 'AVAILABLE').length
    const reserved = properties.filter((p) => p.status === 'RESERVED').length
    const sold = properties.filter((p) => p.status === 'SOLD').length
    return { total, available, reserved, sold }
  }, [properties, total])

  const statusOptions = useMemo(
    () => [
      { value: '', label: t('properties.filters.statusAll', { defaultValue: 'Todos os status' }) },
      { value: 'AVAILABLE', label: t('properties.status.available', { defaultValue: 'Disponível' }) },
      { value: 'RESERVED', label: t('properties.status.reserved', { defaultValue: 'Reservado' }) },
      { value: 'SOLD', label: t('properties.status.sold', { defaultValue: 'Vendido' }) },
    ],
    [t],
  )

  const bedroomOptions = useMemo(
    () => [
      { value: '', label: t('properties.filters.bedroomsAll', { defaultValue: 'Qualquer' }) },
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
      { value: '4', label: '4+' },
    ],
    [t],
  )

  return (
    <div className={styles.propertiesPage}>
      <div className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.pageTitle}>{t('properties.title', { defaultValue: 'Catálogo de Imóveis' })}</h1>
          <p className={styles.pageSubtitle}>{t('properties.subtitle', { defaultValue: 'Encontre o imóvel perfeito para você' })}</p>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.total}</span>
            <span className={styles.statLabel}>{t('properties.stats.results', { defaultValue: 'Resultados' })}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.available}</span>
            <span className={styles.statLabel}>{t('properties.stats.available', { defaultValue: 'Disponíveis' })}</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{stats.reserved}</span>
            <span className={styles.statLabel}>{t('properties.stats.reserved', { defaultValue: 'Reservados' })}</span>
          </div>
        </div>
      </div>

      <Card className={styles.filtersSection}>
        <div className={styles.filtersHeader}>
          <h2 className={styles.filtersTitle}>{t('properties.filters.title', { defaultValue: 'Filtros' })}</h2>
          <Button
            variant="outline"
            size="small"
            onClick={() => setShowFilters(!showFilters)}
            className={styles.toggleFilters}
          >
            {showFilters
              ? t('properties.filters.hide', { defaultValue: 'Ocultar Filtros' })
              : t('properties.filters.show', { defaultValue: 'Mostrar Filtros' })}
          </Button>
        </div>

        <div className={styles.quickSearch}>
          <Input
            placeholder={t('properties.filters.cityPlaceholder', { defaultValue: 'Buscar por cidade...' })}
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {showFilters && (
          <div className={styles.advancedFilters}>
            <div className={styles.filtersGrid}>
              <Select
                placeholder={t('properties.filters.status', { defaultValue: 'Status' })}
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                options={statusOptions}
              />

              <Select
                placeholder={t('properties.filters.bedrooms', { defaultValue: 'Quartos' })}
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                options={bedroomOptions}
              />

              <Input
                placeholder={t('properties.filters.minPrice', { defaultValue: 'Preço mínimo' })}
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />

              <Input
                placeholder={t('properties.filters.maxPrice', { defaultValue: 'Preço máximo' })}
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </div>

            <div className={styles.filtersActions}>
              <Button variant="outline" onClick={clearFilters}>
                {t('properties.filters.clear', { defaultValue: 'Limpar Filtros' })}
              </Button>
            </div>
          </div>
        )}
      </Card>

      <div className={styles.propertiesSection}>
        {loading ? (
          <Card className={styles.loadingState}>
            <div className={styles.loadingContent}>
              <span className={styles.loadingIcon}>⏳</span>
              <h3>{t('properties.loading.title', { defaultValue: 'Carregando imóveis...' })}</h3>
              <p>{t('properties.loading.subtitle', { defaultValue: 'Buscando as melhores oportunidades para você.' })}</p>
            </div>
          </Card>
        ) : error ? (
          <Card className={styles.errorState}>
            <div className={styles.errorContent}>
              <span className={styles.errorIcon}>❌</span>
              <h3>{t('properties.error.title', { defaultValue: 'Erro ao carregar imóveis' })}</h3>
              <p>{error}</p>
              <Button onClick={fetchProperties}>{t('properties.error.retry', { defaultValue: 'Tentar Novamente' })}</Button>
            </div>
          </Card>
        ) : properties.length === 0 ? (
          <Card className={styles.emptyState}>
            <div className={styles.emptyContent}>
              <span className={styles.emptyIcon}>🔍</span>
              <h3>{t('properties.empty.title', { defaultValue: 'Nenhum imóvel encontrado' })}</h3>
              <p>{t('properties.empty.subtitle', { defaultValue: 'Tente ajustar os filtros ou fazer uma nova busca.' })}</p>
              <Button onClick={clearFilters}>{t('properties.empty.action', { defaultValue: 'Limpar Filtros' })}</Button>
            </div>
          </Card>
        ) : (
          <div className={styles.propertiesGrid}>
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
