
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,FormsModule,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Qsqlviewer';
  query: string = '';
  parsedResult: any = null;
  keyArr:any
  

  // constructor(private queryParserService: QueryParserService) { }

  parseQuery() {
    try {
      this.parsedResult = this.parseInsertQuery(this.query);
      this.keyArr = Object.keys(this.parsedResult.values)
    } catch (error) {
      console.error('Error parsing query:', error);
      this.parsedResult = null;
    }
  }
  parseInsertQuery(query:string){
    // Regular expression to match the INSERT INTO statement
    const regex = /^INSERT INTO (\w+)\s*\(([^)]+)\) VALUES\s*\(([^)]+)\);?$/gim;
  
    // Extract table name, column names, and values from the query using regex
    const matches = query.match(regex);
    
    if (!matches || matches.length !== 4) {
      throw new Error('Invalid query format');
    }
  
    // Extract table name, column names, and values strings
    const tableName = matches[1];
    const columnsString = matches[2];
    const valuesString = matches[3];
  
    // Split column names and values into arrays
    const columns = columnsString.split(',').map(col => col.replace(/`/g, ''));
    const values = valuesString.split(',').map(val => {
      // Remove quotes if present and decode from base64 if needed
      if (val.startsWith("'") && val.endsWith("'")) {
        val = val.substring(1, val.length - 1);
      }
      if (val.startsWith('base64:')) {
        val = Buffer.from(val.slice(7), 'base64').toString('utf-8');
      }
      return val;
    });
  
    // Create an object with table name, column names as keys and values as values
    const result:any = {
      tableName: tableName,
      values: {}
    };
    columns.forEach((col, index) => {
      result.values[col] = values[index];
    });
  
    return result;
  }
}