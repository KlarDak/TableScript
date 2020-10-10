interface ITable {
  headers?: Array<string>;
  rows?: Array<Array<string>>;
  id?: string;
  class?: string;
  settings?: object;
}

interface TCell {
  name: string;
  id?: string;
  className?: string;
  contentEditable?: boolean;
}

interface TSettings {
  tdeditable?: boolean;
  theditable?: boolean;
}

class Table {
  private root: HTMLElement;
  private table: HTMLElement;
  private thead: HTMLElement;
  private tbody: HTMLElement;
  private settingslist: TSettings;

  constructor(root: HTMLElement){
    this.root = root;
  }

  public create(config: ITable){
    this.table = document.createElement("table");
    if (config.id != null) this.table.id = config.id;
    if (config.class != null) this.table.className = config.class;
    this.table.appendChild(this.tbody = document.createElement("tbody"));
    this.table.appendChild(this.thead = document.createElement("thead"));

    if (config.settings != null) this.setConfig(config.settings);
    if (config.headers != null) this.addColumnNames(config.headers);
    if (config.rows != null) this.addDataColumns(config.rows);

    if (this.root.appendChild(this.table)) {
      return true;
    }
    else {
      return false;
    }
  }

  public addDataColumns(rows: Array<Array<string> | Array<object>>) : boolean{
    for (let i=0; i<=rows.length-1; i++){
      let tr = this.createRow();

      rows[i].forEach(item => {
        tr.appendChild(this.addCell((typeof item == "string") ? {name: item} : item));
      });

      if (this.tbody.appendChild(tr)) {
        return true;
      }
      else {
        return false;
      }
    }
  }

  public addColumnNames(columnNames: Array<string> | Array<object>){
    let tr = this.createRow();
    columnNames.forEach(item => {
      tr.appendChild(this.addCell((typeof item == "string") ? {name: item} : item, "th"));
    });

    if (this.thead.appendChild(tr)) {
      return true;
    }
    else {
      return false;
    }
  }

  public update(config: ITable) : boolean {
    if (config.headers) {
      this.clear(true, () => {
        return this.create(config);
      });
    }
    else if (config.rows){
      return this.addDataColumns(config.rows);
    }
  }

  public clear(withHeaders: boolean = false, callback = null){
    if (withHeaders === true){
      console.log(withHeaders);
      this.root.removeChild(this.table);
      this.thead.innerHTML = "";
    }

    this.tbody.innerHTML = "";

    if (callback != null) callback();
  }

  // Private methods
  private setConfig(settings: TSettings) : void {
    this.settingslist = settings;
  }

  private addCell(cellsettings: TCell, type: string = "td"){
    let cell = document.createElement(type);
    cell.innerHTML = cellsettings.name;

    for (let key in cellsettings) {
      if (cellsettings[key] != null)
        cell[key] = cellsettings[key];
    }

    let editable = (type == "td") ? this.settingslist.tdeditable : this.settingslist.theditable;
    let csettings = cellsettings.contentEditable; // Попробуем, ткскзт

    if ((csettings == null && editable === true) || csettings === true){
      cell.contentEditable = "true";
      cell.addEventListener("keydown", function(e) {
        if (e.code == "Enter" || e.code == "NumpadEnter") cell.blur();
      });
    }

    return cell;
  }

  private createRow(newrow:any = this.tbody) : HTMLTableRowElement {
    return newrow.insertRow(-1);
  }
}
