import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.css']
})
export class LoadingComponent {
  public isLoading$!: Observable<boolean>;

  constructor(private loadingService: LoadingService ) {}

  ngOnInit(): void {
    this.isLoading$ = this.loadingService.loading$;
  }
}
