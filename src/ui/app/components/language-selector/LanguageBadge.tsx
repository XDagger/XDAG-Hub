import { LanguageBadgeLabel } from "_components/language-selector/LanguageBadgeLabel";

export enum LanguageType {
  EN = "EN",
  CN = "CN",
}


type LanguageBadgeProps = {
  accountType: LanguageType;
};

const TYPE_TO_TEXT: Record<LanguageType, string | null> = {
  [LanguageType.EN]: "English",
  [LanguageType.CN]: "简体中文",
};

export function LanguageBadge({ accountType }: LanguageBadgeProps) {
  const badgeText = TYPE_TO_TEXT[accountType];

  if (!badgeText) return null;

  return <LanguageBadgeLabel label={badgeText} />;
}
