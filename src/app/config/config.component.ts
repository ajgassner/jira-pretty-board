import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms/src/model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ConfigService } from '../config.service';
import { BoardConfig } from '../models';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html'
})
export class ConfigComponent implements OnInit {

  configForm: FormGroup;

  minTTL = BoardConfig.MIN_TTL;
  defaultTTL = BoardConfig.DEFAULT_TTL;

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private configService: ConfigService) { }

  ngOnInit(): void {
    this.configForm = this.fb.group({
      regex: [''],
      ttl: ['', [Validators.pattern('[0-9]+'), Validators.min(BoardConfig.MIN_TTL)]]
    });

    const config = this.configService.load();
    const form = {
      regex: config.regex,
      ttl: config.ttl
    };
    this.configForm.setValue(form);
  }

  save(): void {
    if (!this.configForm.valid) {
      return;
    }

    const config = this.configService.load();
    config.regex = this.configForm.value.regex;
    config.ttl = this.configForm.value.ttl;

    localStorage.clear(); // clear cache
    this.configService.persist(config);
    location.reload(); // hard reset
  }
}
