import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Inject, Input, NgModule, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContextMenuService } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { ZIndexUtils } from 'primeng/utils';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
import * as i3 from "primeng/ripple";
import * as i4 from "primeng/tooltip";
import * as i5 from "primeng/api";
export class ContextMenuSub {
    constructor(contextMenu) {
        this.leafClick = new EventEmitter();
        this.contextMenu = contextMenu;
    }
    ngOnInit() {
        this.activeItemKeyChangeSubscription = this.contextMenu.contextMenuService.activeItemKeyChange$.pipe(takeUntil(this.contextMenu.ngDestroy$)).subscribe((activeItemKey) => {
            this.activeItemKey = activeItemKey;
            if (this.isActive(this.parentItemKey) && DomHandler.hasClass(this.sublistViewChild.nativeElement, 'p-submenu-list-active')) {
                this.contextMenu.positionSubmenu(this.sublistViewChild.nativeElement);
            }
            this.contextMenu.cd.markForCheck();
        });
    }
    onItemMouseEnter(event, item, key) {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
        if (item.disabled) {
            this.activeItemKey = null;
            return;
        }
        if (item.items) {
            let childSublist = DomHandler.findSingle(event.currentTarget, '.p-submenu-list');
            DomHandler.addClass(childSublist, 'p-submenu-list-active');
        }
        this.contextMenu.contextMenuService.changeKey(key);
    }
    onItemMouseLeave(event, item) {
        if (item.disabled) {
            return;
        }
        if (this.contextMenu.el.nativeElement.contains(event.toElement)) {
            if (item.items) {
                this.contextMenu.removeActiveFromSubLists(event.currentTarget);
            }
            if (!this.root) {
                this.contextMenu.contextMenuService.changeKey(this.parentItemKey);
            }
        }
    }
    onItemClick(event, item, menuitem, key) {
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
            let childSublist = DomHandler.findSingle(menuitem, '.p-submenu-list');
            if (childSublist) {
                if (this.isActive(key) && DomHandler.hasClass(childSublist, 'p-submenu-list-active')) {
                    this.contextMenu.removeActiveFromSubLists(menuitem);
                }
                else {
                    DomHandler.addClass(childSublist, 'p-submenu-list-active');
                }
                this.contextMenu.contextMenuService.changeKey(key);
            }
        }
        if (!item.items) {
            this.onLeafClick();
        }
    }
    onLeafClick() {
        if (this.root) {
            this.contextMenu.hide();
        }
        this.leafClick.emit();
    }
    getKey(index) {
        return this.root ? String(index) : this.parentItemKey + '_' + index;
    }
    isActive(key) {
        return this.activeItemKey && (this.activeItemKey.startsWith(key + '_') || this.activeItemKey === key);
    }
}
ContextMenuSub.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: ContextMenuSub, deps: [{ token: forwardRef(() => ContextMenu) }], target: i0.ɵɵFactoryTarget.Component });
ContextMenuSub.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.0", type: ContextMenuSub, selector: "p-contextMenuSub", inputs: { item: "item", root: "root", parentItemKey: "parentItemKey" }, outputs: { leafClick: "leafClick" }, host: { classAttribute: "p-element" }, viewQueries: [{ propertyName: "sublistViewChild", first: true, predicate: ["sublist"], descendants: true }, { propertyName: "menuitemViewChild", first: true, predicate: ["menuitem"], descendants: true }], ngImport: i0, template: `
        <ul #sublist [ngClass]="{ 'p-submenu-list': !root }">
            <ng-template ngFor let-child let-index="index" [ngForOf]="root ? item : item.items">
                <li *ngIf="child.separator" #menuitem class="p-menu-separator" [ngClass]="{ 'p-hidden': child.visible === false }" role="separator"></li>
                <li
                    *ngIf="!child.separator"
                    #menuitem
                    [ngClass]="{ 'p-menuitem': true, 'p-menuitem-active': isActive(getKey(index)), 'p-hidden': child.visible === false }"
                    [ngStyle]="child.style"
                    [class]="child.styleClass"
                    pTooltip
                    [tooltipOptions]="child.tooltipOptions"
                    (mouseenter)="onItemMouseEnter($event, child, getKey(index))"
                    (mouseleave)="onItemMouseLeave($event, child)"
                    role="none"
                    [attr.data-ik]="getKey(index)"
                >
                    <a
                        *ngIf="!child.routerLink"
                        [attr.href]="child.url ? child.url : null"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        [attr.tabindex]="child.disabled ? null : '0'"
                        (click)="onItemClick($event, child, menuitem, getKey(index))"
                        [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': child.disabled }"
                        pRipple
                        [attr.aria-haspopup]="item.items != null"
                        [attr.aria-expanded]="isActive(getKey(index))"
                    >
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlLabel">{{ child.label }}</span>
                        <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{ child.badge }}</span>
                        <span class="p-submenu-icon pi pi-angle-right" *ngIf="child.items"></span>
                    </a>
                    <a
                        *ngIf="child.routerLink"
                        [routerLink]="child.routerLink"
                        [queryParams]="child.queryParams"
                        [routerLinkActive]="'p-menuitem-link-active'"
                        role="menuitem"
                        [routerLinkActiveOptions]="child.routerLinkActiveOptions || { exact: false }"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        [attr.tabindex]="child.disabled ? null : '0'"
                        (click)="onItemClick($event, child, menuitem, getKey(index))"
                        [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': child.disabled }"
                        pRipple
                        [fragment]="child.fragment"
                        [queryParamsHandling]="child.queryParamsHandling"
                        [preserveFragment]="child.preserveFragment"
                        [skipLocationChange]="child.skipLocationChange"
                        [replaceUrl]="child.replaceUrl"
                        [state]="child.state"
                    >
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlRouteLabel">{{ child.label }}</span>
                        <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{ child.badge }}</span>
                        <span class="p-submenu-icon pi pi-angle-right" *ngIf="child.items"></span>
                    </a>
                    <p-contextMenuSub [parentItemKey]="getKey(index)" [item]="child" *ngIf="child.items" (leafClick)="onLeafClick()"></p-contextMenuSub>
                </li>
            </ng-template>
        </ul>
    `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.RouterLink, selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "directive", type: i2.RouterLinkActive, selector: "[routerLinkActive]", inputs: ["routerLinkActiveOptions", "ariaCurrentWhenActive", "routerLinkActive"], outputs: ["isActiveChange"], exportAs: ["routerLinkActive"] }, { kind: "directive", type: i3.Ripple, selector: "[pRipple]" }, { kind: "directive", type: i4.Tooltip, selector: "[pTooltip]", inputs: ["tooltipPosition", "tooltipEvent", "appendTo", "positionStyle", "tooltipStyleClass", "tooltipZIndex", "escape", "showDelay", "hideDelay", "life", "positionTop", "positionLeft", "autoHide", "fitContent", "pTooltip", "tooltipDisabled", "tooltipOptions"] }, { kind: "component", type: ContextMenuSub, selector: "p-contextMenuSub", inputs: ["item", "root", "parentItemKey"], outputs: ["leafClick"] }], encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: ContextMenuSub, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-contextMenuSub',
                    template: `
        <ul #sublist [ngClass]="{ 'p-submenu-list': !root }">
            <ng-template ngFor let-child let-index="index" [ngForOf]="root ? item : item.items">
                <li *ngIf="child.separator" #menuitem class="p-menu-separator" [ngClass]="{ 'p-hidden': child.visible === false }" role="separator"></li>
                <li
                    *ngIf="!child.separator"
                    #menuitem
                    [ngClass]="{ 'p-menuitem': true, 'p-menuitem-active': isActive(getKey(index)), 'p-hidden': child.visible === false }"
                    [ngStyle]="child.style"
                    [class]="child.styleClass"
                    pTooltip
                    [tooltipOptions]="child.tooltipOptions"
                    (mouseenter)="onItemMouseEnter($event, child, getKey(index))"
                    (mouseleave)="onItemMouseLeave($event, child)"
                    role="none"
                    [attr.data-ik]="getKey(index)"
                >
                    <a
                        *ngIf="!child.routerLink"
                        [attr.href]="child.url ? child.url : null"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        [attr.tabindex]="child.disabled ? null : '0'"
                        (click)="onItemClick($event, child, menuitem, getKey(index))"
                        [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': child.disabled }"
                        pRipple
                        [attr.aria-haspopup]="item.items != null"
                        [attr.aria-expanded]="isActive(getKey(index))"
                    >
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlLabel">{{ child.label }}</span>
                        <ng-template #htmlLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{ child.badge }}</span>
                        <span class="p-submenu-icon pi pi-angle-right" *ngIf="child.items"></span>
                    </a>
                    <a
                        *ngIf="child.routerLink"
                        [routerLink]="child.routerLink"
                        [queryParams]="child.queryParams"
                        [routerLinkActive]="'p-menuitem-link-active'"
                        role="menuitem"
                        [routerLinkActiveOptions]="child.routerLinkActiveOptions || { exact: false }"
                        [target]="child.target"
                        [attr.title]="child.title"
                        [attr.id]="child.id"
                        [attr.tabindex]="child.disabled ? null : '0'"
                        (click)="onItemClick($event, child, menuitem, getKey(index))"
                        [ngClass]="{ 'p-menuitem-link': true, 'p-disabled': child.disabled }"
                        pRipple
                        [fragment]="child.fragment"
                        [queryParamsHandling]="child.queryParamsHandling"
                        [preserveFragment]="child.preserveFragment"
                        [skipLocationChange]="child.skipLocationChange"
                        [replaceUrl]="child.replaceUrl"
                        [state]="child.state"
                    >
                        <span class="p-menuitem-icon" *ngIf="child.icon" [ngClass]="child.icon" [ngStyle]="child.iconStyle"></span>
                        <span class="p-menuitem-text" *ngIf="child.escape !== false; else htmlRouteLabel">{{ child.label }}</span>
                        <ng-template #htmlRouteLabel><span class="p-menuitem-text" [innerHTML]="child.label"></span></ng-template>
                        <span class="p-menuitem-badge" *ngIf="child.badge" [ngClass]="child.badgeStyleClass">{{ child.badge }}</span>
                        <span class="p-submenu-icon pi pi-angle-right" *ngIf="child.items"></span>
                    </a>
                    <p-contextMenuSub [parentItemKey]="getKey(index)" [item]="child" *ngIf="child.items" (leafClick)="onLeafClick()"></p-contextMenuSub>
                </li>
            </ng-template>
        </ul>
    `,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => ContextMenu)]
                }] }]; }, propDecorators: { item: [{
                type: Input
            }], root: [{
                type: Input
            }], parentItemKey: [{
                type: Input
            }], leafClick: [{
                type: Output
            }], sublistViewChild: [{
                type: ViewChild,
                args: ['sublist']
            }], menuitemViewChild: [{
                type: ViewChild,
                args: ['menuitem']
            }] } });
export class ContextMenu {
    constructor(el, renderer, cd, zone, contextMenuService, config) {
        this.el = el;
        this.renderer = renderer;
        this.cd = cd;
        this.zone = zone;
        this.contextMenuService = contextMenuService;
        this.config = config;
        this.autoZIndex = true;
        this.baseZIndex = 0;
        this.triggerEvent = 'contextmenu';
        this.onShow = new EventEmitter();
        this.onHide = new EventEmitter();
        this.ngDestroy$ = new Subject();
        this.preventDocumentDefault = false;
    }
    ngAfterViewInit() {
        if (this.global) {
            const documentTarget = this.el ? this.el.nativeElement.ownerDocument : 'document';
            this.triggerEventListener = this.renderer.listen(documentTarget, this.triggerEvent, (event) => {
                this.show(event);
                event.preventDefault();
            });
        }
        else if (this.target) {
            this.triggerEventListener = this.renderer.listen(this.target, this.triggerEvent, (event) => {
                this.show(event);
                event.preventDefault();
            });
        }
        if (this.appendTo) {
            if (this.appendTo === 'body')
                document.body.appendChild(this.containerViewChild.nativeElement);
            else
                DomHandler.appendChild(this.containerViewChild.nativeElement, this.appendTo);
        }
    }
    show(event) {
        this.clearActiveItem();
        this.position(event);
        this.moveOnTop();
        this.containerViewChild.nativeElement.style.display = 'block';
        this.preventDocumentDefault = true;
        DomHandler.fadeIn(this.containerViewChild.nativeElement, 250);
        this.bindGlobalListeners();
        if (event) {
            event.preventDefault();
        }
        this.onShow.emit();
    }
    hide() {
        this.containerViewChild.nativeElement.style.display = 'none';
        if (this.autoZIndex) {
            ZIndexUtils.clear(this.containerViewChild.nativeElement);
        }
        this.clearActiveItem();
        this.unbindGlobalListeners();
        this.onHide.emit();
    }
    moveOnTop() {
        if (this.autoZIndex && this.containerViewChild && this.containerViewChild.nativeElement.style.display !== 'block') {
            ZIndexUtils.set('menu', this.containerViewChild.nativeElement, this.baseZIndex + this.config.zIndex.menu);
        }
    }
    toggle(event) {
        if (this.containerViewChild.nativeElement.offsetParent)
            this.hide();
        else
            this.show(event);
    }
    position(event) {
        if (event) {
            let left = event.pageX + 1;
            let top = event.pageY + 1;
            let width = this.containerViewChild.nativeElement.offsetParent ? this.containerViewChild.nativeElement.offsetWidth : DomHandler.getHiddenElementOuterWidth(this.containerViewChild.nativeElement);
            let height = this.containerViewChild.nativeElement.offsetParent ? this.containerViewChild.nativeElement.offsetHeight : DomHandler.getHiddenElementOuterHeight(this.containerViewChild.nativeElement);
            let viewport = DomHandler.getViewport();
            //flip
            if (left + width - document.scrollingElement.scrollLeft > viewport.width) {
                left -= width;
            }
            //flip
            if (top + height - document.scrollingElement.scrollTop > viewport.height) {
                top -= height;
            }
            //fit
            if (left < document.scrollingElement.scrollLeft) {
                left = document.scrollingElement.scrollLeft;
            }
            //fit
            if (top < document.scrollingElement.scrollTop) {
                top = document.scrollingElement.scrollTop;
            }
            this.containerViewChild.nativeElement.style.left = left + 'px';
            this.containerViewChild.nativeElement.style.top = top + 'px';
        }
    }
    positionSubmenu(sublist) {
        let parentMenuItem = sublist.parentElement.parentElement;
        let viewport = DomHandler.getViewport();
        let sublistWidth = sublist.offsetParent ? sublist.offsetWidth : DomHandler.getHiddenElementOuterWidth(sublist);
        let sublistHeight = sublist.offsetHeight ? sublist.offsetHeight : DomHandler.getHiddenElementOuterHeight(sublist);
        let itemOuterWidth = DomHandler.getOuterWidth(parentMenuItem.children[0]);
        let itemOuterHeight = DomHandler.getOuterHeight(parentMenuItem.children[0]);
        let containerOffset = DomHandler.getOffset(parentMenuItem.parentElement);
        sublist.style.zIndex = ++DomHandler.zindex;
        if (parseInt(containerOffset.top) + itemOuterHeight + sublistHeight > viewport.height - DomHandler.calculateScrollbarHeight()) {
            sublist.style.removeProperty('top');
            sublist.style.bottom = '0px';
        }
        else {
            sublist.style.removeProperty('bottom');
            sublist.style.top = '0px';
        }
        if (parseInt(containerOffset.left) + itemOuterWidth + sublistWidth > viewport.width - DomHandler.calculateScrollbarWidth()) {
            sublist.style.left = -sublistWidth + 'px';
        }
        else {
            sublist.style.left = itemOuterWidth + 'px';
        }
    }
    isItemMatched(menuitem) {
        return DomHandler.hasClass(menuitem, 'p-menuitem') && !DomHandler.hasClass(menuitem.children[0], 'p-disabled');
    }
    findNextItem(menuitem, isRepeated) {
        let nextMenuitem = menuitem.nextElementSibling;
        if (nextMenuitem) {
            return this.isItemMatched(nextMenuitem) ? nextMenuitem : this.findNextItem(nextMenuitem, isRepeated);
        }
        else {
            let firstItem = menuitem.parentElement.children[0];
            return this.isItemMatched(firstItem) ? firstItem : !isRepeated ? this.findNextItem(firstItem, true) : null;
        }
    }
    findPrevItem(menuitem, isRepeated) {
        let prevMenuitem = menuitem.previousElementSibling;
        if (prevMenuitem) {
            return this.isItemMatched(prevMenuitem) ? prevMenuitem : this.findPrevItem(prevMenuitem, isRepeated);
        }
        else {
            let lastItem = menuitem.parentElement.children[menuitem.parentElement.children.length - 1];
            return this.isItemMatched(lastItem) ? lastItem : !isRepeated ? this.findPrevItem(lastItem, true) : null;
        }
    }
    getActiveItem() {
        let activeItemKey = this.contextMenuService.activeItemKey;
        return activeItemKey == null ? null : DomHandler.findSingle(this.containerViewChild.nativeElement, '.p-menuitem[data-ik="' + activeItemKey + '"]');
    }
    clearActiveItem() {
        if (this.contextMenuService.activeItemKey) {
            this.removeActiveFromSubLists(this.containerViewChild.nativeElement);
            this.contextMenuService.reset();
        }
    }
    removeActiveFromSubLists(el) {
        let sublists = DomHandler.find(el, '.p-submenu-list-active');
        for (let sublist of sublists) {
            DomHandler.removeClass(sublist, 'p-submenu-list-active');
        }
    }
    removeActiveFromSublist(menuitem) {
        if (menuitem) {
            let sublist = DomHandler.findSingle(menuitem, '.p-submenu-list');
            if (sublist && DomHandler.hasClass(menuitem, 'p-submenu-list-active')) {
                DomHandler.removeClass(menuitem, 'p-submenu-list-active');
            }
        }
    }
    bindGlobalListeners() {
        if (!this.documentClickListener) {
            const documentTarget = this.el ? this.el.nativeElement.ownerDocument : 'document';
            this.documentClickListener = this.renderer.listen(documentTarget, 'click', (event) => {
                if (this.containerViewChild.nativeElement.offsetParent && this.isOutsideClicked(event) && !event.ctrlKey && event.button !== 2 && this.triggerEvent !== 'click') {
                    this.hide();
                }
            });
            this.documentTriggerListener = this.renderer.listen(documentTarget, this.triggerEvent, (event) => {
                if (this.containerViewChild.nativeElement.offsetParent && this.isOutsideClicked(event) && !this.preventDocumentDefault) {
                    this.hide();
                }
                this.preventDocumentDefault = false;
            });
        }
        this.zone.runOutsideAngular(() => {
            if (!this.windowResizeListener) {
                this.windowResizeListener = this.onWindowResize.bind(this);
                window.addEventListener('resize', this.windowResizeListener);
            }
        });
        if (!this.documentKeydownListener) {
            const documentTarget = this.el ? this.el.nativeElement.ownerDocument : 'document';
            this.documentKeydownListener = this.renderer.listen(documentTarget, 'keydown', (event) => {
                let activeItem = this.getActiveItem();
                switch (event.key) {
                    case 'ArrowDown':
                        if (activeItem) {
                            this.removeActiveFromSublist(activeItem);
                            activeItem = this.findNextItem(activeItem);
                        }
                        else {
                            let firstItem = DomHandler.findSingle(this.containerViewChild.nativeElement, '.p-menuitem-link').parentElement;
                            activeItem = this.isItemMatched(firstItem) ? firstItem : this.findNextItem(firstItem);
                        }
                        if (activeItem) {
                            this.contextMenuService.changeKey(activeItem.getAttribute('data-ik'));
                        }
                        event.preventDefault();
                        break;
                    case 'ArrowUp':
                        if (activeItem) {
                            this.removeActiveFromSublist(activeItem);
                            activeItem = this.findPrevItem(activeItem);
                        }
                        else {
                            let sublist = DomHandler.findSingle(this.containerViewChild.nativeElement, 'ul');
                            let lastItem = sublist.children[sublist.children.length - 1];
                            activeItem = this.isItemMatched(lastItem) ? lastItem : this.findPrevItem(lastItem);
                        }
                        if (activeItem) {
                            this.contextMenuService.changeKey(activeItem.getAttribute('data-ik'));
                        }
                        event.preventDefault();
                        break;
                    case 'ArrowRight':
                        if (activeItem) {
                            let sublist = DomHandler.findSingle(activeItem, '.p-submenu-list');
                            if (sublist) {
                                DomHandler.addClass(sublist, 'p-submenu-list-active');
                                activeItem = DomHandler.findSingle(sublist, '.p-menuitem-link:not(.p-disabled)').parentElement;
                                if (activeItem) {
                                    this.contextMenuService.changeKey(activeItem.getAttribute('data-ik'));
                                }
                            }
                        }
                        event.preventDefault();
                        break;
                    case 'ArrowLeft':
                        if (activeItem) {
                            let sublist = activeItem.parentElement;
                            if (sublist && DomHandler.hasClass(sublist, 'p-submenu-list-active')) {
                                DomHandler.removeClass(sublist, 'p-submenu-list-active');
                                activeItem = sublist.parentElement.parentElement;
                                if (activeItem) {
                                    this.contextMenuService.changeKey(activeItem.getAttribute('data-ik'));
                                }
                            }
                        }
                        event.preventDefault();
                        break;
                    case 'Escape':
                        this.hide();
                        event.preventDefault();
                        break;
                    case 'Enter':
                        if (activeItem) {
                            this.handleItemClick(event, this.findModelItemFromKey(this.contextMenuService.activeItemKey), activeItem);
                        }
                        event.preventDefault();
                        break;
                    default:
                        break;
                }
            });
        }
    }
    findModelItemFromKey(key) {
        if (key == null || !this.model) {
            return null;
        }
        let indexes = key.split('_');
        return indexes.reduce((item, currentIndex) => {
            return item ? item.items[currentIndex] : this.model[currentIndex];
        }, null);
    }
    handleItemClick(event, item, menuitem) {
        if (!item || item.disabled) {
            return;
        }
        if (item.command) {
            item.command({
                originalEvent: event,
                item: item
            });
        }
        if (item.items) {
            let childSublist = DomHandler.findSingle(menuitem, '.p-submenu-list');
            if (childSublist) {
                if (DomHandler.hasClass(childSublist, 'p-submenu-list-active')) {
                    this.removeActiveFromSubLists(menuitem);
                }
                else {
                    DomHandler.addClass(childSublist, 'p-submenu-list-active');
                    this.positionSubmenu(childSublist);
                }
            }
        }
        if (!item.items) {
            this.hide();
        }
    }
    unbindGlobalListeners() {
        if (this.documentClickListener) {
            this.documentClickListener();
            this.documentClickListener = null;
        }
        if (this.documentTriggerListener) {
            this.documentTriggerListener();
            this.documentTriggerListener = null;
        }
        if (this.windowResizeListener) {
            window.removeEventListener('resize', this.windowResizeListener);
            this.windowResizeListener = null;
        }
        if (this.documentKeydownListener) {
            this.documentKeydownListener();
            this.documentKeydownListener = null;
        }
    }
    onWindowResize(event) {
        if (this.containerViewChild.nativeElement.offsetParent) {
            this.hide();
        }
    }
    isOutsideClicked(event) {
        return !(this.containerViewChild.nativeElement.isSameNode(event.target) || this.containerViewChild.nativeElement.contains(event.target));
    }
    ngOnDestroy() {
        this.unbindGlobalListeners();
        if (this.triggerEventListener) {
            this.triggerEventListener();
        }
        if (this.containerViewChild && this.autoZIndex) {
            ZIndexUtils.clear(this.containerViewChild.nativeElement);
        }
        if (this.appendTo) {
            this.el.nativeElement.appendChild(this.containerViewChild.nativeElement);
        }
        this.ngDestroy$.next(true);
        this.ngDestroy$.complete();
    }
}
ContextMenu.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: ContextMenu, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }, { token: i0.NgZone }, { token: i5.ContextMenuService }, { token: i5.PrimeNGConfig }], target: i0.ɵɵFactoryTarget.Component });
ContextMenu.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.0", type: ContextMenu, selector: "p-contextMenu", inputs: { model: "model", global: "global", target: "target", style: "style", styleClass: "styleClass", appendTo: "appendTo", autoZIndex: "autoZIndex", baseZIndex: "baseZIndex", triggerEvent: "triggerEvent" }, outputs: { onShow: "onShow", onHide: "onHide" }, host: { classAttribute: "p-element" }, viewQueries: [{ propertyName: "containerViewChild", first: true, predicate: ["container"], descendants: true }], ngImport: i0, template: `
        <div #container [ngClass]="'p-contextmenu p-component'" [class]="styleClass" [ngStyle]="style">
            <p-contextMenuSub [item]="model" [root]="true"></p-contextMenuSub>
        </div>
    `, isInline: true, styles: [".p-contextmenu{position:absolute;display:none}.p-contextmenu ul{margin:0;padding:0;list-style:none}.p-contextmenu .p-submenu-list{position:absolute;min-width:100%;z-index:1;display:none}.p-contextmenu .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-contextmenu .p-menuitem-text{line-height:1}.p-contextmenu .p-menuitem{position:relative}.p-contextmenu .p-menuitem-link .p-submenu-icon{margin-left:auto}.p-contextmenu .p-menuitem-active>p-contextmenusub>.p-submenu-list.p-submenu-list-active{display:block!important}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "component", type: ContextMenuSub, selector: "p-contextMenuSub", inputs: ["item", "root", "parentItemKey"], outputs: ["leafClick"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: ContextMenu, decorators: [{
            type: Component,
            args: [{ selector: 'p-contextMenu', template: `
        <div #container [ngClass]="'p-contextmenu p-component'" [class]="styleClass" [ngStyle]="style">
            <p-contextMenuSub [item]="model" [root]="true"></p-contextMenuSub>
        </div>
    `, changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-contextmenu{position:absolute;display:none}.p-contextmenu ul{margin:0;padding:0;list-style:none}.p-contextmenu .p-submenu-list{position:absolute;min-width:100%;z-index:1;display:none}.p-contextmenu .p-menuitem-link{cursor:pointer;display:flex;align-items:center;text-decoration:none;overflow:hidden;position:relative}.p-contextmenu .p-menuitem-text{line-height:1}.p-contextmenu .p-menuitem{position:relative}.p-contextmenu .p-menuitem-link .p-submenu-icon{margin-left:auto}.p-contextmenu .p-menuitem-active>p-contextmenusub>.p-submenu-list.p-submenu-list-active{display:block!important}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }, { type: i0.NgZone }, { type: i5.ContextMenuService }, { type: i5.PrimeNGConfig }]; }, propDecorators: { model: [{
                type: Input
            }], global: [{
                type: Input
            }], target: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], autoZIndex: [{
                type: Input
            }], baseZIndex: [{
                type: Input
            }], triggerEvent: [{
                type: Input
            }], onShow: [{
                type: Output
            }], onHide: [{
                type: Output
            }], containerViewChild: [{
                type: ViewChild,
                args: ['container']
            }] } });
export class ContextMenuModule {
}
ContextMenuModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: ContextMenuModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ContextMenuModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.1.0", ngImport: i0, type: ContextMenuModule, declarations: [ContextMenu, ContextMenuSub], imports: [CommonModule, RouterModule, RippleModule, TooltipModule], exports: [ContextMenu, RouterModule, TooltipModule] });
ContextMenuModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: ContextMenuModule, providers: [ContextMenuService], imports: [CommonModule, RouterModule, RippleModule, TooltipModule, RouterModule, TooltipModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: ContextMenuModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RouterModule, RippleModule, TooltipModule],
                    exports: [ContextMenu, RouterModule, TooltipModule],
                    declarations: [ContextMenu, ContextMenuSub],
                    providers: [ContextMenuService]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udGV4dG1lbnUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvY29udGV4dG1lbnUvY29udGV4dG1lbnUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBaUIsdUJBQXVCLEVBQXFCLFNBQVMsRUFBYyxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFxQixNQUFNLEVBQWEsU0FBUyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hPLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsa0JBQWtCLEVBQTJCLE1BQU0sYUFBYSxDQUFDO0FBQzFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUNoRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxPQUFPLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQzdDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7OztBQTZFM0MsTUFBTSxPQUFPLGNBQWM7SUFxQnZCLFlBQW1ELFdBQVc7UUFkcEQsY0FBUyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBZXhELElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBMEIsQ0FBQztJQUNsRCxDQUFDO0lBRUQsUUFBUTtRQUNKLElBQUksQ0FBQywrQkFBK0IsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFB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LEtBQUs7Z0JBRUcsTUFBTTtzQkFBZCxLQUFLO2dCQUVHLE1BQU07c0JBQWQsS0FBSztnQkFFRyxLQUFLO3NCQUFiLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFRyxRQUFRO3NCQUFoQixLQUFLO2dCQUVHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFRyxZQUFZO3NCQUFwQixLQUFLO2dCQUVJLE1BQU07c0JBQWYsTUFBTTtnQkFFRyxNQUFNO3NCQUFmLE1BQU07Z0JBRWlCLGtCQUFrQjtzQkFBekMsU0FBUzt1QkFBQyxXQUFXOztBQWdhMUIsTUFBTSxPQUFPLGlCQUFpQjs7OEdBQWpCLGlCQUFpQjsrR0FBakIsaUJBQWlCLGlCQXZiakIsV0FBVyxFQTNJWCxjQUFjLGFBNmpCYixZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxhQUFhLGFBbGJ4RCxXQUFXLEVBbWJHLFlBQVksRUFBRSxhQUFhOytHQUl6QyxpQkFBaUIsYUFGZixDQUFDLGtCQUFrQixDQUFDLFlBSHJCLFlBQVksRUFBRSxZQUFZLEVBQUUsWUFBWSxFQUFFLGFBQWEsRUFDMUMsWUFBWSxFQUFFLGFBQWE7MkZBSXpDLGlCQUFpQjtrQkFON0IsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsWUFBWSxFQUFFLFlBQVksRUFBRSxhQUFhLENBQUM7b0JBQ2xFLE9BQU8sRUFBRSxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUsYUFBYSxDQUFDO29CQUNuRCxZQUFZLEVBQUUsQ0FBQyxXQUFXLEVBQUUsY0FBYyxDQUFDO29CQUMzQyxTQUFTLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQztpQkFDbEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENoYW5nZURldGVjdG9yUmVmLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbnB1dCwgTmdNb2R1bGUsIE5nWm9uZSwgT25EZXN0cm95LCBPdXRwdXQsIFJlbmRlcmVyMiwgVmlld0NoaWxkLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IENvbnRleHRNZW51U2VydmljZSwgTWVudUl0ZW0sIFByaW1lTkdDb25maWcgfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQgeyBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgUmlwcGxlTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9yaXBwbGUnO1xuaW1wb3J0IHsgVG9vbHRpcE1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvdG9vbHRpcCc7XG5pbXBvcnQgeyBaSW5kZXhVdGlscyB9IGZyb20gJ3ByaW1lbmcvdXRpbHMnO1xuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1jb250ZXh0TWVudVN1YicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPHVsICNzdWJsaXN0IFtuZ0NsYXNzXT1cInsgJ3Atc3VibWVudS1saXN0JzogIXJvb3QgfVwiPlxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlIG5nRm9yIGxldC1jaGlsZCBsZXQtaW5kZXg9XCJpbmRleFwiIFtuZ0Zvck9mXT1cInJvb3QgPyBpdGVtIDogaXRlbS5pdGVtc1wiPlxuICAgICAgICAgICAgICAgIDxsaSAqbmdJZj1cImNoaWxkLnNlcGFyYXRvclwiICNtZW51aXRlbSBjbGFzcz1cInAtbWVudS1zZXBhcmF0b3JcIiBbbmdDbGFzc109XCJ7ICdwLWhpZGRlbic6IGNoaWxkLnZpc2libGUgPT09IGZhbHNlIH1cIiByb2xlPVwic2VwYXJhdG9yXCI+PC9saT5cbiAgICAgICAgICAgICAgICA8bGlcbiAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCIhY2hpbGQuc2VwYXJhdG9yXCJcbiAgICAgICAgICAgICAgICAgICAgI21lbnVpdGVtXG4gICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3AtbWVudWl0ZW0nOiB0cnVlLCAncC1tZW51aXRlbS1hY3RpdmUnOiBpc0FjdGl2ZShnZXRLZXkoaW5kZXgpKSwgJ3AtaGlkZGVuJzogY2hpbGQudmlzaWJsZSA9PT0gZmFsc2UgfVwiXG4gICAgICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cImNoaWxkLnN0eWxlXCJcbiAgICAgICAgICAgICAgICAgICAgW2NsYXNzXT1cImNoaWxkLnN0eWxlQ2xhc3NcIlxuICAgICAgICAgICAgICAgICAgICBwVG9vbHRpcFxuICAgICAgICAgICAgICAgICAgICBbdG9vbHRpcE9wdGlvbnNdPVwiY2hpbGQudG9vbHRpcE9wdGlvbnNcIlxuICAgICAgICAgICAgICAgICAgICAobW91c2VlbnRlcik9XCJvbkl0ZW1Nb3VzZUVudGVyKCRldmVudCwgY2hpbGQsIGdldEtleShpbmRleCkpXCJcbiAgICAgICAgICAgICAgICAgICAgKG1vdXNlbGVhdmUpPVwib25JdGVtTW91c2VMZWF2ZSgkZXZlbnQsIGNoaWxkKVwiXG4gICAgICAgICAgICAgICAgICAgIHJvbGU9XCJub25lXCJcbiAgICAgICAgICAgICAgICAgICAgW2F0dHIuZGF0YS1pa109XCJnZXRLZXkoaW5kZXgpXCJcbiAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIDxhXG4gICAgICAgICAgICAgICAgICAgICAgICAqbmdJZj1cIiFjaGlsZC5yb3V0ZXJMaW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthdHRyLmhyZWZdPVwiY2hpbGQudXJsID8gY2hpbGQudXJsIDogbnVsbFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbdGFyZ2V0XT1cImNoaWxkLnRhcmdldFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci50aXRsZV09XCJjaGlsZC50aXRsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci5pZF09XCJjaGlsZC5pZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbYXR0ci50YWJpbmRleF09XCJjaGlsZC5kaXNhYmxlZCA/IG51bGwgOiAnMCdcIlxuICAgICAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cIm9uSXRlbUNsaWNrKCRldmVudCwgY2hpbGQsIG1lbnVpdGVtLCBnZXRLZXkoaW5kZXgpKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdwLW1lbnVpdGVtLWxpbmsnOiB0cnVlLCAncC1kaXNhYmxlZCc6IGNoaWxkLmRpc2FibGVkIH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgcFJpcHBsZVxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1oYXNwb3B1cF09XCJpdGVtLml0ZW1zICE9IG51bGxcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1leHBhbmRlZF09XCJpc0FjdGl2ZShnZXRLZXkoaW5kZXgpKVwiXG4gICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS1pY29uXCIgKm5nSWY9XCJjaGlsZC5pY29uXCIgW25nQ2xhc3NdPVwiY2hpbGQuaWNvblwiIFtuZ1N0eWxlXT1cImNoaWxkLmljb25TdHlsZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS10ZXh0XCIgKm5nSWY9XCJjaGlsZC5lc2NhcGUgIT09IGZhbHNlOyBlbHNlIGh0bWxMYWJlbFwiPnt7IGNoaWxkLmxhYmVsIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNodG1sTGFiZWw+PHNwYW4gY2xhc3M9XCJwLW1lbnVpdGVtLXRleHRcIiBbaW5uZXJIVE1MXT1cImNoaWxkLmxhYmVsXCI+PC9zcGFuPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tYmFkZ2VcIiAqbmdJZj1cImNoaWxkLmJhZGdlXCIgW25nQ2xhc3NdPVwiY2hpbGQuYmFkZ2VTdHlsZUNsYXNzXCI+e3sgY2hpbGQuYmFkZ2UgfX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtc3VibWVudS1pY29uIHBpIHBpLWFuZ2xlLXJpZ2h0XCIgKm5nSWY9XCJjaGlsZC5pdGVtc1wiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgICAgICAgICA8YVxuICAgICAgICAgICAgICAgICAgICAgICAgKm5nSWY9XCJjaGlsZC5yb3V0ZXJMaW5rXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtyb3V0ZXJMaW5rXT1cImNoaWxkLnJvdXRlckxpbmtcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW3F1ZXJ5UGFyYW1zXT1cImNoaWxkLnF1ZXJ5UGFyYW1zXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtyb3V0ZXJMaW5rQWN0aXZlXT1cIidwLW1lbnVpdGVtLWxpbmstYWN0aXZlJ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICByb2xlPVwibWVudWl0ZW1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgW3JvdXRlckxpbmtBY3RpdmVPcHRpb25zXT1cImNoaWxkLnJvdXRlckxpbmtBY3RpdmVPcHRpb25zIHx8IHsgZXhhY3Q6IGZhbHNlIH1cIlxuICAgICAgICAgICAgICAgICAgICAgICAgW3RhcmdldF09XCJjaGlsZC50YXJnZXRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIudGl0bGVdPVwiY2hpbGQudGl0bGVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIuaWRdPVwiY2hpbGQuaWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW2F0dHIudGFiaW5kZXhdPVwiY2hpbGQuZGlzYWJsZWQgPyBudWxsIDogJzAnXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIChjbGljayk9XCJvbkl0ZW1DbGljaygkZXZlbnQsIGNoaWxkLCBtZW51aXRlbSwgZ2V0S2V5KGluZGV4KSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1tZW51aXRlbS1saW5rJzogdHJ1ZSwgJ3AtZGlzYWJsZWQnOiBjaGlsZC5kaXNhYmxlZCB9XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBSaXBwbGVcbiAgICAgICAgICAgICAgICAgICAgICAgIFtmcmFnbWVudF09XCJjaGlsZC5mcmFnbWVudFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbcXVlcnlQYXJhbXNIYW5kbGluZ109XCJjaGlsZC5xdWVyeVBhcmFtc0hhbmRsaW5nXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFtwcmVzZXJ2ZUZyYWdtZW50XT1cImNoaWxkLnByZXNlcnZlRnJhZ21lbnRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW3NraXBMb2NhdGlvbkNoYW5nZV09XCJjaGlsZC5za2lwTG9jYXRpb25DaGFuZ2VcIlxuICAgICAgICAgICAgICAgICAgICAgICAgW3JlcGxhY2VVcmxdPVwiY2hpbGQucmVwbGFjZVVybFwiXG4gICAgICAgICAgICAgICAgICAgICAgICBbc3RhdGVdPVwiY2hpbGQuc3RhdGVcIlxuICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0taWNvblwiICpuZ0lmPVwiY2hpbGQuaWNvblwiIFtuZ0NsYXNzXT1cImNoaWxkLmljb25cIiBbbmdTdHlsZV09XCJjaGlsZC5pY29uU3R5bGVcIj48L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiICpuZ0lmPVwiY2hpbGQuZXNjYXBlICE9PSBmYWxzZTsgZWxzZSBodG1sUm91dGVMYWJlbFwiPnt7IGNoaWxkLmxhYmVsIH19PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNodG1sUm91dGVMYWJlbD48c3BhbiBjbGFzcz1cInAtbWVudWl0ZW0tdGV4dFwiIFtpbm5lckhUTUxdPVwiY2hpbGQubGFiZWxcIj48L3NwYW4+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1tZW51aXRlbS1iYWRnZVwiICpuZ0lmPVwiY2hpbGQuYmFkZ2VcIiBbbmdDbGFzc109XCJjaGlsZC5iYWRnZVN0eWxlQ2xhc3NcIj57eyBjaGlsZC5iYWRnZSB9fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1zdWJtZW51LWljb24gcGkgcGktYW5nbGUtcmlnaHRcIiAqbmdJZj1cImNoaWxkLml0ZW1zXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2E+XG4gICAgICAgICAgICAgICAgICAgIDxwLWNvbnRleHRNZW51U3ViIFtwYXJlbnRJdGVtS2V5XT1cImdldEtleShpbmRleClcIiBbaXRlbV09XCJjaGlsZFwiICpuZ0lmPVwiY2hpbGQuaXRlbXNcIiAobGVhZkNsaWNrKT1cIm9uTGVhZkNsaWNrKClcIj48L3AtY29udGV4dE1lbnVTdWI+XG4gICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvdWw+XG4gICAgYCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBDb250ZXh0TWVudVN1YiB7XG4gICAgQElucHV0KCkgaXRlbTogTWVudUl0ZW07XG5cbiAgICBASW5wdXQoKSByb290OiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgcGFyZW50SXRlbUtleTogYW55O1xuXG4gICAgQE91dHB1dCgpIGxlYWZDbGljazogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAVmlld0NoaWxkKCdzdWJsaXN0Jykgc3VibGlzdFZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ21lbnVpdGVtJykgbWVudWl0ZW1WaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBjb250ZXh0TWVudTogQ29udGV4dE1lbnU7XG5cbiAgICBhY3RpdmVJdGVtS2V5OiBzdHJpbmc7XG5cbiAgICBoaWRlVGltZW91dDogYW55O1xuXG4gICAgYWN0aXZlSXRlbUtleUNoYW5nZVN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChmb3J3YXJkUmVmKCgpID0+IENvbnRleHRNZW51KSkgY29udGV4dE1lbnUpIHtcbiAgICAgICAgdGhpcy5jb250ZXh0TWVudSA9IGNvbnRleHRNZW51IGFzIENvbnRleHRNZW51O1xuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLmFjdGl2ZUl0ZW1LZXlDaGFuZ2VTdWJzY3JpcHRpb24gPSB0aGlzLmNvbnRleHRNZW51LmNvbnRleHRNZW51U2VydmljZS5hY3RpdmVJdGVtS2V5Q2hhbmdlJC5waXBlKHRha2VVbnRpbCh0aGlzLmNvbnRleHRNZW51Lm5nRGVzdHJveSQpKS5zdWJzY3JpYmUoKGFjdGl2ZUl0ZW1LZXkpID0+IHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlSXRlbUtleSA9IGFjdGl2ZUl0ZW1LZXk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmlzQWN0aXZlKHRoaXMucGFyZW50SXRlbUtleSkgJiYgRG9tSGFuZGxlci5oYXNDbGFzcyh0aGlzLnN1Ymxpc3RWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCwgJ3Atc3VibWVudS1saXN0LWFjdGl2ZScpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudS5wb3NpdGlvblN1Ym1lbnUodGhpcy5zdWJsaXN0Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmNkLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBvbkl0ZW1Nb3VzZUVudGVyKGV2ZW50LCBpdGVtLCBrZXkpIHtcbiAgICAgICAgaWYgKHRoaXMuaGlkZVRpbWVvdXQpIHtcbiAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLmhpZGVUaW1lb3V0KTtcbiAgICAgICAgICAgIHRoaXMuaGlkZVRpbWVvdXQgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGl0ZW0uZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuYWN0aXZlSXRlbUtleSA9IG51bGw7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbS5pdGVtcykge1xuICAgICAgICAgICAgbGV0IGNoaWxkU3VibGlzdCA9IERvbUhhbmRsZXIuZmluZFNpbmdsZShldmVudC5jdXJyZW50VGFyZ2V0LCAnLnAtc3VibWVudS1saXN0Jyk7XG4gICAgICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKGNoaWxkU3VibGlzdCwgJ3Atc3VibWVudS1saXN0LWFjdGl2ZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jb250ZXh0TWVudS5jb250ZXh0TWVudVNlcnZpY2UuY2hhbmdlS2V5KGtleSk7XG4gICAgfVxuXG4gICAgb25JdGVtTW91c2VMZWF2ZShldmVudCwgaXRlbSkge1xuICAgICAgICBpZiAoaXRlbS5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuY29udGV4dE1lbnUuZWwubmF0aXZlRWxlbWVudC5jb250YWlucyg8Tm9kZT5ldmVudC50b0VsZW1lbnQpKSB7XG4gICAgICAgICAgICBpZiAoaXRlbS5pdGVtcykge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUucmVtb3ZlQWN0aXZlRnJvbVN1Ykxpc3RzKGV2ZW50LmN1cnJlbnRUYXJnZXQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIXRoaXMucm9vdCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuY29udGV4dE1lbnVTZXJ2aWNlLmNoYW5nZUtleSh0aGlzLnBhcmVudEl0ZW1LZXkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25JdGVtQ2xpY2soZXZlbnQsIGl0ZW0sIG1lbnVpdGVtLCBrZXkpIHtcbiAgICAgICAgaWYgKGl0ZW0uZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIWl0ZW0udXJsICYmICFpdGVtLnJvdXRlckxpbmspIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbS5jb21tYW5kKSB7XG4gICAgICAgICAgICBpdGVtLmNvbW1hbmQoe1xuICAgICAgICAgICAgICAgIG9yaWdpbmFsRXZlbnQ6IGV2ZW50LFxuICAgICAgICAgICAgICAgIGl0ZW06IGl0ZW1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGl0ZW0uaXRlbXMpIHtcbiAgICAgICAgICAgIGxldCBjaGlsZFN1Ymxpc3QgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUobWVudWl0ZW0sICcucC1zdWJtZW51LWxpc3QnKTtcblxuICAgICAgICAgICAgaWYgKGNoaWxkU3VibGlzdCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzQWN0aXZlKGtleSkgJiYgRG9tSGFuZGxlci5oYXNDbGFzcyhjaGlsZFN1Ymxpc3QsICdwLXN1Ym1lbnUtbGlzdC1hY3RpdmUnKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LnJlbW92ZUFjdGl2ZUZyb21TdWJMaXN0cyhtZW51aXRlbSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyhjaGlsZFN1Ymxpc3QsICdwLXN1Ym1lbnUtbGlzdC1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51LmNvbnRleHRNZW51U2VydmljZS5jaGFuZ2VLZXkoa2V5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghaXRlbS5pdGVtcykge1xuICAgICAgICAgICAgdGhpcy5vbkxlYWZDbGljaygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25MZWFmQ2xpY2soKSB7XG4gICAgICAgIGlmICh0aGlzLnJvb3QpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnUuaGlkZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sZWFmQ2xpY2suZW1pdCgpO1xuICAgIH1cblxuICAgIGdldEtleShpbmRleCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yb290ID8gU3RyaW5nKGluZGV4KSA6IHRoaXMucGFyZW50SXRlbUtleSArICdfJyArIGluZGV4O1xuICAgIH1cblxuICAgIGlzQWN0aXZlKGtleSkge1xuICAgICAgICByZXR1cm4gdGhpcy5hY3RpdmVJdGVtS2V5ICYmICh0aGlzLmFjdGl2ZUl0ZW1LZXkuc3RhcnRzV2l0aChrZXkgKyAnXycpIHx8IHRoaXMuYWN0aXZlSXRlbUtleSA9PT0ga2V5KTtcbiAgICB9XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1jb250ZXh0TWVudScsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPGRpdiAjY29udGFpbmVyIFtuZ0NsYXNzXT1cIidwLWNvbnRleHRtZW51IHAtY29tcG9uZW50J1wiIFtjbGFzc109XCJzdHlsZUNsYXNzXCIgW25nU3R5bGVdPVwic3R5bGVcIj5cbiAgICAgICAgICAgIDxwLWNvbnRleHRNZW51U3ViIFtpdGVtXT1cIm1vZGVsXCIgW3Jvb3RdPVwidHJ1ZVwiPjwvcC1jb250ZXh0TWVudVN1Yj5cbiAgICAgICAgPC9kaXY+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL2NvbnRleHRtZW51LmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBDb250ZXh0TWVudSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gICAgQElucHV0KCkgbW9kZWw6IE1lbnVJdGVtW107XG5cbiAgICBASW5wdXQoKSBnbG9iYWw6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSB0YXJnZXQ6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBhcHBlbmRUbzogYW55O1xuXG4gICAgQElucHV0KCkgYXV0b1pJbmRleDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBiYXNlWkluZGV4OiBudW1iZXIgPSAwO1xuXG4gICAgQElucHV0KCkgdHJpZ2dlckV2ZW50OiBzdHJpbmcgPSAnY29udGV4dG1lbnUnO1xuXG4gICAgQE91dHB1dCgpIG9uU2hvdzogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25IaWRlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBWaWV3Q2hpbGQoJ2NvbnRhaW5lcicpIGNvbnRhaW5lclZpZXdDaGlsZDogRWxlbWVudFJlZjtcblxuICAgIGRvY3VtZW50Q2xpY2tMaXN0ZW5lcjogYW55O1xuXG4gICAgZG9jdW1lbnRUcmlnZ2VyTGlzdGVuZXI6IGFueTtcblxuICAgIGRvY3VtZW50S2V5ZG93bkxpc3RlbmVyOiBhbnk7XG5cbiAgICB3aW5kb3dSZXNpemVMaXN0ZW5lcjogYW55O1xuXG4gICAgdHJpZ2dlckV2ZW50TGlzdGVuZXI6IGFueTtcblxuICAgIG5nRGVzdHJveSQgPSBuZXcgU3ViamVjdCgpO1xuXG4gICAgcHJldmVudERvY3VtZW50RGVmYXVsdDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmLCBwdWJsaWMgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHVibGljIGNkOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHVibGljIHpvbmU6IE5nWm9uZSwgcHVibGljIGNvbnRleHRNZW51U2VydmljZTogQ29udGV4dE1lbnVTZXJ2aWNlLCBwcml2YXRlIGNvbmZpZzogUHJpbWVOR0NvbmZpZykge31cblxuICAgIG5nQWZ0ZXJWaWV3SW5pdCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2xvYmFsKSB7XG4gICAgICAgICAgICBjb25zdCBkb2N1bWVudFRhcmdldDogYW55ID0gdGhpcy5lbCA/IHRoaXMuZWwubmF0aXZlRWxlbWVudC5vd25lckRvY3VtZW50IDogJ2RvY3VtZW50JztcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckV2ZW50TGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbihkb2N1bWVudFRhcmdldCwgdGhpcy50cmlnZ2VyRXZlbnQsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvdyhldmVudCk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMudGFyZ2V0KSB7XG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJFdmVudExpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGhpcy50YXJnZXQsIHRoaXMudHJpZ2dlckV2ZW50LCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNob3coZXZlbnQpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmFwcGVuZFRvKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5hcHBlbmRUbyA9PT0gJ2JvZHknKSBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgZWxzZSBEb21IYW5kbGVyLmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQsIHRoaXMuYXBwZW5kVG8pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvdyhldmVudD86IE1vdXNlRXZlbnQpIHtcbiAgICAgICAgdGhpcy5jbGVhckFjdGl2ZUl0ZW0oKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbihldmVudCk7XG4gICAgICAgIHRoaXMubW92ZU9uVG9wKCk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIHRoaXMucHJldmVudERvY3VtZW50RGVmYXVsdCA9IHRydWU7XG4gICAgICAgIERvbUhhbmRsZXIuZmFkZUluKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQsIDI1MCk7XG4gICAgICAgIHRoaXMuYmluZEdsb2JhbExpc3RlbmVycygpO1xuXG4gICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMub25TaG93LmVtaXQoKTtcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG5cbiAgICAgICAgaWYgKHRoaXMuYXV0b1pJbmRleCkge1xuICAgICAgICAgICAgWkluZGV4VXRpbHMuY2xlYXIodGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNsZWFyQWN0aXZlSXRlbSgpO1xuICAgICAgICB0aGlzLnVuYmluZEdsb2JhbExpc3RlbmVycygpO1xuICAgICAgICB0aGlzLm9uSGlkZS5lbWl0KCk7XG4gICAgfVxuXG4gICAgbW92ZU9uVG9wKCkge1xuICAgICAgICBpZiAodGhpcy5hdXRvWkluZGV4ICYmIHRoaXMuY29udGFpbmVyVmlld0NoaWxkICYmIHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUuZGlzcGxheSAhPT0gJ2Jsb2NrJykge1xuICAgICAgICAgICAgWkluZGV4VXRpbHMuc2V0KCdtZW51JywgdGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCwgdGhpcy5iYXNlWkluZGV4ICsgdGhpcy5jb25maWcuekluZGV4Lm1lbnUpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdG9nZ2xlKGV2ZW50PzogTW91c2VFdmVudCkge1xuICAgICAgICBpZiAodGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5vZmZzZXRQYXJlbnQpIHRoaXMuaGlkZSgpO1xuICAgICAgICBlbHNlIHRoaXMuc2hvdyhldmVudCk7XG4gICAgfVxuXG4gICAgcG9zaXRpb24oZXZlbnQ/OiBNb3VzZUV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudCkge1xuICAgICAgICAgICAgbGV0IGxlZnQgPSBldmVudC5wYWdlWCArIDE7XG4gICAgICAgICAgICBsZXQgdG9wID0gZXZlbnQucGFnZVkgKyAxO1xuICAgICAgICAgICAgbGV0IHdpZHRoID0gdGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5vZmZzZXRQYXJlbnQgPyB0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoIDogRG9tSGFuZGxlci5nZXRIaWRkZW5FbGVtZW50T3V0ZXJXaWR0aCh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgICAgIGxldCBoZWlnaHQgPSB0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50Lm9mZnNldFBhcmVudCA/IHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQub2Zmc2V0SGVpZ2h0IDogRG9tSGFuZGxlci5nZXRIaWRkZW5FbGVtZW50T3V0ZXJIZWlnaHQodGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgICAgICBsZXQgdmlld3BvcnQgPSBEb21IYW5kbGVyLmdldFZpZXdwb3J0KCk7XG5cbiAgICAgICAgICAgIC8vZmxpcFxuICAgICAgICAgICAgaWYgKGxlZnQgKyB3aWR0aCAtIGRvY3VtZW50LnNjcm9sbGluZ0VsZW1lbnQuc2Nyb2xsTGVmdCA+IHZpZXdwb3J0LndpZHRoKSB7XG4gICAgICAgICAgICAgICAgbGVmdCAtPSB3aWR0aDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9mbGlwXG4gICAgICAgICAgICBpZiAodG9wICsgaGVpZ2h0IC0gZG9jdW1lbnQuc2Nyb2xsaW5nRWxlbWVudC5zY3JvbGxUb3AgPiB2aWV3cG9ydC5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICB0b3AgLT0gaGVpZ2h0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2ZpdFxuICAgICAgICAgICAgaWYgKGxlZnQgPCBkb2N1bWVudC5zY3JvbGxpbmdFbGVtZW50LnNjcm9sbExlZnQpIHtcbiAgICAgICAgICAgICAgICBsZWZ0ID0gZG9jdW1lbnQuc2Nyb2xsaW5nRWxlbWVudC5zY3JvbGxMZWZ0O1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL2ZpdFxuICAgICAgICAgICAgaWYgKHRvcCA8IGRvY3VtZW50LnNjcm9sbGluZ0VsZW1lbnQuc2Nyb2xsVG9wKSB7XG4gICAgICAgICAgICAgICAgdG9wID0gZG9jdW1lbnQuc2Nyb2xsaW5nRWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9IGxlZnQgKyAncHgnO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS50b3AgPSB0b3AgKyAncHgnO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcG9zaXRpb25TdWJtZW51KHN1Ymxpc3QpIHtcbiAgICAgICAgbGV0IHBhcmVudE1lbnVJdGVtID0gc3VibGlzdC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIGxldCB2aWV3cG9ydCA9IERvbUhhbmRsZXIuZ2V0Vmlld3BvcnQoKTtcbiAgICAgICAgbGV0IHN1Ymxpc3RXaWR0aCA9IHN1Ymxpc3Qub2Zmc2V0UGFyZW50ID8gc3VibGlzdC5vZmZzZXRXaWR0aCA6IERvbUhhbmRsZXIuZ2V0SGlkZGVuRWxlbWVudE91dGVyV2lkdGgoc3VibGlzdCk7XG4gICAgICAgIGxldCBzdWJsaXN0SGVpZ2h0ID0gc3VibGlzdC5vZmZzZXRIZWlnaHQgPyBzdWJsaXN0Lm9mZnNldEhlaWdodCA6IERvbUhhbmRsZXIuZ2V0SGlkZGVuRWxlbWVudE91dGVySGVpZ2h0KHN1Ymxpc3QpO1xuICAgICAgICBsZXQgaXRlbU91dGVyV2lkdGggPSBEb21IYW5kbGVyLmdldE91dGVyV2lkdGgocGFyZW50TWVudUl0ZW0uY2hpbGRyZW5bMF0pO1xuICAgICAgICBsZXQgaXRlbU91dGVySGVpZ2h0ID0gRG9tSGFuZGxlci5nZXRPdXRlckhlaWdodChwYXJlbnRNZW51SXRlbS5jaGlsZHJlblswXSk7XG4gICAgICAgIGxldCBjb250YWluZXJPZmZzZXQgPSBEb21IYW5kbGVyLmdldE9mZnNldChwYXJlbnRNZW51SXRlbS5wYXJlbnRFbGVtZW50KTtcblxuICAgICAgICBzdWJsaXN0LnN0eWxlLnpJbmRleCA9ICsrRG9tSGFuZGxlci56aW5kZXg7XG5cbiAgICAgICAgaWYgKHBhcnNlSW50KGNvbnRhaW5lck9mZnNldC50b3ApICsgaXRlbU91dGVySGVpZ2h0ICsgc3VibGlzdEhlaWdodCA+IHZpZXdwb3J0LmhlaWdodCAtIERvbUhhbmRsZXIuY2FsY3VsYXRlU2Nyb2xsYmFySGVpZ2h0KCkpIHtcbiAgICAgICAgICAgIHN1Ymxpc3Quc3R5bGUucmVtb3ZlUHJvcGVydHkoJ3RvcCcpO1xuICAgICAgICAgICAgc3VibGlzdC5zdHlsZS5ib3R0b20gPSAnMHB4JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1Ymxpc3Quc3R5bGUucmVtb3ZlUHJvcGVydHkoJ2JvdHRvbScpO1xuICAgICAgICAgICAgc3VibGlzdC5zdHlsZS50b3AgPSAnMHB4JztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwYXJzZUludChjb250YWluZXJPZmZzZXQubGVmdCkgKyBpdGVtT3V0ZXJXaWR0aCArIHN1Ymxpc3RXaWR0aCA+IHZpZXdwb3J0LndpZHRoIC0gRG9tSGFuZGxlci5jYWxjdWxhdGVTY3JvbGxiYXJXaWR0aCgpKSB7XG4gICAgICAgICAgICBzdWJsaXN0LnN0eWxlLmxlZnQgPSAtc3VibGlzdFdpZHRoICsgJ3B4JztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN1Ymxpc3Quc3R5bGUubGVmdCA9IGl0ZW1PdXRlcldpZHRoICsgJ3B4JztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzSXRlbU1hdGNoZWQobWVudWl0ZW0pIHtcbiAgICAgICAgcmV0dXJuIERvbUhhbmRsZXIuaGFzQ2xhc3MobWVudWl0ZW0sICdwLW1lbnVpdGVtJykgJiYgIURvbUhhbmRsZXIuaGFzQ2xhc3MobWVudWl0ZW0uY2hpbGRyZW5bMF0sICdwLWRpc2FibGVkJyk7XG4gICAgfVxuXG4gICAgZmluZE5leHRJdGVtKG1lbnVpdGVtLCBpc1JlcGVhdGVkPykge1xuICAgICAgICBsZXQgbmV4dE1lbnVpdGVtID0gbWVudWl0ZW0ubmV4dEVsZW1lbnRTaWJsaW5nO1xuXG4gICAgICAgIGlmIChuZXh0TWVudWl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmlzSXRlbU1hdGNoZWQobmV4dE1lbnVpdGVtKSA/IG5leHRNZW51aXRlbSA6IHRoaXMuZmluZE5leHRJdGVtKG5leHRNZW51aXRlbSwgaXNSZXBlYXRlZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBsZXQgZmlyc3RJdGVtID0gbWVudWl0ZW0ucGFyZW50RWxlbWVudC5jaGlsZHJlblswXTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNJdGVtTWF0Y2hlZChmaXJzdEl0ZW0pID8gZmlyc3RJdGVtIDogIWlzUmVwZWF0ZWQgPyB0aGlzLmZpbmROZXh0SXRlbShmaXJzdEl0ZW0sIHRydWUpIDogbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZpbmRQcmV2SXRlbShtZW51aXRlbSwgaXNSZXBlYXRlZD8pIHtcbiAgICAgICAgbGV0IHByZXZNZW51aXRlbSA9IG1lbnVpdGVtLnByZXZpb3VzRWxlbWVudFNpYmxpbmc7XG5cbiAgICAgICAgaWYgKHByZXZNZW51aXRlbSkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNJdGVtTWF0Y2hlZChwcmV2TWVudWl0ZW0pID8gcHJldk1lbnVpdGVtIDogdGhpcy5maW5kUHJldkl0ZW0ocHJldk1lbnVpdGVtLCBpc1JlcGVhdGVkKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxldCBsYXN0SXRlbSA9IG1lbnVpdGVtLnBhcmVudEVsZW1lbnQuY2hpbGRyZW5bbWVudWl0ZW0ucGFyZW50RWxlbWVudC5jaGlsZHJlbi5sZW5ndGggLSAxXTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaXNJdGVtTWF0Y2hlZChsYXN0SXRlbSkgPyBsYXN0SXRlbSA6ICFpc1JlcGVhdGVkID8gdGhpcy5maW5kUHJldkl0ZW0obGFzdEl0ZW0sIHRydWUpIDogbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEFjdGl2ZUl0ZW0oKSB7XG4gICAgICAgIGxldCBhY3RpdmVJdGVtS2V5ID0gdGhpcy5jb250ZXh0TWVudVNlcnZpY2UuYWN0aXZlSXRlbUtleTtcblxuICAgICAgICByZXR1cm4gYWN0aXZlSXRlbUtleSA9PSBudWxsID8gbnVsbCA6IERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LCAnLnAtbWVudWl0ZW1bZGF0YS1paz1cIicgKyBhY3RpdmVJdGVtS2V5ICsgJ1wiXScpO1xuICAgIH1cblxuICAgIGNsZWFyQWN0aXZlSXRlbSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLmFjdGl2ZUl0ZW1LZXkpIHtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlQWN0aXZlRnJvbVN1Ykxpc3RzKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudVNlcnZpY2UucmVzZXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZUFjdGl2ZUZyb21TdWJMaXN0cyhlbCkge1xuICAgICAgICBsZXQgc3VibGlzdHMgPSBEb21IYW5kbGVyLmZpbmQoZWwsICcucC1zdWJtZW51LWxpc3QtYWN0aXZlJyk7XG5cbiAgICAgICAgZm9yIChsZXQgc3VibGlzdCBvZiBzdWJsaXN0cykge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyhzdWJsaXN0LCAncC1zdWJtZW51LWxpc3QtYWN0aXZlJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZW1vdmVBY3RpdmVGcm9tU3VibGlzdChtZW51aXRlbSkge1xuICAgICAgICBpZiAobWVudWl0ZW0pIHtcbiAgICAgICAgICAgIGxldCBzdWJsaXN0ID0gRG9tSGFuZGxlci5maW5kU2luZ2xlKG1lbnVpdGVtLCAnLnAtc3VibWVudS1saXN0Jyk7XG5cbiAgICAgICAgICAgIGlmIChzdWJsaXN0ICYmIERvbUhhbmRsZXIuaGFzQ2xhc3MobWVudWl0ZW0sICdwLXN1Ym1lbnUtbGlzdC1hY3RpdmUnKSkge1xuICAgICAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3MobWVudWl0ZW0sICdwLXN1Ym1lbnUtbGlzdC1hY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIGJpbmRHbG9iYWxMaXN0ZW5lcnMoKSB7XG4gICAgICAgIGlmICghdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGRvY3VtZW50VGFyZ2V0OiBhbnkgPSB0aGlzLmVsID8gdGhpcy5lbC5uYXRpdmVFbGVtZW50Lm93bmVyRG9jdW1lbnQgOiAnZG9jdW1lbnQnO1xuXG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKGRvY3VtZW50VGFyZ2V0LCAnY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5vZmZzZXRQYXJlbnQgJiYgdGhpcy5pc091dHNpZGVDbGlja2VkKGV2ZW50KSAmJiAhZXZlbnQuY3RybEtleSAmJiBldmVudC5idXR0b24gIT09IDIgJiYgdGhpcy50cmlnZ2VyRXZlbnQgIT09ICdjbGljaycpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRUcmlnZ2VyTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbihkb2N1bWVudFRhcmdldCwgdGhpcy50cmlnZ2VyRXZlbnQsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50Lm9mZnNldFBhcmVudCAmJiB0aGlzLmlzT3V0c2lkZUNsaWNrZWQoZXZlbnQpICYmICF0aGlzLnByZXZlbnREb2N1bWVudERlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucHJldmVudERvY3VtZW50RGVmYXVsdCA9IGZhbHNlO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKCF0aGlzLndpbmRvd1Jlc2l6ZUxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgdGhpcy53aW5kb3dSZXNpemVMaXN0ZW5lciA9IHRoaXMub25XaW5kb3dSZXNpemUuYmluZCh0aGlzKTtcbiAgICAgICAgICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgdGhpcy53aW5kb3dSZXNpemVMaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghdGhpcy5kb2N1bWVudEtleWRvd25MaXN0ZW5lcikge1xuICAgICAgICAgICAgY29uc3QgZG9jdW1lbnRUYXJnZXQ6IGFueSA9IHRoaXMuZWwgPyB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQub3duZXJEb2N1bWVudCA6ICdkb2N1bWVudCc7XG5cbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRLZXlkb3duTGlzdGVuZXIgPSB0aGlzLnJlbmRlcmVyLmxpc3Rlbihkb2N1bWVudFRhcmdldCwgJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgYWN0aXZlSXRlbSA9IHRoaXMuZ2V0QWN0aXZlSXRlbSgpO1xuXG4gICAgICAgICAgICAgICAgc3dpdGNoIChldmVudC5rZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dEb3duJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBY3RpdmVGcm9tU3VibGlzdChhY3RpdmVJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVJdGVtID0gdGhpcy5maW5kTmV4dEl0ZW0oYWN0aXZlSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaXJzdEl0ZW0gPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUodGhpcy5jb250YWluZXJWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCwgJy5wLW1lbnVpdGVtLWxpbmsnKS5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZUl0ZW0gPSB0aGlzLmlzSXRlbU1hdGNoZWQoZmlyc3RJdGVtKSA/IGZpcnN0SXRlbSA6IHRoaXMuZmluZE5leHRJdGVtKGZpcnN0SXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudVNlcnZpY2UuY2hhbmdlS2V5KGFjdGl2ZUl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWlrJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dVcCc6XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlQWN0aXZlRnJvbVN1Ymxpc3QoYWN0aXZlSXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlSXRlbSA9IHRoaXMuZmluZFByZXZJdGVtKGFjdGl2ZUl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgc3VibGlzdCA9IERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LCAndWwnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbGFzdEl0ZW0gPSBzdWJsaXN0LmNoaWxkcmVuW3N1Ymxpc3QuY2hpbGRyZW4ubGVuZ3RoIC0gMV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlSXRlbSA9IHRoaXMuaXNJdGVtTWF0Y2hlZChsYXN0SXRlbSkgPyBsYXN0SXRlbSA6IHRoaXMuZmluZFByZXZJdGVtKGxhc3RJdGVtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHRNZW51U2VydmljZS5jaGFuZ2VLZXkoYWN0aXZlSXRlbS5nZXRBdHRyaWJ1dGUoJ2RhdGEtaWsnKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgICAgICBjYXNlICdBcnJvd1JpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN1Ymxpc3QgPSBEb21IYW5kbGVyLmZpbmRTaW5nbGUoYWN0aXZlSXRlbSwgJy5wLXN1Ym1lbnUtbGlzdCcpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN1Ymxpc3QpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyhzdWJsaXN0LCAncC1zdWJtZW51LWxpc3QtYWN0aXZlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlSXRlbSA9IERvbUhhbmRsZXIuZmluZFNpbmdsZShzdWJsaXN0LCAnLnAtbWVudWl0ZW0tbGluazpub3QoLnAtZGlzYWJsZWQpJykucGFyZW50RWxlbWVudDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoYWN0aXZlSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0TWVudVNlcnZpY2UuY2hhbmdlS2V5KGFjdGl2ZUl0ZW0uZ2V0QXR0cmlidXRlKCdkYXRhLWlrJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgY2FzZSAnQXJyb3dMZWZ0JzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHN1Ymxpc3QgPSBhY3RpdmVJdGVtLnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3VibGlzdCAmJiBEb21IYW5kbGVyLmhhc0NsYXNzKHN1Ymxpc3QsICdwLXN1Ym1lbnUtbGlzdC1hY3RpdmUnKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLnJlbW92ZUNsYXNzKHN1Ymxpc3QsICdwLXN1Ym1lbnUtbGlzdC1hY3RpdmUnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmVJdGVtID0gc3VibGlzdC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGFjdGl2ZUl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLmNoYW5nZUtleShhY3RpdmVJdGVtLmdldEF0dHJpYnV0ZSgnZGF0YS1paycpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0VzY2FwZSc6XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgICAgIGNhc2UgJ0VudGVyJzpcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChhY3RpdmVJdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVJdGVtQ2xpY2soZXZlbnQsIHRoaXMuZmluZE1vZGVsSXRlbUZyb21LZXkodGhpcy5jb250ZXh0TWVudVNlcnZpY2UuYWN0aXZlSXRlbUtleSksIGFjdGl2ZUl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZmluZE1vZGVsSXRlbUZyb21LZXkoa2V5KSB7XG4gICAgICAgIGlmIChrZXkgPT0gbnVsbCB8fCAhdGhpcy5tb2RlbCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgaW5kZXhlcyA9IGtleS5zcGxpdCgnXycpO1xuICAgICAgICByZXR1cm4gaW5kZXhlcy5yZWR1Y2UoKGl0ZW0sIGN1cnJlbnRJbmRleCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGl0ZW0gPyBpdGVtLml0ZW1zW2N1cnJlbnRJbmRleF0gOiB0aGlzLm1vZGVsW2N1cnJlbnRJbmRleF07XG4gICAgICAgIH0sIG51bGwpO1xuICAgIH1cblxuICAgIGhhbmRsZUl0ZW1DbGljayhldmVudCwgaXRlbSwgbWVudWl0ZW0pIHtcbiAgICAgICAgaWYgKCFpdGVtIHx8IGl0ZW0uZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpdGVtLmNvbW1hbmQpIHtcbiAgICAgICAgICAgIGl0ZW0uY29tbWFuZCh7XG4gICAgICAgICAgICAgICAgb3JpZ2luYWxFdmVudDogZXZlbnQsXG4gICAgICAgICAgICAgICAgaXRlbTogaXRlbVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXRlbS5pdGVtcykge1xuICAgICAgICAgICAgbGV0IGNoaWxkU3VibGlzdCA9IERvbUhhbmRsZXIuZmluZFNpbmdsZShtZW51aXRlbSwgJy5wLXN1Ym1lbnUtbGlzdCcpO1xuXG4gICAgICAgICAgICBpZiAoY2hpbGRTdWJsaXN0KSB7XG4gICAgICAgICAgICAgICAgaWYgKERvbUhhbmRsZXIuaGFzQ2xhc3MoY2hpbGRTdWJsaXN0LCAncC1zdWJtZW51LWxpc3QtYWN0aXZlJykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVBY3RpdmVGcm9tU3ViTGlzdHMobWVudWl0ZW0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3MoY2hpbGRTdWJsaXN0LCAncC1zdWJtZW51LWxpc3QtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucG9zaXRpb25TdWJtZW51KGNoaWxkU3VibGlzdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCFpdGVtLml0ZW1zKSB7XG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVuYmluZEdsb2JhbExpc3RlbmVycygpIHtcbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRDbGlja0xpc3RlbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50Q2xpY2tMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5kb2N1bWVudENsaWNrTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRUcmlnZ2VyTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRUcmlnZ2VyTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRUcmlnZ2VyTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMud2luZG93UmVzaXplTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLndpbmRvd1Jlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMud2luZG93UmVzaXplTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuZG9jdW1lbnRLZXlkb3duTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRLZXlkb3duTGlzdGVuZXIoKTtcbiAgICAgICAgICAgIHRoaXMuZG9jdW1lbnRLZXlkb3duTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25XaW5kb3dSZXNpemUoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQub2Zmc2V0UGFyZW50KSB7XG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlzT3V0c2lkZUNsaWNrZWQoZXZlbnQ6IEV2ZW50KSB7XG4gICAgICAgIHJldHVybiAhKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuaXNTYW1lTm9kZShldmVudC50YXJnZXQpIHx8IHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudW5iaW5kR2xvYmFsTGlzdGVuZXJzKCk7XG5cbiAgICAgICAgaWYgKHRoaXMudHJpZ2dlckV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckV2ZW50TGlzdGVuZXIoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZCAmJiB0aGlzLmF1dG9aSW5kZXgpIHtcbiAgICAgICAgICAgIFpJbmRleFV0aWxzLmNsZWFyKHRoaXMuY29udGFpbmVyVmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYXBwZW5kVG8pIHtcbiAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lclZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubmdEZXN0cm95JC5uZXh0KHRydWUpO1xuICAgICAgICB0aGlzLm5nRGVzdHJveSQuY29tcGxldGUoKTtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgUm91dGVyTW9kdWxlLCBSaXBwbGVNb2R1bGUsIFRvb2x0aXBNb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtDb250ZXh0TWVudSwgUm91dGVyTW9kdWxlLCBUb29sdGlwTW9kdWxlXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtDb250ZXh0TWVudSwgQ29udGV4dE1lbnVTdWJdLFxuICAgIHByb3ZpZGVyczogW0NvbnRleHRNZW51U2VydmljZV1cbn0pXG5leHBvcnQgY2xhc3MgQ29udGV4dE1lbnVNb2R1bGUge31cbiJdfQ==