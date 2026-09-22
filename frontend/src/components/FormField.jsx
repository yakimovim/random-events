import FormError from "./FormError";

export default function FormField({ label, error, children }) {
  return (
    <div>
      <label className="block">{label}</label>
      {children}
      <FormError error={error} />
    </div>
  );
}
