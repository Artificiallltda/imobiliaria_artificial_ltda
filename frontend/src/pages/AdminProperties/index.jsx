import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input, Select } from '../../components/ui/index.js';
import { getProperties, deleteProperty, formatPrice, translateStatus } from '../../services/propertiesService.js';
import { useI18n } from '../../i18n/index.jsx';
import styles from './styles.module.css';

const AdminProperties = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({ city: '', status: '' });

  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);
      const validFilters = {
        city: filters.city.trim() || undefined,
        status: filters.status || undefined
      };
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

  useEffect(() => { fetchProperties(); }, [filters]);

  const ActionsDropdown = ({ property, isLast }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
      <div className={styles.dropdown} ref={dropdownRef}>
        <button
          className={styles.dropdownToggle}
          onClick={() => setIsOpen(!isOpen)}
          title={t('adminProperties.actions.toggle')}
        >
          ⋮
        </button>
        {isOpen && (
          <div className={`${styles.dropdownMenu} ${isLast ? styles.dropdownMenuUp : ''}`}>
            <button className={styles.dropdownItem} onClick={() => { navigate(`/admin/properties/${property.id}/edit`); setIsOpen(false); }}>
              {t('adminProperties.actions.edit')}
            </button>
            <button className={styles.dropdownItem} onClick={() => { handleDeleteProperty(property.id, property.title); setIsOpen(false); }}>
              {t('adminProperties.actions.delete')}
            </button>
            <button className={styles.dropdownItem} onClick={() => { navigate(`/properties/${property.id}`); setIsOpen(false); }}>
              {t('adminProperties.actions.viewDetails')}
            </button>
          </div>
        )}
      </div>
    );
  };

  const handleDeleteProperty = async (id, title) => {
    if (!window.confirm(t('adminProperties.confirmDelete', { title }))) return;
    try {
      await deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      setTotal(prev => prev - 1);
    } catch (err) {
      alert(t('adminProperties.deleteError', { message: err.message }));
    }
  };

  const statusOptions = [
    { value: '', label: t('adminProperties.filters.statusOptions.all') },
    { value: 'AVAILABLE', label: t('adminProperties.filters.statusOptions.available') },
    { value: 'SOLD', label: t('adminProperties.filters.statusOptions.sold') },
    { value: 'RESERVED', label: t('adminProperties.filters.statusOptions.reserved') },
  ];

  return (
    <div className={styles.adminProperties}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{t('adminProperties.title')}</h1>
          <p className={styles.subtitle}>{t('adminProperties.subtitle')}</p>
        </div>
        <Button onClick={() => navigate('/admin/properties/new')} className={styles.addButton}>
          {t('adminProperties.addButton')}
        </Button>
      </div>

      <Card className={styles.filters}>
        <div className={styles.filtersContent}>
          <Input
            placeholder={t('adminProperties.filters.cityPlaceholder')}
            value={filters.city}
            onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
            className={styles.filterInput}
          />
          <Select
            placeholder={t('adminProperties.filters.statusPlaceholder')}
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            options={statusOptions}
            className={styles.filterSelect}
          />
          <Button variant="outline" onClick={() => setFilters({ city: '', status: '' })}>
            {t('adminProperties.filters.clear')}
          </Button>
        </div>
      </Card>

      <Card className={styles.propertiesList}>
        {loading ? (
          <div className={styles.loading}>
            <span>{t('adminProperties.loading')}</span>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <span>{t('adminProperties.error', { message: error })}</span>
            <Button onClick={fetchProperties}>{t('adminProperties.retry')}</Button>
          </div>
        ) : properties.length === 0 ? (
          <div className={styles.empty}>
            <span>{t('adminProperties.empty.message')}</span>
            <Button onClick={() => navigate('/admin/properties/new')}>
              {t('adminProperties.empty.action')}
            </Button>
          </div>
        ) : (
          <>
            <div className={styles.listHeader}>
              <span className={styles.total}>{t('adminProperties.total', { count: total })}</span>
            </div>

            <div className={styles.propertiesGrid}>
              <div className={styles.desktopView}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>{t('adminProperties.table.title')}</th>
                      <th>{t('adminProperties.table.city')}</th>
                      <th>{t('adminProperties.table.price')}</th>
                      <th>{t('adminProperties.table.status')}</th>
                      <th>{t('adminProperties.table.actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property, index) => (
                      <tr key={property.id}>
                        <td className={styles.titleCell}>
                          <div>
                            <strong>{property.title}</strong>
                            <small>
                              {t('adminProperties.details', {
                                bedrooms: property.bedrooms,
                                bathrooms: property.bathrooms,
                                area: property.area
                              })}
                            </small>
                          </div>
                        </td>
                        <td>{property.city}</td>
                        <td className={styles.priceCell}>{formatPrice(property.price)}</td>
                        <td>
                          <span className={`${styles.status} ${styles[property.status]}`}>
                            {translateStatus(property.status)}
                          </span>
                        </td>
                        <td className={styles.actionsCell}>
                          <ActionsDropdown property={property} isLast={index === properties.length - 1} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.mobileView}>
                {properties.map((property, index) => (
                  <div key={property.id} className={styles.propertyCard}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>{property.title}</h3>
                      <div className={styles.cardActions}>
                        <ActionsDropdown property={property} isLast={index === properties.length - 1} />
                      </div>
                    </div>
                    <div className={styles.cardLocation}>📍 {property.city}</div>
                    <div className={styles.cardPrice}>{formatPrice(property.price)}</div>
                    <div className={styles.cardDetails}>
                      {t('adminProperties.details', {
                        bedrooms: property.bedrooms,
                        bathrooms: property.bathrooms,
                        area: property.area
                      })}
                    </div>
                    <div className={styles.cardStatus}>
                      <span className={`${styles.status} ${styles[property.status]}`}>
                        {translateStatus(property.status)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};

export default AdminProperties;
