import { MenuButton } from "_components/menu";

export function HeaderOnlyLanguage() {
  return (
    <header className="grid grid-cols-header items-center gap-3 px-3 py-2">
        <div className="col-start-3 mr-1 justify-self-end">
          { <MenuButton showSetting={ false }/> }
        </div>
    </header>
  );
}
