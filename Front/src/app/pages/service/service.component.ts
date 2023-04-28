import {Component, OnInit} from '@angular/core';
import {ServiceService} from "../../services/service.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Service} from "../../models/service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {

  service: Service | undefined;
  formGroup!: FormGroup;
  errorMessage!: string;

  constructor(
    private ServiceService: ServiceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.ServiceService.isLogged()) {
      alert('Vous devez vous connecter pour accéder à cette page');
      this.router.navigate(['/']);
    }
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.ServiceService.getServiceById(id).subscribe((service: any) => {
      this.service = service;
    });
    this.formGroup = new FormGroup({
      name: new FormControl('', [Validators.required]),
      siteId: new FormControl('', [Validators.required]),
    });
  }

  editService() {
    const service = {
      id: this.service?.id,
      name: this.formGroup.value.name == '' ? this.service?.name : this.formGroup.value.name,
      siteId: this.formGroup.value.siteId == '' ? this.service?.siteId : this.formGroup.value.siteId,
    }

    this.ServiceService.update(service).subscribe(result => {
      this.router.navigate(['/']);
    }, (error: HttpErrorResponse) => {
      if (error.status == 404) {
        this.errorMessage = "Erreur de modification !";
      }
    });
  }

  deleteService(id: any) {
    this.ServiceService.delete(id).subscribe(result => {
      this.router.navigate(['/']);
    }, (error: HttpErrorResponse) => {
      if (error.status == 404) {
        this.errorMessage = "Erreur de suppression !";
      }
      if (error.status == 500) {
        this.errorMessage = "Vous ne pouvez pas le supprimer !";
      }
    });
  }

}
