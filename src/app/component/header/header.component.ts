import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { filter } from 'rxjs';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  faShoppingCart = faShoppingCart;
  faBars = faBars;
  faXmark = faXmark;
  product!: number;
  id: string[] = [];
  ActiveRoute: string = '';
  sideMenu: boolean = false;
  menu: boolean = true;


  constructor(private service: DataService, private router: Router) { }

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.ActiveRoute = this.router.url;
      });

    this.service.getAddToCartData().subscribe(res => {
      this.id = res.map(item => item.id);

      this.service.getCartProducts(this.id).subscribe(products => {
        this.product = products.length;
      });
    })
  }

  menuOpen() {
    this.sideMenu = true;
    this.menu = false;
  }

  menuClose() {
    this.sideMenu = false;
    this.menu = true;
  }
}
