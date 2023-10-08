import { TxnAddressLink } from "./TxnAddressLink";
import { Text } from "_src/ui/app/shared/text";

type TxnRemarkProps = {
  remark: string;
  label: string;
};

export function TxnRemark({ remark, label }: TxnRemarkProps) {
  return (
    <div className="flex justify-between w-full items-center py-3.5 first:pt-0">
      <Text variant="body" weight="medium" color="steel-darker">
        {label}
      </Text>
      <div className="flex gap-1 items-center">
        <h3 style={{color:"darkblue"}}>
          {remark}
        </h3>
      </div>
    </div>
  );
}

