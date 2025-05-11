export const FormInput = ({ label, id, name, type = "text", value, onChange, required = false, checked = false, ...rest }) => (
    <div className="form-group">
        <label htmlFor={id}>{label}{required && " *"}</label>
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            checked={checked}
            required={required}
            {...rest}
        />
    </div>
);
