import { Component, OnInit,ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { EmployeeService } from './services/employee.service';
import {MatPaginator, } from '@angular/material/paginator';
import {MatSort, } from '@angular/material/sort';
import {MatTableDataSource,} from '@angular/material/table';
import { DialogRef } from '@angular/cdk/dialog';
import { CoreService } from './core/core.service';
import { BreakpointObserver } from '@angular/cdk/layout';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
 displayedColumns: string[] = [
    'id',
   'UserName',
    'email',
    'Role',
    'action',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(private _dialog:MatDialog, private _empService:EmployeeService,private _coreService:CoreService,private breakpointObserver: BreakpointObserver){
    this.breakpointObserver.observe(['(max-width: 600px)']).subscribe(result => {
      if (result.matches) {
        this.displayedColumns = [ 'UserName','Role','action',]; // Fewer columns
      } else {
        this.displayedColumns = [ 'UserName', 'email', 'Role','action']; // Full columns
      }
    });
  }


  ngOnInit(): void {
    this.getEmployeeList();
  }

  openAddEditEmpform(){
    const dialogRef= this._dialog.open(EmpAddEditComponent)
    dialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getEmployeeList(); 
        }
      }
    });
  }
  getEmployeeList(){
    this._empService.getEmployeeList().subscribe({
      next:(res)=>{
     this.dataSource= new MatTableDataSource(res);
     this.dataSource.sort = this.sort;
     this.dataSource.paginator=this.paginator
      },error:console.log
       })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteEmployee(id:any){
    this._empService.deleteEmployee(id).subscribe({
      next:(res)=>{
       
        this._coreService.openSnackBar('User deleted!','done')
        this.getEmployeeList();
      },
      error:console.log,
    })
  }
  openEditEmpform(data:any){
    const DialogRef = this._dialog.open(EmpAddEditComponent,{
      data,
    });
    
    DialogRef.afterClosed().subscribe({
      next:(val)=>{
        if(val){
          this.getEmployeeList(); 
        }
      }
    });
  }
}
