import { EventEmitter, QueryList, TemplateRef, AfterContentInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "primeng/tooltip";
import * as i4 from "primeng/icons/chevronright";
import * as i5 from "primeng/icons/home";
import * as i6 from "primeng/api";
export declare class Breadcrumb implements AfterContentInit {
    model: MenuItem[];
    style: any;
    styleClass: string;
    home: MenuItem;
    homeAriaLabel: string;
    onItemClick: EventEmitter<any>;
    templates: QueryList<any>;
    separatorTemplate: TemplateRef<any>;
    itemClick(event: any, item: MenuItem): void;
    onHomeClick(event: any): void;
    ngAfterContentInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Breadcrumb, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Breadcrumb, "p-breadcrumb", never, { "model": "model"; "style": "style"; "styleClass": "styleClass"; "home": "home"; "homeAriaLabel": "homeAriaLabel"; }, { "onItemClick": "onItemClick"; }, ["templates"], never, false, never>;
}
export declare class BreadcrumbModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<BreadcrumbModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<BreadcrumbModule, [typeof Breadcrumb], [typeof i1.CommonModule, typeof i2.RouterModule, typeof i3.TooltipModule, typeof i4.ChevronRightIcon, typeof i5.HomeIcon, typeof i6.SharedModule], [typeof Breadcrumb, typeof i2.RouterModule, typeof i3.TooltipModule, typeof i6.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<BreadcrumbModule>;
}
