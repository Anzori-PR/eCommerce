import { Component, OnInit } from '@angular/core';
import { fetch } from 'src/app/fetch.interface';
import { DataService } from 'src/app/service/data.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: fetch[] = [];
  ids: string[] = [];
  cartCounts: { [id: string]: number } = {};
  message: string = '';
  wholeCount!: number;

  faTrash = faTrash;

  constructor(private service: DataService) { }

  ngOnInit(): void {
    this.service.getAddToCartData().subscribe(res => {
      this.ids = res.map(item => item.id); // Extract IDs from objects

      // Calculate counts for each product in the cart
      this.ids.forEach(id => {
        this.cartCounts[id] = (this.cartCounts[id] || 0) + 1;
      });

      this.service.getCartProducts(this.ids).subscribe(products => {
        this.cartItems = products;
      });
    });
  }

  deleteProduct(id: string) {
    const productCount = this.cartCounts[id];
    for (let i = 0; i < productCount; i++) {
      this.service.deleteCartItem(id).subscribe(() => {
        this.cartItems = this.cartItems.filter(item => item.id !== id);
        window.location.reload();
      });
    }
  }


  getTotalPrice(id: string): number {
    const productCount = this.cartCounts[id];
    let count = 0;
    for (const item of this.cartItems) {
      if (item.id === id) {
        count += item.price * productCount;
      }
    }
    
    return count;
  }


  getWholeTotalPrice(): number {
    let wholeTotal = 0;
  
    this.cartItems.forEach(item => {
      const productCount = this.cartCounts[item.id];
      wholeTotal += item.price * productCount;
    });
  
    return wholeTotal;
  }
  
  
  add(id: string) {
    const item = this.cartItems.find(item => item.id === id);
    const number = this.cartCounts[id];

    if (item && this.cartCounts[id] < item.stock) {
      this.message = '';
      this.service.addToCart(id).subscribe(() => {
        this.cartCounts[id] = number + 1;
      });
    }else {
      this.message = "There is no more items in the stock";
    }
  }
  
  minus(id: string) {
    const item = this.cartItems.find(item => item.id === id);
    const number = this.cartCounts[id];

    if (item && this.cartCounts[id] > 1) {
      this.message = '';
      this.service.deleteCartItem(id).subscribe(() => {
        this.cartCounts[id] = number - 1;
      });
    } else {
      this.message = "Invalid quantity or item not found";
    }
  }
  
}
