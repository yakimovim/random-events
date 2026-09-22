export default function CardButton({ text, onClick }) {
  return (
    <div
      className="underline cursor-pointer bg-light-cyan rounded-2xl px-4"
      onClick={onClick}
    >
      {text}
    </div>
  );
}
