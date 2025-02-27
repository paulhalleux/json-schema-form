import { JSONSchema } from "@phalleux/jsf-core";

import { Collapsible } from "./Collapsible.tsx";
import { ExampleListItem } from "./ExampleListItem.tsx";

export type ExampleListCategory = {
  categoryName: string;
  schemas: (JSONSchema | ExampleListCategory)[];
};

type ExampleCategoryProps = {
  path?: string;
  selectedSchemaPath?: string;
  category: ExampleListCategory;
};

export function ExampleListCategory({
  category,
  selectedSchemaPath,
  path = "",
}: ExampleCategoryProps) {
  return (
    <Collapsible
      title={category.categoryName}
      key={category.categoryName}
      defaultExpanded={selectedSchemaPath?.startsWith(path)}
    >
      <div className="flex flex-col gap-1 border-l border-neutral-300 ml-3.5 pl-2">
        {category.schemas.map((schema, key) => {
          if ("categoryName" in schema) {
            return (
              <ExampleListCategory
                key={key}
                path={`${path}.schemas[${key}]`}
                category={schema}
                selectedSchemaPath={selectedSchemaPath}
              />
            );
          }

          return (
            <ExampleListItem
              key={key}
              schema={schema}
              isSelected={selectedSchemaPath === `${path}.schemas[${key}]`}
              path={`${path}.schemas[${key}]`}
            />
          );
        })}
      </div>
    </Collapsible>
  );
}
