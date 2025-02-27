import { memo } from "react";
import { Link } from "react-router-dom";
import { JSONSchema } from "@phalleux/jsf-core";

type ExampleListItemProps = {
  schema: JSONSchema;
  isSelected: boolean;
  path: string;
};

export const ExampleListItem = memo(
  ({ schema, isSelected, path }: ExampleListItemProps) => {
    return (
      <Link
        className={`w-full px-2 py-1 text-left text-xs hover:bg-neutral-100 cursor-pointer rounded ${isSelected ? "bg-neutral-200" : ""}`}
        to={`/${path}`}
      >
        {schema.title}
      </Link>
    );
  },
);

ExampleListItem.displayName = "ExampleListItem";
