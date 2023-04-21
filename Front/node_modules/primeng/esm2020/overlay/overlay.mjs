import { animate, animation, style, transition, trigger, useAnimation } from '@angular/animations';
import { CommonModule, DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, forwardRef, Inject, Input, NgModule, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { ConnectedOverlayScrollHandler, DomHandler } from 'primeng/dom';
import { ObjectUtils, ZIndexUtils } from 'primeng/utils';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
import * as i2 from "@angular/common";
export const OVERLAY_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Overlay),
    multi: true
};
const showOverlayContentAnimation = animation([style({ transform: '{{transform}}', opacity: 0 }), animate('{{showTransitionParams}}')]);
const hideOverlayContentAnimation = animation([animate('{{hideTransitionParams}}', style({ transform: '{{transform}}', opacity: 0 }))]);
export class Overlay {
    constructor(document, el, renderer, config, overlayService, zone) {
        this.document = document;
        this.el = el;
        this.renderer = renderer;
        this.config = config;
        this.overlayService = overlayService;
        this.zone = zone;
        this.visibleChange = new EventEmitter();
        this.onBeforeShow = new EventEmitter();
        this.onShow = new EventEmitter();
        this.onBeforeHide = new EventEmitter();
        this.onHide = new EventEmitter();
        this.onAnimationStart = new EventEmitter();
        this.onAnimationDone = new EventEmitter();
        this._visible = false;
        this.modalVisible = false;
        this.isOverlayClicked = false;
        this.isOverlayContentClicked = false;
        this.transformOptions = {
            default: 'scaleY(0.8)',
            center: 'scale(0.7)',
            top: 'translate3d(0px, -100%, 0px)',
            'top-start': 'translate3d(0px, -100%, 0px)',
            'top-end': 'translate3d(0px, -100%, 0px)',
            bottom: 'translate3d(0px, 100%, 0px)',
            'bottom-start': 'translate3d(0px, 100%, 0px)',
            'bottom-end': 'translate3d(0px, 100%, 0px)',
            left: 'translate3d(-100%, 0px, 0px)',
            'left-start': 'translate3d(-100%, 0px, 0px)',
            'left-end': 'translate3d(-100%, 0px, 0px)',
            right: 'translate3d(100%, 0px, 0px)',
            'right-start': 'translate3d(100%, 0px, 0px)',
            'right-end': 'translate3d(100%, 0px, 0px)'
        };
        this.window = this.document.defaultView;
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
        if (this._visible && !this.modalVisible) {
            this.modalVisible = true;
        }
    }
    get mode() {
        return this._mode || this.overlayOptions?.mode;
    }
    set mode(value) {
        this._mode = value;
    }
    get style() {
        return ObjectUtils.merge(this._style, this.modal ? this.overlayResponsiveOptions?.style : this.overlayOptions?.style);
    }
    set style(value) {
        this._style = value;
    }
    get styleClass() {
        return ObjectUtils.merge(this._styleClass, this.modal ? this.overlayResponsiveOptions?.styleClass : this.overlayOptions?.styleClass);
    }
    set styleClass(value) {
        this._styleClass = value;
    }
    get contentStyle() {
        return ObjectUtils.merge(this._contentStyle, this.modal ? this.overlayResponsiveOptions?.contentStyle : this.overlayOptions?.contentStyle);
    }
    set contentStyle(value) {
        this._contentStyle = value;
    }
    get contentStyleClass() {
        return ObjectUtils.merge(this._contentStyleClass, this.modal ? this.overlayResponsiveOptions?.contentStyleClass : this.overlayOptions?.contentStyleClass);
    }
    set contentStyleClass(value) {
        this._contentStyleClass = value;
    }
    get target() {
        const value = this._target || this.overlayOptions?.target;
        return value === undefined ? '@prev' : value;
    }
    set target(value) {
        this._target = value;
    }
    get appendTo() {
        return this._appendTo || this.overlayOptions?.appendTo;
    }
    set appendTo(value) {
        this._appendTo = value;
    }
    get autoZIndex() {
        const value = this._autoZIndex || this.overlayOptions?.autoZIndex;
        return value === undefined ? true : value;
    }
    set autoZIndex(value) {
        this._autoZIndex = value;
    }
    get baseZIndex() {
        const value = this._baseZIndex || this.overlayOptions?.baseZIndex;
        return value === undefined ? 0 : value;
    }
    set baseZIndex(value) {
        this._baseZIndex = value;
    }
    get showTransitionOptions() {
        const value = this._showTransitionOptions || this.overlayOptions?.showTransitionOptions;
        return value === undefined ? '.12s cubic-bezier(0, 0, 0.2, 1)' : value;
    }
    set showTransitionOptions(value) {
        this._showTransitionOptions = value;
    }
    get hideTransitionOptions() {
        const value = this._hideTransitionOptions || this.overlayOptions?.hideTransitionOptions;
        return value === undefined ? '.1s linear' : value;
    }
    set hideTransitionOptions(value) {
        this._hideTransitionOptions = value;
    }
    get listener() {
        return this._listener || this.overlayOptions?.listener;
    }
    set listener(value) {
        this._listener = value;
    }
    get responsive() {
        return this._responsive || this.overlayOptions?.responsive;
    }
    set responsive(val) {
        this._responsive = val;
    }
    get options() {
        return this._options;
    }
    set options(val) {
        this._options = val;
    }
    get modal() {
        return this.mode === 'modal' || (this.overlayResponsiveOptions && this.window?.matchMedia(this.overlayResponsiveOptions.media?.replace('@media', '') || `(max-width: ${this.overlayResponsiveOptions.breakpoint})`).matches);
    }
    get overlayMode() {
        return this.mode || (this.modal ? 'modal' : 'overlay');
    }
    get overlayOptions() {
        return { ...this.config?.overlayOptions, ...this.options }; // TODO: Improve performance
    }
    get overlayResponsiveOptions() {
        return { ...this.overlayOptions?.responsive, ...this.responsive }; // TODO: Improve performance
    }
    get overlayResponsiveDirection() {
        return this.overlayResponsiveOptions?.direction || 'center';
    }
    get overlayEl() {
        return this.overlayViewChild?.nativeElement;
    }
    get contentEl() {
        return this.contentViewChild?.nativeElement;
    }
    get targetEl() {
        return DomHandler.getTargetElement(this.target, this.el?.nativeElement);
    }
    ngAfterContentInit() {
        this.templates?.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                // TODO: new template types may be added.
                default:
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }
    show(overlay, isFocus = false) {
        this.onVisibleChange(true);
        this.handleEvents('onShow', { overlay: overlay || this.overlayEl, target: this.targetEl, mode: this.overlayMode });
        isFocus && DomHandler.focus(this.targetEl);
        this.modal && DomHandler.addClass(this.document?.body, 'p-overflow-hidden');
    }
    hide(overlay, isFocus = false) {
        if (!this.visible) {
            return;
        }
        else {
            this.onVisibleChange(false);
            this.handleEvents('onHide', { overlay: overlay || this.overlayEl, target: this.targetEl, mode: this.overlayMode });
            isFocus && DomHandler.focus(this.targetEl);
            this.modal && DomHandler.removeClass(this.document?.body, 'p-overflow-hidden');
        }
    }
    alignOverlay() {
        !this.modal && DomHandler.alignOverlay(this.overlayEl, this.targetEl, this.appendTo);
    }
    onVisibleChange(visible) {
        this._visible = visible;
        this.visibleChange.emit(visible);
    }
    onOverlayClick(event) {
        this.isOverlayClicked = true;
    }
    onOverlayContentClick(event) {
        this.overlayService.add({
            originalEvent: event,
            target: this.targetEl
        });
        this.isOverlayContentClicked = true;
    }
    onOverlayContentAnimationStart(event) {
        switch (event.toState) {
            case 'visible':
                this.handleEvents('onBeforeShow', { overlay: this.overlayEl, target: this.targetEl, mode: this.overlayMode });
                if (this.autoZIndex) {
                    ZIndexUtils.set(this.overlayMode, this.overlayEl, this.baseZIndex + this.config?.zIndex[this.overlayMode]);
                }
                DomHandler.appendOverlay(this.overlayEl, this.appendTo === 'body' ? this.document.body : this.appendTo, this.appendTo);
                this.alignOverlay();
                break;
            case 'void':
                this.handleEvents('onBeforeHide', { overlay: this.overlayEl, target: this.targetEl, mode: this.overlayMode });
                this.modal && DomHandler.addClass(this.overlayEl, 'p-component-overlay-leave');
                break;
        }
        this.handleEvents('onAnimationStart', event);
    }
    onOverlayContentAnimationDone(event) {
        const container = this.overlayEl || event.element.parentElement;
        switch (event.toState) {
            case 'visible':
                this.show(container, true);
                this.bindListeners();
                break;
            case 'void':
                this.hide(container, true);
                this.unbindListeners();
                DomHandler.appendOverlay(this.overlayEl, this.targetEl, this.appendTo);
                ZIndexUtils.clear(container);
                this.modalVisible = false;
                break;
        }
        this.handleEvents('onAnimationDone', event);
    }
    handleEvents(name, params) {
        this[name].emit(params);
        this.options && this.options[name] && this.options[name](params);
        this.config?.overlayOptions && (this.config?.overlayOptions)[name] && (this.config?.overlayOptions)[name](params);
    }
    bindListeners() {
        this.bindScrollListener();
        this.bindDocumentClickListener();
        this.bindDocumentResizeListener();
        this.bindDocumentKeyboardListener();
    }
    unbindListeners() {
        this.unbindScrollListener();
        this.unbindDocumentClickListener();
        this.unbindDocumentResizeListener();
        this.unbindDocumentKeyboardListener();
    }
    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.targetEl, (event) => {
                const valid = this.listener ? this.listener(event, { type: 'scroll', mode: this.overlayMode, valid: true }) : true;
                valid && this.hide(event, true);
            });
        }
        this.scrollHandler.bindScrollListener();
    }
    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }
    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = this.renderer.listen(this.document, 'click', (event) => {
                const isTargetClicked = this.targetEl && (this.targetEl.isSameNode(event.target) || (!this.isOverlayClicked && this.targetEl.contains(event.target)));
                const isOutsideClicked = !isTargetClicked && !this.isOverlayContentClicked;
                const valid = this.listener ? this.listener(event, { type: 'outside', mode: this.overlayMode, valid: event.which !== 3 && isOutsideClicked }) : isOutsideClicked;
                valid && this.hide(event);
                this.isOverlayClicked = this.isOverlayContentClicked = false;
            });
        }
    }
    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
    }
    bindDocumentResizeListener() {
        if (!this.documentResizeListener) {
            this.documentResizeListener = this.renderer.listen(this.window, 'resize', (event) => {
                const valid = this.listener ? this.listener(event, { type: 'resize', mode: this.overlayMode, valid: !DomHandler.isTouchDevice() }) : !DomHandler.isTouchDevice();
                valid && this.hide(event, true);
            });
        }
    }
    unbindDocumentResizeListener() {
        if (this.documentResizeListener) {
            this.documentResizeListener();
            this.documentResizeListener = null;
        }
    }
    bindDocumentKeyboardListener() {
        if (this.documentKeyboardListener) {
            return;
        }
        this.zone.runOutsideAngular(() => {
            this.documentKeyboardListener = this.renderer.listen(this.window, 'keydown', (event) => {
                if (!this.overlayOptions.hideOnEscape || event.keyCode !== 27) {
                    return;
                }
                const valid = this.listener ? this.listener(event, { type: 'keydown', mode: this.overlayMode, valid: !DomHandler.isTouchDevice() }) : !DomHandler.isTouchDevice();
                if (valid) {
                    this.zone.run(() => {
                        this.hide(event, true);
                    });
                }
            });
        });
    }
    unbindDocumentKeyboardListener() {
        if (this.documentKeyboardListener) {
            this.documentKeyboardListener();
            this.documentKeyboardListener = null;
        }
    }
    ngOnDestroy() {
        this.hide(this.overlayEl, true);
        if (this.overlayEl) {
            DomHandler.appendOverlay(this.overlayEl, this.targetEl, this.appendTo);
            ZIndexUtils.clear(this.overlayEl);
        }
        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }
        this.unbindListeners();
    }
}
Overlay.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: Overlay, deps: [{ token: DOCUMENT }, { token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i1.PrimeNGConfig }, { token: i1.OverlayService }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
Overlay.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.0", type: Overlay, selector: "p-overlay", inputs: { visible: "visible", mode: "mode", style: "style", styleClass: "styleClass", contentStyle: "contentStyle", contentStyleClass: "contentStyleClass", target: "target", appendTo: "appendTo", autoZIndex: "autoZIndex", baseZIndex: "baseZIndex", showTransitionOptions: "showTransitionOptions", hideTransitionOptions: "hideTransitionOptions", listener: "listener", responsive: "responsive", options: "options" }, outputs: { visibleChange: "visibleChange", onBeforeShow: "onBeforeShow", onShow: "onShow", onBeforeHide: "onBeforeHide", onHide: "onHide", onAnimationStart: "onAnimationStart", onAnimationDone: "onAnimationDone" }, host: { classAttribute: "p-element" }, providers: [OVERLAY_VALUE_ACCESSOR], queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "overlayViewChild", first: true, predicate: ["overlay"], descendants: true }, { propertyName: "contentViewChild", first: true, predicate: ["content"], descendants: true }], ngImport: i0, template: `
        <div
            *ngIf="modalVisible"
            #overlay
            [ngStyle]="style"
            [class]="styleClass"
            [ngClass]="{
                'p-overlay p-component': true,
                'p-overlay-modal p-component-overlay p-component-overlay-enter': modal,
                'p-overlay-center': modal && overlayResponsiveDirection === 'center',
                'p-overlay-top': modal && overlayResponsiveDirection === 'top',
                'p-overlay-top-start': modal && overlayResponsiveDirection === 'top-start',
                'p-overlay-top-end': modal && overlayResponsiveDirection === 'top-end',
                'p-overlay-bottom': modal && overlayResponsiveDirection === 'bottom',
                'p-overlay-bottom-start': modal && overlayResponsiveDirection === 'bottom-start',
                'p-overlay-bottom-end': modal && overlayResponsiveDirection === 'bottom-end',
                'p-overlay-left': modal && overlayResponsiveDirection === 'left',
                'p-overlay-left-start': modal && overlayResponsiveDirection === 'left-start',
                'p-overlay-left-end': modal && overlayResponsiveDirection === 'left-end',
                'p-overlay-right': modal && overlayResponsiveDirection === 'right',
                'p-overlay-right-start': modal && overlayResponsiveDirection === 'right-start',
                'p-overlay-right-end': modal && overlayResponsiveDirection === 'right-end'
            }"
            (click)="onOverlayClick($event)"
        >
            <div
                *ngIf="visible"
                #content
                [ngStyle]="contentStyle"
                [class]="contentStyleClass"
                [ngClass]="'p-overlay-content'"
                (click)="onOverlayContentClick($event)"
                [@overlayContentAnimation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions, transform: transformOptions[modal ? overlayResponsiveDirection : 'default'] } }"
                (@overlayContentAnimation.start)="onOverlayContentAnimationStart($event)"
                (@overlayContentAnimation.done)="onOverlayContentAnimationDone($event)"
            >
                <ng-content></ng-content>
                <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: { mode: overlayMode } }"></ng-container>
            </div>
        </div>
    `, isInline: true, styles: [".p-overlay{position:absolute;top:0;left:0}.p-overlay-modal{display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;width:100%;height:100%}.p-overlay-content{transform-origin:inherit}.p-overlay-modal>.p-overlay-content{z-index:1;width:90%}.p-overlay-top{align-items:flex-start}.p-overlay-top-start{align-items:flex-start;justify-content:flex-start}.p-overlay-top-end{align-items:flex-start;justify-content:flex-end}.p-overlay-bottom{align-items:flex-end}.p-overlay-bottom-start{align-items:flex-end;justify-content:flex-start}.p-overlay-bottom-end{align-items:flex-end;justify-content:flex-end}.p-overlay-left{justify-content:flex-start}.p-overlay-left-start{justify-content:flex-start;align-items:flex-start}.p-overlay-left-end{justify-content:flex-start;align-items:flex-end}.p-overlay-right{justify-content:flex-end}.p-overlay-right-start{justify-content:flex-end;align-items:flex-start}.p-overlay-right-end{justify-content:flex-end;align-items:flex-end}\n"], dependencies: [{ kind: "directive", type: i2.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i2.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i2.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i2.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], animations: [trigger('overlayContentAnimation', [transition(':enter', [useAnimation(showOverlayContentAnimation)]), transition(':leave', [useAnimation(hideOverlayContentAnimation)])])], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: Overlay, decorators: [{
            type: Component,
            args: [{ selector: 'p-overlay', template: `
        <div
            *ngIf="modalVisible"
            #overlay
            [ngStyle]="style"
            [class]="styleClass"
            [ngClass]="{
                'p-overlay p-component': true,
                'p-overlay-modal p-component-overlay p-component-overlay-enter': modal,
                'p-overlay-center': modal && overlayResponsiveDirection === 'center',
                'p-overlay-top': modal && overlayResponsiveDirection === 'top',
                'p-overlay-top-start': modal && overlayResponsiveDirection === 'top-start',
                'p-overlay-top-end': modal && overlayResponsiveDirection === 'top-end',
                'p-overlay-bottom': modal && overlayResponsiveDirection === 'bottom',
                'p-overlay-bottom-start': modal && overlayResponsiveDirection === 'bottom-start',
                'p-overlay-bottom-end': modal && overlayResponsiveDirection === 'bottom-end',
                'p-overlay-left': modal && overlayResponsiveDirection === 'left',
                'p-overlay-left-start': modal && overlayResponsiveDirection === 'left-start',
                'p-overlay-left-end': modal && overlayResponsiveDirection === 'left-end',
                'p-overlay-right': modal && overlayResponsiveDirection === 'right',
                'p-overlay-right-start': modal && overlayResponsiveDirection === 'right-start',
                'p-overlay-right-end': modal && overlayResponsiveDirection === 'right-end'
            }"
            (click)="onOverlayClick($event)"
        >
            <div
                *ngIf="visible"
                #content
                [ngStyle]="contentStyle"
                [class]="contentStyleClass"
                [ngClass]="'p-overlay-content'"
                (click)="onOverlayContentClick($event)"
                [@overlayContentAnimation]="{ value: 'visible', params: { showTransitionParams: showTransitionOptions, hideTransitionParams: hideTransitionOptions, transform: transformOptions[modal ? overlayResponsiveDirection : 'default'] } }"
                (@overlayContentAnimation.start)="onOverlayContentAnimationStart($event)"
                (@overlayContentAnimation.done)="onOverlayContentAnimationDone($event)"
            >
                <ng-content></ng-content>
                <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: { mode: overlayMode } }"></ng-container>
            </div>
        </div>
    `, animations: [trigger('overlayContentAnimation', [transition(':enter', [useAnimation(showOverlayContentAnimation)]), transition(':leave', [useAnimation(hideOverlayContentAnimation)])])], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, providers: [OVERLAY_VALUE_ACCESSOR], host: {
                        class: 'p-element'
                    }, styles: [".p-overlay{position:absolute;top:0;left:0}.p-overlay-modal{display:flex;align-items:center;justify-content:center;position:fixed;top:0;left:0;width:100%;height:100%}.p-overlay-content{transform-origin:inherit}.p-overlay-modal>.p-overlay-content{z-index:1;width:90%}.p-overlay-top{align-items:flex-start}.p-overlay-top-start{align-items:flex-start;justify-content:flex-start}.p-overlay-top-end{align-items:flex-start;justify-content:flex-end}.p-overlay-bottom{align-items:flex-end}.p-overlay-bottom-start{align-items:flex-end;justify-content:flex-start}.p-overlay-bottom-end{align-items:flex-end;justify-content:flex-end}.p-overlay-left{justify-content:flex-start}.p-overlay-left-start{justify-content:flex-start;align-items:flex-start}.p-overlay-left-end{justify-content:flex-start;align-items:flex-end}.p-overlay-right{justify-content:flex-end}.p-overlay-right-start{justify-content:flex-end;align-items:flex-start}.p-overlay-right-end{justify-content:flex-end;align-items:flex-end}\n"] }]
        }], ctorParameters: function () { return [{ type: Document, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i1.PrimeNGConfig }, { type: i1.OverlayService }, { type: i0.NgZone }]; }, propDecorators: { visible: [{
                type: Input
            }], mode: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], contentStyle: [{
                type: Input
            }], contentStyleClass: [{
                type: Input
            }], target: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], autoZIndex: [{
                type: Input
            }], baseZIndex: [{
                type: Input
            }], showTransitionOptions: [{
                type: Input
            }], hideTransitionOptions: [{
                type: Input
            }], listener: [{
                type: Input
            }], responsive: [{
                type: Input
            }], options: [{
                type: Input
            }], visibleChange: [{
                type: Output
            }], onBeforeShow: [{
                type: Output
            }], onShow: [{
                type: Output
            }], onBeforeHide: [{
                type: Output
            }], onHide: [{
                type: Output
            }], onAnimationStart: [{
                type: Output
            }], onAnimationDone: [{
                type: Output
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], overlayViewChild: [{
                type: ViewChild,
                args: ['overlay']
            }], contentViewChild: [{
                type: ViewChild,
                args: ['content']
            }] } });
export class OverlayModule {
}
OverlayModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: OverlayModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
OverlayModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.1.0", ngImport: i0, type: OverlayModule, declarations: [Overlay], imports: [CommonModule, SharedModule], exports: [Overlay, SharedModule] });
OverlayModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: OverlayModule, imports: [CommonModule, SharedModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: OverlayModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, SharedModule],
                    exports: [Overlay, SharedModule],
                    declarations: [Overlay]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3ZlcmxheS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9vdmVybGF5L292ZXJsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQWtCLEtBQUssRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ25ILE9BQU8sRUFBRSxZQUFZLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDekQsT0FBTyxFQUVILHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsZUFBZSxFQUVmLFlBQVksRUFDWixVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxRQUFRLEVBR1IsTUFBTSxFQUlOLFNBQVMsRUFDVCxpQkFBaUIsRUFDcEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDbkQsT0FBTyxFQUFrRSxhQUFhLEVBQTRCLFlBQVksRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUNwSixPQUFPLEVBQUUsNkJBQTZCLEVBQUUsVUFBVSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3hFLE9BQU8sRUFBRSxXQUFXLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7O0FBRXpELE1BQU0sQ0FBQyxNQUFNLHNCQUFzQixHQUFRO0lBQ3ZDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUM7SUFDdEMsS0FBSyxFQUFFLElBQUk7Q0FDZCxDQUFDO0FBRUYsTUFBTSwyQkFBMkIsR0FBRyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsRUFBRSxTQUFTLEVBQUUsZUFBZSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQywwQkFBMEIsQ0FBQyxDQUFDLENB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SztnQkFRTyxxQkFBcUI7c0JBQWpDLEtBQUs7Z0JBUU8scUJBQXFCO3NCQUFqQyxLQUFLO2dCQVFPLFFBQVE7c0JBQXBCLEtBQUs7Z0JBT08sVUFBVTtzQkFBdEIsS0FBSztnQkFPTyxPQUFPO3NCQUFuQixLQUFLO2dCQU9JLGFBQWE7c0JBQXRCLE1BQU07Z0JBRUcsWUFBWTtzQkFBckIsTUFBTTtnQkFFRyxNQUFNO3NCQUFmLE1BQU07Z0JBRUcsWUFBWTtzQkFBckIsTUFBTTtnQkFFRyxNQUFNO3NCQUFmLE1BQU07Z0JBRUcsZ0JBQWdCO3NCQUF6QixNQUFNO2dCQUVHLGVBQWU7c0JBQXhCLE1BQU07Z0JBRXlCLFNBQVM7c0JBQXhDLGVBQWU7dUJBQUMsYUFBYTtnQkFFUixnQkFBZ0I7c0JBQXJDLFNBQVM7dUJBQUMsU0FBUztnQkFFRSxnQkFBZ0I7c0JBQXJDLFNBQVM7dUJBQUMsU0FBUzs7QUE2VXhCLE1BQU0sT0FBTyxhQUFhOzswR0FBYixhQUFhOzJHQUFiLGFBQWEsaUJBbGRiLE9BQU8sYUE4Y04sWUFBWSxFQUFFLFlBQVksYUE5YzNCLE9BQU8sRUErY0csWUFBWTsyR0FHdEIsYUFBYSxZQUpaLFlBQVksRUFBRSxZQUFZLEVBQ2pCLFlBQVk7MkZBR3RCLGFBQWE7a0JBTHpCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQztvQkFDckMsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksQ0FBQztvQkFDaEMsWUFBWSxFQUFFLENBQUMsT0FBTyxDQUFDO2lCQUMxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFuaW1hdGUsIGFuaW1hdGlvbiwgQW5pbWF0aW9uRXZlbnQsIHN0eWxlLCB0cmFuc2l0aW9uLCB0cmlnZ2VyLCB1c2VBbmltYXRpb24gfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSwgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgICBBZnRlckNvbnRlbnRJbml0LFxuICAgIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICAgIENvbXBvbmVudCxcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgRWxlbWVudFJlZixcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgZm9yd2FyZFJlZixcbiAgICBJbmplY3QsXG4gICAgSW5wdXQsXG4gICAgTmdNb2R1bGUsXG4gICAgTmdab25lLFxuICAgIE9uRGVzdHJveSxcbiAgICBPdXRwdXQsXG4gICAgUXVlcnlMaXN0LFxuICAgIFJlbmRlcmVyMixcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBWaWV3Q2hpbGQsXG4gICAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE92ZXJsYXlNb2RlVHlwZSwgT3ZlcmxheU9wdGlvbnMsIE92ZXJsYXlTZXJ2aWNlLCBQcmltZU5HQ29uZmlnLCBQcmltZVRlbXBsYXRlLCBSZXNwb25zaXZlT3ZlcmxheU9wdGlvbnMsIFNoYXJlZE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IENvbm5lY3RlZE92ZXJsYXlTY3JvbGxIYW5kbGVyLCBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgT2JqZWN0VXRpbHMsIFpJbmRleFV0aWxzIH0gZnJvbSAncHJpbWVuZy91dGlscyc7XG5cbmV4cG9ydCBjb25zdCBPVkVSTEFZX1ZBTFVFX0FDQ0VTU09SOiBhbnkgPSB7XG4gICAgcHJvdmlkZTogTkdfVkFMVUVfQUNDRVNTT1IsXG4gICAgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gT3ZlcmxheSksXG4gICAgbXVsdGk6IHRydWVcbn07XG5cbmNvbnN0IHNob3dPdmVybGF5Q29udGVudEFuaW1hdGlvbiA9IGFuaW1hdGlvbihbc3R5bGUoeyB0cmFuc2Zvcm06ICd7e3RyYW5zZm9ybX19Jywgb3BhY2l0eTogMCB9KSwgYW5pbWF0ZSgne3tzaG93VHJhbnNpdGlvblBhcmFtc319JyldKTtcblxuY29uc3QgaGlkZU92ZXJsYXlDb250ZW50QW5pbWF0aW9uID0gYW5pbWF0aW9uKFthbmltYXRlKCd7e2hpZGVUcmFuc2l0aW9uUGFyYW1zfX0nLCBzdHlsZSh7IHRyYW5zZm9ybTogJ3t7dHJhbnNmb3JtfX0nLCBvcGFjaXR5OiAwIH0pKV0pO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Atb3ZlcmxheScsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdlxuICAgICAgICAgICAgKm5nSWY9XCJtb2RhbFZpc2libGVcIlxuICAgICAgICAgICAgI292ZXJsYXlcbiAgICAgICAgICAgIFtuZ1N0eWxlXT1cInN0eWxlXCJcbiAgICAgICAgICAgIFtjbGFzc109XCJzdHlsZUNsYXNzXCJcbiAgICAgICAgICAgIFtuZ0NsYXNzXT1cIntcbiAgICAgICAgICAgICAgICAncC1vdmVybGF5IHAtY29tcG9uZW50JzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAncC1vdmVybGF5LW1vZGFsIHAtY29tcG9uZW50LW92ZXJsYXkgcC1jb21wb25lbnQtb3ZlcmxheS1lbnRlcic6IG1vZGFsLFxuICAgICAgICAgICAgICAgICdwLW92ZXJsYXktY2VudGVyJzogbW9kYWwgJiYgb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24gPT09ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICdwLW92ZXJsYXktdG9wJzogbW9kYWwgJiYgb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24gPT09ICd0b3AnLFxuICAgICAgICAgICAgICAgICdwLW92ZXJsYXktdG9wLXN0YXJ0JzogbW9kYWwgJiYgb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24gPT09ICd0b3Atc3RhcnQnLFxuICAgICAgICAgICAgICAgICdwLW92ZXJsYXktdG9wLWVuZCc6IG1vZGFsICYmIG92ZXJsYXlSZXNwb25zaXZlRGlyZWN0aW9uID09PSAndG9wLWVuZCcsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS1ib3R0b20nOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ2JvdHRvbScsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS1ib3R0b20tc3RhcnQnOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ2JvdHRvbS1zdGFydCcsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS1ib3R0b20tZW5kJzogbW9kYWwgJiYgb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24gPT09ICdib3R0b20tZW5kJyxcbiAgICAgICAgICAgICAgICAncC1vdmVybGF5LWxlZnQnOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ2xlZnQnLFxuICAgICAgICAgICAgICAgICdwLW92ZXJsYXktbGVmdC1zdGFydCc6IG1vZGFsICYmIG92ZXJsYXlSZXNwb25zaXZlRGlyZWN0aW9uID09PSAnbGVmdC1zdGFydCcsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS1sZWZ0LWVuZCc6IG1vZGFsICYmIG92ZXJsYXlSZXNwb25zaXZlRGlyZWN0aW9uID09PSAnbGVmdC1lbmQnLFxuICAgICAgICAgICAgICAgICdwLW92ZXJsYXktcmlnaHQnOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ3JpZ2h0JyxcbiAgICAgICAgICAgICAgICAncC1vdmVybGF5LXJpZ2h0LXN0YXJ0JzogbW9kYWwgJiYgb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24gPT09ICdyaWdodC1zdGFydCcsXG4gICAgICAgICAgICAgICAgJ3Atb3ZlcmxheS1yaWdodC1lbmQnOiBtb2RhbCAmJiBvdmVybGF5UmVzcG9uc2l2ZURpcmVjdGlvbiA9PT0gJ3JpZ2h0LWVuZCdcbiAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgKGNsaWNrKT1cIm9uT3ZlcmxheUNsaWNrKCRldmVudClcIlxuICAgICAgICA+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgKm5nSWY9XCJ2aXNpYmxlXCJcbiAgICAgICAgICAgICAgICAjY29udGVudFxuICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cImNvbnRlbnRTdHlsZVwiXG4gICAgICAgICAgICAgICAgW2NsYXNzXT1cImNvbnRlbnRTdHlsZUNsYXNzXCJcbiAgICAgICAgICAgICAgICBbbmdDbGFzc109XCIncC1vdmVybGF5LWNvbnRlbnQnXCJcbiAgICAgICAgICAgICAgICAoY2xpY2spPVwib25PdmVybGF5Q29udGVudENsaWNrKCRldmVudClcIlxuICAgICAgICAgICAgICAgIFtAb3ZlcmxheUNvbnRlbnRBbmltYXRpb25dPVwieyB2YWx1ZTogJ3Zpc2libGUnLCBwYXJhbXM6IHsgc2hvd1RyYW5zaXRpb25QYXJhbXM6IHNob3dUcmFuc2l0aW9uT3B0aW9ucywgaGlkZVRyYW5zaXRpb25QYXJhbXM6IGhpZGVUcmFuc2l0aW9uT3B0aW9ucywgdHJhbnNmb3JtOiB0cmFuc2Zvcm1PcHRpb25zW21vZGFsID8gb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24gOiAnZGVmYXVsdCddIH0gfVwiXG4gICAgICAgICAgICAgICAgKEBvdmVybGF5Q29udGVudEFuaW1hdGlvbi5zdGFydCk9XCJvbk92ZXJsYXlDb250ZW50QW5pbWF0aW9uU3RhcnQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgKEBvdmVybGF5Q29udGVudEFuaW1hdGlvbi5kb25lKT1cIm9uT3ZlcmxheUNvbnRlbnRBbmltYXRpb25Eb25lKCRldmVudClcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29udGVudFRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogeyBtb2RlOiBvdmVybGF5TW9kZSB9IH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGFuaW1hdGlvbnM6IFt0cmlnZ2VyKCdvdmVybGF5Q29udGVudEFuaW1hdGlvbicsIFt0cmFuc2l0aW9uKCc6ZW50ZXInLCBbdXNlQW5pbWF0aW9uKHNob3dPdmVybGF5Q29udGVudEFuaW1hdGlvbildKSwgdHJhbnNpdGlvbignOmxlYXZlJywgW3VzZUFuaW1hdGlvbihoaWRlT3ZlcmxheUNvbnRlbnRBbmltYXRpb24pXSldKV0sXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBwcm92aWRlcnM6IFtPVkVSTEFZX1ZBTFVFX0FDQ0VTU09SXSxcbiAgICBzdHlsZVVybHM6IFsnLi9vdmVybGF5LmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBPdmVybGF5IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSBnZXQgdmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3Zpc2libGU7XG4gICAgfVxuICAgIHNldCB2aXNpYmxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3Zpc2libGUgPSB2YWx1ZTtcblxuICAgICAgICBpZiAodGhpcy5fdmlzaWJsZSAmJiAhdGhpcy5tb2RhbFZpc2libGUpIHtcbiAgICAgICAgICAgIHRoaXMubW9kYWxWaXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBtb2RlKCk6IE92ZXJsYXlNb2RlVHlwZSB8IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9tb2RlIHx8IHRoaXMub3ZlcmxheU9wdGlvbnM/Lm1vZGU7XG4gICAgfVxuICAgIHNldCBtb2RlKHZhbHVlOiBPdmVybGF5TW9kZVR5cGUgfCBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fbW9kZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBzdHlsZSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gT2JqZWN0VXRpbHMubWVyZ2UodGhpcy5fc3R5bGUsIHRoaXMubW9kYWwgPyB0aGlzLm92ZXJsYXlSZXNwb25zaXZlT3B0aW9ucz8uc3R5bGUgOiB0aGlzLm92ZXJsYXlPcHRpb25zPy5zdHlsZSk7XG4gICAgfVxuICAgIHNldCBzdHlsZSh2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuX3N0eWxlID0gdmFsdWU7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHN0eWxlQ2xhc3MoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdFV0aWxzLm1lcmdlKHRoaXMuX3N0eWxlQ2xhc3MsIHRoaXMubW9kYWwgPyB0aGlzLm92ZXJsYXlSZXNwb25zaXZlT3B0aW9ucz8uc3R5bGVDbGFzcyA6IHRoaXMub3ZlcmxheU9wdGlvbnM/LnN0eWxlQ2xhc3MpO1xuICAgIH1cbiAgICBzZXQgc3R5bGVDbGFzcyh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX3N0eWxlQ2xhc3MgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgY29udGVudFN0eWxlKCk6IGFueSB7XG4gICAgICAgIHJldHVybiBPYmplY3RVdGlscy5tZXJnZSh0aGlzLl9jb250ZW50U3R5bGUsIHRoaXMubW9kYWwgPyB0aGlzLm92ZXJsYXlSZXNwb25zaXZlT3B0aW9ucz8uY29udGVudFN0eWxlIDogdGhpcy5vdmVybGF5T3B0aW9ucz8uY29udGVudFN0eWxlKTtcbiAgICB9XG4gICAgc2V0IGNvbnRlbnRTdHlsZSh2YWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuX2NvbnRlbnRTdHlsZSA9IHZhbHVlO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBjb250ZW50U3R5bGVDbGFzcygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gT2JqZWN0VXRpbHMubWVyZ2UodGhpcy5fY29udGVudFN0eWxlQ2xhc3MsIHRoaXMubW9kYWwgPyB0aGlzLm92ZXJsYXlSZXNwb25zaXZlT3B0aW9ucz8uY29udGVudFN0eWxlQ2xhc3MgOiB0aGlzLm92ZXJsYXlPcHRpb25zPy5jb250ZW50U3R5bGVDbGFzcyk7XG4gICAgfVxuICAgIHNldCBjb250ZW50U3R5bGVDbGFzcyh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2NvbnRlbnRTdHlsZUNsYXNzID0gdmFsdWU7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHRhcmdldCgpOiBhbnkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuX3RhcmdldCB8fCB0aGlzLm92ZXJsYXlPcHRpb25zPy50YXJnZXQ7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gJ0BwcmV2JyA6IHZhbHVlO1xuICAgIH1cbiAgICBzZXQgdGFyZ2V0KHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fdGFyZ2V0ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGFwcGVuZFRvKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9hcHBlbmRUbyB8fCB0aGlzLm92ZXJsYXlPcHRpb25zPy5hcHBlbmRUbztcbiAgICB9XG4gICAgc2V0IGFwcGVuZFRvKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fYXBwZW5kVG8gPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgYXV0b1pJbmRleCgpOiBib29sZWFuIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLl9hdXRvWkluZGV4IHx8IHRoaXMub3ZlcmxheU9wdGlvbnM/LmF1dG9aSW5kZXg7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdHJ1ZSA6IHZhbHVlO1xuICAgIH1cbiAgICBzZXQgYXV0b1pJbmRleCh2YWx1ZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9hdXRvWkluZGV4ID0gdmFsdWU7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGJhc2VaSW5kZXgoKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLl9iYXNlWkluZGV4IHx8IHRoaXMub3ZlcmxheU9wdGlvbnM/LmJhc2VaSW5kZXg7XG4gICAgICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gMCA6IHZhbHVlO1xuICAgIH1cbiAgICBzZXQgYmFzZVpJbmRleCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2Jhc2VaSW5kZXggPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgc2hvd1RyYW5zaXRpb25PcHRpb25zKCk6IHN0cmluZyB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5fc2hvd1RyYW5zaXRpb25PcHRpb25zIHx8IHRoaXMub3ZlcmxheU9wdGlvbnM/LnNob3dUcmFuc2l0aW9uT3B0aW9ucztcbiAgICAgICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyAnLjEycyBjdWJpYy1iZXppZXIoMCwgMCwgMC4yLCAxKScgOiB2YWx1ZTtcbiAgICB9XG4gICAgc2V0IHNob3dUcmFuc2l0aW9uT3B0aW9ucyh2YWx1ZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX3Nob3dUcmFuc2l0aW9uT3B0aW9ucyA9IHZhbHVlO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBoaWRlVHJhbnNpdGlvbk9wdGlvbnMoKTogc3RyaW5nIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLl9oaWRlVHJhbnNpdGlvbk9wdGlvbnMgfHwgdGhpcy5vdmVybGF5T3B0aW9ucz8uaGlkZVRyYW5zaXRpb25PcHRpb25zO1xuICAgICAgICByZXR1cm4gdmFsdWUgPT09IHVuZGVmaW5lZCA/ICcuMXMgbGluZWFyJyA6IHZhbHVlO1xuICAgIH1cbiAgICBzZXQgaGlkZVRyYW5zaXRpb25PcHRpb25zKHZhbHVlOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5faGlkZVRyYW5zaXRpb25PcHRpb25zID0gdmFsdWU7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGxpc3RlbmVyKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9saXN0ZW5lciB8fCB0aGlzLm92ZXJsYXlPcHRpb25zPy5saXN0ZW5lcjtcbiAgICB9XG4gICAgc2V0IGxpc3RlbmVyKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fbGlzdGVuZXIgPSB2YWx1ZTtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgcmVzcG9uc2l2ZSgpOiBSZXNwb25zaXZlT3ZlcmxheU9wdGlvbnMgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzcG9uc2l2ZSB8fCB0aGlzLm92ZXJsYXlPcHRpb25zPy5yZXNwb25zaXZlO1xuICAgIH1cbiAgICBzZXQgcmVzcG9uc2l2ZSh2YWw6IFJlc3BvbnNpdmVPdmVybGF5T3B0aW9ucyB8IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLl9yZXNwb25zaXZlID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBvcHRpb25zKCk6IE92ZXJsYXlPcHRpb25zIHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29wdGlvbnM7XG4gICAgfVxuICAgIHNldCBvcHRpb25zKHZhbDogT3ZlcmxheU9wdGlvbnMgfCB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IHZhbDtcbiAgICB9XG5cbiAgICBAT3V0cHV0KCkgdmlzaWJsZUNoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25CZWZvcmVTaG93OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvblNob3c6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uQmVmb3JlSGlkZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25IaWRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkFuaW1hdGlvblN0YXJ0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkFuaW1hdGlvbkRvbmU6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxhbnk+IHwgdW5kZWZpbmVkO1xuXG4gICAgQFZpZXdDaGlsZCgnb3ZlcmxheScpIG92ZXJsYXlWaWV3Q2hpbGQ6IEVsZW1lbnRSZWYgfCB1bmRlZmluZWQ7XG5cbiAgICBAVmlld0NoaWxkKCdjb250ZW50JykgY29udGVudFZpZXdDaGlsZDogRWxlbWVudFJlZiB8IHVuZGVmaW5lZDtcblxuICAgIGNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PiB8IHVuZGVmaW5lZDtcblxuICAgIF92aXNpYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBfbW9kZTogT3ZlcmxheU1vZGVUeXBlIHwgc3RyaW5nO1xuXG4gICAgX3N0eWxlOiBhbnk7XG5cbiAgICBfc3R5bGVDbGFzczogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgX2NvbnRlbnRTdHlsZTogYW55O1xuXG4gICAgX2NvbnRlbnRTdHlsZUNsYXNzOiBzdHJpbmcgfCB1bmRlZmluZWQ7XG5cbiAgICBfdGFyZ2V0OiBhbnk7XG5cbiAgICBfYXBwZW5kVG86ICdib2R5JyB8IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG4gICAgX2F1dG9aSW5kZXg6IGJvb2xlYW4gfCB1bmRlZmluZWQ7XG5cbiAgICBfYmFzZVpJbmRleDogbnVtYmVyIHwgdW5kZWZpbmVkO1xuXG4gICAgX3Nob3dUcmFuc2l0aW9uT3B0aW9uczogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgX2hpZGVUcmFuc2l0aW9uT3B0aW9uczogc3RyaW5nIHwgdW5kZWZpbmVkO1xuXG4gICAgX2xpc3RlbmVyOiBhbnk7XG5cbiAgICBfcmVzcG9uc2l2ZTogUmVzcG9uc2l2ZU92ZXJsYXlPcHRpb25zIHwgdW5kZWZpbmVkO1xuXG4gICAgX29wdGlvbnM6IE92ZXJsYXlPcHRpb25zIHwgdW5kZWZpbmVkO1xuXG4gICAgbW9kYWxWaXNpYmxlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBpc092ZXJsYXlDbGlja2VkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBpc092ZXJsYXlDb250ZW50Q2xpY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgc2Nyb2xsSGFuZGxlcjogYW55O1xuXG4gICAgZG9jdW1lbnRDbGlja0xpc3RlbmVyOiBhbnk7XG5cbiAgICBkb2N1bWVudFJlc2l6ZUxpc3RlbmVyOiBhbnk7XG5cbiAgICBwcml2YXRlIGRvY3VtZW50S2V5Ym9hcmRMaXN0ZW5lcjogVm9pZEZ1bmN0aW9uIHwgbnVsbDtcblxuICAgIHByaXZhdGUgd2luZG93OiBXaW5kb3cgfCBudWxsO1xuXG4gICAgcHJvdGVjdGVkIHRyYW5zZm9ybU9wdGlvbnM6IGFueSA9IHtcbiAgICAgICAgZGVmYXVsdDogJ3NjYWxlWSgwLjgpJyxcbiAgICAgICAgY2VudGVyOiAnc2NhbGUoMC43KScsXG4gICAgICAgIHRvcDogJ3RyYW5zbGF0ZTNkKDBweCwgLTEwMCUsIDBweCknLFxuICAgICAgICAndG9wLXN0YXJ0JzogJ3RyYW5zbGF0ZTNkKDBweCwgLTEwMCUsIDBweCknLFxuICAgICAgICAndG9wLWVuZCc6ICd0cmFuc2xhdGUzZCgwcHgsIC0xMDAlLCAwcHgpJyxcbiAgICAgICAgYm90dG9tOiAndHJhbnNsYXRlM2QoMHB4LCAxMDAlLCAwcHgpJyxcbiAgICAgICAgJ2JvdHRvbS1zdGFydCc6ICd0cmFuc2xhdGUzZCgwcHgsIDEwMCUsIDBweCknLFxuICAgICAgICAnYm90dG9tLWVuZCc6ICd0cmFuc2xhdGUzZCgwcHgsIDEwMCUsIDBweCknLFxuICAgICAgICBsZWZ0OiAndHJhbnNsYXRlM2QoLTEwMCUsIDBweCwgMHB4KScsXG4gICAgICAgICdsZWZ0LXN0YXJ0JzogJ3RyYW5zbGF0ZTNkKC0xMDAlLCAwcHgsIDBweCknLFxuICAgICAgICAnbGVmdC1lbmQnOiAndHJhbnNsYXRlM2QoLTEwMCUsIDBweCwgMHB4KScsXG4gICAgICAgIHJpZ2h0OiAndHJhbnNsYXRlM2QoMTAwJSwgMHB4LCAwcHgpJyxcbiAgICAgICAgJ3JpZ2h0LXN0YXJ0JzogJ3RyYW5zbGF0ZTNkKDEwMCUsIDBweCwgMHB4KScsXG4gICAgICAgICdyaWdodC1lbmQnOiAndHJhbnNsYXRlM2QoMTAwJSwgMHB4LCAwcHgpJ1xuICAgIH07XG5cbiAgICBnZXQgbW9kYWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vZGUgPT09ICdtb2RhbCcgfHwgKHRoaXMub3ZlcmxheVJlc3BvbnNpdmVPcHRpb25zICYmIHRoaXMud2luZG93Py5tYXRjaE1lZGlhKHRoaXMub3ZlcmxheVJlc3BvbnNpdmVPcHRpb25zLm1lZGlhPy5yZXBsYWNlKCdAbWVkaWEnLCAnJykgfHwgYChtYXgtd2lkdGg6ICR7dGhpcy5vdmVybGF5UmVzcG9uc2l2ZU9wdGlvbnMuYnJlYWtwb2ludH0pYCkubWF0Y2hlcyk7XG4gICAgfVxuXG4gICAgZ2V0IG92ZXJsYXlNb2RlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5tb2RlIHx8ICh0aGlzLm1vZGFsID8gJ21vZGFsJyA6ICdvdmVybGF5Jyk7XG4gICAgfVxuXG4gICAgZ2V0IG92ZXJsYXlPcHRpb25zKCk6IE92ZXJsYXlPcHRpb25zIHtcbiAgICAgICAgcmV0dXJuIHsgLi4udGhpcy5jb25maWc/Lm92ZXJsYXlPcHRpb25zLCAuLi50aGlzLm9wdGlvbnMgfTsgLy8gVE9ETzogSW1wcm92ZSBwZXJmb3JtYW5jZVxuICAgIH1cblxuICAgIGdldCBvdmVybGF5UmVzcG9uc2l2ZU9wdGlvbnMoKTogUmVzcG9uc2l2ZU92ZXJsYXlPcHRpb25zIHtcbiAgICAgICAgcmV0dXJuIHsgLi4udGhpcy5vdmVybGF5T3B0aW9ucz8ucmVzcG9uc2l2ZSwgLi4udGhpcy5yZXNwb25zaXZlIH07IC8vIFRPRE86IEltcHJvdmUgcGVyZm9ybWFuY2VcbiAgICB9XG5cbiAgICBnZXQgb3ZlcmxheVJlc3BvbnNpdmVEaXJlY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm92ZXJsYXlSZXNwb25zaXZlT3B0aW9ucz8uZGlyZWN0aW9uIHx8ICdjZW50ZXInO1xuICAgIH1cblxuICAgIGdldCBvdmVybGF5RWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm92ZXJsYXlWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQ7XG4gICAgfVxuXG4gICAgZ2V0IGNvbnRlbnRFbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudFZpZXdDaGlsZD8ubmF0aXZlRWxlbWVudDtcbiAgICB9XG5cbiAgICBnZXQgdGFyZ2V0RWwoKSB7XG4gICAgICAgIHJldHVybiBEb21IYW5kbGVyLmdldFRhcmdldEVsZW1lbnQodGhpcy50YXJnZXQsIHRoaXMuZWw/Lm5hdGl2ZUVsZW1lbnQpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IERvY3VtZW50LCBwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIGNvbmZpZzogUHJpbWVOR0NvbmZpZywgcHVibGljIG92ZXJsYXlTZXJ2aWNlOiBPdmVybGF5U2VydmljZSwgcHJpdmF0ZSB6b25lOiBOZ1pvbmUpIHtcbiAgICAgICAgdGhpcy53aW5kb3cgPSB0aGlzLmRvY3VtZW50LmRlZmF1bHRWaWV3O1xuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXM/LmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIHN3aXRjaCAoaXRlbS5nZXRUeXBlKCkpIHtcbiAgICAgICAgICAgICAgICBjYXNlICdjb250ZW50JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZW50VGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBuZXcgdGVtcGxhdGUgdHlwZXMgbWF5IGJlIGFkZGVkLlxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudFRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNob3cob3ZlcmxheT86IEhUTUxFbGVtZW50LCBpc0ZvY3VzOiBib29sZWFuID0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5vblZpc2libGVDaGFuZ2UodHJ1ZSk7XG4gICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCdvblNob3cnLCB7IG92ZXJsYXk6IG92ZXJsYXkgfHwgdGhpcy5vdmVybGF5RWwsIHRhcmdldDogdGhpcy50YXJnZXRFbCwgbW9kZTogdGhpcy5vdmVybGF5TW9kZSB9KTtcblxuICAgICAgICBpc0ZvY3VzICYmIERvbUhhbmRsZXIuZm9jdXModGhpcy50YXJnZXRFbCk7XG4gICAgICAgIHRoaXMubW9kYWwgJiYgRG9tSGFuZGxlci5hZGRDbGFzcyh0aGlzLmRvY3VtZW50Py5ib2R5LCAncC1vdmVyZmxvdy1oaWRkZW4nKTtcbiAgICB9XG5cbiAgICBoaWRlKG92ZXJsYXk/OiBIVE1MRWxlbWVudCwgaXNGb2N1czogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgIGlmICghdGhpcy52aXNpYmxlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm9uVmlzaWJsZUNoYW5nZShmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUV2ZW50cygnb25IaWRlJywgeyBvdmVybGF5OiBvdmVybGF5IHx8IHRoaXMub3ZlcmxheUVsLCB0YXJnZXQ6IHRoaXMudGFyZ2V0RWwsIG1vZGU6IHRoaXMub3ZlcmxheU1vZGUgfSk7XG4gICAgICAgICAgICBpc0ZvY3VzICYmIERvbUhhbmRsZXIuZm9jdXModGhpcy50YXJnZXRFbCk7XG4gICAgICAgICAgICB0aGlzLm1vZGFsICYmIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy5kb2N1bWVudD8uYm9keSwgJ3Atb3ZlcmZsb3ctaGlkZGVuJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbGlnbk92ZXJsYXkoKSB7XG4gICAgICAgICF0aGlzLm1vZGFsICYmIERvbUhhbmRsZXIuYWxpZ25PdmVybGF5KHRoaXMub3ZlcmxheUVsLCB0aGlzLnRhcmdldEVsLCB0aGlzLmFwcGVuZFRvKTtcbiAgICB9XG5cbiAgICBvblZpc2libGVDaGFuZ2UodmlzaWJsZTogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl92aXNpYmxlID0gdmlzaWJsZTtcbiAgICAgICAgdGhpcy52aXNpYmxlQ2hhbmdlLmVtaXQodmlzaWJsZSk7XG4gICAgfVxuXG4gICAgb25PdmVybGF5Q2xpY2soZXZlbnQpIHtcbiAgICAgICAgdGhpcy5pc092ZXJsYXlDbGlja2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBvbk92ZXJsYXlDb250ZW50Q2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgdGhpcy5vdmVybGF5U2VydmljZS5hZGQoe1xuICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICB0YXJnZXQ6IHRoaXMudGFyZ2V0RWxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pc092ZXJsYXlDb250ZW50Q2xpY2tlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgb25PdmVybGF5Q29udGVudEFuaW1hdGlvblN0YXJ0KGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LnRvU3RhdGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ3Zpc2libGUnOlxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCdvbkJlZm9yZVNob3cnLCB7IG92ZXJsYXk6IHRoaXMub3ZlcmxheUVsLCB0YXJnZXQ6IHRoaXMudGFyZ2V0RWwsIG1vZGU6IHRoaXMub3ZlcmxheU1vZGUgfSk7XG5cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdXRvWkluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgIFpJbmRleFV0aWxzLnNldCh0aGlzLm92ZXJsYXlNb2RlLCB0aGlzLm92ZXJsYXlFbCwgdGhpcy5iYXNlWkluZGV4ICsgdGhpcy5jb25maWc/LnpJbmRleFt0aGlzLm92ZXJsYXlNb2RlXSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hcHBlbmRPdmVybGF5KHRoaXMub3ZlcmxheUVsLCB0aGlzLmFwcGVuZFRvID09PSAnYm9keScgPyB0aGlzLmRvY3VtZW50LmJvZHkgOiB0aGlzLmFwcGVuZFRvLCB0aGlzLmFwcGVuZFRvKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFsaWduT3ZlcmxheSgpO1xuXG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3ZvaWQnOlxuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCdvbkJlZm9yZUhpZGUnLCB7IG92ZXJsYXk6IHRoaXMub3ZlcmxheUVsLCB0YXJnZXQ6IHRoaXMudGFyZ2V0RWwsIG1vZGU6IHRoaXMub3ZlcmxheU1vZGUgfSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLm1vZGFsICYmIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy5vdmVybGF5RWwsICdwLWNvbXBvbmVudC1vdmVybGF5LWxlYXZlJyk7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCdvbkFuaW1hdGlvblN0YXJ0JywgZXZlbnQpO1xuICAgIH1cblxuICAgIG9uT3ZlcmxheUNvbnRlbnRBbmltYXRpb25Eb25lKGV2ZW50OiBBbmltYXRpb25FdmVudCkge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSB0aGlzLm92ZXJsYXlFbCB8fCBldmVudC5lbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgICAgc3dpdGNoIChldmVudC50b1N0YXRlKSB7XG4gICAgICAgICAgICBjYXNlICd2aXNpYmxlJzpcbiAgICAgICAgICAgICAgICB0aGlzLnNob3coY29udGFpbmVyLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmJpbmRMaXN0ZW5lcnMoKTtcblxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlICd2b2lkJzpcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGUoY29udGFpbmVyLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB0aGlzLnVuYmluZExpc3RlbmVycygpO1xuXG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hcHBlbmRPdmVybGF5KHRoaXMub3ZlcmxheUVsLCB0aGlzLnRhcmdldEVsLCB0aGlzLmFwcGVuZFRvKTtcbiAgICAgICAgICAgICAgICBaSW5kZXhVdGlscy5jbGVhcihjb250YWluZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMubW9kYWxWaXNpYmxlID0gZmFsc2U7XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaGFuZGxlRXZlbnRzKCdvbkFuaW1hdGlvbkRvbmUnLCBldmVudCk7XG4gICAgfVxuXG4gICAgaGFuZGxlRXZlbnRzKG5hbWU6IHN0cmluZywgcGFyYW1zOiBhbnkpIHtcbiAgICAgICAgKHRoaXMgYXMgYW55KVtuYW1lXS5lbWl0KHBhcmFtcyk7XG4gICAgICAgIHRoaXMub3B0aW9ucyAmJiAodGhpcy5vcHRpb25zIGFzIGFueSlbbmFtZV0gJiYgKHRoaXMub3B0aW9ucyBhcyBhbnkpW25hbWVdKHBhcmFtcyk7XG4gICAgICAgIHRoaXMuY29uZmlnPy5vdmVybGF5T3B0aW9ucyAmJiAodGhpcy5jb25maWc/Lm92ZXJsYXlPcHRpb25zIGFzIGFueSlbbmFtZV0gJiYgKHRoaXMuY29uZmlnPy5vdmVybGF5T3B0aW9ucyBhcyBhbnkpW25hbWVdKHBhcmFtcyk7XG4gICAgfVxuXG4gICAgYmluZExpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnRLZXlib2FyZExpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgdW5iaW5kTGlzdGVuZXJzKCkge1xuICAgICAgICB0aGlzLnVuYmluZFNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpO1xuICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50S2V5Ym9hcmRMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIGJpbmRTY3JvbGxMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNjcm9sbEhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlciA9IG5ldyBDb25uZWN0ZWRPdmVybGF5U2Nyb2xsSGFuZGxlcih0aGlzLnRhcmdldEVsLCAoZXZlbnQ6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkID0gdGhpcy5saXN0ZW5lciA/IHRoaXMubGlzdGVuZXIoZXZlbnQsIHsgdHlwZTogJ3Njcm9sbCcsIG1vZGU6IHRoaXMub3ZlcmxheU1vZGUsIHZhbGlkOiB0cnVlIH0pIDogdHJ1ZTtcblxuICAgICAgICAgICAgICAgIHZhbGlkICYmIHRoaXMuaGlkZShldmVudCwgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlci5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICB1bmJpbmRTY3JvbGxMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsSGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyLnVuYmluZFNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMuZG9jdW1lbnQsICdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzVGFyZ2V0Q2xpY2tlZCA9IHRoaXMudGFyZ2V0RWwgJiYgKHRoaXMudGFyZ2V0RWwuaXNTYW1lTm9kZShldmVudC50YXJnZXQpIHx8ICghdGhpcy5pc092ZXJsYXlDbGlja2VkICYmIHRoaXMudGFyZ2V0RWwuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IGlzT3V0c2lkZUNsaWNrZWQgPSAhaXNUYXJnZXRDbGlja2VkICYmICF0aGlzLmlzT3ZlcmxheUNvbnRlbnRDbGlja2VkO1xuICAgICAgICAgICAgICAgIGNvbnN0IHZhbGlkID0gdGhpcy5saXN0ZW5lciA/IHRoaXMubGlzdGVuZXIoZXZlbnQsIHsgdHlwZTogJ291dHNpZGUnLCBtb2RlOiB0aGlzLm92ZXJsYXlNb2RlLCB2YWxpZDogZXZlbnQud2hpY2ggIT09IDMgJiYgaXNPdXRzaWRlQ2xpY2tlZCB9KSA6IGlzT3V0c2lkZUNsaWNrZWQ7XG5cbiAgICAgICAgICAgICAgICB2YWxpZCAmJiB0aGlzLmhpZGUoZXZlbnQpO1xuICAgICAgICAgICAgICAgIHRoaXMuaXNPdmVybGF5Q2xpY2tlZCA9IHRoaXMuaXNPdmVybGF5Q29udGVudENsaWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKHRoaXMud2luZG93LCAncmVzaXplJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgdmFsaWQgPSB0aGlzLmxpc3RlbmVyID8gdGhpcy5saXN0ZW5lcihldmVudCwgeyB0eXBlOiAncmVzaXplJywgbW9kZTogdGhpcy5vdmVybGF5TW9kZSwgdmFsaWQ6ICFEb21IYW5kbGVyLmlzVG91Y2hEZXZpY2UoKSB9KSA6ICFEb21IYW5kbGVyLmlzVG91Y2hEZXZpY2UoKTtcblxuICAgICAgICAgICAgICAgIHZhbGlkICYmIHRoaXMuaGlkZShldmVudCwgdHJ1ZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50UmVzaXplTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudFJlc2l6ZUxpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJpbmREb2N1bWVudEtleWJvYXJkTGlzdGVuZXIoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmRvY3VtZW50S2V5Ym9hcmRMaXN0ZW5lcikge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRLZXlib2FyZExpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy53aW5kb3csICdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLm92ZXJsYXlPcHRpb25zLmhpZGVPbkVzY2FwZSB8fCBldmVudC5rZXlDb2RlICE9PSAyNykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgdmFsaWQgPSB0aGlzLmxpc3RlbmVyID8gdGhpcy5saXN0ZW5lcihldmVudCwgeyB0eXBlOiAna2V5ZG93bicsIG1vZGU6IHRoaXMub3ZlcmxheU1vZGUsIHZhbGlkOiAhRG9tSGFuZGxlci5pc1RvdWNoRGV2aWNlKCkgfSkgOiAhRG9tSGFuZGxlci5pc1RvdWNoRGV2aWNlKCk7XG5cbiAgICAgICAgICAgICAgICBpZiAodmFsaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy56b25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoZXZlbnQsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdW5iaW5kRG9jdW1lbnRLZXlib2FyZExpc3RlbmVyKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudEtleWJvYXJkTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRLZXlib2FyZExpc3RlbmVyKCk7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50S2V5Ym9hcmRMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5oaWRlKHRoaXMub3ZlcmxheUVsLCB0cnVlKTtcblxuICAgICAgICBpZiAodGhpcy5vdmVybGF5RWwpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuYXBwZW5kT3ZlcmxheSh0aGlzLm92ZXJsYXlFbCwgdGhpcy50YXJnZXRFbCwgdGhpcy5hcHBlbmRUbyk7XG4gICAgICAgICAgICBaSW5kZXhVdGlscy5jbGVhcih0aGlzLm92ZXJsYXlFbCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zY3JvbGxIYW5kbGVyKSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEhhbmRsZXIuZGVzdHJveSgpO1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudW5iaW5kTGlzdGVuZXJzKCk7XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGUsIFNoYXJlZE1vZHVsZV0sXG4gICAgZXhwb3J0czogW092ZXJsYXksIFNoYXJlZE1vZHVsZV0sXG4gICAgZGVjbGFyYXRpb25zOiBbT3ZlcmxheV1cbn0pXG5leHBvcnQgY2xhc3MgT3ZlcmxheU1vZHVsZSB7fVxuIl19