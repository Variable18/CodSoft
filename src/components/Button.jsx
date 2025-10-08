function Button({ children, onClick, type = 'button', style = {}, ...rest }) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        padding: '0.75rem 1.6rem',
        backgroundColor: '#2a68ff',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '1rem',
        fontWeight: 600,
        cursor: 'pointer',
        boxShadow: '0 4px 14px rgba(42, 104, 255, 0.7)',
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#1f4ed8';
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(31, 78, 216, 0.8)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#2a68ff';
        e.currentTarget.style.boxShadow = '0 4px 14px rgba(42, 104, 255, 0.7)';
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
