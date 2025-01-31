import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EmployeeService } from '../services/employee.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CoreService } from '../core/core.service';

@Component({
  selector: 'app-emp-add-edit',
  templateUrl: './emp-add-edit.component.html',
  styleUrls: ['./emp-add-edit.component.css']
})
export class EmpAddEditComponent implements OnInit {
  empForm:  FormGroup;
   Role:string[]=[
     'Admin',
    'user'
   ];

   constructor(private _fb:FormBuilder,
     private _empService:EmployeeService,
     private _dialogRef:MatDialogRef<EmpAddEditComponent>,
    @Inject(MAT_DIALOG_DATA)public data:any,
     private _coreService:CoreService){
    this.empForm = this._fb.group({
      UserName:'',
      email:'',
      Role:'',

    })
   }

   ngOnInit(): void {
     this.empForm.patchValue(this.data);
   }
   
   onFormSubmit(){
    if(this.empForm.valid){
      if(this.data){
        this._empService
        .updateEmployee(this.data.id, this.empForm.value)
        .subscribe({
          next:(val:any)=>{
            this._coreService.openSnackBar('User detail updated!');
            this._dialogRef.close(true);
          },
          error:(err:any)=>{
            console.error(err)
          },
        });

      }else{
        this._empService.addEmployee(this.empForm.value).subscribe({
          next:(val:any)=>{
            alert('')
            this._coreService.openSnackBar('User detail successfully');
            this._dialogRef.close(true);
          },
          error:(err:any)=>{
            console.error(err)
          }
        })
      }
      
    }
   }
   
}
