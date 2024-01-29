import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function NewTransactionForm() {
  return (
    <form>
      <Input />
      <Button type="submit">Add</Button>
    </form>
  );
}
