import Input from '../atoms/Input';
import Button from '../atoms/Button';

export default function SearchBar() {
  return (
    <div className="flex gap-2">
      <Input placeholder="Buscar..." />
      <Button>Buscar</Button>
    </div>
  );
}