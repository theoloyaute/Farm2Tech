import { QueryList, ElementRef, ChangeDetectorRef, EventEmitter, Renderer2 } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/api";
export declare class Splitter {
    private document;
    private platformId;
    private renderer;
    cd: ChangeDetectorRef;
    private el;
    styleClass: string;
    panelStyleClass: string;
    style: any;
    panelStyle: any;
    stateStorage: string;
    stateKey: string;
    layout: string;
    gutterSize: number;
    minSizes: number[];
    onResizeEnd: EventEmitter<any>;
    onResizeStart: EventEmitter<any>;
    templates: QueryList<any>;
    containerViewChild: ElementRef;
    get panelSizes(): number[];
    set panelSizes(val: number[]);
    nested: boolean;
    panels: any[];
    dragging: boolean;
    mouseMoveListener: VoidFunction | null;
    mouseUpListener: VoidFunction | null;
    touchMoveListener: VoidFunction | null;
    touchEndListener: VoidFunction | null;
    size: any;
    gutterElement: any;
    startPos: any;
    prevPanelElement: any;
    nextPanelElement: any;
    nextPanelSize: any;
    prevPanelSize: any;
    _panelSizes: number[];
    prevPanelIndex: any;
    private window;
    constructor(document: Document, platformId: any, renderer: Renderer2, cd: ChangeDetectorRef, el: ElementRef);
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    resizeStart(event: any, index: any): void;
    onResize(event: any): void;
    resizeEnd(event: any): void;
    onGutterMouseDown(event: any, index: any): void;
    onGutterTouchStart(event: any, index: any): void;
    onGutterTouchEnd(event: any): void;
    validateResize(newPrevPanelSize: any, newNextPanelSize: any): boolean;
    bindMouseListeners(): void;
    bindTouchListeners(): void;
    unbindMouseListeners(): void;
    unbindTouchListeners(): void;
    clear(): void;
    isNested(): boolean;
    isStateful(): boolean;
    getStorage(): Storage;
    saveState(): void;
    restoreState(): boolean;
    containerClass(): {
        'p-splitter p-component': boolean;
        'p-splitter-horizontal': boolean;
        'p-splitter-vertical': boolean;
    };
    panelContainerClass(): {
        'p-splitter-panel': boolean;
        'p-splitter-panel-nested': boolean;
    };
    gutterStyle(): {
        width: string;
        height?: undefined;
    } | {
        height: string;
        width?: undefined;
    };
    horizontal(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<Splitter, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Splitter, "p-splitter", never, { "styleClass": "styleClass"; "panelStyleClass": "panelStyleClass"; "style": "style"; "panelStyle": "panelStyle"; "stateStorage": "stateStorage"; "stateKey": "stateKey"; "layout": "layout"; "gutterSize": "gutterSize"; "minSizes": "minSizes"; "panelSizes": "panelSizes"; }, { "onResizeEnd": "onResizeEnd"; "onResizeStart": "onResizeStart"; }, ["templates"], never, false, never>;
}
export declare class SplitterModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<SplitterModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<SplitterModule, [typeof Splitter], [typeof i1.CommonModule], [typeof Splitter, typeof i2.SharedModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<SplitterModule>;
}
