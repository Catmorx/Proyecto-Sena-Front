export const FormSelect = ({ label, id, name, value, onChange, options, required = false }) => (

  <div className="form-group">
    <label htmlFor={id}>{label}{required && " *"}</label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    >
      <option value="">Seleccione</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);
