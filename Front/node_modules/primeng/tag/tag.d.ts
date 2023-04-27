import { TemplateRef, QueryList } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/api";
export declare class Tag {
    styleClass: string;
    style: any;
    severity: string;
    value: string;
    icon: string;
    rounded: boolean;
    templates: QueryList<any>;
    iconTemplate: TemplateRef<any>;
    ngAfterContentInit(): void;
    containerClass(): {
        'p-tag p-component': boolean;
        'p-tag-info': boolean;
        'p-tag-success': boolean;
        'p-tag-warning': boolean;
        'p-tag-danger': boolean;
        'p-tag-rounded': boolean;
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<Tag, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Tag, "p-tag", never, { "styleClass": "styleClass"; "style": "style"; "severity": "severity"; "value": "value"; "icon": "icon"; "rounded": "rounded"; }, {}, ["templates"], ["*"], false, never>;
}
export declare class TagModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<TagModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<TagModule, [typeof Tag], [typeof i1.CommonModule, typeof i2.SharedModule], [typeof Tag, typeof i2.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<TagModule>;
}
