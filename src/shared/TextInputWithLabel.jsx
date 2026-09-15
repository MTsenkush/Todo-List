function TextInputWithLabel({
  elementId,
  labelText,
  onChange,
  ref,
  value,
  validationError
}) {
  return (
    <>
      <label htmlFor={elementId} className="font-medium">{labelText}</label>
      <input
        type="text"
        id={elementId}
        ref={ref}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 min-h-11"
        maxLength={100}
        aria-invalid={validationError ? "true" : "false"}
      />
    </>
  );
}

export default TextInputWithLabel;