import React from "react";

export type PolymorphicProps<E extends React.ElementType> =
  React.PropsWithChildren<React.ComponentPropsWithoutRef<E> & { as?: E }>;
