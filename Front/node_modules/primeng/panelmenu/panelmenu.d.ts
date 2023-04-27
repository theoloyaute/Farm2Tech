import { ChangeDetectorRef, TemplateRef, AfterContentInit, QueryList } from '@angular/core';
import { MenuItem } from 'primeng/api';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "primeng/tooltip";
import * as i4 from "primeng/api";
import * as i5 from "primeng/icons/angledown";
import * as i6 from "primeng/icons/angleright";
import * as i7 from "primeng/icons/chevrondown";
import * as i8 from "primeng/icons/chevronright";
export declare class BasePanelMenuItem {
    private ref;
    constructor(ref: ChangeDetectorRef);
    handleClick(event: any, item: any): void;
}
export declare class PanelMenuSub extends BasePanelMenuItem {
    panelMenu: PanelMenu;
    item: MenuItem;
    expanded: boolean;
    parentExpanded: boolean;
    transitionOptions: string;
    root: boolean;
    constructor(ref: ChangeDetectorRef, panelMenu: PanelMenu);
    onItemKeyDown(event: any): void;
    getAnimation(): {
        value: string;
        params: {
            transitionParams: string;
            height: string;
        };
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<PanelMenuSub, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PanelMenuSub, "p-panelMenuSub", never, { "item": "item"; "expanded": "expanded"; "parentExpanded": "parentExpanded"; "transitionOptions": "transitionOptions"; "root": "root"; }, {}, never, never, false, never>;
}
export declare class PanelMenu extends BasePanelMenuItem implements AfterContentInit {
    model: MenuItem[];
    style: any;
    styleClass: string;
    multiple: boolean;
    transitionOptions: string;
    templates: QueryList<any>;
    submenuIconTemplate: TemplateRef<any>;
    animating: boolean;
    constructor(ref: ChangeDetectorRef);
    ngAfterContentInit(): void;
    collapseAll(): void;
    handleClick(event: any, item: any): void;
    onToggleDone(): void;
    onItemKeyDown(event: any): void;
    visible(item: any): boolean;
    getAnimation(item: any): {
        value: string;
        params: {
            transitionParams: string;
            height: string;
        };
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<PanelMenu, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PanelMenu, "p-panelMenu", never, { "model": "model"; "style": "style"; "styleClass": "styleClass"; "multiple": "multiple"; "transitionOptions": "transitionOptions"; }, {}, ["templates"], never, false, never>;
}
export declare class PanelMenuModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<PanelMenuModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<PanelMenuModule, [typeof PanelMenu, typeof PanelMenuSub], [typeof i1.CommonModule, typeof i2.RouterModule, typeof i3.TooltipModule, typeof i4.SharedModule, typeof i5.AngleDownIcon, typeof i6.AngleRightIcon, typeof i7.ChevronDownIcon, typeof i8.ChevronRightIcon], [typeof PanelMenu, typeof i2.RouterModule, typeof i3.TooltipModule, typeof i4.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<PanelMenuModule>;
}
