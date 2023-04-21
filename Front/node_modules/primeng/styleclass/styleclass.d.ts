import { ElementRef, NgZone, OnDestroy, Renderer2 } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export declare class StyleClass implements OnDestroy {
    el: ElementRef;
    renderer: Renderer2;
    private zone;
    constructor(el: ElementRef, renderer: Renderer2, zone: NgZone);
    selector: string;
    enterClass: string;
    enterActiveClass: string;
    enterToClass: string;
    leaveClass: string;
    leaveActiveClass: string;
    leaveToClass: string;
    hideOnOutsideClick: boolean;
    toggleClass: string;
    hideOnEscape: boolean;
    eventListener: Function;
    documentClickListener: Function;
    documentKeydownListener: Function;
    target: HTMLElement;
    enterListener: Function;
    leaveListener: Function;
    animating: boolean;
    clickListener(): void;
    toggle(): void;
    enter(): void;
    leave(): void;
    resolveTarget(): any;
    bindDocumentClickListener(): void;
    bindDocumentKeydownListener(): void;
    isVisible(): boolean;
    isOutsideClick(event: MouseEvent): boolean;
    unbindDocumentClickListener(): void;
    unbindDocumentKeydownListener(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<StyleClass, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<StyleClass, "[pStyleClass]", never, { "selector": "pStyleClass"; "enterClass": "enterClass"; "enterActiveClass": "enterActiveClass"; "enterToClass": "enterToClass"; "leaveClass": "leaveClass"; "leaveActiveClass": "leaveActiveClass"; "leaveToClass": "leaveToClass"; "hideOnOutsideClick": "hideOnOutsideClick"; "toggleClass": "toggleClass"; "hideOnEscape": "hideOnEscape"; }, {}, never, never, false, never>;
}
export declare class StyleClassModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<StyleClassModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<StyleClassModule, [typeof StyleClass], [typeof i1.CommonModule], [typeof StyleClass]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<StyleClassModule>;
}
