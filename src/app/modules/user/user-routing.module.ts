import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RationalListComponent } from './components/rational-list/rational-list.component';
import { RationalDataComponent } from './components/rational-data/rational-data.component';


const routes: Routes = [
  { path: '', redirectTo: 'rationale', pathMatch: 'full' },
  { path: 'rationale', component: RationalListComponent },
  { path: 'rationale/:id', component: RationalDataComponent },
  { path: 'rationale/add', component: RationalDataComponent },
  // ... other routes
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
