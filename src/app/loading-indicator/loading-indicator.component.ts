import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { LoadingStateService } from '../loading-state.service';

@Component({
  selector: 'app-loading-indicator',
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.scss']
})
export class LoadingIndicatorComponent implements OnInit {

  loading: Observable<boolean>;

  constructor(private ls: LoadingStateService) { }

  ngOnInit(): void {
    this.loading = this.ls.loadingState;
  }
}
