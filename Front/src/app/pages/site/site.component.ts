import {Component, OnInit} from '@angular/core';
import {SiteService} from "../../services/site.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Site} from "../../models/site";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.css']
})
export class SiteComponent implements OnInit {

  site: Site | undefined;
  formGroup!: FormGroup;
  errorMessage!: string;

  constructor(
    private SiteService: SiteService,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    if (!this.SiteService.isLogged()) {
      alert('Vous devez vous connecter pour accéder à cette page');
      this.router.navigate(['/']);
    }
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.SiteService.getSiteById(id).subscribe((site: any) => {
      this.site = site;
    });
    this.formGroup = new FormGroup({
      city: new FormControl('', [Validators.required]),
    });
  }

  editSite() {
    const site = {
      id: this.site?.id,
      city: this.formGroup.value.city == '' ? this.site?.city : this.formGroup.value.city,
    }

    this.SiteService.update(site).subscribe(result => {
      this.router.navigate(['/']);
    }, (error: HttpErrorResponse) => {
      if (error.status == 404) {
        this.errorMessage = "Erreur de modification !";
      }
    });
  }

  deleteSite(id: any) {
    this.SiteService.delete(id).subscribe(result => {
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
