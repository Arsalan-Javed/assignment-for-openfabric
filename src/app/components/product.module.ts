import { NgModule } from '@angular/core';
import { AddProductComponent } from './add-product/add-product.component';
import { ProductListingComponent } from './product-listing/product-listing.component';
import { ProductRoutingModule } from './product-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AddProductComponent,
    ProductListingComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ProductRoutingModule,
  ],
  providers: [],
})
export class ProductModule { }
