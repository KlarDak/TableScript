class Table {
    constructor(root) {
        this.root = root;
    }
    create(config) {
        this.table = document.createElement("table");
        if (config.id != null)
            this.table.id = config.id;
        if (config.class != null)
            this.table.className = config.class;
        this.table.appendChild(this.tbody = document.createElement("tbody"));
        this.table.appendChild(this.thead = document.createElement("thead"));
        if (config.settings != null)
            this.setConfig(config.settings);
        if (config.headers != null)
            this.addColumnNames(config.headers);
        if (config.rows != null)
            this.addDataColumns(config.rows);
        if (this.root.appendChild(this.table)) {
            return true;
        }
        else {
            return false;
        }
    }
    addDataColumns(rows) {
        for (let i = 0; i <= rows.length - 1; i++) {
            let tr = this.createRow();
            rows[i].forEach(item => {
                tr.appendChild(this.addCell((typeof item == "string") ? { name: item } : item));
            });
            if (this.tbody.appendChild(tr)) {
                return true;
            }
            else {
                return false;
            }
        }
    }
    addColumnNames(columnNames) {
        let tr = this.createRow();
        columnNames.forEach(item => {
            tr.appendChild(this.addCell((typeof item == "string") ? { name: item } : item, "th"));
        });
        if (this.thead.appendChild(tr)) {
            return true;
        }
        else {
            return false;
        }
    }
    update(config) {
        if (config.headers) {
            this.clear(true, () => {
                return this.create(config);
            });
        }
        else if (config.rows) {
            return this.addDataColumns(config.rows);
        }
    }
    clear(withHeaders = false, callback = null) {
        if (withHeaders === true) {
            console.log(withHeaders);
            this.root.removeChild(this.table);
            this.thead.innerHTML = "";
        }
        this.tbody.innerHTML = "";
        if (callback != null)
            callback();
    }
    setConfig(settings) {
        this.settingslist = settings;
    }
    addCell(cellsettings, type = "td") {
        let cell = document.createElement(type);
        cell.innerHTML = cellsettings.name;
        for (let key in cellsettings) {
            if (cellsettings[key] != null)
                cell[key] = cellsettings[key];
        }
        let editable = (type == "td") ? this.settingslist.tdeditable : this.settingslist.theditable;
        let csettings = cellsettings.contentEditable;
        if ((csettings == null && editable === true) || csettings === true) {
            cell.contentEditable = "true";
            cell.addEventListener("keydown", function (e) {
                if (e.code == "Enter" || e.code == "NumpadEnter")
                    cell.blur();
            });
        }
        return cell;
    }
    createRow(newrow = this.tbody) {
        return newrow.insertRow(-1);
    }
}
