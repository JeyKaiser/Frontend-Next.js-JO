export default function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
      {children}
    </button>
  );
}