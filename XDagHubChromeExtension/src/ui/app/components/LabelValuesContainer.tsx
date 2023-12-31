import { type ReactNode } from "react";

export type LabelValuesContainerProps = {
  children: ReactNode;
};

export function LabelValuesContainer({ children }: LabelValuesContainerProps) {
  return (
    <div className="flex flex-col flex-nowrap gap-3 text-body font-medium">
      {children}
    </div>
  );
}
