import { AfterContentInit, AfterViewInit, ElementRef, EventEmitter, OnDestroy, QueryList, TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/ripple";
import * as i3 from "primeng/api";
import * as i4 from "primeng/icons/spinner";
declare type ButtonIconPosition = 'left' | 'right' | 'top' | 'bottom';
export declare class ButtonDirective implements AfterViewInit, OnDestroy {
    el: ElementRef;
    private document;
    iconPos: ButtonIconPosition;
    loadingIcon: string;
    get label(): string;
    set label(val: string);
    get icon(): string;
    set icon(val: string);
    get loading(): boolean;
    set loading(val: boolean);
    _label: string;
    _icon: string;
    _loading: boolean;
    initialized: boolean;
    private get htmlElement();
    private _internalClasses;
    spinnerIcon: string;
    constructor(el: ElementRef, document: Document);
    ngAfterViewInit(): void;
    getStyleClass(): string[];
    setStyleClass(): void;
    createLabel(): void;
    createIcon(): void;
    updateLabel(): void;
    updateIcon(): void;
    getIconClass(): string;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ButtonDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<ButtonDirective, "[pButton]", never, { "iconPos": "iconPos"; "loadingIcon": "loadingIcon"; "label": "label"; "icon": "icon"; "loading": "loading"; }, {}, never, never, false, never>;
}
export declare class Button implements AfterContentInit {
    iconClass(): {
        'p-button-icon': boolean;
        'p-button-icon-left': string;
        'p-button-icon-right': string;
        'p-button-icon-top': string;
        'p-button-icon-bottom': string;
    };
    buttonClass(): {
        'p-button p-component': boolean;
        'p-button-icon-only': boolean;
        'p-button-vertical': string;
        'p-disabled': boolean;
        'p-button-loading': boolean;
        'p-button-loading-label-only': string;
    };
    type: string;
    iconPos: ButtonIconPosition;
    icon: string;
    badge: string;
    label: string;
    disabled: boolean;
    loading: boolean;
    loadingIcon: string;
    style: any;
    styleClass: string;
    badgeClass: string;
    ariaLabel: string;
    contentTemplate: TemplateRef<any>;
    loadingIconTemplate: TemplateRef<any>;
    iconTemplate: TemplateRef<any>;
    templates: QueryList<any>;
    onClick: EventEmitter<any>;
    onFocus: EventEmitter<any>;
    onBlur: EventEmitter<any>;
    ngAfterContentInit(): void;
    badgeStyleClass(): {
        'p-badge p-component': boolean;
        'p-badge-no-gutter': boolean;
    };
    static ɵfac: i0.ɵɵFactoryDeclaration<Button, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Button, "p-button", never, { "type": "type"; "iconPos": "iconPos"; "icon": "icon"; "badge": "badge"; "label": "label"; "disabled": "disabled"; "loading": "loading"; "loadingIcon": "loadingIcon"; "style": "style"; "styleClass": "styleClass"; "badgeClass": "badgeClass"; "ariaLabel": "ariaLabel"; }, { "onClick": "onClick"; "onFocus": "onFocus"; "onBlur": "onBlur"; }, ["templates"], ["*"], false, never>;
}
export declare class ButtonModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<ButtonModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<ButtonModule, [typeof ButtonDirective, typeof Button], [typeof i1.CommonModule, typeof i2.RippleModule, typeof i3.SharedModule, typeof i4.SpinnerIcon], [typeof ButtonDirective, typeof Button, typeof i3.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<ButtonModule>;
}
export {};
