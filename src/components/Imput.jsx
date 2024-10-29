// src/components/Imput.jsx

const InputForm = ({ label, type, name, value, onChange, placeholder = '', cssInput }) => {
    return (
        <input
            type={type}
            id={name}
            className={`${cssInput}`}
            placeholder={placeholder}
            value={value}
            onChange={onChange} // Pass the onChange prop to the input field
            required
        />
    );
}

export default InputForm;
