import {TTransactionType} from "@/lib/schema/transactions"
import {Button} from "@/components/ui/button/animated-button"

const NewTransactionButtons = ({
  setTransaction,
}: {
  setTransaction: (type: TTransactionType) => void
}) => {
  return (
    <div className="flex gap-1">
      <Button color="green" onPress={() => setTransaction("income")}>
        Income
      </Button>
      <Button color="red" onPress={() => setTransaction("expense")}>
        Expense
      </Button>
    </div>
  )
}

export default NewTransactionButtons
