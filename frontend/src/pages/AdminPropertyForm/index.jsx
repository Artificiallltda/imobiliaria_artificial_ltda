import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  createProperty, 
  updateProperty, 
  getPropertyById 
} from '../../services/propertiesService';
import styles from './styles.module.css';

/**
 * Formulário administrativo para criação e edição de imóveis
 * Funciona em modo criação (sem ID na rota) ou edição (com ID)
 */
function AdminPropertyForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  // Estados do formulário
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    status: 'AVAILABLE'
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Carrega dados do imóvel se estiver em modo edição
  useEffect(() => {
    if (isEditing) {
      loadProperty();
    }
  }, [id, isEditing]);

  /**
   * Carrega os dados do imóvel para edição
   */
  async function loadProperty() {
    try {
      setLoading(true);
      setError('');
      
      const property = await getPropertyById(id);
      
      setFormData({
        title: property.title || '',
        description: property.description || '',
        price: property.price || '',
        city: property.city || '',
        bedrooms: property.bedrooms || '',
        bathrooms: property.bathrooms || '',
        area: property.area || '',
        status: property.status || 'AVAILABLE'
      });
      
    } catch (err) {
      setError(err.message || 'Erro ao carregar imóvel');
    } finally {
      setLoading(false);
    }
  }

  /**
   * Manipula mudanças nos campos do formulário
   */
  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }

  /**
   * Envia o formulário para criação ou edição
   */
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const propertyData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        city: formData.city.trim(),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        area: parseFloat(formData.area),
        status: formData.status
      };

      if (isEditing) {
        await updateProperty(id, propertyData);
        setSuccess('Imóvel atualizado com sucesso!');
      } else {
        await createProperty(propertyData);
        setSuccess('Imóvel criado com sucesso!');
      }

      // Redireciona após 2 segundos
      setTimeout(() => {
        navigate('/admin/properties');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Erro ao salvar imóvel');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {isEditing ? 'Editar Imóvel' : 'Criar Novo Imóvel'}
        </h1>
        <button 
          onClick={() => navigate('/admin/properties')}
          className={styles.backButton}
        >
          ← Voltar
        </button>
      </div>

      {/* Mensagens de feedback */}
      {error && (
        <div className={styles.errorMessage}>
          {error}
        </div>
      )}

      {success && (
        <div className={styles.successMessage}>
          {success}
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Título *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ex: Casa em Condomínio"
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Cidade *
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={styles.input}
              placeholder="Ex: Campinas"
              disabled={loading}
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>
            Descrição *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={styles.textarea}
            placeholder="Descrição detalhada do imóvel..."
            rows="4"
            disabled={loading}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Preço (R$) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className={styles.input}
              placeholder="950000"
              step="0.01"
              min="0"
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Área (m²) *
            </label>
            <input
              type="number"
              name="area"
              value={formData.area}
              onChange={handleChange}
              className={styles.input}
              placeholder="250"
              step="0.01"
              min="0"
              disabled={loading}
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Quartos *
            </label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
              className={styles.input}
              placeholder="4"
              min="1"
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Banheiros *
            </label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
              className={styles.input}
              placeholder="3"
              min="1"
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Status *
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={styles.select}
              disabled={loading}
            >
              <option value="AVAILABLE">Disponível</option>
              <option value="RESERVED">Reservado</option>
              <option value="SOLD">Vendido</option>
            </select>
          </div>
        </div>

        <div className={styles.formActions}>
          <button
            type="button"
            onClick={() => navigate('/admin/properties')}
            className={styles.cancelButton}
            disabled={loading}
          >
            Cancelar
          </button>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AdminPropertyForm;
