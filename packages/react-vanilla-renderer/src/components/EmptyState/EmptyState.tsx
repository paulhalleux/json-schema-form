type EmptyStateProps = {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
};

export function EmptyState({
  title,
  description,
  buttonText,
  onClick,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-32">
      <h1 className="font-medium">{title}</h1>
      <p className="text-neutral-700 text-sm">{description}</p>
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer h-6 px-2 text-xs border border-neutral-300 rounded-sm mt-2 hover:bg-neutral-100 focus:outline-none focus:bg-neutral-100"
      >
        {buttonText}
      </button>
    </div>
  );
}
