function Input({ label, value, onChange, type = 'text', required = false, style = {}, ...rest }) {
  return (
    <div style={{ marginBottom: '1.2rem', width: '100%' }}>
      {label && <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: '600', color: '#222' }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        style={{
          width: '100%',
          padding: '0.6rem 1rem',
          fontSize: '1rem',
          borderRadius: '8px',
          border: '1.5px solid #d0d5dd',
          outlineOffset: '2px',
          transition: 'border-color 0.3s ease',
          ...style,
        }}
        onFocus={(e) => (e.currentTarget.style.borderColor = '#2a68ff')}
        onBlur={(e) => (e.currentTarget.style.borderColor = '#d0d5dd')}
        {...rest}
      />
    </div>
  );
}

export default Input;
