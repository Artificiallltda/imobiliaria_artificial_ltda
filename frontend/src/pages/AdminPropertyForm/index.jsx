import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input, Card } from '../../components/ui/index.js';
import { createProperty, updateProperty, getPropertyById } from '../../services/propertiesService.js';
import { useI18n } from '../../i18n/index.jsx';
import styles from './styles.module.css';

const AdminPropertyForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const { t } = useI18n();

  const [formData, setFormData] = useState({
    title: '',
    city: '',
    description: '',
    price: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    status: 'AVAILABLE',
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEditing);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const loadProperty = async () => {
        try {
          setLoadingData(true);
          const property = await getPropertyById(id);
          setFormData({
            title: property.title || '',
            city: property.city || '',
            description: property.description || '',
            price: property.price || '',
            area: property.area || '',
            bedrooms: property.bedrooms || '',
            bathrooms: property.bathrooms || '',
            status: property.status || 'AVAILABLE',
          });
        } catch (err) {
          setError(t('adminPropertyForm.errors.load'));
        } finally {
          setLoadingData(false);
        }
      };
      loadProperty();
    }
  }, [id, isEditing]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
      };
      if (isEditing) {
        await updateProperty(id, payload);
      } else {
        await createProperty(payload);
      }
      navigate('/admin/properties');
    } catch (err) {
      setError(t('adminPropertyForm.errors.save'));
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: 'AVAILABLE', label: t('adminPropertyForm.statusOptions.available') },
    { value: 'RESERVED', label: t('adminPropertyForm.statusOptions.reserved') },
    { value: 'SOLD', label: t('adminPropertyForm.statusOptions.sold') },
  ];

  if (loadingData) {
    return <div className={styles.loading}>{t('adminProperties.loading')}</div>;
  }

  return (
    <div className={styles.adminPropertyForm}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          {isEditing ? t('adminPropertyForm.titleEdit') : t('adminPropertyForm.titleCreate')}
        </h1>
        <Button variant="outline" onClick={() => navigate('/admin/properties')}>
          {t('adminPropertyForm.back')}
        </Button>
      </div>

      <Card className={styles.formCard}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t('adminPropertyForm.fields.title')}</label>
              <Input
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder={t('adminPropertyForm.fields.titlePlaceholder')}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>{t('adminPropertyForm.fields.city')}</label>
              <Input
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder={t('adminPropertyForm.fields.cityPlaceholder')}
                required
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>{t('adminPropertyForm.fields.description')}</label>
            <textarea
              className={styles.textarea}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder={t('adminPropertyForm.fields.descriptionPlaceholder')}
              rows={4}
              required
            />
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t('adminPropertyForm.fields.price')}</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="950000"
                min="0"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>{t('adminPropertyForm.fields.area')}</label>
              <Input
                type="number"
                value={formData.area}
                onChange={(e) => handleChange('area', e.target.value)}
                placeholder="250"
                min="0"
                required
              />
            </div>
          </div>

          <div className={styles.formGrid3}>
            <div className={styles.formGroup}>
              <label className={styles.label}>{t('adminPropertyForm.fields.bedrooms')}</label>
              <Input
                type="number"
                value={formData.bedrooms}
                onChange={(e) => handleChange('bedrooms', e.target.value)}
                placeholder="4"
                min="0"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>{t('adminPropertyForm.fields.bathrooms')}</label>
              <Input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => handleChange('bathrooms', e.target.value)}
                placeholder="3"
                min="0"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>{t('adminPropertyForm.fields.status')}</label>
              <select
                className={styles.select}
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.formActions}>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/admin/properties')}
            >
              {t('adminPropertyForm.actions.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? t('adminPropertyForm.actions.saving')
                : isEditing
                  ? t('adminPropertyForm.actions.update')
                  : t('adminPropertyForm.actions.create')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AdminPropertyForm;
