import { ElementRef, Renderer2, ChangeDetectorRef, AfterContentInit, QueryList, TemplateRef } from '@angular/core';
import { MegaMenuItem, MenuItem } from 'primeng/api';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/tooltip";
import * as i5 from "primeng/api";
import * as i6 from "primeng/icons/angledown";
import * as i7 from "primeng/icons/angleright";
export declare class MegaMenu implements AfterContentInit {
    private document;
    private platformId;
    el: ElementRef;
    renderer: Renderer2;
    cd: ChangeDetectorRef;
    model: MegaMenuItem[];
    style: any;
    styleClass: string;
    orientation: string;
    templates: QueryList<any>;
    activeItem: any;
    documentClickListener: () => void | null;
    startTemplate: TemplateRef<any>;
    endTemplate: TemplateRef<any>;
    submenuIconTemplate: TemplateRef<any>;
    constructor(document: Document, platformId: any, el: ElementRef, renderer: Renderer2, cd: ChangeDetectorRef);
    ngAfterContentInit(): void;
    onCategoryMouseEnter(event: any, menuitem: MegaMenuItem): void;
    onCategoryClick(event: any, item: MenuItem | MegaMenuItem): void;
    itemClick(event: MouseEvent, item: MenuItem | MegaMenuItem): void;
    getColumnClass(menuitem: MegaMenuItem): any;
    bindDocumentClickListener(): void;
    unbindDocumentClickListener(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MegaMenu, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<MegaMenu, "p-megaMenu", never, { "model": "model"; "style": "style"; "styleClass": "styleClass"; "orientation": "orientation"; }, {}, ["templates"], ["*"], false, never>;
}
export declare class MegaMenuModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MegaMenuModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MegaMenuModule, [typeof MegaMenu], [typeof i1.CommonModule, typeof i2.RouterModule, typeof i3.RippleModule, typeof i4.TooltipModule, typeof i5.SharedModule, typeof i6.AngleDownIcon, typeof i7.AngleRightIcon], [typeof MegaMenu, typeof i2.RouterModule, typeof i4.TooltipModule, typeof i5.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MegaMenuModule>;
}
