import { Text } from "_src/ui/app/shared/text";

export type NoActivityCardType = {
  message: string;
};

export function NoActivityCard({ message }: NoActivityCardType) {
  return (
    <div className="flex flex-col gap-4 justify-center items-center text-center h-full px-10">
      <Text variant="pBody" weight="medium" color="steel">
        {message}
      </Text>
    </div>
  );
}
