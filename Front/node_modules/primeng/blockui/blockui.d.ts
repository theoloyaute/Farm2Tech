import { AfterViewInit, OnDestroy, ElementRef, ChangeDetectorRef, QueryList, TemplateRef, Renderer2 } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export declare class BlockUI implements AfterViewInit, OnDestroy {
    private document;
    el: ElementRef;
    cd: ChangeDetectorRef;
    config: PrimeNGConfig;
    private renderer;
    target: any;
    autoZIndex: boolean;
    baseZIndex: number;
    styleClass: string;
    templates: QueryList<any>;
    mask: ElementRef;
    _blocked: boolean;
    animationEndListener: VoidFunction | null;
    contentTemplate: TemplateRef<any>;
    constructor(document: Document, el: ElementRef, cd: ChangeDetectorRef, config: PrimeNGConfig, renderer: Renderer2);
    get blocked(): boolean;
    set blocked(val: boolean);
    ngAfterViewInit(): void;
    ngAfterContentInit(): void;
    block(): void;
    unblock(): void;
    destroyModal(): void;
    unbindAnimationEndListener(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BlockUI, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BlockUI, "p-blockUI", never, { "target": "target"; "autoZIndex": "autoZIndex"; "baseZIndex": "baseZIndex"; "styleClass": "styleClass"; "blocked": "blocked"; }, {}, ["templates"], ["*"], false, never>;
}
export declare class BlockUIModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<BlockUIModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<BlockUIModule, [typeof BlockUI], [typeof i1.CommonModule], [typeof BlockUI]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<BlockUIModule>;
}
