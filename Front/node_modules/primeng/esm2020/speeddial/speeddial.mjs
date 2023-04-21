import { NgModule, Component, Input, ChangeDetectionStrategy, ViewEncapsulation, ContentChildren, Output, EventEmitter, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule, PrimeTemplate } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { DomHandler } from 'primeng/dom';
import { RouterModule } from '@angular/router';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/button";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/tooltip";
import * as i5 from "@angular/router";
export class SpeedDial {
    constructor(el, cd) {
        this.el = el;
        this.cd = cd;
        this.model = null;
        this.direction = 'up';
        this.transitionDelay = 30;
        this.type = 'linear';
        this.radius = 0;
        this.mask = false;
        this.disabled = false;
        this.hideOnClickOutside = true;
        this.showIcon = 'pi pi-plus';
        this.rotateAnimation = true;
        this.onVisibleChange = new EventEmitter();
        this.visibleChange = new EventEmitter();
        this.onClick = new EventEmitter();
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
        this.isItemClicked = false;
        this._visible = false;
    }
    get visible() {
        return this._visible;
    }
    set visible(value) {
        this._visible = value;
        if (this._visible) {
            this.bindDocumentClickListener();
        }
        else {
            this.unbindDocumentClickListener();
        }
    }
    ngAfterViewInit() {
        if (this.type !== 'linear') {
            const button = DomHandler.findSingle(this.container.nativeElement, '.p-speeddial-button');
            const firstItem = DomHandler.findSingle(this.list.nativeElement, '.p-speeddial-item');
            if (button && firstItem) {
                const wDiff = Math.abs(button.offsetWidth - firstItem.offsetWidth);
                const hDiff = Math.abs(button.offsetHeight - firstItem.offsetHeight);
                this.list.nativeElement.style.setProperty('--item-diff-x', `${wDiff / 2}px`);
                this.list.nativeElement.style.setProperty('--item-diff-y', `${hDiff / 2}px`);
            }
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'button':
                    this.buttonTemplate = item.template;
                    break;
            }
        });
    }
    show() {
        this.onVisibleChange.emit(true);
        this.visibleChange.emit(true);
        this._visible = true;
        this.onShow.emit();
        this.bindDocumentClickListener();
        this.cd.markForCheck();
    }
    hide() {
        this.onVisibleChange.emit(false);
        this.visibleChange.emit(false);
        this._visible = false;
        this.onHide.emit();
        this.unbindDocumentClickListener();
        this.cd.markForCheck();
    }
    onButtonClick(event) {
        this.visible ? this.hide() : this.show();
        this.onClick.emit(event);
        this.isItemClicked = true;
    }
    onItemClick(e, item) {
        if (item.command) {
            item.command({ originalEvent: e, item });
        }
        this.hide();
        this.isItemClicked = true;
    }
    calculatePointStyle(index) {
        const type = this.type;
        if (type !== 'linear') {
            const length = this.model.length;
            const radius = this.radius || length * 20;
            if (type === 'circle') {
                const step = (2 * Math.PI) / length;
                return {
                    left: `calc(${radius * Math.cos(step * index)}px + var(--item-diff-x, 0px))`,
                    top: `calc(${radius * Math.sin(step * index)}px + var(--item-diff-y, 0px))`
                };
            }
            else if (type === 'semi-circle') {
                const direction = this.direction;
                const step = Math.PI / (length - 1);
                const x = `calc(${radius * Math.cos(step * index)}px + var(--item-diff-x, 0px))`;
                const y = `calc(${radius * Math.sin(step * index)}px + var(--item-diff-y, 0px))`;
                if (direction === 'up') {
                    return { left: x, bottom: y };
                }
                else if (direction === 'down') {
                    return { left: x, top: y };
                }
                else if (direction === 'left') {
                    return { right: y, top: x };
                }
                else if (direction === 'right') {
                    return { left: y, top: x };
                }
            }
            else if (type === 'quarter-circle') {
                const direction = this.direction;
                const step = Math.PI / (2 * (length - 1));
                const x = `calc(${radius * Math.cos(step * index)}px + var(--item-diff-x, 0px))`;
                const y = `calc(${radius * Math.sin(step * index)}px + var(--item-diff-y, 0px))`;
                if (direction === 'up-left') {
                    return { right: x, bottom: y };
                }
                else if (direction === 'up-right') {
                    return { left: x, bottom: y };
                }
                else if (direction === 'down-left') {
                    return { right: y, top: x };
                }
                else if (direction === 'down-right') {
                    return { left: y, top: x };
                }
            }
        }
        return {};
    }
    calculateTransitionDelay(index) {
        const length = this.model.length;
        return (this.visible ? index : length - index - 1) * this.transitionDelay;
    }
    containerClass() {
        return {
            ['p-speeddial p-component' + ` p-speeddial-${this.type}`]: true,
            [`p-speeddial-direction-${this.direction}`]: this.type !== 'circle',
            'p-speeddial-opened': this.visible,
            'p-disabled': this.disabled
        };
    }
    buttonClass() {
        return {
            'p-speeddial-button p-button-rounded': true,
            'p-speeddial-rotate': this.rotateAnimation && !this.hideIcon,
            [this.buttonClassName]: true
        };
    }
    get buttonIconClass() {
        return (!this.visible && this.showIcon) || !this.hideIcon ? this.showIcon : this.hideIcon;
    }
    getItemStyle(index) {
        const transitionDelay = this.calculateTransitionDelay(index);
        const pointStyle = this.calculatePointStyle(index);
        return {
            transitionDelay: `${transitionDelay}ms`,
            ...pointStyle
        };
    }
    isClickableRouterLink(item) {
        return item.routerLink && !this.disabled && !item.disabled;
    }
    isOutsideClicked(event) {
        return this.container && !(this.container.nativeElement.isSameNode(event.target) || this.container.nativeElement.contains(event.target) || this.isItemClicked);
    }
    bindDocumentClickListener() {
        if (!this.documentClickListener && this.hideOnClickOutside) {
            this.documentClickListener = (event) => {
                if (this.visible && this.isOutsideClicked(event)) {
                    this.hide();
                }
                this.isItemClicked = false;
            };
            document.addEventListener('click', this.documentClickListener);
        }
    }
    unbindDocumentClickListener() {
        if (this.documentClickListener) {
            document.removeEventListener('click', this.documentClickListener);
            this.documentClickListener = null;
        }
    }
    ngOnDestroy() {
        this.unbindDocumentClickListener();
    }
}
SpeedDial.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: SpeedDial, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
SpeedDial.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.0", type: SpeedDial, selector: "p-speedDial", inputs: { id: "id", model: "model", visible: "visible", style: "style", className: "className", direction: "direction", transitionDelay: "transitionDelay", type: "type", radius: "radius", mask: "mask", disabled: "disabled", hideOnClickOutside: "hideOnClickOutside", buttonStyle: "buttonStyle", buttonClassName: "buttonClassName", maskStyle: "maskStyle", maskClassName: "maskClassName", showIcon: "showIcon", hideIcon: "hideIcon", rotateAnimation: "rotateAnimation" }, outputs: { onVisibleChange: "onVisibleChange", visibleChange: "visibleChange", onClick: "onClick", onShow: "onShow", onHide: "onHide" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "container", first: true, predicate: ["container"], descendants: true }, { propertyName: "list", first: true, predicate: ["list"], descendants: true }], ngImport: i0, template: `
        <div #container [attr.id]="id" [ngClass]="containerClass()" [class]="className" [ngStyle]="style">
            <button pRipple pButton [style]="buttonStyle" [icon]="buttonIconClass" [ngClass]="buttonClass()" (click)="onButtonClick($event)">
                <ng-container *ngIf="buttonTemplate">
                    <ng-container *ngTemplateOutlet="buttonTemplate"></ng-container>
                </ng-container>
            </button>
            <ul #list class="p-speeddial-list" role="menu">
                <li *ngFor="let item of model; let i = index" [ngStyle]="getItemStyle(i)" class="p-speeddial-item" pTooltip [tooltipOptions]="item.tooltipOptions" [ngClass]="{ 'p-hidden': item.visible === false }">
                    <a
                        *ngIf="isClickableRouterLink(item); else elseBlock"
                        pRipple
                        [routerLink]="item.routerLink"
                        [queryParams]="item.queryParams"
                        class="p-speeddial-action"
                        [ngClass]="{ 'p-disabled': item.disabled }"
                        role="menuitem"
                        [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
                        (click)="onItemClick($event, item)"
                        (keydown.enter)="onItemClick($event, item, i)"
                        [attr.target]="item.target"
                        [attr.id]="item.id"
                        [attr.tabindex]="item.disabled || readonly || !visible ? null : item.tabindex ? item.tabindex : '0'"
                        [fragment]="item.fragment"
                        [queryParamsHandling]="item.queryParamsHandling"
                        [preserveFragment]="item.preserveFragment"
                        [skipLocationChange]="item.skipLocationChange"
                        [replaceUrl]="item.replaceUrl"
                        [state]="item.state"
                    >
                        <span class="p-speeddial-action-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                    </a>
                    <ng-template #elseBlock>
                        <a
                            [attr.href]="item.url || null"
                            class="p-speeddial-action"
                            role="menuitem"
                            pRipple
                            (click)="onItemClick($event, item)"
                            [ngClass]="{ 'p-disabled': item.disabled }"
                            (keydown.enter)="onItemClick($event, item, i)"
                            [attr.target]="item.target"
                            [attr.id]="item.id"
                            [attr.tabindex]="item.disabled || (i !== activeIndex && readonly) || !visible ? null : item.tabindex ? item.tabindex : '0'"
                        >
                            <span class="p-speeddial-action-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                        </a>
                    </ng-template>
                </li>
            </ul>
        </div>
        <div *ngIf="mask && visible" [ngClass]="{ 'p-speeddial-mask': true, 'p-speeddial-mask-visible': visible }" [class]="maskClassName" [ngStyle]="maskStyle"></div>
    `, isInline: true, styles: [".p-speeddial{position:absolute;display:flex;z-index:1}.p-speeddial-list{margin:0;padding:0;list-style:none;display:flex;align-items:center;justify-content:center;transition:top 0s linear .2s;pointer-events:none}.p-speeddial-item{transform:scale(0);opacity:0;transition:transform .2s cubic-bezier(.4,0,.2,1) 0ms,opacity .8s;will-change:transform}.p-speeddial-action{display:flex;align-items:center;justify-content:center;border-radius:50%;position:relative;overflow:hidden;cursor:pointer}.p-speeddial-circle .p-speeddial-item,.p-speeddial-semi-circle .p-speeddial-item,.p-speeddial-quarter-circle .p-speeddial-item{position:absolute}.p-speeddial-rotate{transition:transform .25s cubic-bezier(.4,0,.2,1) 0ms;will-change:transform}.p-speeddial-mask{position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;transition:opacity .25s cubic-bezier(.25,.8,.25,1)}.p-speeddial-mask-visible{pointer-events:none;opacity:1;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.p-speeddial-opened .p-speeddial-list{pointer-events:auto}.p-speeddial-opened .p-speeddial-item{transform:scale(1);opacity:1}.p-speeddial-opened .p-speeddial-rotate{transform:rotate(45deg)}.p-speeddial-direction-up{align-items:center;flex-direction:column-reverse}.p-speeddial-direction-up .p-speeddial-list{flex-direction:column-reverse}.p-speeddial-direction-down{align-items:center;flex-direction:column}.p-speeddial-direction-down .p-speeddial-list{flex-direction:column}.p-speeddial-direction-left{justify-content:center;flex-direction:row-reverse}.p-speeddial-direction-left .p-speeddial-list{flex-direction:row-reverse}.p-speeddial-direction-right{justify-content:center;flex-direction:row}.p-speeddial-direction-right .p-speeddial-list{flex-direction:row}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }, { kind: "directive", type: i3.Ripple, selector: "[pRipple]" }, { kind: "directive", type: i4.Tooltip, selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "autoHide", "fitContent", "pTooltip", "tooltipDisabled", "tooltipOptions"] }, { kind: "directive", type: i5.RouterLink, selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: SpeedDial, decorators: [{
            type: Component,
            args: [{ selector: 'p-speedDial', template: `
        <div #container [attr.id]="id" [ngClass]="containerClass()" [class]="className" [ngStyle]="style">
            <button pRipple pButton [style]="buttonStyle" [icon]="buttonIconClass" [ngClass]="buttonClass()" (click)="onButtonClick($event)">
                <ng-container *ngIf="buttonTemplate">
                    <ng-container *ngTemplateOutlet="buttonTemplate"></ng-container>
                </ng-container>
            </button>
            <ul #list class="p-speeddial-list" role="menu">
                <li *ngFor="let item of model; let i = index" [ngStyle]="getItemStyle(i)" class="p-speeddial-item" pTooltip [tooltipOptions]="item.tooltipOptions" [ngClass]="{ 'p-hidden': item.visible === false }">
                    <a
                        *ngIf="isClickableRouterLink(item); else elseBlock"
                        pRipple
                        [routerLink]="item.routerLink"
                        [queryParams]="item.queryParams"
                        class="p-speeddial-action"
                        [ngClass]="{ 'p-disabled': item.disabled }"
                        role="menuitem"
                        [routerLinkActiveOptions]="item.routerLinkActiveOptions || { exact: false }"
                        (click)="onItemClick($event, item)"
                        (keydown.enter)="onItemClick($event, item, i)"
                        [attr.target]="item.target"
                        [attr.id]="item.id"
                        [attr.tabindex]="item.disabled || readonly || !visible ? null : item.tabindex ? item.tabindex : '0'"
                        [fragment]="item.fragment"
                        [queryParamsHandling]="item.queryParamsHandling"
                        [preserveFragment]="item.preserveFragment"
                        [skipLocationChange]="item.skipLocationChange"
                        [replaceUrl]="item.replaceUrl"
                        [state]="item.state"
                    >
                        <span class="p-speeddial-action-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                    </a>
                    <ng-template #elseBlock>
                        <a
                            [attr.href]="item.url || null"
                            class="p-speeddial-action"
                            role="menuitem"
                            pRipple
                            (click)="onItemClick($event, item)"
                            [ngClass]="{ 'p-disabled': item.disabled }"
                            (keydown.enter)="onItemClick($event, item, i)"
                            [attr.target]="item.target"
                            [attr.id]="item.id"
                            [attr.tabindex]="item.disabled || (i !== activeIndex && readonly) || !visible ? null : item.tabindex ? item.tabindex : '0'"
                        >
                            <span class="p-speeddial-action-icon" *ngIf="item.icon" [ngClass]="item.icon"></span>
                        </a>
                    </ng-template>
                </li>
            </ul>
        </div>
        <div *ngIf="mask && visible" [ngClass]="{ 'p-speeddial-mask': true, 'p-speeddial-mask-visible': visible }" [class]="maskClassName" [ngStyle]="maskStyle"></div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-speeddial{position:absolute;display:flex;z-index:1}.p-speeddial-list{margin:0;padding:0;list-style:none;display:flex;align-items:center;justify-content:center;transition:top 0s linear .2s;pointer-events:none}.p-speeddial-item{transform:scale(0);opacity:0;transition:transform .2s cubic-bezier(.4,0,.2,1) 0ms,opacity .8s;will-change:transform}.p-speeddial-action{display:flex;align-items:center;justify-content:center;border-radius:50%;position:relative;overflow:hidden;cursor:pointer}.p-speeddial-circle .p-speeddial-item,.p-speeddial-semi-circle .p-speeddial-item,.p-speeddial-quarter-circle .p-speeddial-item{position:absolute}.p-speeddial-rotate{transition:transform .25s cubic-bezier(.4,0,.2,1) 0ms;will-change:transform}.p-speeddial-mask{position:absolute;left:0;top:0;width:100%;height:100%;opacity:0;transition:opacity .25s cubic-bezier(.25,.8,.25,1)}.p-speeddial-mask-visible{pointer-events:none;opacity:1;transition:opacity .4s cubic-bezier(.25,.8,.25,1)}.p-speeddial-opened .p-speeddial-list{pointer-events:auto}.p-speeddial-opened .p-speeddial-item{transform:scale(1);opacity:1}.p-speeddial-opened .p-speeddial-rotate{transform:rotate(45deg)}.p-speeddial-direction-up{align-items:center;flex-direction:column-reverse}.p-speeddial-direction-up .p-speeddial-list{flex-direction:column-reverse}.p-speeddial-direction-down{align-items:center;flex-direction:column}.p-speeddial-direction-down .p-speeddial-list{flex-direction:column}.p-speeddial-direction-left{justify-content:center;flex-direction:row-reverse}.p-speeddial-direction-left .p-speeddial-list{flex-direction:row-reverse}.p-speeddial-direction-right{justify-content:center;flex-direction:row}.p-speeddial-direction-right .p-speeddial-list{flex-direction:row}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { id: [{
                type: Input
            }], model: [{
                type: Input
            }], visible: [{
                type: Input
            }], style: [{
                type: Input
            }], className: [{
                type: Input
            }], direction: [{
                type: Input
            }], transitionDelay: [{
                type: Input
            }], type: [{
                type: Input
            }], radius: [{
                type: Input
            }], mask: [{
                type: Input
            }], disabled: [{
                type: Input
            }], hideOnClickOutside: [{
                type: Input
            }], buttonStyle: [{
                type: Input
            }], buttonClassName: [{
                type: Input
            }], maskStyle: [{
                type: Input
            }], maskClassName: [{
                type: Input
            }], showIcon: [{
                type: Input
            }], hideIcon: [{
                type: Input
            }], rotateAnimation: [{
                type: Input
            }], onVisibleChange: [{
                type: Output
            }], visibleChange: [{
                type: Output
            }], onClick: [{
                type: Output
            }], onShow: [{
                type: Output
            }], onHide: [{
                type: Output
            }], container: [{
                type: ViewChild,
                args: ['container']
            }], list: [{
                type: ViewChild,
                args: ['list']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }] } });
export class SpeedDialModule {
}
SpeedDialModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: SpeedDialModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SpeedDialModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.1.0", ngImport: i0, type: SpeedDialModule, declarations: [SpeedDial], imports: [CommonModule, ButtonModule, RippleModule, TooltipModule, RouterModule], exports: [SpeedDial, SharedModule, ButtonModule, TooltipModule, RouterModule] });
SpeedDialModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: SpeedDialModule, imports: [CommonModule, ButtonModule, RippleModule, TooltipModule, RouterModule, SharedModule, ButtonModule, TooltipModule, RouterModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: SpeedDialModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, ButtonModule, RippleModule, TooltipModule, RouterModule],
                    exports: [SpeedDial, SharedModule, ButtonModule, TooltipModule, RouterModule],
                    declarations: [SpeedDial]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BlZWRkaWFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3NwZWVkZGlhbC9zcGVlZGRpYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNILFFBQVEsRUFDUixTQUFTLEVBQ1QsS0FBSyxFQUVMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFHakIsZUFBZSxFQUVmLE1BQU0sRUFDTixZQUFZLEVBRVosU0FBUyxFQUlaLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBWSxNQUFNLGFBQWEsQ0FBQztBQUNwRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQzs7Ozs7OztBQWdFL0MsTUFBTSxPQUFPLFNBQVM7SUEwRWxCLFlBQW9CLEVBQWMsRUFBUyxFQUFxQjtRQUE1QyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVMsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUF2RXZELFVBQUssR0FBVSxJQUFJLENBQUM7UUFtQnBCLGNBQVMsR0FBVyxJQUFJLENBQUM7UUFFekIsb0JBQWUsR0FBVyxFQUFFLENBQUM7UUFFN0IsU0FBSSxHQUFXLFFBQVEsQ0FBQztRQUV4QixXQUFNLEdBQVcsQ0FBQyxDQUFDO1FBRW5CLFNBQUksR0FBWSxLQUFLLENBQUM7UUFFdEIsYUFBUSxHQUFZLEtBQUssQ0FBQztRQUUxQix1QkFBa0IsR0FBWSxJQUFJLENBQUM7UUFVbkMs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QUFNO2dCQUVlLFNBQVM7c0JBQXhDLGVBQWU7dUJBQUMsYUFBYTs7QUFnTWxDLE1BQU0sT0FBTyxlQUFlOzs0R0FBZixlQUFlOzZHQUFmLGVBQWUsaUJBaFFmLFNBQVMsYUE0UFIsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLFlBQVksYUE1UHRFLFNBQVMsRUE2UEcsWUFBWSxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsWUFBWTs2R0FHbkUsZUFBZSxZQUpkLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQzFELFlBQVksRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLFlBQVk7MkZBR25FLGVBQWU7a0JBTDNCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLFlBQVksQ0FBQztvQkFDaEYsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLFlBQVksQ0FBQztvQkFDN0UsWUFBWSxFQUFFLENBQUMsU0FBUyxDQUFDO2lCQUM1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgTmdNb2R1bGUsXG4gICAgQ29tcG9uZW50LFxuICAgIElucHV0LFxuICAgIEVsZW1lbnRSZWYsXG4gICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgVmlld0VuY2Fwc3VsYXRpb24sXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBDb250ZW50Q2hpbGRyZW4sXG4gICAgUXVlcnlMaXN0LFxuICAgIE91dHB1dCxcbiAgICBFdmVudEVtaXR0ZXIsXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgVmlld0NoaWxkLFxuICAgIE9uRGVzdHJveSxcbiAgICBPbkluaXQsXG4gICAgQWZ0ZXJWaWV3SW5pdFxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbW1vbk1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBTaGFyZWRNb2R1bGUsIFByaW1lVGVtcGxhdGUsIE1lbnVJdGVtIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgQnV0dG9uTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9idXR0b24nO1xuaW1wb3J0IHsgUmlwcGxlTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9yaXBwbGUnO1xuaW1wb3J0IHsgVG9vbHRpcE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvdG9vbHRpcCc7XG5pbXBvcnQgeyBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLXNwZWVkRGlhbCcsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiAjY29udGFpbmVyIFthdHRyLmlkXT1cImlkXCIgW25nQ2xhc3NdPVwiY29udGFpbmVyQ2xhc3MoKVwiIFtjbGFzc109XCJjbGFzc05hbWVcIiBbbmdTdHlsZV09XCJzdHlsZVwiPlxuICAgICAgICAgICAgPGJ1dHRvbiBwUmlwcGxlIHBCdXR0b24gW3N0eWxlXT1cImJ1dHRvblN0eWxlXCIgW2ljb25dPVwiYnV0dG9uSWNvbkNsYXNzXCIgW25nQ2xhc3NdPVwiYnV0dG9uQ2xhc3MoKVwiIChjbGljayk9XCJvbkJ1dHRvbkNsaWNrKCRldmVudClcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiYnV0dG9uVGVtcGxhdGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImJ1dHRvblRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgIDx1bCAjbGlzdCBjbGFzcz1cInAtc3BlZWRkaWFsLWxpc3RcIiByb2xlPVwibWVudVwiPlxuICAgICAgICAgICAgICAgIDxsaSAqbmdGb3I9XCJsZXQgaXRlbSBvZiBtb2RlbDsgbGV0IGkgPSBpbmRleFwiIFtuZ1N0eWxlXT1cImdldEl0ZW1TdHlsZShpKVwiIGNsYXNzPVwicC1zcGVlZGRpYWwtaXRlbVwiIHBUb29sdGlwIFt0b29sdGlwT3B0aW9uc109XCJpdGVtLnRvb2x0aXBPcHRpb25zXCIgW25nQ2xhc3NdPVwieyAncC1oaWRkZW4nOiBpdGVtLnZpc2libGUgPT09IGZhbHNlIH1cIj5cbiAgICAgICAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICAgICAgICAgICpuZ0lmPVwiaXNDbGlja2FibGVSb3V0ZXJMaW5rKGl0ZW0pOyBlbHNlIGVsc2VCbG9ja1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBwUmlwcGxlXG4gICAgICAgICAgICAgICAgICAgICAgICBbcm91dGVyTGlua109XCJpdGVtLnJvdXRlckxpbmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW3F1ZXJ5UGFyYW1zXT1cIml0ZW0ucXVlcnlQYXJhbXNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJwLXNwZWVkZGlhbC1hY3Rpb25cIlxuICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1kaXNhYmxlZCc6IGl0ZW0uZGlzYWJsZWQgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlPVwibWVudWl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgW3JvdXRlckxpbmtBY3RpdmVPcHRpb25zXT1cIml0ZW0ucm91dGVyTGlua0FjdGl2ZU9wdGlvbnMgfHwgeyBleGFjdDogZmFsc2UgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwib25JdGVtQ2xpY2soJGV2ZW50LCBpdGVtKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAoa2V5ZG93bi5lbnRlcik9XCJvbkl0ZW1DbGljaygkZXZlbnQsIGl0ZW0sIGkpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLnRhcmdldF09XCJpdGVtLnRhcmdldFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5pZF09XCJpdGVtLmlkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLnRhYmluZGV4XT1cIml0ZW0uZGlzYWJsZWQgfHwgcmVhZG9ubHkgfHwgIXZpc2libGUgPyBudWxsIDogaXRlbS50YWJpbmRleCA/IGl0ZW0udGFiaW5kZXggOiAnMCdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2ZyYWdtZW50XT1cIml0ZW0uZnJhZ21lbnRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW3F1ZXJ5UGFyYW1zSGFuZGxpbmddPVwiaXRlbS5xdWVyeVBhcmFtc0hhbmRsaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtwcmVzZXJ2ZUZyYWdtZW50XT1cIml0ZW0ucHJlc2VydmVGcmFnbWVudFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbc2tpcExvY2F0aW9uQ2hhbmdlXT1cIml0ZW0uc2tpcExvY2F0aW9uQ2hhbmdlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtyZXBsYWNlVXJsXT1cIml0ZW0ucmVwbGFjZVVybFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbc3RhdGVdPVwiaXRlbS5zdGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1zcGVlZGRpYWwtYWN0aW9uLWljb25cIiAqbmdJZj1cIml0ZW0uaWNvblwiIFtuZ0NsYXNzXT1cIml0ZW0uaWNvblwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2Vsc2VCbG9jaz5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuaHJlZl09XCJpdGVtLnVybCB8fCBudWxsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInAtc3BlZWRkaWFsLWFjdGlvblwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9sZT1cIm1lbnVpdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwUmlwcGxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cIm9uSXRlbUNsaWNrKCRldmVudCwgaXRlbSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3AtZGlzYWJsZWQnOiBpdGVtLmRpc2FibGVkIH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIChrZXlkb3duLmVudGVyKT1cIm9uSXRlbUNsaWNrKCRldmVudCwgaXRlbSwgaSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLnRhcmdldF09XCJpdGVtLnRhcmdldFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuaWRdPVwiaXRlbS5pZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIudGFiaW5kZXhdPVwiaXRlbS5kaXNhYmxlZCB8fCAoaSAhPT0gYWN0aXZlSW5kZXggJiYgcmVhZG9ubHkpIHx8ICF2aXNpYmxlID8gbnVsbCA6IGl0ZW0udGFiaW5kZXggPyBpdGVtLnRhYmluZGV4IDogJzAnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtc3BlZWRkaWFsLWFjdGlvbi1pY29uXCIgKm5nSWY9XCJpdGVtLmljb25cIiBbbmdDbGFzc109XCJpdGVtLmljb25cIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2ICpuZ0lmPVwibWFzayAmJiB2aXNpYmxlXCIgW25nQ2xhc3NdPVwieyAncC1zcGVlZGRpYWwtbWFzayc6IHRydWUsICdwLXNwZWVkZGlhbC1tYXNrLXZpc2libGUnOiB2aXNpYmxlIH1cIiBbY2xhc3NdPVwibWFza0NsYXNzTmFtZVwiIFtuZ1N0eWxlXT1cIm1hc2tTdHlsZVwiPjwvZGl2PlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9zcGVlZGRpYWwuY3NzJ10sXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFNwZWVkRGlhbCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KCkgaWQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIG1vZGVsOiBhbnlbXSA9IG51bGw7XG5cbiAgICBASW5wdXQoKSBnZXQgdmlzaWJsZSgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdmlzaWJsZTtcbiAgICB9XG4gICAgc2V0IHZpc2libGUodmFsdWU6IGFueSkge1xuICAgICAgICB0aGlzLl92aXNpYmxlID0gdmFsdWU7XG5cbiAgICAgICAgaWYgKHRoaXMuX3Zpc2libGUpIHtcbiAgICAgICAgICAgIHRoaXMuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBjbGFzc05hbWU6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGRpcmVjdGlvbjogc3RyaW5nID0gJ3VwJztcblxuICAgIEBJbnB1dCgpIHRyYW5zaXRpb25EZWxheTogbnVtYmVyID0gMzA7XG5cbiAgICBASW5wdXQoKSB0eXBlOiBzdHJpbmcgPSAnbGluZWFyJztcblxuICAgIEBJbnB1dCgpIHJhZGl1czogbnVtYmVyID0gMDtcblxuICAgIEBJbnB1dCgpIG1hc2s6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBASW5wdXQoKSBoaWRlT25DbGlja091dHNpZGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgYnV0dG9uU3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIGJ1dHRvbkNsYXNzTmFtZTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgbWFza1N0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBtYXNrQ2xhc3NOYW1lOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBzaG93SWNvbjogc3RyaW5nID0gJ3BpIHBpLXBsdXMnO1xuXG4gICAgQElucHV0KCkgaGlkZUljb246IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHJvdGF0ZUFuaW1hdGlvbjogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBAT3V0cHV0KCkgb25WaXNpYmxlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSB2aXNpYmxlQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkNsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvblNob3c6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uSGlkZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAVmlld0NoaWxkKCdjb250YWluZXInKSBjb250YWluZXI6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdsaXN0JykgbGlzdDogRWxlbWVudFJlZjtcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8YW55PjtcblxuICAgIGJ1dHRvblRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgaXNJdGVtQ2xpY2tlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgX3Zpc2libGU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGRvY3VtZW50Q2xpY2tMaXN0ZW5lcjogYW55O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBlbDogRWxlbWVudFJlZiwgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge31cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMudHlwZSAhPT0gJ2xpbmVhcicpIHtcbiAgICAgICAgICAgIGNvbnN0IGJ1dHRvbiA9IERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmNvbnRhaW5lci5uYXRpdmVFbGVtZW50LCAnLnAtc3BlZWRkaWFsLWJ1dHRvbicpO1xuICAgICAgICAgICAgY29uc3QgZmlyc3RJdGVtID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMubGlzdC5uYXRpdmVFbGVtZW50LCAnLnAtc3BlZWRkaWFsLWl0ZW0nKTtcblxuICAgICAgICAgICAgaWYgKGJ1dHRvbiAmJiBmaXJzdEl0ZW0pIHtcbiAgICAgICAgICAgICAgICBjb25zdCB3RGlmZiA9IE1hdGguYWJzKGJ1dHRvbi5vZmZzZXRXaWR0aCAtIGZpcnN0SXRlbS5vZmZzZXRXaWR0aCk7XG4gICAgICAgICAgICAgICAgY29uc3QgaERpZmYgPSBNYXRoLmFicyhidXR0b24ub2Zmc2V0SGVpZ2h0IC0gZmlyc3RJdGVtLm9mZnNldEhlaWdodCk7XG4gICAgICAgICAgICAgICAgdGhpcy5saXN0Lm5hdGl2ZUVsZW1lbnQuc3R5bGUuc2V0UHJvcGVydHkoJy0taXRlbS1kaWZmLXgnLCBgJHt3RGlmZiAvIDJ9cHhgKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3QubmF0aXZlRWxlbWVudC5zdHlsZS5zZXRQcm9wZXJ0eSgnLS1pdGVtLWRpZmYteScsIGAke2hEaWZmIC8gMn1weGApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnYnV0dG9uJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5idXR0b25UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzaG93KCkge1xuICAgICAgICB0aGlzLm9uVmlzaWJsZUNoYW5nZS5lbWl0KHRydWUpO1xuICAgICAgICB0aGlzLnZpc2libGVDaGFuZ2UuZW1pdCh0cnVlKTtcbiAgICAgICAgdGhpcy5fdmlzaWJsZSA9IHRydWU7XG4gICAgICAgIHRoaXMub25TaG93LmVtaXQoKTtcbiAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgaGlkZSgpIHtcbiAgICAgICAgdGhpcy5vblZpc2libGVDaGFuZ2UuZW1pdChmYWxzZSk7XG4gICAgICAgIHRoaXMudmlzaWJsZUNoYW5nZS5lbWl0KGZhbHNlKTtcbiAgICAgICAgdGhpcy5fdmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLm9uSGlkZS5lbWl0KCk7XG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgb25CdXR0b25DbGljayhldmVudCkge1xuICAgICAgICB0aGlzLnZpc2libGUgPyB0aGlzLmhpZGUoKSA6IHRoaXMuc2hvdygpO1xuICAgICAgICB0aGlzLm9uQ2xpY2suZW1pdChldmVudCk7XG4gICAgICAgIHRoaXMuaXNJdGVtQ2xpY2tlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgb25JdGVtQ2xpY2soZSwgaXRlbSkge1xuICAgICAgICBpZiAoaXRlbS5jb21tYW5kKSB7XG4gICAgICAgICAgICBpdGVtLmNvbW1hbmQoeyBvcmlnaW5hbEV2ZW50OiBlLCBpdGVtIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5oaWRlKCk7XG5cbiAgICAgICAgdGhpcy5pc0l0ZW1DbGlja2VkID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVQb2ludFN0eWxlKGluZGV4KSB7XG4gICAgICAgIGNvbnN0IHR5cGUgPSB0aGlzLnR5cGU7XG5cbiAgICAgICAgaWYgKHR5cGUgIT09ICdsaW5lYXInKSB7XG4gICAgICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLm1vZGVsLmxlbmd0aDtcbiAgICAgICAgICAgIGNvbnN0IHJhZGl1cyA9IHRoaXMucmFkaXVzIHx8IGxlbmd0aCAqIDIwO1xuXG4gICAgICAgICAgICBpZiAodHlwZSA9PT0gJ2NpcmNsZScpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwID0gKDIgKiBNYXRoLlBJKSAvIGxlbmd0aDtcblxuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6IGBjYWxjKCR7cmFkaXVzICogTWF0aC5jb3Moc3RlcCAqIGluZGV4KX1weCArIHZhcigtLWl0ZW0tZGlmZi14LCAwcHgpKWAsXG4gICAgICAgICAgICAgICAgICAgIHRvcDogYGNhbGMoJHtyYWRpdXMgKiBNYXRoLnNpbihzdGVwICogaW5kZXgpfXB4ICsgdmFyKC0taXRlbS1kaWZmLXksIDBweCkpYFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzZW1pLWNpcmNsZScpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSB0aGlzLmRpcmVjdGlvbjtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGVwID0gTWF0aC5QSSAvIChsZW5ndGggLSAxKTtcbiAgICAgICAgICAgICAgICBjb25zdCB4ID0gYGNhbGMoJHtyYWRpdXMgKiBNYXRoLmNvcyhzdGVwICogaW5kZXgpfXB4ICsgdmFyKC0taXRlbS1kaWZmLXgsIDBweCkpYDtcbiAgICAgICAgICAgICAgICBjb25zdCB5ID0gYGNhbGMoJHtyYWRpdXMgKiBNYXRoLnNpbihzdGVwICogaW5kZXgpfXB4ICsgdmFyKC0taXRlbS1kaWZmLXksIDBweCkpYDtcbiAgICAgICAgICAgICAgICBpZiAoZGlyZWN0aW9uID09PSAndXAnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IGxlZnQ6IHgsIGJvdHRvbTogeSB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bicpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgbGVmdDogeCwgdG9wOiB5IH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyByaWdodDogeSwgdG9wOiB4IH07XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChkaXJlY3Rpb24gPT09ICdyaWdodCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgbGVmdDogeSwgdG9wOiB4IH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlID09PSAncXVhcnRlci1jaXJjbGUnKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlyZWN0aW9uID0gdGhpcy5kaXJlY3Rpb247XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RlcCA9IE1hdGguUEkgLyAoMiAqIChsZW5ndGggLSAxKSk7XG4gICAgICAgICAgICAgICAgY29uc3QgeCA9IGBjYWxjKCR7cmFkaXVzICogTWF0aC5jb3Moc3RlcCAqIGluZGV4KX1weCArIHZhcigtLWl0ZW0tZGlmZi14LCAwcHgpKWA7XG4gICAgICAgICAgICAgICAgY29uc3QgeSA9IGBjYWxjKCR7cmFkaXVzICogTWF0aC5zaW4oc3RlcCAqIGluZGV4KX1weCArIHZhcigtLWl0ZW0tZGlmZi15LCAwcHgpKWA7XG4gICAgICAgICAgICAgICAgaWYgKGRpcmVjdGlvbiA9PT0gJ3VwLWxlZnQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7IHJpZ2h0OiB4LCBib3R0b206IHkgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ3VwLXJpZ2h0Jykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geyBsZWZ0OiB4LCBib3R0b206IHkgfTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRpcmVjdGlvbiA9PT0gJ2Rvd24tbGVmdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgcmlnaHQ6IHksIHRvcDogeCB9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGlyZWN0aW9uID09PSAnZG93bi1yaWdodCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHsgbGVmdDogeSwgdG9wOiB4IH07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZVRyYW5zaXRpb25EZWxheShpbmRleCkge1xuICAgICAgICBjb25zdCBsZW5ndGggPSB0aGlzLm1vZGVsLmxlbmd0aDtcblxuICAgICAgICByZXR1cm4gKHRoaXMudmlzaWJsZSA/IGluZGV4IDogbGVuZ3RoIC0gaW5kZXggLSAxKSAqIHRoaXMudHJhbnNpdGlvbkRlbGF5O1xuICAgIH1cblxuICAgIGNvbnRhaW5lckNsYXNzKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgWydwLXNwZWVkZGlhbCBwLWNvbXBvbmVudCcgKyBgIHAtc3BlZWRkaWFsLSR7dGhpcy50eXBlfWBdOiB0cnVlLFxuICAgICAgICAgICAgW2BwLXNwZWVkZGlhbC1kaXJlY3Rpb24tJHt0aGlzLmRpcmVjdGlvbn1gXTogdGhpcy50eXBlICE9PSAnY2lyY2xlJyxcbiAgICAgICAgICAgICdwLXNwZWVkZGlhbC1vcGVuZWQnOiB0aGlzLnZpc2libGUsXG4gICAgICAgICAgICAncC1kaXNhYmxlZCc6IHRoaXMuZGlzYWJsZWRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBidXR0b25DbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICdwLXNwZWVkZGlhbC1idXR0b24gcC1idXR0b24tcm91bmRlZCc6IHRydWUsXG4gICAgICAgICAgICAncC1zcGVlZGRpYWwtcm90YXRlJzogdGhpcy5yb3RhdGVBbmltYXRpb24gJiYgIXRoaXMuaGlkZUljb24sXG4gICAgICAgICAgICBbdGhpcy5idXR0b25DbGFzc05hbWVdOiB0cnVlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgZ2V0IGJ1dHRvbkljb25DbGFzcygpIHtcbiAgICAgICAgcmV0dXJuICghdGhpcy52aXNpYmxlICYmIHRoaXMuc2hvd0ljb24pIHx8ICF0aGlzLmhpZGVJY29uID8gdGhpcy5zaG93SWNvbiA6IHRoaXMuaGlkZUljb247XG4gICAgfVxuXG4gICAgZ2V0SXRlbVN0eWxlKGluZGV4KSB7XG4gICAgICAgIGNvbnN0IHRyYW5zaXRpb25EZWxheSA9IHRoaXMuY2FsY3VsYXRlVHJhbnNpdGlvbkRlbGF5KGluZGV4KTtcbiAgICAgICAgY29uc3QgcG9pbnRTdHlsZSA9IHRoaXMuY2FsY3VsYXRlUG9pbnRTdHlsZShpbmRleCk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uRGVsYXk6IGAke3RyYW5zaXRpb25EZWxheX1tc2AsXG4gICAgICAgICAgICAuLi5wb2ludFN0eWxlXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgaXNDbGlja2FibGVSb3V0ZXJMaW5rKGl0ZW06IE1lbnVJdGVtKSB7XG4gICAgICAgIHJldHVybiBpdGVtLnJvdXRlckxpbmsgJiYgIXRoaXMuZGlzYWJsZWQgJiYgIWl0ZW0uZGlzYWJsZWQ7XG4gICAgfVxuXG4gICAgaXNPdXRzaWRlQ2xpY2tlZChldmVudCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb250YWluZXIgJiYgISh0aGlzLmNvbnRhaW5lci5uYXRpdmVFbGVtZW50LmlzU2FtZU5vZGUoZXZlbnQudGFyZ2V0KSB8fCB0aGlzLmNvbnRhaW5lci5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkgfHwgdGhpcy5pc0l0ZW1DbGlja2VkKTtcbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyICYmIHRoaXMuaGlkZU9uQ2xpY2tPdXRzaWRlKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZpc2libGUgJiYgdGhpcy5pc091dHNpZGVDbGlja2VkKGV2ZW50KSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmlzSXRlbUNsaWNrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBCdXR0b25Nb2R1bGUsIFJpcHBsZU1vZHVsZSwgVG9vbHRpcE1vZHVsZSwgUm91dGVyTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbU3BlZWREaWFsLCBTaGFyZWRNb2R1bGUsIEJ1dHRvbk1vZHVsZSwgVG9vbHRpcE1vZHVsZSwgUm91dGVyTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtTcGVlZERpYWxdXG59KVxuZXhwb3J0IGNsYXNzIFNwZWVkRGlhbE1vZHVsZSB7fVxuIl19