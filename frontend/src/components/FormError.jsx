export default function FormError({ error }) {
  if (!error) {
    return null;
  }

  return <span className="text-red-600 text-xs">{error.message}</span>;
}
