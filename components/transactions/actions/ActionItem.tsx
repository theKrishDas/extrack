export default function ActionItem({
  actionName,
  icon,
}: {
  actionName: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex w-32 items-center justify-between">
      {actionName}
      {icon}
    </div>
  );
}
