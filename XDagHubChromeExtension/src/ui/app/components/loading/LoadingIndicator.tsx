import { cva, type VariantProps } from "class-variance-authority";
import { Spinner16 } from "_assets/icons/tsIcons";

const styles = cva("", {
  variants: {
    color: {
      inherit: "text-inherit",
      xdag: "text-Xdag",
    },
  },
});

export type LoadingIndicatorProps = VariantProps<typeof styles>;

const LoadingIndicator = ({ color = "xdag" }: LoadingIndicatorProps) => {
  return <Spinner16 className={styles({ className: "animate-spin", color })} />;
};

export default LoadingIndicator;
