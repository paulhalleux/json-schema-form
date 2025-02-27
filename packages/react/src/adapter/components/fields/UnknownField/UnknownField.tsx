type UnknownFieldProps = {
  type: string | string[];
};

export function UnknownField({ type }: UnknownFieldProps) {
  if (import.meta.env.DEV) {
    return (
      <div>
        <p>Unknown field type: {JSON.stringify(type)}</p>
      </div>
    );
  }
  return null;
}
