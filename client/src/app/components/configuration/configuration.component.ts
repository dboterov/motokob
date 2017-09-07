import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { UserService } from '../../services/user.service';

declare var $: any;

@Component({
  selector: 'motokob-quotations',
  templateUrl: './quotations.component.html',
  styleUrls: ['./quotations.component.css'],
  providers: [UserService]
})
export class QuotationsComponent implements OnInit {
  public identity;
  public token;
  public errorMessage: string = '';
  public successMessage: string = '';

  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router: Router) {
  }

  ngOnInit() {
    console.log('iniciando componente de configuracion');
    this.identity = this._userService.getItentity();
    this.token = this._userService.getToken();
    if (this.identity === null || this.token === null) {
      this._router.navigate(['/']);
    }
  }
}
