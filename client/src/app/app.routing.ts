import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { UsersComponent } from './components/users/users.component';
import { CustomersComponent } from './components/customers/customers.component';
import { PruebaComponent } from './components/prueba/prueba.component';
import { ProductsComponent } from './components/products/products.component';

const appRoutes: Routes = [
    {path: '', component: LoginComponent},
    {path: 'home', component: HomeComponent},
    {path: 'empleados', component: UsersComponent},
    {path: 'clientes', component: CustomersComponent},
    {path: 'prueba', component: PruebaComponent},
    {path: 'productos', component: ProductsComponent}
];

export const appRoutingProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
