export default function Input({
    label,
    error,
    type = 'text',
    variant = 'text',
    placeholder,
    value,
    onChange,
    required = false,
    disabled = false,
    rows = 4,
    accept,
    className = '',
    ...props
}) {
    const baseStyles = 'w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 focus:outline-none';
    const normalStyles = 'border-gray-300 focus:border-black';
    const errorStyles = 'border-red-500 focus:border-red-600';
    const disabledStyles = 'bg-gray-100 cursor-not-allowed';

    const inputClass = `${baseStyles} ${error ? errorStyles : normalStyles} ${disabled ? disabledStyles : ''} ${className}`;

    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {variant === 'textarea' ? (
                <textarea
                    className={inputClass}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    rows={rows}
                    {...props}
                />
            ) : variant === 'file' ? (
                <input
                    type="file"
                    className={inputClass}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    accept={accept}
                    {...props}
                />
            ) : (
                <input
                    type={type}
                    className={inputClass}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    required={required}
                    disabled={disabled}
                    {...props}
                />
            )}

            {error && (
                <p className="mt-1 text-sm text-red-600">
                    {error}
                </p>
            )}
        </div>
    );
}
