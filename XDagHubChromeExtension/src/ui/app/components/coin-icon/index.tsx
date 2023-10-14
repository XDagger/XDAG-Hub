import { cva, type VariantProps } from "class-variance-authority";
import { ImageIcon } from "_app/shared/image-icon";
import { Xdag, Unstaked } from "_assets/icons/tsIcons";
import { useCoinMetadata } from "_shared/hooks";
import { XDAG_TYPE_ARG } from "_src/xdag/typescript/framework";

const imageStyle = cva(["rounded-full flex rounded-full"], {
  variants: {
    size: {
      sm: "w-6 h-6",
      md: "w-7.5 h-7.5",
      lg: "md:w-10 md:h-10 w-8 h-8",
      xl: "md:w-31.5 md:h-31.5 w-16 h-16 ",
    },
  },

  defaultVariants: {
    size: "md",
  },
});

function XdagCoin() {
  return (
    <Xdag className="flex items-center w-full h-full justify-center text-white text-body p-1.5 bg-Xdag rounded-full" />
  );
}

type NonXdagCoinProps = {
  coinType: string;
};

function NonXdagCoin({ coinType }: NonXdagCoinProps) {
  const { data: coinMeta } = useCoinMetadata(coinType);
  return (
    <div className="flex h-full w-full items-center justify-center text-white bg-steel rounded-full">
      {coinMeta?.iconUrl ? (
        <ImageIcon
          src={coinMeta.iconUrl}
          label={coinMeta.name || coinType}
          fallback={coinMeta.name || coinType}
          circle
        />
      ) : (
        <Unstaked />
      )}
    </div>
  );
}

export interface CoinIconProps extends VariantProps<typeof imageStyle> {
  coinType: string;
}

export function CoinIcon({ coinType, ...styleProps }: CoinIconProps) {
  return (
    <div className={imageStyle(styleProps)}>
      {coinType === XDAG_TYPE_ARG ? (
        <XdagCoin />
      ) : (
        <NonXdagCoin coinType={coinType} />
      )}
    </div>
  );
}
