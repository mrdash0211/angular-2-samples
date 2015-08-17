import {KeyMap} from './key-map';
import {Row} from './row';
import {Column} from './column';

export class SpreadsheetModel{

    rows:Array<Row>;
    current:Column;
    start:number;
    end:number;

    constructor(public rowCount, public columnCount){

        this.rows = [];

        this.start = 0;
        this.end = rowCount;

        for(let i = 0; i < this.rowCount; i++){

            this.rows.push(this.addRow(this.columnCount,i));
        }

        this.current = this.rows[0].columns[0];
    }

    addRow(columnCount,rowIndex){

        let row = new Row(rowIndex);
        for(let j = 0; j < columnCount; j++){
            row.columns.push(new Column(j,rowIndex));
        }

        return row;
    }

    selectColumn(col){
        this.current = col;
    }

    navigate(keyCode){

        const navDirection = KeyMap.getNavigationDirection(keyCode);

        if(navDirection.down){
            this.ensureRow();
            this.current = this.rows[this.current.rowIndex + 1].columns[this.current.columnIndex];
            this.adjustRowRangeDownward();
        }
        if(navDirection.up){
            if(this.current.rowIndex === 0){
                return;
            }
            this.current = this.rows[this.current.rowIndex - 1].columns[this.current.columnIndex];
            this.adjustRowRangeUpward();
        }
        if(navDirection.left){
            if(this.current.columnIndex === 0){
                return;
            }
            this.current = this.rows[this.current.rowIndex].columns[this.current.columnIndex - 1];
        }
        if(navDirection.right){
            this.ensureColumn();
            this.current = this.rows[this.current.rowIndex].columns[this.current.columnIndex + 1];
        }

    }

    ensureColumn(){

        if(this.current.columnIndex + 1 >= this.rows[0].columns.length){
            for(let i = 0; i < this.rows.length; i++){
                this.rows[i].columns.push(new Column(this.rows[0].columns.length,i));
            }
        }
    }

    adjustColumnsRight(){

    }

    adjustRowRangeUpward(){
        if(this.current.rowIndex < this.start){
            this.shiftRowsBy(1);
        }
    }

    adjustRowRangeDownward(){
        if(this.current.rowIndex === this.end){
            this.shiftRowsBy(-1);
        }
    }

    shiftRowsBy(offset){
        this.start = this.start + offset;
        this.end = this.end + offset;
    }

    ensureRow(){
        if(this.current.rowIndex + 1 >= this.rows.length){
            this.rows.push(this.addRow(this.columnCount,this.current.rowIndex + 1));
        }
    }

}



