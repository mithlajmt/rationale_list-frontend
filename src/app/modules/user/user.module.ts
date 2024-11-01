import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user.component';
import { RationalListComponent } from './components/rational-list/rational-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TruncatePipe } from 'src/app/pipes/truncate.pipe';
import { RationalDataComponent } from './components/rational-data/rational-data.component';



@NgModule({
  declarations: [
  
    UserComponent,
       RationalListComponent,
       TruncatePipe,
       RationalDataComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
  ]
})
export class UserModule { }