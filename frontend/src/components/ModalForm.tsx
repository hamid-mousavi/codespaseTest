import React, { useState, useEffect } from 'react'

interface Field {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select';
  options?: { value: string; label: string }[];
  required?: boolean;
}

interface ModalFormProps {
  title: string;
  fields: Field[];
  initialData?: any;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}

const ModalForm: React.FC<ModalFormProps> = ({ title, fields, initialData, isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<any>(initialData || {})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setFormData(initialData || {})
    setError(null)
  }, [initialData, isOpen])

  if (!isOpen) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await onSubmit(formData)
      onClose()
    } catch (err: any) {
      setError(err?.response?.data?.error || err.message || 'An unknown error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={modalOverlayStyle}>
      <div style={modalContentStyle}>
        <div style={modalHeaderStyle}>
          <h2>{title}</h2>
          <button onClick={onClose} style={closeButtonStyle}>&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          {fields.map(field => (
            <div key={field.name} style={formGroupStyle}>
              <label htmlFor={field.name} style={labelStyle}>{field.label}{field.required && <span style={{ color: 'red' }}>*</span>}</label>
              {field.type === 'select' ? (
                <select
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  style={inputStyle}
                >
                  <option value="">Select...</option>
                  {field.options?.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name] || ''}
                  onChange={handleChange}
                  required={field.required}
                  style={inputStyle}
                />
              )}
            </div>
          ))}
          {error && <div style={errorStyle}>{error}</div>}
          <div style={formGroupStyle}>
            <button type="submit" disabled={loading} style={submitButtonStyle}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Basic inline styles for a modal (to avoid adding new CSS files)
const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
}

const modalContentStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '400px',
  maxWidth: '90%',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
}

const modalHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #eee',
  paddingBottom: '10px',
  marginBottom: '15px',
}

const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '24px',
  cursor: 'pointer',
  color: '#aaa',
}

const formGroupStyle: React.CSSProperties = {
  marginBottom: '15px',
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '5px',
  fontWeight: 'bold',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxSizing: 'border-box',
}

const submitButtonStyle: React.CSSProperties = {
  backgroundColor: '#007bff',
  color: 'white',
  padding: '10px 15px',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '16px',
}

const errorStyle: React.CSSProperties = {
  color: 'red',
  marginBottom: '10px',
}

export default ModalForm
