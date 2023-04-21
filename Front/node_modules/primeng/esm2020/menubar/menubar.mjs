import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Injectable, Input, NgModule, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZIndexUtils } from 'primeng/utils';
import { PrimeTemplate, SharedModule } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { debounce, filter, interval, Subject } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/tooltip";
import * as i5 from "primeng/api";
export class MenubarService {
    constructor() {
        this.mouseLeaves = new Subject();
        this.mouseLeft$ = this.mouseLeaves.pipe(debounce(() => interval(this.autoHideDelay)), filter((mouseLeft) => this.autoHide && mouseLeft));
    }
}
MenubarService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: MenubarService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
MenubarService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: MenubarService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: MenubarService, decorators: [{
            type: Injectable
        }] });
export class MenubarSub {
    constructor(el, renderer, cd, menubarService) {
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.menubarService = menubarService;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.leafClick = new EventEmitter();
        this.menuHoverActive = false;
    }
    get parentActive() {
        return this._parentActive;
    }
    set parentActive(value) {
        if (!this.root) {
            this._parentActive = value;
            if (!value)
                this.activeItem = null;
        }
    }
    ngOnInit() {
        this.mouseLeaveSubscriber = this.menubarService.mouseLeft$.subscribe(() => {
            this.activeItem = null;
            this.cd.markForCheck();
            this.unbindDocumentClickListener();
        });
    }
    onItemClick(event, item) {
        if (item.disabled) {
            event.preventDefault();
            return;
        }
        if (!item.url && !item.routerLink) {
            event.preventDefault();
        }
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }
        if (item.items) {
            if (this.activeItem && item === this.activeItem) {
                this.activeItem = null;
                this.unbindDocumentClickListener();
            }
            else {
                this.activeItem = item;
                if (this.root) {
                    this.bindDocumentClickListener();
                }
            }
        }
        if (!item.items) {
            this.onLeafClick();
        }
    }
    onItemMouseLeave(event, item) {
        this.menubarService.mouseLeaves.next(true);
    }
    onItemMouseEnter(event, item) {
        this.menubarService.mouseLeaves.next(false);
        if (item.disabled || this.mobileActive) {
            event.preventDefault();
            return;
        }
        if (this.root) {
            if (this.activeItem || this.autoDisplay) {
                this.activeItem = item;
                this.bindDocumentClickListener();
            }
        }
        else {
            this.activeItem = item;
            this.bindDocumentClickListener();
        }
    }
    onLeafClick() {
        this.activeItem = null;
        if (this.root) {
            this.unbindDocumentClickListener();
        }
        this.leafClick.emit();
    }
    bindDocumentClickListener() {
        if (!this.documentClickListener) {
            this.documentClickListener = (event) => {
                if (this.el && !this.el.nativeElement.contains(event.target)) {
                    this.activeItem = null;
                    this.cd.markForCheck();
                    this.unbindDocumentClickListener();
                }
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
        this.mouseLeaveSubscriber.unsubscribe();
        this.unbindDocumentClickListener();
    }
}
MenubarSub.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: MenubarSub, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: MenubarService }], target: i0.ɵɵFactoryTarget.Component });
MenubarSub.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.0", type: MenubarSub, selector: "p-menubarSub", inputs: { item: "item", root: "root", autoZIndex: "autoZIndex", baseZIndex: "baseZIndex", mobileActive: "mobileActive", autoDisplay: "autoDisplay", parentActive: "parentActive" }, outputs: { leafClick: "leafClick" }, host: { classAttribute: "p-element" }, ngImport: i0, template: `
        <ul [ngClass]="{ 'p-submenu-list': !root, 'p-menubar-root-list': root }" [attr.role]="root ? 'menubar' : 'menu'">
            <ng-template ngFor let-child [ngForOf]="root ? item : item.items">
                <li *ngIf="child.separator" class="p-menu-separator" [ngClass]="{ 'p-hidden': child.visible === false }" role="separator"></li>
                <li
                    *ngIf="!child.separator"
                    #listItem
                    [ngClass]="{ 'p-menuitem': true, 'p-menuitem-active': child === activeItem, 'p-hidden': child.visible === false }"
                    [ngStyle]="child.style"
                    [class]="child.styleClass"
                    role="none"
                    pTooltip
                    [tooltipOptions]="child.tooltipOptions"
                >
                    <a
                        *ngIf="!child.routerLink"
                        [attr.href]="child.url"
                        [attr.data-automationid]="child.automationId"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        role="menuitem"
                        (click)="onItemClick($event, child)"
                        (mouseenter)="onItemMouseEnter($event, child)"
                        (mouseleave)="onItemMouseLeave($event, child)"
                        [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': child.disabled }"
                        [attr.tabindex]="child.disabled ? null : '0'"
                        [attr.aria-haspopup]="item.items != null"
                        [attr.aria-expanded]="item === activeItem"
                        pRipple
                    >
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlLabel">{{ child.label }}</span>
                        <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{ child.badge }}</span>
                        <span class="p-submenu-icon pi" *ngIf="child.items" [ngClass]="{ 'pi-angle-down': root, 'pi-angle-right': !root }"></span>
                    </a>
                    <a
                        *ngIf="child.routerLink"
                        [routerLink]="child.routerLink"
                        [attr.data-automationid]="child.automationId"
                        [queryParams]="child.queryParams"
                        [routerLinkActive]="'p-menuitem-link-active'"
                        [routerLinkActiveOptions]="child.routerLinkActiveOptions || { exact: false }"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        [attr.tabindex]="child.disabled ? null : '0'"
                        role="menuitem"
                        (click)="onItemClick($event, child)"
                        (mouseenter)="onItemMouseEnter($event, child)"
                        (mouseleave)="onItemMouseLeave($event, child)"
                        [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': child.disabled }"
                        [fragment]="child.fragment"
                        [queryParamsHandling]="child.queryParamsHandling"
                        [preserveFragment]="child.preserveFragment"
                        [skipLocationChange]="child.skipLocationChange"
                        [replaceUrl]="child.replaceUrl"
                        [state]="child.state"
                        pRipple
                    >
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlRouteLabel">{{ child.label }}</span>
                        <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{ child.badge }}</span>
                        <span class="p-submenu-icon pi" *ngIf="child.items" [ngClass]="{ 'pi-angle-down': root, 'pi-angle-right': !root }"></span>
                    </a>
                    <p-menubarSub [parentActive]="child === activeItem" [item]="child" *ngIf="child.items" [mobileActive]="mobileActive" [autoDisplay]="autoDisplay" (leafClick)="onLeafClick()"></p-menubarSub>
                </li>
            </ng-template>
        </ul>
    `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.RouterLink, selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "directive", type: i2.RouterLinkActive, selector: "[routerLinkActive]", inputs: ["routerLinkActiveOptions", "ariaCurrentWhenActive", "routerLinkActive"], outputs: ["isActiveChange"], exportAs: ["routerLinkActive"] }, { kind: "directive", type: i3.Ripple, selector: "[pRipple]" }, { kind: "directive", type: i4.Tooltip, selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "autoHide", "fitContent", "pTooltip", "tooltipDisabled", "tooltipOptions"] }, { kind: "component", type: MenubarSub, selector: "p-menubarSub", inputs: ["item", "root", "autoZIndex", "baseZIndex", "mobileActive", "autoDisplay", "parentActive"], outputs: ["leafClick"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: MenubarSub, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-menubarSub',
                    template: `
        <ul [ngClass]="{ 'p-submenu-list': !root, 'p-menubar-root-list': root }" [attr.role]="root ? 'menubar' : 'menu'">
            <ng-template ngFor let-child [ngForOf]="root ? item : item.items">
                <li *ngIf="child.separator" class="p-menu-separator" [ngClass]="{ 'p-hidden': child.visible === false }" role="separator"></li>
                <li
                    *ngIf="!child.separator"
                    #listItem
                    [ngClass]="{ 'p-menuitem': true, 'p-menuitem-active': child === activeItem, 'p-hidden': child.visible === false }"
                    [ngStyle]="child.style"
                    [class]="child.styleClass"
                    role="none"
                    pTooltip
                    [tooltipOptions]="child.tooltipOptions"
                >
                    <a
                        *ngIf="!child.routerLink"
                        [attr.href]="child.url"
                        [attr.data-automationid]="child.automationId"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        role="menuitem"
                        (click)="onItemClick($event, child)"
                        (mouseenter)="onItemMouseEnter($event, child)"
                        (mouseleave)="onItemMouseLeave($event, child)"
                        [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': child.disabled }"
                        [attr.tabindex]="child.disabled ? null : '0'"
                        [attr.aria-haspopup]="item.items != null"
                        [attr.aria-expanded]="item === activeItem"
                        pRipple
                    >
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlLabel">{{ child.label }}</span>
                        <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{ child.badge }}</span>
                        <span class="p-submenu-icon pi" *ngIf="child.items" [ngClass]="{ 'pi-angle-down': root, 'pi-angle-right': !root }"></span>
                    </a>
                    <a
                        *ngIf="child.routerLink"
                        [routerLink]="child.routerLink"
                        [attr.data-automationid]="child.automationId"
                        [queryParams]="child.queryParams"
                        [routerLinkActive]="'p-menuitem-link-active'"
                        [routerLinkActiveOptions]="child.routerLinkActiveOptions || { exact: false }"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        [attr.tabindex]="child.disabled ? null : '0'"
                        role="menuitem"
                        (click)="onItemClick($event, child)"
                        (mouseenter)="onItemMouseEnter($event, child)"
                        (mouseleave)="onItemMouseLeave($event, child)"
                        [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': child.disabled }"
                        [fragment]="child.fragment"
                        [queryParamsHandling]="child.queryParamsHandling"
                        [preserveFragment]="child.preserveFragment"
                        [skipLocationChange]="child.skipLocationChange"
                        [replaceUrl]="child.replaceUrl"
                        [state]="child.state"
                        pRipple
                    >
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlRouteLabel">{{ child.label }}</span>
                        <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{ child.badge }}</span>
                        <span class="p-submenu-icon pi" *ngIf="child.items" [ngClass]="{ 'pi-angle-down': root, 'pi-angle-right': !root }"></span>
                    </a>
                    <p-menubarSub [parentActive]="child === activeItem" [item]="child" *ngIf="child.items" [mobileActive]="mobileActive" [autoDisplay]="autoDisplay" (leafClick)="onLeafClick()"></p-menubarSub>
                </li>
            </ng-template>
        </ul>
    `,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: MenubarService }]; }, propDecorators: { item: [{
                type: Input
            }], root: [{
                type: Input
            }], autoZIndex: [{
                type: Input
            }], baseZIndex: [{
                type: Input
            }], mobileActive: [{
                type: Input
            }], autoDisplay: [{
                type: Input
            }], parentActive: [{
                type: Input
            }], leafClick: [{
                type: Output
            }] } });
export class Menubar {
    constructor(el, renderer, cd, config, menubarService) {
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.config = config;
        this.menubarService = menubarService;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.autoHideDelay = 100;
    }
    ngOnInit() {
        this.menubarService.autoHide = this.autoHide;
        this.menubarService.autoHideDelay = this.autoHideDelay;
        this.mouseLeaveSubscriber = this.menubarService.mouseLeft$.subscribe(() => this.unbindOutsideClickListener());
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'start':
                    this.startTemplate = item.template;
                    break;
                case 'end':
                    this.endTemplate = item.template;
                    break;
            }
        });
    }
    toggle(event) {
        if (this.mobileActive) {
            this.hide();
            ZIndexUtils.clear(this.rootmenu.el.nativeElement);
        }
        else {
            this.mobileActive = true;
            ZIndexUtils.set('menu', this.rootmenu.el.nativeElement, this.config.zIndex.menu);
        }
        this.bindOutsideClickListener();
        event.preventDefault();
    }
    bindOutsideClickListener() {
        if (!this.outsideClickListener) {
            this.outsideClickListener = (event) => {
                if (this.mobileActive &&
                    this.rootmenu.el.nativeElement !== event.target &&
                    !this.rootmenu.el.nativeElement.contains(event.target) &&
                    this.menubutton.nativeElement !== event.target &&
                    !this.menubutton.nativeElement.contains(event.target)) {
                    this.hide();
                }
            };
            document.addEventListener('click', this.outsideClickListener);
        }
    }
    hide() {
        this.mobileActive = false;
        this.cd.markForCheck();
        ZIndexUtils.clear(this.rootmenu.el.nativeElement);
        this.unbindOutsideClickListener();
    }
    onLeafClick() {
        this.hide();
    }
    unbindOutsideClickListener() {
        if (this.outsideClickListener) {
            document.removeEventListener('click', this.outsideClickListener);
            this.outsideClickListener = null;
        }
    }
    ngOnDestroy() {
        this.mouseLeaveSubscriber.unsubscribe();
        this.unbindOutsideClickListener();
    }
}
Menubar.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: Menubar, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i5.PrimeNGConfig }, { token: MenubarService }], target: i0.ɵɵFactoryTarget.Component });
Menubar.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.0", type: Menubar, selector: "p-menubar", inputs: { model: "model", style: "style", styleClass: "styleClass", autoZIndex: "autoZIndex", baseZIndex: "baseZIndex", autoDisplay: "autoDisplay", autoHide: "autoHide", autoHideDelay: "autoHideDelay" }, host: { classAttribute: "p-element" }, providers: [MenubarService], queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "menubutton", first: true, predicate: ["menubutton"], descendants: true }, { propertyName: "rootmenu", first: true, predicate: ["rootmenu"], descendants: true }], ngImport: i0, template: `
        <div [ngClass]="{ 'p-menubar p-component': true, 'p-menubar-mobile-active': mobileActive }" [class]="styleClass" [ngStyle]="style">
            <div class="p-menubar-start" *ngIf="startTemplate">
                <ng-container *ngTemplateOutlet="startTemplate"></ng-container>
            </div>
            <a #menubutton tabindex="0" *ngIf="model && model.length > 0" class="p-menubar-button" (click)="toggle($event)">
                <i class="pi pi-bars"></i>
            </a>
            <p-menubarSub #rootmenu [item]="model" root="root" [baseZIndex]="baseZIndex" (leafClick)="onLeafClick()" [autoZIndex]="autoZIndex" [mobileActive]="mobileActive" [autoDisplay]="autoDisplay"></p-menubarSub>
            <div class="p-menubar-end" *ngIf="endTemplate; else legacy">
                <ng-container *ngTemplateOutlet="endTemplate"></ng-container>
            </div>
            <ng-template #legacy>
                <div class="p-menubar-end">
                    <ng-content></ng-content>
                </div>
            </ng-template>
        </div>
    `, isInline: true, styles: [".p-menubar{display:flex;align-items:center}.p-menubar ul{margin:0;padding:0;list-style:none}.p-menubar .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-menubar .p-menuitem-text{line-height:1}.p-menubar .p-menuitem{position:relative}.p-menubar-root-list{display:flex;align-items:center;flex-wrap:wrap}.p-menubar-root-list>li ul{display:none;z-index:1}.p-menubar-root-list>.p-menuitem-active>p-menubarsub>.p-submenu-list{display:block}.p-menubar .p-submenu-list{display:none;position:absolute;z-index:2}.p-menubar .p-submenu-list>.p-menuitem-active>p-menubarsub>.p-submenu-list{display:block;left:100%;top:0}.p-menubar .p-submenu-list .p-menuitem-link .p-submenu-icon{margin-left:auto}.p-menubar .p-menubar-custom,.p-menubar .p-menubar-end{margin-left:auto;align-self:center}.p-menubar-button{display:none;cursor:pointer;align-items:center;justify-content:center}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: MenubarSub, selector: "p-menubarSub", inputs: ["item", "root", "autoZIndex", "baseZIndex", "mobileActive", "autoDisplay", "parentActive"], outputs: ["leafClick"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: Menubar, decorators: [{
            type: Component,
            args: [{ selector: 'p-menubar', template: `
        <div [ngClass]="{ 'p-menubar p-component': true, 'p-menubar-mobile-active': mobileActive }" [class]="styleClass" [ngStyle]="style">
            <div class="p-menubar-start" *ngIf="startTemplate">
                <ng-container *ngTemplateOutlet="startTemplate"></ng-container>
            </div>
            <a #menubutton tabindex="0" *ngIf="model && model.length > 0" class="p-menubar-button" (click)="toggle($event)">
                <i class="pi pi-bars"></i>
            </a>
            <p-menubarSub #rootmenu [item]="model" root="root" [baseZIndex]="baseZIndex" (leafClick)="onLeafClick()" [autoZIndex]="autoZIndex" [mobileActive]="mobileActive" [autoDisplay]="autoDisplay"></p-menubarSub>
            <div class="p-menubar-end" *ngIf="endTemplate; else legacy">
                <ng-container *ngTemplateOutlet="endTemplate"></ng-container>
            </div>
            <ng-template #legacy>
                <div class="p-menubar-end">
                    <ng-content></ng-content>
                </div>
            </ng-template>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, providers: [MenubarService], styles: [".p-menubar{display:flex;align-items:center}.p-menubar ul{margin:0;padding:0;list-style:none}.p-menubar .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-menubar .p-menuitem-text{line-height:1}.p-menubar .p-menuitem{position:relative}.p-menubar-root-list{display:flex;align-items:center;flex-wrap:wrap}.p-menubar-root-list>li ul{display:none;z-index:1}.p-menubar-root-list>.p-menuitem-active>p-menubarsub>.p-submenu-list{display:block}.p-menubar .p-submenu-list{display:none;position:absolute;z-index:2}.p-menubar .p-submenu-list>.p-menuitem-active>p-menubarsub>.p-submenu-list{display:block;left:100%;top:0}.p-menubar .p-submenu-list .p-menuitem-link .p-submenu-icon{margin-left:auto}.p-menubar .p-menubar-custom,.p-menubar .p-menubar-end{margin-left:auto;align-self:center}.p-menubar-button{display:none;cursor:pointer;align-items:center;justify-content:center}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i5.PrimeNGConfig }, { type: MenubarService }]; }, propDecorators: { model: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], autoZIndex: [{
                type: Input
            }], baseZIndex: [{
                type: Input
            }], autoDisplay: [{
                type: Input
            }], autoHide: [{
                type: Input
            }], autoHideDelay: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], menubutton: [{
                type: ViewChild,
                args: ['menubutton']
            }], rootmenu: [{
                type: ViewChild,
                args: ['rootmenu']
            }] } });
export class MenubarModule {
}
MenubarModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: MenubarModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
MenubarModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.1.0", ngImport: i0, type: MenubarModule, declarations: [Menubar, MenubarSub], imports: [CommonModule, RouterModule, RippleModule, TooltipModule, SharedModule], exports: [Menubar, RouterModule, TooltipModule, SharedModule] });
MenubarModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: MenubarModule, imports: [CommonModule, RouterModule, RippleModule, TooltipModule, SharedModule, RouterModule, TooltipModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: MenubarModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule, RippleModule, TooltipModule, SharedModule],
                    exports: [Menubar, RouterModule, TooltipModule, SharedModule],
                    declarations: [Menubar, MenubarSub]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVudWJhci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy9tZW51YmFyL21lbnViYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUVILHVCQUF1QixFQUV2QixTQUFTLEVBQ1QsZUFBZSxFQUVmLFlBQVksRUFDWixVQUFVLEVBQ1YsS0FBSyxFQUNMLFFBQVEsRUFHUixNQUFNLEVBSU4sU0FBUyxFQUNULGlCQUFpQixFQUNwQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQTJCLGFBQWEsRUFBRSxZQUFZLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDbkYsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUM5QyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDaEQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBZ0IsTUFBTSxNQUFNLENBQUM7Ozs7Ozs7QUFHekUsTUFBTSxPQUFPLGNBQWM7SUFEM0I7UUFNYSxnQkFBVyxHQUFHLElBQUksT0FBTyxFQUFXLENBQUM7UUFFckMsZUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUN2QyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxFQUM1QyxNQUFNLENBQUMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksU0FBUyxDQUFDLENBQ3BELENBQUM7S0FDTDs7MkdBWFksY0FBYzsrR0FBZCxjQUFjOzJGQUFkLGNBQWM7a0JBRDFCLFVBQVU7O0FBNkZYLE1BQU0sT0FBTyxVQUFVO0lBb0NuQixZQUFtQixFQUFjLEVBQVMsUUFBbUIsRUFBVSxFQUFxQixFQUFVLGNBQThCO1FBQWpILE9BQUUsR0FBRixFQUFFLENBQVk7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQVUsT0FBRSxHQUFGLEVBQUUsQ0FBbUI7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUEvQjNILGVBQVUsR0FBWSxJQUFJLENBQUM7UUFFM0IsZUFBVSxHQUFXLENBQUMsQ0FBQztRQWlCdEIsY0FBUyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBTTVELG9CQUFlLEdBQVksS0FBSyxDQUFDO0lBTXNHLENBQUM7SUF2QnhJLElBQWEsWUFBWTtRQUNyQixPQUFPLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDOUIsQ0FBQztJQUNELElBQUksWUFBWSxDQUFDLEtBQUs7UUFDbEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDWixJQUFJLENBQUMsYUFBYSxHQUFHLEtBQUssQ0FBQztZQUUzQixJQUFJLENBQUMsS0FBSztnQkFBRSxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztTQUN0QztJQUNMLENBQUM7SUFnQkQsUUFBUTtRQUNKLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ3RFLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDdkIsSUFBSSxDQUFDLDJCQUEyQixFQUFFLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJO1FBQ25CLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNmLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixPQUFPO1NBQ1Y7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDL0IsS0FBSyxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQzFCO1FBRUQsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2QsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDVCxhQUFhLEVBQUUsS0FBSztnQkFDcEIsSUFBSSxFQUFFLElBQUk7YUFDYixDQUFDLENBQUM7U0FDTjtRQUVELElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNaLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLEtBQUssSUFBSSxDQUFDLFVBQVUsRUFBRTtnQkFDN0MsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQywyQkFBMkIsRUFBRSxDQUFDO2FBQ3RDO2lCQUFNO2dCQUNILElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO2dCQUN2QixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7b0JBQ1gsSUFBSSxDQUFDLHlCQUF5QixFQUFFLENBQUM7aUJBQ3BDO2FBQ0o7U0FDSjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ2IsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3RCO0lBQ0wsQ0FBQztJQUVELGdCQUFnQixDQUFDLEtBQUssRUFBRSxJQUFJO1FBQ3hCLElBQUksQ0FBQyxjQUFjLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLElBQUk7UUFDeEIsSUFBSSxDQUFDLGNBQWMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTVDLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3BDLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztZQUN2QixPQUFPO1NBQ1Y7UUFFRCxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDWCxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDckMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7Z0JBQ3ZCLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO2FBQ3BDO1NBQ0o7YUFBTTtZQUNILElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyx5QkFBeUIsRUFBRSxDQUFDO1NBQ3BDO0lBQ0wsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztRQUN2QixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDWCxJQUFJLENBQUMsMkJBQTJCLEVBQUUsQ0FBQztTQUN0QztRQUVELElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELHlCQUF5QjtRQUNyQixJQUFJLENBQUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFO1lBQzdCLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUNuQyxJQUFJLElBQUksQ0FBQyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO29CQUMxRCxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztvQkFDdkIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQztvQkFDdkIsSUFBSSxDQUFDLDJCQUEyQixFQUFFLENBQUM7aUJBQ3RDO1lBQ0wsQ0FBQyxDQUFDO1lBRUYsUUFBUSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztTQUNsRTtJQUNMLENBQUM7SUFFRCwyQkFBMkI7UUFDdkIsSUFBSSxJQUFJLENBQUMscUJBQXFCLEVBQUU7WUFDNUIsUUFBUSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztZQUNsRSxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO1NBQ3JDO0lBQ0wsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsb0JBQW9CLENBQUMsV0FBVyxFQUFFLENBQUM7UUFDeEMsSUFBSSxDQUFDLDJCQUEyQixFQUFFLENBQUM7SUFDdkMsQ0FBQzs7dUdBeElRLFVBQVU7MkZBQVYsVUFBVSxvVEE3RVQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBdUVULGd5Q0FNUSxVQUFVOzJGQUFWLFVBQVU7a0JBL0V0QixTQUFTO21CQUFDO29CQUNQLFFBQVEsRUFBRSxjQUFjO29CQUN4QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBdUVUO29CQUNELGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO29CQUNyQyxJQUFJLEVBQUU7d0JBQ0YsS0FBSyxFQUFFLFdBQVc7cUJBQ3JCO2lCQUNKO21MQUVZLElBQUk7c0JBQVosS0FBSztnQkFFRyxJQUFJO3NCQUFaLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFRyxVQUFVO3NCQUFsQixLQUFLO2dCQUVHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBRUcsV0FBVztzQkFBbkIsS0FBSztnQkFFTyxZQUFZO3NCQUF4QixLQUFLO2dCQVdJLFNBQVM7c0JBQWxCLE1BQU07O0FBZ0pYLE1BQU0sT0FBTyxPQUFPO0lBaUNoQixZQUFtQixFQUFjLEVBQVMsUUFBbUIsRUFBUyxFQUFxQixFQUFTLE1BQXFCLEVBQVUsY0FBOEI7UUFBOUksT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFTLGFBQVEsR0FBUixRQUFRLENBQVc7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUFTLFdBQU0sR0FBTixNQUFNLENBQWU7UUFBVSxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUExQnhKLGVBQVUsR0FBWSxJQUFJLENBQUM7UUFFM0IsZUFBVSxHQUFXLENBQUMsQ0FBQztRQU12QixrQkFBYSxHQUFXLEdBQUcsQ0FBQztJQWtCK0gsQ0FBQztJQUVySyxRQUFRO1FBQ0osSUFBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUM3QyxJQUFJLENBQUMsY0FBYyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDO1FBQ3ZELElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUMsQ0FBQztJQUNsSCxDQUFDO0lBRUQsa0JBQWtCO1FBQ2QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM1QixRQUFRLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFBRTtnQkFDcEIsS0FBSyxPQUFPO29CQUNSLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDbkMsTUFBTTtnQkFFVixLQUFLLEtBQUs7b0JBQ04sSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO29CQUNqQyxNQUFNO2FBQ2I7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxNQUFNLENBQUMsS0FBSztRQUNSLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNuQixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDWixXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1NBQ3JEO2FBQU07WUFDSCxJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztZQUN6QixXQUFXLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDcEY7UUFFRCxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUNoQyxLQUFLLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELHdCQUF3QjtRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFO1lBQzVCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUNsQyxJQUNJLElBQUksQ0FBQyxZQUFZO29CQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxhQUFhLEtBQUssS0FBSyxDQUFDLE1BQU07b0JBQy9DLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO29CQUN0RCxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsS0FBSyxLQUFLLENBQUMsTUFBTTtvQkFDOUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUN2RDtvQkFDRSxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQ2Y7WUFDTCxDQUFDLENBQUM7WUFDRixRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1NBQ2pFO0lBQ0wsQ0FBQztJQUVELElBQUk7UUFDQSxJQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztRQUMxQixJQUFJLENBQUMsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3ZCLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLDBCQUEwQixFQUFFLENBQUM7SUFDdEMsQ0FBQztJQUVELFdBQVc7UUFDUCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDaEIsQ0FBQztJQUVELDBCQUEwQjtRQUN0QixJQUFJLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtZQUMzQixRQUFRLENBQUMsbUJBQW1CLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQ2pFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7U0FDcEM7SUFDTCxDQUFDO0lBRUQsV0FBVztRQUNQLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUN4QyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQztJQUN0QyxDQUFDOztvR0ExR1EsT0FBTzt3RkFBUCxPQUFPLHVSQUZMLENBQUMsY0FBYyxDQUFDLG9EQW1CVixhQUFhLDhOQTVDcEI7Ozs7Ozs7Ozs7Ozs7Ozs7OztLQWtCVCxnN0NBL0pRLFVBQVU7MkZBd0tWLE9BQU87a0JBN0JuQixTQUFTOytCQUNJLFdBQVcsWUFDWDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBa0JULG1CQUNnQix1QkFBdUIsQ0FBQyxNQUFNLGlCQUNoQyxpQkFBaUIsQ0FBQyxJQUFJLFFBRS9CO3dCQUNGLEtBQUssRUFBRSxXQUFXO3FCQUNyQixhQUNVLENBQUMsY0FBYyxDQUFDOytNQUdsQixLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsS0FBSztzQkFBYixLQUFLO2dCQUVHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFRyxVQUFVO3NCQUFsQixLQUFLO2dCQUVHLFdBQVc7c0JBQW5CLEtBQUs7Z0JBRUcsUUFBUTtzQkFBaEIsS0FBSztnQkFFRyxhQUFhO3NCQUFyQixLQUFLO2dCQUUwQixTQUFTO3NCQUF4QyxlQUFlO3VCQUFDLGFBQWE7Z0JBRUwsVUFBVTtzQkFBbEMsU0FBUzt1QkFBQyxZQUFZO2dCQUVBLFFBQVE7c0JBQTlCLFNBQVM7dUJBQUMsVUFBVTs7QUE2RnpCLE1BQU0sT0FBTyxhQUFhOzswR0FBYixhQUFhOzJHQUFiLGFBQWEsaUJBbEhiLE9BQU8sRUF4S1AsVUFBVSxhQXNSVCxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsWUFBWSxhQTlHdEUsT0FBTyxFQStHRyxZQUFZLEVBQUUsYUFBYSxFQUFFLFlBQVk7MkdBR25ELGFBQWEsWUFKWixZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUM1RCxZQUFZLEVBQUUsYUFBYSxFQUFFLFlBQVk7MkZBR25ELGFBQWE7a0JBTHpCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksRUFBRSxZQUFZLEVBQUUsYUFBYSxFQUFFLFlBQVksQ0FBQztvQkFDaEYsT0FBTyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQVksRUFBRSxhQUFhLEVBQUUsWUFBWSxDQUFDO29CQUM3RCxZQUFZLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBVSxDQUFDO2lCQUN0QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBDb21wb25lbnQsXG4gICAgQ29udGVudENoaWxkcmVuLFxuICAgIEVsZW1lbnRSZWYsXG4gICAgRXZlbnRFbWl0dGVyLFxuICAgIEluamVjdGFibGUsXG4gICAgSW5wdXQsXG4gICAgTmdNb2R1bGUsXG4gICAgT25EZXN0cm95LFxuICAgIE9uSW5pdCxcbiAgICBPdXRwdXQsXG4gICAgUXVlcnlMaXN0LFxuICAgIFJlbmRlcmVyMixcbiAgICBUZW1wbGF0ZVJlZixcbiAgICBWaWV3Q2hpbGQsXG4gICAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgWkluZGV4VXRpbHMgfSBmcm9tICdwcmltZW5nL3V0aWxzJztcbmltcG9ydCB7IE1lbnVJdGVtLCBQcmltZU5HQ29uZmlnLCBQcmltZVRlbXBsYXRlLCBTaGFyZWRNb2R1bGUgfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQgeyBSb3V0ZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgUmlwcGxlTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9yaXBwbGUnO1xuaW1wb3J0IHsgVG9vbHRpcE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvdG9vbHRpcCc7XG5pbXBvcnQgeyBkZWJvdW5jZSwgZmlsdGVyLCBpbnRlcnZhbCwgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBNZW51YmFyU2VydmljZSB7XG4gICAgYXV0b0hpZGU6IGJvb2xlYW47XG5cbiAgICBhdXRvSGlkZURlbGF5OiBudW1iZXI7XG5cbiAgICByZWFkb25seSBtb3VzZUxlYXZlcyA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG5cbiAgICByZWFkb25seSBtb3VzZUxlZnQkID0gdGhpcy5tb3VzZUxlYXZlcy5waXBlKFxuICAgICAgICBkZWJvdW5jZSgoKSA9PiBpbnRlcnZhbCh0aGlzLmF1dG9IaWRlRGVsYXkpKSxcbiAgICAgICAgZmlsdGVyKChtb3VzZUxlZnQpID0+IHRoaXMuYXV0b0hpZGUgJiYgbW91c2VMZWZ0KVxuICAgICk7XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1tZW51YmFyU3ViJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8dWwgW25nQ2xhc3NdPVwieyAncC1zdWJtZW51LWxpc3QnOiAhcm9vdCwgJ3AtbWVudWJhci1yb290LWxpc3QnOiByb290IH1cIiBbYXR0ci5yb2xlXT1cInJvb3QgPyAnbWVudWJhcicgOiAnbWVudSdcIj5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBuZ0ZvciBsZXQtY2hpbGQgW25nRm9yT2ZdPVwicm9vdCA/IGl0ZW0gOiBpdGVtLml0ZW1zXCI+XG4gICAgICAgICAgICAgICAgPGxpICpuZ0lmPVwiY2hpbGQuc2VwYXJhdG9yXCIgY2xhc3M9XCJwLW1lbnUtc2VwYXJhdG9yXCIgW25nQ2xhc3NdPVwieyAncC1oaWRkZW4nOiBjaGlsZC52aXNpYmxlID09PSBmYWxzZSB9XCIgcm9sZT1cInNlcGFyYXRvclwiPjwvbGk+XG4gICAgICAgICAgICAgICAgPGxpXG4gICAgICAgICAgICAgICAgICAgICpuZ0lmPVwiIWNoaWxkLnNlcGFyYXRvclwiXG4gICAgICAgICAgICAgICAgICAgICNsaXN0SXRlbVxuICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdwLW1lbnVpdGVtJzogdHJ1ZSwgJ3AtbWVudWl0ZW0tYWN0aXZlJzogY2hpbGQgPT09IGFjdGl2ZUl0ZW0sICdwLWhpZGRlbic6IGNoaWxkLnZpc2libGUgPT09IGZhbHNlIH1cIlxuICAgICAgICAgICAgICAgICAgICBbbmdTdHlsZV09XCJjaGlsZC5zdHlsZVwiXG4gICAgICAgICAgICAgICAgICAgIFtjbGFzc109XCJjaGlsZC5zdHlsZUNsYXNzXCJcbiAgICAgICAgICAgICAgICAgICAgcm9sZT1cIm5vbmVcIlxuICAgICAgICAgICAgICAgICAgICBwVG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICBbdG9vbHRpcE9wdGlvbnNdPVwiY2hpbGQudG9vbHRpcE9wdGlvbnNcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICAgICAgICAgICpuZ0lmPVwiIWNoaWxkLnJvdXRlckxpbmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuaHJlZl09XCJjaGlsZC51cmxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuZGF0YS1hdXRvbWF0aW9uaWRdPVwiY2hpbGQuYXV0b21hdGlvbklkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFt0YXJnZXRdPVwiY2hpbGQudGFyZ2V0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLnRpdGxlXT1cImNoaWxkLnRpdGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmlkXT1cImNoaWxkLmlkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU9XCJtZW51aXRlbVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAoY2xpY2spPVwib25JdGVtQ2xpY2soJGV2ZW50LCBjaGlsZClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKG1vdXNlZW50ZXIpPVwib25JdGVtTW91c2VFbnRlcigkZXZlbnQsIGNoaWxkKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAobW91c2VsZWF2ZSk9XCJvbkl0ZW1Nb3VzZUxlYXZlKCRldmVudCwgY2hpbGQpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3AtbWVudWl0ZW0tbGluayc6IHRydWUsICdwLWRpc2FibGVkJzogY2hpbGQuZGlzYWJsZWQgfVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci50YWJpbmRleF09XCJjaGlsZC5kaXNhYmxlZCA/IG51bGwgOiAnMCdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1oYXNwb3B1cF09XCJpdGVtLml0ZW1zICE9IG51bGxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJpdGVtID09PSBhY3RpdmVJdGVtXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBSaXBwbGVcbiAgICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLWljb25cIiAqbmdJZj1cImNoaWxkLmljb25cIiBbbmdDbGFzc109XCJjaGlsZC5pY29uXCIgW25nU3R5bGVdPVwiY2hpbGQuaWNvblN0eWxlXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLXRleHRcIiAqbmdJZj1cImNoaWxkLmVzY2FwZSAhPT0gZmFsc2U7IGVsc2UgaHRtbExhYmVsXCI+e3sgY2hpbGQubGFiZWwgfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2h0bWxMYWJlbD48c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiIFtpbm5lckhUTUxdPVwiY2hpbGQubGFiZWxcIj48L3NwYW4+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS1iYWRnZVwiICpuZ0lmPVwiY2hpbGQuYmFkZ2VcIiBbbmdDbGFzc109XCJjaGlsZC5iYWRnZVN0eWxlQ2xhc3NcIj57eyBjaGlsZC5iYWRnZSB9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1zdWJtZW51LWljb24gcGlcIiAqbmdJZj1cImNoaWxkLml0ZW1zXCIgW25nQ2xhc3NdPVwieyAncGktYW5nbGUtZG93bic6IHJvb3QsICdwaS1hbmdsZS1yaWdodCc6ICFyb290IH1cIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICAgICAgICAgICpuZ0lmPVwiY2hpbGQucm91dGVyTGlua1wiXG4gICAgICAgICAgICAgICAgICAgICAgICBbcm91dGVyTGlua109XCJjaGlsZC5yb3V0ZXJMaW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmRhdGEtYXV0b21hdGlvbmlkXT1cImNoaWxkLmF1dG9tYXRpb25JZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbcXVlcnlQYXJhbXNdPVwiY2hpbGQucXVlcnlQYXJhbXNcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW3JvdXRlckxpbmtBY3RpdmVdPVwiJ3AtbWVudWl0ZW0tbGluay1hY3RpdmUnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtyb3V0ZXJMaW5rQWN0aXZlT3B0aW9uc109XCJjaGlsZC5yb3V0ZXJMaW5rQWN0aXZlT3B0aW9ucyB8fCB7IGV4YWN0OiBmYWxzZSB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFt0YXJnZXRdPVwiY2hpbGQudGFyZ2V0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLnRpdGxlXT1cImNoaWxkLnRpdGxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmlkXT1cImNoaWxkLmlkXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLnRhYmluZGV4XT1cImNoaWxkLmRpc2FibGVkID8gbnVsbCA6ICcwJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlPVwibWVudWl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cIm9uSXRlbUNsaWNrKCRldmVudCwgY2hpbGQpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIChtb3VzZWVudGVyKT1cIm9uSXRlbU1vdXNlRW50ZXIoJGV2ZW50LCBjaGlsZClcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKG1vdXNlbGVhdmUpPVwib25JdGVtTW91c2VMZWF2ZSgkZXZlbnQsIGNoaWxkKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdwLW1lbnVpdGVtLWxpbmsnOiB0cnVlLCAncC1kaXNhYmxlZCc6IGNoaWxkLmRpc2FibGVkIH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2ZyYWdtZW50XT1cImNoaWxkLmZyYWdtZW50XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtxdWVyeVBhcmFtc0hhbmRsaW5nXT1cImNoaWxkLnF1ZXJ5UGFyYW1zSGFuZGxpbmdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW3ByZXNlcnZlRnJhZ21lbnRdPVwiY2hpbGQucHJlc2VydmVGcmFnbWVudFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbc2tpcExvY2F0aW9uQ2hhbmdlXT1cImNoaWxkLnNraXBMb2NhdGlvbkNoYW5nZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbcmVwbGFjZVVybF09XCJjaGlsZC5yZXBsYWNlVXJsXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtzdGF0ZV09XCJjaGlsZC5zdGF0ZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBwUmlwcGxlXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS1pY29uXCIgKm5nSWY9XCJjaGlsZC5pY29uXCIgW25nQ2xhc3NdPVwiY2hpbGQuaWNvblwiIFtuZ1N0eWxlXT1cImNoaWxkLmljb25TdHlsZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS10ZXh0XCIgKm5nSWY9XCJjaGlsZC5lc2NhcGUgIT09IGZhbHNlOyBlbHNlIGh0bWxSb3V0ZUxhYmVsXCI+e3sgY2hpbGQubGFiZWwgfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2h0bWxSb3V0ZUxhYmVsPjxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS10ZXh0XCIgW2lubmVySFRNTF09XCJjaGlsZC5sYWJlbFwiPjwvc3Bhbj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLWJhZGdlXCIgKm5nSWY9XCJjaGlsZC5iYWRnZVwiIFtuZ0NsYXNzXT1cImNoaWxkLmJhZGdlU3R5bGVDbGFzc1wiPnt7IGNoaWxkLmJhZGdlIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJwLXN1Ym1lbnUtaWNvbiBwaVwiICpuZ0lmPVwiY2hpbGQuaXRlbXNcIiBbbmdDbGFzc109XCJ7ICdwaS1hbmdsZS1kb3duJzogcm9vdCwgJ3BpLWFuZ2xlLXJpZ2h0JzogIXJvb3QgfVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8cC1tZW51YmFyU3ViIFtwYXJlbnRBY3RpdmVdPVwiY2hpbGQgPT09IGFjdGl2ZUl0ZW1cIiBbaXRlbV09XCJjaGlsZFwiICpuZ0lmPVwiY2hpbGQuaXRlbXNcIiBbbW9iaWxlQWN0aXZlXT1cIm1vYmlsZUFjdGl2ZVwiIFthdXRvRGlzcGxheV09XCJhdXRvRGlzcGxheVwiIChsZWFmQ2xpY2spPVwib25MZWFmQ2xpY2soKVwiPjwvcC1tZW51YmFyU3ViPlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICA8L3VsPlxuICAgIGAsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgTWVudWJhclN1YiBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSBpdGVtOiBNZW51SXRlbTtcblxuICAgIEBJbnB1dCgpIHJvb3Q6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBhdXRvWkluZGV4OiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIGJhc2VaSW5kZXg6IG51bWJlciA9IDA7XG5cbiAgICBASW5wdXQoKSBtb2JpbGVBY3RpdmU6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBhdXRvRGlzcGxheTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGdldCBwYXJlbnRBY3RpdmUoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnRBY3RpdmU7XG4gICAgfVxuICAgIHNldCBwYXJlbnRBY3RpdmUodmFsdWUpIHtcbiAgICAgICAgaWYgKCF0aGlzLnJvb3QpIHtcbiAgICAgICAgICAgIHRoaXMuX3BhcmVudEFjdGl2ZSA9IHZhbHVlO1xuXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSB0aGlzLmFjdGl2ZUl0ZW0gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQE91dHB1dCgpIGxlYWZDbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBfcGFyZW50QWN0aXZlOiBib29sZWFuO1xuXG4gICAgZG9jdW1lbnRDbGlja0xpc3RlbmVyOiBhbnk7XG5cbiAgICBtZW51SG92ZXJBY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGFjdGl2ZUl0ZW06IGFueTtcblxuICAgIG1vdXNlTGVhdmVTdWJzY3JpYmVyOiBTdWJzY3JpcHRpb247XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHJpdmF0ZSBtZW51YmFyU2VydmljZTogTWVudWJhclNlcnZpY2UpIHt9XG5cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgdGhpcy5tb3VzZUxlYXZlU3Vic2NyaWJlciA9IHRoaXMubWVudWJhclNlcnZpY2UubW91c2VMZWZ0JC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVJdGVtID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkl0ZW1DbGljayhldmVudCwgaXRlbSkge1xuICAgICAgICBpZiAoaXRlbS5kaXNhYmxlZCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXRlbS51cmwgJiYgIWl0ZW0ucm91dGVyTGluaykge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpdGVtLmNvbW1hbmQpIHtcbiAgICAgICAgICAgIGl0ZW0uY29tbWFuZCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgaXRlbTogaXRlbVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbS5pdGVtcykge1xuICAgICAgICAgICAgaWYgKHRoaXMuYWN0aXZlSXRlbSAmJiBpdGVtID09PSB0aGlzLmFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZUl0ZW0gPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlSXRlbSA9IGl0ZW07XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucm9vdCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWl0ZW0uaXRlbXMpIHtcbiAgICAgICAgICAgIHRoaXMub25MZWFmQ2xpY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG9uSXRlbU1vdXNlTGVhdmUoZXZlbnQsIGl0ZW0pIHtcbiAgICAgICAgdGhpcy5tZW51YmFyU2VydmljZS5tb3VzZUxlYXZlcy5uZXh0KHRydWUpO1xuICAgIH1cblxuICAgIG9uSXRlbU1vdXNlRW50ZXIoZXZlbnQsIGl0ZW0pIHtcbiAgICAgICAgdGhpcy5tZW51YmFyU2VydmljZS5tb3VzZUxlYXZlcy5uZXh0KGZhbHNlKTtcblxuICAgICAgICBpZiAoaXRlbS5kaXNhYmxlZCB8fCB0aGlzLm1vYmlsZUFjdGl2ZSkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLnJvb3QpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFjdGl2ZUl0ZW0gfHwgdGhpcy5hdXRvRGlzcGxheSkge1xuICAgICAgICAgICAgICAgIHRoaXMuYWN0aXZlSXRlbSA9IGl0ZW07XG4gICAgICAgICAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2ZUl0ZW0gPSBpdGVtO1xuICAgICAgICAgICAgdGhpcy5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbkxlYWZDbGljaygpIHtcbiAgICAgICAgdGhpcy5hY3RpdmVJdGVtID0gbnVsbDtcbiAgICAgICAgaWYgKHRoaXMucm9vdCkge1xuICAgICAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGVhZkNsaWNrLmVtaXQoKTtcbiAgICB9XG5cbiAgICBiaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmVsICYmICF0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFjdGl2ZUl0ZW0gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVuYmluZERvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kRG9jdW1lbnRDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMubW91c2VMZWF2ZVN1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudENsaWNrTGlzdGVuZXIoKTtcbiAgICB9XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1tZW51YmFyJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2IFtuZ0NsYXNzXT1cInsgJ3AtbWVudWJhciBwLWNvbXBvbmVudCc6IHRydWUsICdwLW1lbnViYXItbW9iaWxlLWFjdGl2ZSc6IG1vYmlsZUFjdGl2ZSB9XCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIiBbbmdTdHlsZV09XCJzdHlsZVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtbWVudWJhci1zdGFydFwiICpuZ0lmPVwic3RhcnRUZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJzdGFydFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxhICNtZW51YnV0dG9uIHRhYmluZGV4PVwiMFwiICpuZ0lmPVwibW9kZWwgJiYgbW9kZWwubGVuZ3RoID4gMFwiIGNsYXNzPVwicC1tZW51YmFyLWJ1dHRvblwiIChjbGljayk9XCJ0b2dnbGUoJGV2ZW50KVwiPlxuICAgICAgICAgICAgICAgIDxpIGNsYXNzPVwicGkgcGktYmFyc1wiPjwvaT5cbiAgICAgICAgICAgIDwvYT5cbiAgICAgICAgICAgIDxwLW1lbnViYXJTdWIgI3Jvb3RtZW51IFtpdGVtXT1cIm1vZGVsXCIgcm9vdD1cInJvb3RcIiBbYmFzZVpJbmRleF09XCJiYXNlWkluZGV4XCIgKGxlYWZDbGljayk9XCJvbkxlYWZDbGljaygpXCIgW2F1dG9aSW5kZXhdPVwiYXV0b1pJbmRleFwiIFttb2JpbGVBY3RpdmVdPVwibW9iaWxlQWN0aXZlXCIgW2F1dG9EaXNwbGF5XT1cImF1dG9EaXNwbGF5XCI+PC9wLW1lbnViYXJTdWI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC1tZW51YmFyLWVuZFwiICpuZ0lmPVwiZW5kVGVtcGxhdGU7IGVsc2UgbGVnYWN5XCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImVuZFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjbGVnYWN5PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLW1lbnViYXItZW5kXCI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9tZW51YmFyLmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfSxcbiAgICBwcm92aWRlcnM6IFtNZW51YmFyU2VydmljZV1cbn0pXG5leHBvcnQgY2xhc3MgTWVudWJhciBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSwgT25Jbml0IHtcbiAgICBASW5wdXQoKSBtb2RlbDogTWVudUl0ZW1bXTtcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBhdXRvWkluZGV4OiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIGJhc2VaSW5kZXg6IG51bWJlciA9IDA7XG5cbiAgICBASW5wdXQoKSBhdXRvRGlzcGxheTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGF1dG9IaWRlOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgYXV0b0hpZGVEZWxheTogbnVtYmVyID0gMTAwO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihQcmltZVRlbXBsYXRlKSB0ZW1wbGF0ZXM6IFF1ZXJ5TGlzdDxhbnk+O1xuXG4gICAgQFZpZXdDaGlsZCgnbWVudWJ1dHRvbicpIG1lbnVidXR0b246IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdyb290bWVudScpIHJvb3RtZW51OiBNZW51YmFyU3ViO1xuXG4gICAgc3RhcnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIGVuZFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgbW9iaWxlQWN0aXZlOiBib29sZWFuO1xuXG4gICAgb3V0c2lkZUNsaWNrTGlzdGVuZXI6IGFueTtcblxuICAgIG1vdXNlTGVhdmVTdWJzY3JpYmVyOiBTdWJzY3JpcHRpb247XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyByZW5kZXJlcjogUmVuZGVyZXIyLCBwdWJsaWMgY2Q6IENoYW5nZURldGVjdG9yUmVmLCBwdWJsaWMgY29uZmlnOiBQcmltZU5HQ29uZmlnLCBwcml2YXRlIG1lbnViYXJTZXJ2aWNlOiBNZW51YmFyU2VydmljZSkge31cblxuICAgIG5nT25Jbml0KCk6IHZvaWQge1xuICAgICAgICB0aGlzLm1lbnViYXJTZXJ2aWNlLmF1dG9IaWRlID0gdGhpcy5hdXRvSGlkZTtcbiAgICAgICAgdGhpcy5tZW51YmFyU2VydmljZS5hdXRvSGlkZURlbGF5ID0gdGhpcy5hdXRvSGlkZURlbGF5O1xuICAgICAgICB0aGlzLm1vdXNlTGVhdmVTdWJzY3JpYmVyID0gdGhpcy5tZW51YmFyU2VydmljZS5tb3VzZUxlZnQkLnN1YnNjcmliZSgoKSA9PiB0aGlzLnVuYmluZE91dHNpZGVDbGlja0xpc3RlbmVyKCkpO1xuICAgIH1cblxuICAgIG5nQWZ0ZXJDb250ZW50SW5pdCgpIHtcbiAgICAgICAgdGhpcy50ZW1wbGF0ZXMuZm9yRWFjaCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgc3dpdGNoIChpdGVtLmdldFR5cGUoKSkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3N0YXJ0JzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zdGFydFRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdlbmQnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVuZFRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHRvZ2dsZShldmVudCkge1xuICAgICAgICBpZiAodGhpcy5tb2JpbGVBY3RpdmUpIHtcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgWkluZGV4VXRpbHMuY2xlYXIodGhpcy5yb290bWVudS5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMubW9iaWxlQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgIFpJbmRleFV0aWxzLnNldCgnbWVudScsIHRoaXMucm9vdG1lbnUuZWwubmF0aXZlRWxlbWVudCwgdGhpcy5jb25maWcuekluZGV4Lm1lbnUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5iaW5kT3V0c2lkZUNsaWNrTGlzdGVuZXIoKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBiaW5kT3V0c2lkZUNsaWNrTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy5vdXRzaWRlQ2xpY2tMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5vdXRzaWRlQ2xpY2tMaXN0ZW5lciA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5tb2JpbGVBY3RpdmUgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yb290bWVudS5lbC5uYXRpdmVFbGVtZW50ICE9PSBldmVudC50YXJnZXQgJiZcbiAgICAgICAgICAgICAgICAgICAgIXRoaXMucm9vdG1lbnUuZWwubmF0aXZlRWxlbWVudC5jb250YWlucyhldmVudC50YXJnZXQpICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubWVudWJ1dHRvbi5uYXRpdmVFbGVtZW50ICE9PSBldmVudC50YXJnZXQgJiZcbiAgICAgICAgICAgICAgICAgICAgIXRoaXMubWVudWJ1dHRvbi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldClcbiAgICAgICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdGhpcy5vdXRzaWRlQ2xpY2tMaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLm1vYmlsZUFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICBaSW5kZXhVdGlscy5jbGVhcih0aGlzLnJvb3RtZW51LmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB0aGlzLnVuYmluZE91dHNpZGVDbGlja0xpc3RlbmVyKCk7XG4gICAgfVxuXG4gICAgb25MZWFmQ2xpY2soKSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cblxuICAgIHVuYmluZE91dHNpZGVDbGlja0xpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5vdXRzaWRlQ2xpY2tMaXN0ZW5lcikge1xuICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLm91dHNpZGVDbGlja0xpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMub3V0c2lkZUNsaWNrTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMubW91c2VMZWF2ZVN1YnNjcmliZXIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgdGhpcy51bmJpbmRPdXRzaWRlQ2xpY2tMaXN0ZW5lcigpO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlLCBSb3V0ZXJNb2R1bGUsIFJpcHBsZU1vZHVsZSwgVG9vbHRpcE1vZHVsZSwgU2hhcmVkTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbTWVudWJhciwgUm91dGVyTW9kdWxlLCBUb29sdGlwTW9kdWxlLCBTaGFyZWRNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW01lbnViYXIsIE1lbnViYXJTdWJdXG59KVxuZXhwb3J0IGNsYXNzIE1lbnViYXJNb2R1bGUge31cbiJdfQ==