import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ProductModel } from 'src/app/models/productModel';
import { AppService } from 'src/app/services/app.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit {

  productForm: FormGroup;
  productId = 0;
  
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private ApiService: AppService,
    ) { 

    this.productForm = this.formBuilder.group({
      id: [0],
      name: ['', Validators.required],
      quantity: ['', Validators.required],
      price: ['', Validators.required],
      model: [''],
      color: [''],
    });

  }

  ngOnInit(): void {

    this.productId = this.activatedRoute.snapshot.paramMap.get('id') ? Number(this.activatedRoute.snapshot.paramMap.get('id')) : 0;

    if(this.productId){
      // edit case
      this.ApiService.getProductById(this.productId).subscribe((res:any)=>{
        if(res.status == 200){
          this.productForm.patchValue(res.data[0])
        }
      });
    }
  }

  onSubmit() {
    if (this.productForm.invalid) {
      return;
    }

    var product:ProductModel  = this.productForm.getRawValue();
    console.log(product);

    if(product.id>0){
      this.ApiService.updateProduct(product).subscribe((res:any)=>{
          if(res.status == 200){
            this.toaster.success("Product saved successfully.");
            this.router.navigate(['products']);
          }
          else{
            this.toaster.error("Product not saved.");
          }
      });
    }
    else{ 
      this.ApiService.addProduct(product).subscribe((res:any)=>{
        if(res.status == 200){
          this.toaster.success("Product saved successfully.");
          this.router.navigate(['products']);
        }
        else{
          this.toaster.error("Product not saved.");
        }
    })

    }
     

  }

  cancel(){
    this.router.navigate(['products'])
  }


}
