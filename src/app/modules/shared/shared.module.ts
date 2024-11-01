import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotfoundComponent } from './notfound/notfound.component';
import { LoadingComponent } from './loading/loading.component';



@NgModule({
  declarations: [
    NotfoundComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
  ],
  exports:[NotfoundComponent,LoadingComponent]
})
export class SharedModule { }
