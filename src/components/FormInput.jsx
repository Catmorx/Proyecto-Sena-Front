export const FormInput = ({ label, id, name, type = "text", value, onChange, required = false, checked = false, maxLength = 46, errorMessage, ...rest }) => (
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
            maxLength={maxLength}
            {...rest}
        />
        {errorMessage && (
            <div style={{ color: 'red', fontSize: '0.9em' }}>
                {errorMessage}
            </div>
        )}
    </div>
);
