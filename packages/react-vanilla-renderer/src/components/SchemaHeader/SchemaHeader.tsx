import React from "react";

type SchemaHeaderProps = {
  title?: string;
  description?: string;
};

export const SchemaHeader = React.memo(function SchemaHeader({
  title,
  description,
}: SchemaHeaderProps) {
  return title || description ? (
    <header>
      {title && <h1 className="text-md font-medium">{title}</h1>}
      {description && <p className="text-sm text-neutral-700">{description}</p>}
    </header>
  ) : null;
});
