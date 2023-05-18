import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductModel } from 'src/app/models/productModel';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-product-listing',
  templateUrl: './product-listing.component.html',
  styleUrls: ['./product-listing.component.scss']
})
export class ProductListingComponent implements OnInit {

  constructor(
    private router: Router,
    private toaster: ToastrService,
    public ApiService: AppService,
  ) { }

  products : ProductModel[] = [];

  ngOnInit(): void {

    this.ApiService.getAllProducts().subscribe((res:any)=>{
        if(res.status == 200){
          this.products = res.data;
        }
        else{
          this.toaster.error("Product not found.");
        }
    });

  }

  addProduct(){
    this.router.navigate(['products/add-product']);
  }

  editProduct(product:ProductModel){
    this.router.navigate(['products/edit-product/' + product.id])
  }

  removeProduct(product:ProductModel){

    this.ApiService.deleteProduct(product.id).subscribe((res:any)=>{
      if(res.status == 200){
        this.products = this.products.filter(p=>p.id!=product.id);
      }
    });

  }

}
