import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Input, Select } from '../../components/ui/index.js';
import { getProperties, deleteProperty, formatPrice, translateStatus } from '../../services/propertiesService.js';
import styles from './styles.module.css';

const AdminProperties = () => {
  const navigate = useNavigate();
  
  // Estados
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  
  // Filtros
  const [filters, setFilters] = useState({
    city: '',
    status: ''
  });

  // Buscar imóveis
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

  useEffect(() => {
    fetchProperties();
  }, [filters]);

  // Componente Dropdown para ações
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

    const handleEdit = () => {
      navigate(`/admin/properties/${property.id}/edit`);
      setIsOpen(false);
    };

    const handleDelete = () => {
      handleDeleteProperty(property.id, property.title);
      setIsOpen(false);
    };

    const handleViewDetails = () => {
      navigate(`/properties/${property.id}`);
      setIsOpen(false);
    };

    return (
      <div className={styles.dropdown} ref={dropdownRef}>
        <button
          className={styles.dropdownToggle}
          onClick={() => setIsOpen(!isOpen)}
          title="Ações"
        >
          ⋮
        </button>
        {isOpen && (
          <div className={`${styles.dropdownMenu} ${isLast ? styles.dropdownMenuUp : ''}`}>
            <button className={styles.dropdownItem} onClick={handleEdit}>
              Editar
            </button>
            <button className={styles.dropdownItem} onClick={handleDelete}>
              Excluir
            </button>
            <button className={styles.dropdownItem} onClick={handleViewDetails}>
              Ver detalhes
            </button>
          </div>
        )}
      </div>
    );
  };

  // Deletar imóvel
  const handleDeleteProperty = async (id, title) => {
    if (!window.confirm(`Tem certeza que deseja excluir o imóvel "${title}"?`)) {
      return;
    }

    try {
      await deleteProperty(id);
      // Remove da lista local
      setProperties(prev => prev.filter(p => p.id !== id));
      setTotal(prev => prev - 1);
    } catch (err) {
      alert('Erro ao excluir imóvel: ' + err.message);
    }
  };

  // Opções de status
  const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'AVAILABLE', label: 'Disponível' },
    { value: 'SOLD', label: 'Vendido' },
    { value: 'RESERVED', label: 'Reservado' }
  ];

  return (
    <div className={styles.adminProperties}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Administração de Imóveis</h1>
          <p className={styles.subtitle}>
            Gerencie todos os imóveis do sistema
          </p>
        </div>
        <Button 
          onClick={() => navigate('/admin/properties/new')}
          className={styles.addButton}
        >
          + Adicionar Imóvel
        </Button>
      </div>

      {/* Filtros */}
      <Card className={styles.filters}>
        <div className={styles.filtersContent}>
          <Input
            placeholder="Filtrar por cidade..."
            value={filters.city}
            onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
            className={styles.filterInput}
          />
          
          <Select
            placeholder="Status"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            options={statusOptions}
            className={styles.filterSelect}
          />
          
          <Button 
            variant="outline"
            onClick={() => setFilters({ city: '', status: '' })}
          >
            Limpar
          </Button>
        </div>
      </Card>

      {/* Lista de imóveis */}
      <Card className={styles.propertiesList}>
        {loading ? (
          <div className={styles.loading}>
            <span>⏳ Carregando imóveis...</span>
          </div>
        ) : error ? (
          <div className={styles.error}>
            <span>❌ Erro: {error}</span>
            <Button onClick={fetchProperties}>Tentar novamente</Button>
          </div>
        ) : properties.length === 0 ? (
          <div className={styles.empty}>
            <span>🔍 Nenhum imóvel encontrado</span>
            <Button onClick={() => navigate('/admin/properties/new')}>
              Adicionar primeiro imóvel
            </Button>
          </div>
        ) : (
          <>
            <div className={styles.listHeader}>
              <span className={styles.total}>{total} imóveis encontrados</span>
            </div>
            
            <div className={styles.propertiesGrid}>
              {/* Versão Desktop - Tabela */}
              <div className={styles.desktopView}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Cidade</th>
                      <th>Preço</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property, index) => (
                      <tr key={property.id}>
                        <td className={styles.titleCell}>
                          <div>
                            <strong>{property.title}</strong>
                            <small>{property.bedrooms} quartos • {property.bathrooms} banheiros • {property.area}m²</small>
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
                          <ActionsDropdown 
                            property={property} 
                            isLast={index === properties.length - 1}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Versão Mobile - Cards Empilhados */}
              <div className={styles.mobileView}>
                {properties.map((property, index) => (
                  <div key={property.id} className={styles.propertyCard}>
                    <div className={styles.cardHeader}>
                      <h3 className={styles.cardTitle}>{property.title}</h3>
                      <div className={styles.cardActions}>
                        <ActionsDropdown 
                          property={property} 
                          isLast={index === properties.length - 1}
                        />
                      </div>
                    </div>
                    
                    <div className={styles.cardLocation}>
                      📍 {property.city}
                    </div>
                    
                    <div className={styles.cardPrice}>
                      {formatPrice(property.price)}
                    </div>
                    
                    <div className={styles.cardDetails}>
                      {property.bedrooms} quartos • {property.bathrooms} banheiros • {property.area}m²
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
