

import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { api_params } from "./serviceUrls";
import { ProductModel } from "../models/productModel";
import { Router } from "@angular/router";



@Injectable({
    providedIn: 'root'
})
export class AppService {

    constructor(private http: HttpClient,public router: Router) { }
   
    login(credentials: any) {

       return  this.http.post(api_params.LOGIN, credentials);

    }

    getAllProducts() {
        return this.http.get(api_params.GET_PRODUCTS);
    }

    getProductById(id: number) {
        return this.http.get(api_params.GET_PRODUCTS + '/'+ id );
    }

    addProduct(product:ProductModel) {
        return this.http.post(api_params.GET_PRODUCTS,product);
    }

    updateProduct(product:ProductModel) {
        return this.http.put(api_params.GET_PRODUCTS + '/'+ product.id, product);
    }

    deleteProduct(id: number) {
        return this.http.delete(api_params.GET_PRODUCTS + '/' + id);
    }

    logout(){
        localStorage.clear();
        this.router.navigate(['login']);
    }

   

}