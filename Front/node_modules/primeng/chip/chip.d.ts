import { EventEmitter, TemplateRef, AfterContentInit, QueryList } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/icons/timescircle";
import * as i3 from "primeng/api";
export declare class Chip implements AfterContentInit {
    label: string;
    icon: string;
    image: string;
    style: any;
    styleClass: string;
    removable: boolean;
    removeIcon: string;
    onRemove: EventEmitter<any>;
    onImageError: EventEmitter<any>;
    visible: boolean;
    removeIconTemplate: TemplateRef<any>;
    templates: QueryList<any>;
    ngAfterContentInit(): void;
    containerClass(): {
        'p-chip p-component': boolean;
        'p-chip-image': boolean;
    };
    close(event: any): void;
    imageError(event: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<Chip, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Chip, "p-chip", never, { "label": "label"; "icon": "icon"; "image": "image"; "style": "style"; "styleClass": "styleClass"; "removable": "removable"; "removeIcon": "removeIcon"; }, { "onRemove": "onRemove"; "onImageError": "onImageError"; }, ["templates"], ["*"], false, never>;
}
export declare class ChipModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ChipModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ChipModule, [typeof Chip], [typeof i1.CommonModule, typeof i2.TimesCircleIcon, typeof i3.SharedModule], [typeof Chip, typeof i3.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ChipModule>;
}
