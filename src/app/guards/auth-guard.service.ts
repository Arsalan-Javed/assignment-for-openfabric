import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { storage_keys } from '../services/serviceUrls';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router
    ) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let isActive = localStorage.getItem(storage_keys.TOKEN) ? true : false;
        if(isActive){
            return isActive;
        } 
        else{
            this.router.navigate(['login']);
            return false;
        }
    }

}
