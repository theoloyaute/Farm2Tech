import { animate, state, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, forwardRef, Inject, Input, NgModule, Output, ViewEncapsulation } from '@angular/core';
import { Header, PrimeTemplate, SharedModule } from 'primeng/api';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
let idx = 0;
export class AccordionTab {
    constructor(accordion, changeDetector) {
        this.changeDetector = changeDetector;
        this.cache = true;
        this.selectedChange = new EventEmitter();
        this.transitionOptions = '400ms cubic-bezier(0.86, 0, 0.07, 1)';
        this.iconPos = 'start';
        this.id = `p-accordiontab-${idx++}`;
        this.accordion = accordion;
    }
    get selected() {
        return this._selected;
    }
    set selected(val) {
        this._selected = val;
        if (!this.loaded) {
            if (this._selected && this.cache) {
                this.loaded = true;
            }
            this.changeDetector.detectChanges();
        }
    }
    get iconClass() {
        if (this.iconPos === 'end') {
            return 'p-accordion-toggle-icon-end';
        }
        else {
            return 'p-accordion-toggle-icon';
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                case 'header':
                    this.headerTemplate = item.template;
                    break;
                default:
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }
    toggle(event) {
        if (this.disabled) {
            return false;
        }
        let index = this.findTabIndex();
        if (this.selected) {
            this.selected = false;
            this.accordion.onClose.emit({ originalEvent: event, index: index });
        }
        else {
            if (!this.accordion.multiple) {
                for (var i = 0; i < this.accordion.tabs.length; i++) {
                    if (this.accordion.tabs[i].selected) {
                        this.accordion.tabs[i].selected = false;
                        this.accordion.tabs[i].selectedChange.emit(false);
                        this.accordion.tabs[i].changeDetector.markForCheck();
                    }
                }
            }
            this.selected = true;
            this.loaded = true;
            this.accordion.onOpen.emit({ originalEvent: event, index: index });
        }
        this.selectedChange.emit(this.selected);
        this.accordion.updateActiveIndex();
        this.changeDetector.markForCheck();
        event.preventDefault();
    }
    findTabIndex() {
        let index = -1;
        for (var i = 0; i < this.accordion.tabs.length; i++) {
            if (this.accordion.tabs[i] == this) {
                index = i;
                break;
            }
        }
        return index;
    }
    get hasHeaderFacet() {
        return this.headerFacet && this.headerFacet.length > 0;
    }
    onKeydown(event) {
        if (event.which === 32 || event.which === 13) {
            this.toggle(event);
            event.preventDefault();
        }
    }
    ngOnDestroy() {
        this.accordion.tabs.splice(this.findTabIndex(), 1);
    }
}
AccordionTab.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: AccordionTab, deps: [{ token: forwardRef(() => Accordion) }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
AccordionTab.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.0", type: AccordionTab, selector: "p-accordionTab", inputs: { header: "header", headerStyle: "headerStyle", tabStyle: "tabStyle", contentStyle: "contentStyle", tabStyleClass: "tabStyleClass", headerStyleClass: "headerStyleClass", contentStyleClass: "contentStyleClass", disabled: "disabled", cache: "cache", transitionOptions: "transitionOptions", iconPos: "iconPos", selected: "selected" }, outputs: { selectedChange: "selectedChange" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "headerFacet", predicate: Header }, { propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <div class="p-accordion-tab" [class.p-accordion-tab-active]="selected" [ngClass]="tabStyleClass" [ngStyle]="tabStyle">
            <div class="p-accordion-header" [class.p-highlight]="selected" [class.p-disabled]="disabled">
                <a
                    [ngClass]="headerStyleClass"
                    [style]="headerStyle"
                    role="tab"
                    class="p-accordion-header-link"
                    (click)="toggle($event)"
                    (keydown)="onKeydown($event)"
                    [attr.tabindex]="disabled ? null : 0"
                    [attr.id]="id"
                    [attr.aria-controls]="id + '-content'"
                    [attr.aria-expanded]="selected"
                >
                    <span [class]="iconClass" [ngClass]="selected ? accordion.collapseIcon : accordion.expandIcon"></span>
                    <span class="p-accordion-header-text" *ngIf="!hasHeaderFacet">
                        {{ header }}
                    </span>
                    <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
                    <ng-content select="p-header" *ngIf="hasHeaderFacet"></ng-content>
                </a>
            </div>
            <div
                [attr.id]="id + '-content'"
                class="p-toggleable-content"
                [@tabContent]="selected ? { value: 'visible', params: { transitionParams: transitionOptions } } : { value: 'hidden', params: { transitionParams: transitionOptions } }"
                role="region"
                [attr.aria-hidden]="!selected"
                [attr.aria-labelledby]="id"
            >
                <div class="p-accordion-content" [ngClass]="contentStyleClass" [ngStyle]="contentStyle">
                    <ng-content></ng-content>
                    <ng-container *ngIf="contentTemplate && (cache ? loaded : selected)">
                        <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
                    </ng-container>
                </div>
            </div>
        </div>
    `, isInline: true, styles: [".p-accordion-header-link{cursor:pointer;display:flex;align-items:center;-webkit-user-select:none;user-select:none;position:relative;text-decoration:none}.p-accordion-header-link:focus{z-index:1}.p-accordion-header-text{line-height:1}.p-accordion .p-toggleable-content{overflow:hidden}.p-accordion .p-accordion-tab-active>.p-toggleable-content:not(.ng-animating){overflow:inherit}.p-accordion-toggle-icon-end{order:1;margin-left:auto}.p-accordion-toggle-icon{order:0}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], animations: [
        trigger('tabContent', [
            state('hidden', style({
                height: '0'
            })),
            state('visible', style({
                height: '*'
            })),
            transition('visible <=> hidden', [animate('{{transitionParams}}')]),
            transition('void => *', animate(0))
        ])
    ], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: AccordionTab, decorators: [{
            type: Component,
            args: [{ selector: 'p-accordionTab', template: `
        <div class="p-accordion-tab" [class.p-accordion-tab-active]="selected" [ngClass]="tabStyleClass" [ngStyle]="tabStyle">
            <div class="p-accordion-header" [class.p-highlight]="selected" [class.p-disabled]="disabled">
                <a
                    [ngClass]="headerStyleClass"
                    [style]="headerStyle"
                    role="tab"
                    class="p-accordion-header-link"
                    (click)="toggle($event)"
                    (keydown)="onKeydown($event)"
                    [attr.tabindex]="disabled ? null : 0"
                    [attr.id]="id"
                    [attr.aria-controls]="id + '-content'"
                    [attr.aria-expanded]="selected"
                >
                    <span [class]="iconClass" [ngClass]="selected ? accordion.collapseIcon : accordion.expandIcon"></span>
                    <span class="p-accordion-header-text" *ngIf="!hasHeaderFacet">
                        {{ header }}
                    </span>
                    <ng-container *ngTemplateOutlet="headerTemplate"></ng-container>
                    <ng-content select="p-header" *ngIf="hasHeaderFacet"></ng-content>
                </a>
            </div>
            <div
                [attr.id]="id + '-content'"
                class="p-toggleable-content"
                [@tabContent]="selected ? { value: 'visible', params: { transitionParams: transitionOptions } } : { value: 'hidden', params: { transitionParams: transitionOptions } }"
                role="region"
                [attr.aria-hidden]="!selected"
                [attr.aria-labelledby]="id"
            >
                <div class="p-accordion-content" [ngClass]="contentStyleClass" [ngStyle]="contentStyle">
                    <ng-content></ng-content>
                    <ng-container *ngIf="contentTemplate && (cache ? loaded : selected)">
                        <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
                    </ng-container>
                </div>
            </div>
        </div>
    `, animations: [
                        trigger('tabContent', [
                            state('hidden', style({
                                height: '0'
                            })),
                            state('visible', style({
                                height: '*'
                            })),
                            transition('visible <=> hidden', [animate('{{transitionParams}}')]),
                            transition('void => *', animate(0))
                        ])
                    ], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-accordion-header-link{cursor:pointer;display:flex;align-items:center;-webkit-user-select:none;user-select:none;position:relative;text-decoration:none}.p-accordion-header-link:focus{z-index:1}.p-accordion-header-text{line-height:1}.p-accordion .p-toggleable-content{overflow:hidden}.p-accordion .p-accordion-tab-active>.p-toggleable-content:not(.ng-animating){overflow:inherit}.p-accordion-toggle-icon-end{order:1;margin-left:auto}.p-accordion-toggle-icon{order:0}\n"] }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [forwardRef(() => Accordion)]
                }] }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { header: [{
                type: Input
            }], headerStyle: [{
                type: Input
            }], tabStyle: [{
                type: Input
            }], contentStyle: [{
                type: Input
            }], tabStyleClass: [{
                type: Input
            }], headerStyleClass: [{
                type: Input
            }], contentStyleClass: [{
                type: Input
            }], disabled: [{
                type: Input
            }], cache: [{
                type: Input
            }], selectedChange: [{
                type: Output
            }], transitionOptions: [{
                type: Input
            }], iconPos: [{
                type: Input
            }], headerFacet: [{
                type: ContentChildren,
                args: [Header]
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], selected: [{
                type: Input
            }] } });
export class Accordion {
    constructor(el, changeDetector) {
        this.el = el;
        this.changeDetector = changeDetector;
        this.onClose = new EventEmitter();
        this.onOpen = new EventEmitter();
        this.expandIcon = 'pi pi-fw pi-chevron-right';
        this.collapseIcon = 'pi pi-fw pi-chevron-down';
        this.activeIndexChange = new EventEmitter();
        this.tabs = [];
    }
    ngAfterContentInit() {
        this.initTabs();
        this.tabListSubscription = this.tabList.changes.subscribe((_) => {
            this.initTabs();
        });
    }
    initTabs() {
        this.tabs = this.tabList.toArray();
        this.updateSelectionState();
        this.changeDetector.markForCheck();
    }
    getBlockableElement() {
        return this.el.nativeElement.children[0];
    }
    get activeIndex() {
        return this._activeIndex;
    }
    set activeIndex(val) {
        this._activeIndex = val;
        if (this.preventActiveIndexPropagation) {
            this.preventActiveIndexPropagation = false;
            return;
        }
        this.updateSelectionState();
    }
    updateSelectionState() {
        if (this.tabs && this.tabs.length && this._activeIndex != null) {
            for (let i = 0; i < this.tabs.length; i++) {
                let selected = this.multiple ? this._activeIndex.includes(i) : i === this._activeIndex;
                let changed = selected !== this.tabs[i].selected;
                if (changed) {
                    this.tabs[i].selected = selected;
                    this.tabs[i].selectedChange.emit(selected);
                    this.tabs[i].changeDetector.markForCheck();
                }
            }
        }
    }
    updateActiveIndex() {
        let index = this.multiple ? [] : null;
        this.tabs.forEach((tab, i) => {
            if (tab.selected) {
                if (this.multiple) {
                    index.push(i);
                }
                else {
                    index = i;
                    return;
                }
            }
        });
        this.preventActiveIndexPropagation = true;
        this.activeIndexChange.emit(index);
    }
    ngOnDestroy() {
        if (this.tabListSubscription) {
            this.tabListSubscription.unsubscribe();
        }
    }
}
Accordion.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: Accordion, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
Accordion.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.0", type: Accordion, selector: "p-accordion", inputs: { multiple: "multiple", style: "style", styleClass: "styleClass", expandIcon: "expandIcon", collapseIcon: "collapseIcon", activeIndex: "activeIndex" }, outputs: { onClose: "onClose", onOpen: "onOpen", activeIndexChange: "activeIndexChange" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "tabList", predicate: AccordionTab }], ngImport: i0, template: `
        <div [ngClass]="'p-accordion p-component'" [ngStyle]="style" [class]="styleClass" role="tablist">
            <ng-content></ng-content>
        </div>
    `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: Accordion, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-accordion',
                    template: `
        <div [ngClass]="'p-accordion p-component'" [ngStyle]="style" [class]="styleClass" role="tablist">
            <ng-content></ng-content>
        </div>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { multiple: [{
                type: Input
            }], onClose: [{
                type: Output
            }], onOpen: [{
                type: Output
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], expandIcon: [{
                type: Input
            }], collapseIcon: [{
                type: Input
            }], activeIndexChange: [{
                type: Output
            }], tabList: [{
                type: ContentChildren,
                args: [AccordionTab]
            }], activeIndex: [{
                type: Input
            }] } });
export class AccordionModule {
}
AccordionModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: AccordionModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AccordionModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.1.0", ngImport: i0, type: AccordionModule, declarations: [Accordion, AccordionTab], imports: [CommonModule], exports: [Accordion, AccordionTab, SharedModule] });
AccordionModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: AccordionModule, imports: [CommonModule, SharedModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: AccordionModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Accordion, AccordionTab, SharedModule],
                    declarations: [Accordion, AccordionTab]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWNjb3JkaW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2FjY29yZGlvbi9hY2NvcmRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNqRixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFvQix1QkFBdUIsRUFBcUIsU0FBUyxFQUFFLGVBQWUsRUFBYyxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFhLE1BQU0sRUFBMEIsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdFAsT0FBTyxFQUFlLE1BQU0sRUFBRSxhQUFhLEVBQUUsWUFBWSxFQUFFLE1BQU0sYUFBYSxDQUFDOzs7QUFHL0UsSUFBSSxHQUFHLEdBQVcsQ0FBQyxDQUFDO0FBcUVwQixNQUFNLE9BQU8sWUFBWTtJQWlFckIsWUFBaUQsU0FBUyxFQUFTLGNBQWlDO1FBQWpDLG1CQUFjLEdBQWQsY0FBYyxDQUFtQjtRQWhEM0YsVUFBSyxHQUFZLElBQUksQ0FBQztRQUVyQixtQkFBYyxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRXhELHNCQUFpQixHQUFXLHNDQUFzQyxDQUFDO1FBRW5FLFlBQU8sR0FBVyxPQUFPLENBQUM7UUFvQ25DLE9BQUUsR0FBVyxrQkFBa0IsR0FBRyxFQUFFLEVBQUUsQ0FBQztRQU9uQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQXNCLENBQUM7SUFDNUMsQ0FBQztJQXBDRCxJQUFhLFFBQVE7UUFDakIsT0FBTyxJQUFJLENBQUMsU0FBUyxDQUFDO0lBQzFCLENBQUM7SUFFRCxJQUFJLFFBQVEsQ0FBQyxHQUFRO1FBQ2pCLElBQUksQ0FBQyxTQUFTLEdBQUcsR0FB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QUFNO3NCQUFmLE1BQU07Z0JBRUUsS0FBSztzQkFBYixLQUFLO2dCQUVHLFVBQVU7c0JBQWxCLEtBQUs7Z0JBRUcsVUFBVTtzQkFBbEIsS0FBSztnQkFFRyxZQUFZO3NCQUFwQixLQUFLO2dCQUVJLGlCQUFpQjtzQkFBMUIsTUFBTTtnQkFFd0IsT0FBTztzQkFBckMsZUFBZTt1QkFBQyxZQUFZO2dCQThCaEIsV0FBVztzQkFBdkIsS0FBSzs7QUEwRFYsTUFBTSxPQUFPLGVBQWU7OzRHQUFmLGVBQWU7NkdBQWYsZUFBZSxpQkF6R2YsU0FBUyxFQS9KVCxZQUFZLGFBb1FYLFlBQVksYUFyR2IsU0FBUyxFQS9KVCxZQUFZLEVBcVFjLFlBQVk7NkdBR3RDLGVBQWUsWUFKZCxZQUFZLEVBQ2EsWUFBWTsyRkFHdEMsZUFBZTtrQkFMM0IsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7b0JBQ3ZCLE9BQU8sRUFBRSxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsWUFBWSxDQUFDO29CQUNoRCxZQUFZLEVBQUUsQ0FBQyxTQUFTLEVBQUUsWUFBWSxDQUFDO2lCQUMxQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFuaW1hdGUsIHN0YXRlLCBzdHlsZSwgdHJhbnNpdGlvbiwgdHJpZ2dlciB9IGZyb20gJ0Bhbmd1bGFyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEFmdGVyQ29udGVudEluaXQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBDb250ZW50Q2hpbGRyZW4sIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZiwgSW5qZWN0LCBJbnB1dCwgTmdNb2R1bGUsIE9uRGVzdHJveSwgT3V0cHV0LCBRdWVyeUxpc3QsIFRlbXBsYXRlUmVmLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmxvY2thYmxlVUksIEhlYWRlciwgUHJpbWVUZW1wbGF0ZSwgU2hhcmVkTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9hcGknO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5cbmxldCBpZHg6IG51bWJlciA9IDA7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1hY2NvcmRpb25UYWInLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgY2xhc3M9XCJwLWFjY29yZGlvbi10YWJcIiBbY2xhc3MucC1hY2NvcmRpb24tdGFiLWFjdGl2ZV09XCJzZWxlY3RlZFwiIFtuZ0NsYXNzXT1cInRhYlN0eWxlQ2xhc3NcIiBbbmdTdHlsZV09XCJ0YWJTdHlsZVwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInAtYWNjb3JkaW9uLWhlYWRlclwiIFtjbGFzcy5wLWhpZ2hsaWdodF09XCJzZWxlY3RlZFwiIFtjbGFzcy5wLWRpc2FibGVkXT1cImRpc2FibGVkXCI+XG4gICAgICAgICAgICAgICAgPGFcbiAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwiaGVhZGVyU3R5bGVDbGFzc1wiXG4gICAgICAgICAgICAgICAgICAgIFtzdHlsZV09XCJoZWFkZXJTdHlsZVwiXG4gICAgICAgICAgICAgICAgICAgIHJvbGU9XCJ0YWJcIlxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cInAtYWNjb3JkaW9uLWhlYWRlci1saW5rXCJcbiAgICAgICAgICAgICAgICAgICAgKGNsaWNrKT1cInRvZ2dsZSgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgKGtleWRvd24pPVwib25LZXlkb3duKCRldmVudClcIlxuICAgICAgICAgICAgICAgICAgICBbYXR0ci50YWJpbmRleF09XCJkaXNhYmxlZCA/IG51bGwgOiAwXCJcbiAgICAgICAgICAgICAgICAgICAgW2F0dHIuaWRdPVwiaWRcIlxuICAgICAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWNvbnRyb2xzXT1cImlkICsgJy1jb250ZW50J1wiXG4gICAgICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtZXhwYW5kZWRdPVwic2VsZWN0ZWRcIlxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gW2NsYXNzXT1cImljb25DbGFzc1wiIFtuZ0NsYXNzXT1cInNlbGVjdGVkID8gYWNjb3JkaW9uLmNvbGxhcHNlSWNvbiA6IGFjY29yZGlvbi5leHBhbmRJY29uXCI+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtYWNjb3JkaW9uLWhlYWRlci10ZXh0XCIgKm5nSWY9XCIhaGFzSGVhZGVyRmFjZXRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt7IGhlYWRlciB9fVxuICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJoZWFkZXJUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGVudCBzZWxlY3Q9XCJwLWhlYWRlclwiICpuZ0lmPVwiaGFzSGVhZGVyRmFjZXRcIj48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICAgICAgPC9hPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgW2F0dHIuaWRdPVwiaWQgKyAnLWNvbnRlbnQnXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cInAtdG9nZ2xlYWJsZS1jb250ZW50XCJcbiAgICAgICAgICAgICAgICBbQHRhYkNvbnRlbnRdPVwic2VsZWN0ZWQgPyB7IHZhbHVlOiAndmlzaWJsZScsIHBhcmFtczogeyB0cmFuc2l0aW9uUGFyYW1zOiB0cmFuc2l0aW9uT3B0aW9ucyB9IH0gOiB7IHZhbHVlOiAnaGlkZGVuJywgcGFyYW1zOiB7IHRyYW5zaXRpb25QYXJhbXM6IHRyYW5zaXRpb25PcHRpb25zIH0gfVwiXG4gICAgICAgICAgICAgICAgcm9sZT1cInJlZ2lvblwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1oaWRkZW5dPVwiIXNlbGVjdGVkXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiaWRcIlxuICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLWFjY29yZGlvbi1jb250ZW50XCIgW25nQ2xhc3NdPVwiY29udGVudFN0eWxlQ2xhc3NcIiBbbmdTdHlsZV09XCJjb250ZW50U3R5bGVcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiY29udGVudFRlbXBsYXRlICYmIChjYWNoZSA/IGxvYWRlZCA6IHNlbGVjdGVkKVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImNvbnRlbnRUZW1wbGF0ZVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGFuaW1hdGlvbnM6IFtcbiAgICAgICAgdHJpZ2dlcigndGFiQ29udGVudCcsIFtcbiAgICAgICAgICAgIHN0YXRlKFxuICAgICAgICAgICAgICAgICdoaWRkZW4nLFxuICAgICAgICAgICAgICAgIHN0eWxlKHtcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnMCdcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKSxcbiAgICAgICAgICAgIHN0YXRlKFxuICAgICAgICAgICAgICAgICd2aXNpYmxlJyxcbiAgICAgICAgICAgICAgICBzdHlsZSh7XG4gICAgICAgICAgICAgICAgICAgIGhlaWdodDogJyonXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICksXG4gICAgICAgICAgICB0cmFuc2l0aW9uKCd2aXNpYmxlIDw9PiBoaWRkZW4nLCBbYW5pbWF0ZSgne3t0cmFuc2l0aW9uUGFyYW1zfX0nKV0pLFxuICAgICAgICAgICAgdHJhbnNpdGlvbigndm9pZCA9PiAqJywgYW5pbWF0ZSgwKSlcbiAgICAgICAgXSlcbiAgICBdLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgc3R5bGVVcmxzOiBbJy4vYWNjb3JkaW9uLmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBBY2NvcmRpb25UYWIgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xuICAgIEBJbnB1dCgpIGhlYWRlcjogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgaGVhZGVyU3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHRhYlN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBjb250ZW50U3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHRhYlN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGhlYWRlclN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGNvbnRlbnRTdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGNhY2hlOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBPdXRwdXQoKSBzZWxlY3RlZENoYW5nZTogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBASW5wdXQoKSB0cmFuc2l0aW9uT3B0aW9uczogc3RyaW5nID0gJzQwMG1zIGN1YmljLWJlemllcigwLjg2LCAwLCAwLjA3LCAxKSc7XG5cbiAgICBASW5wdXQoKSBpY29uUG9zOiBzdHJpbmcgPSAnc3RhcnQnO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihIZWFkZXIpIGhlYWRlckZhY2V0OiBRdWVyeUxpc3Q8SGVhZGVyPjtcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8YW55PjtcblxuICAgIHByaXZhdGUgX3NlbGVjdGVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgZ2V0IHNlbGVjdGVkKCk6IGFueSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zZWxlY3RlZDtcbiAgICB9XG5cbiAgICBzZXQgc2VsZWN0ZWQodmFsOiBhbnkpIHtcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWQgPSB2YWw7XG5cbiAgICAgICAgaWYgKCF0aGlzLmxvYWRlZCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuX3NlbGVjdGVkICYmIHRoaXMuY2FjaGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGljb25DbGFzcygpIHtcbiAgICAgICAgaWYgKHRoaXMuaWNvblBvcyA9PT0gJ2VuZCcpIHtcbiAgICAgICAgICAgIHJldHVybiAncC1hY2NvcmRpb24tdG9nZ2xlLWljb24tZW5kJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAncC1hY2NvcmRpb24tdG9nZ2xlLWljb24nO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY29udGVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgaGVhZGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBpZDogc3RyaW5nID0gYHAtYWNjb3JkaW9udGFiLSR7aWR4Kyt9YDtcblxuICAgIGxvYWRlZDogYm9vbGVhbjtcblxuICAgIGFjY29yZGlvbjogQWNjb3JkaW9uO1xuXG4gICAgY29uc3RydWN0b3IoQEluamVjdChmb3J3YXJkUmVmKCgpID0+IEFjY29yZGlvbikpIGFjY29yZGlvbiwgcHVibGljIGNoYW5nZURldGVjdG9yOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgICAgICB0aGlzLmFjY29yZGlvbiA9IGFjY29yZGlvbiBhcyBBY2NvcmRpb247XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY29udGVudCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudFRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdoZWFkZXInOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmhlYWRlclRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB0b2dnbGUoZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuZmluZFRhYkluZGV4KCk7XG5cbiAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIHRoaXMuYWNjb3JkaW9uLm9uQ2xvc2UuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50LCBpbmRleDogaW5kZXggfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMuYWNjb3JkaW9uLm11bHRpcGxlKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmFjY29yZGlvbi50YWJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmFjY29yZGlvbi50YWJzW2ldLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFjY29yZGlvbi50YWJzW2ldLnNlbGVjdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFjY29yZGlvbi50YWJzW2ldLnNlbGVjdGVkQ2hhbmdlLmVtaXQoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hY2NvcmRpb24udGFic1tpXS5jaGFuZ2VEZXRlY3Rvci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmxvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLmFjY29yZGlvbi5vbk9wZW4uZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50LCBpbmRleDogaW5kZXggfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNlbGVjdGVkQ2hhbmdlLmVtaXQodGhpcy5zZWxlY3RlZCk7XG4gICAgICAgIHRoaXMuYWNjb3JkaW9uLnVwZGF0ZUFjdGl2ZUluZGV4KCk7XG4gICAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBmaW5kVGFiSW5kZXgoKSB7XG4gICAgICAgIGxldCBpbmRleCA9IC0xO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYWNjb3JkaW9uLnRhYnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmFjY29yZGlvbi50YWJzW2ldID09IHRoaXMpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cblxuICAgIGdldCBoYXNIZWFkZXJGYWNldCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaGVhZGVyRmFjZXQgJiYgdGhpcy5oZWFkZXJGYWNldC5sZW5ndGggPiAwO1xuICAgIH1cblxuICAgIG9uS2V5ZG93bihldmVudDogS2V5Ym9hcmRFdmVudCkge1xuICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT09IDMyIHx8IGV2ZW50LndoaWNoID09PSAxMykge1xuICAgICAgICAgICAgdGhpcy50b2dnbGUoZXZlbnQpO1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLmFjY29yZGlvbi50YWJzLnNwbGljZSh0aGlzLmZpbmRUYWJJbmRleCgpLCAxKTtcbiAgICB9XG59XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1hY2NvcmRpb24nLFxuICAgIHRlbXBsYXRlOiBgXG4gICAgICAgIDxkaXYgW25nQ2xhc3NdPVwiJ3AtYWNjb3JkaW9uIHAtY29tcG9uZW50J1wiIFtuZ1N0eWxlXT1cInN0eWxlXCIgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIiByb2xlPVwidGFibGlzdFwiPlxuICAgICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICA8L2Rpdj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBBY2NvcmRpb24gaW1wbGVtZW50cyBCbG9ja2FibGVVSSwgQWZ0ZXJDb250ZW50SW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSBtdWx0aXBsZTogYm9vbGVhbjtcblxuICAgIEBPdXRwdXQoKSBvbkNsb3NlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbk9wZW46IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQElucHV0KCkgc3R5bGU6IGFueTtcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGV4cGFuZEljb246IHN0cmluZyA9ICdwaSBwaS1mdyBwaS1jaGV2cm9uLXJpZ2h0JztcblxuICAgIEBJbnB1dCgpIGNvbGxhcHNlSWNvbjogc3RyaW5nID0gJ3BpIHBpLWZ3IHBpLWNoZXZyb24tZG93bic7XG5cbiAgICBAT3V0cHV0KCkgYWN0aXZlSW5kZXhDaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQENvbnRlbnRDaGlsZHJlbihBY2NvcmRpb25UYWIpIHRhYkxpc3Q6IFF1ZXJ5TGlzdDxBY2NvcmRpb25UYWI+O1xuXG4gICAgdGFiTGlzdFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgcHJpdmF0ZSBfYWN0aXZlSW5kZXg6IGFueTtcblxuICAgIHByZXZlbnRBY3RpdmVJbmRleFByb3BhZ2F0aW9uOiBib29sZWFuO1xuXG4gICAgcHVibGljIHRhYnM6IEFjY29yZGlvblRhYltdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyBjaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9XG5cbiAgICBuZ0FmdGVyQ29udGVudEluaXQoKSB7XG4gICAgICAgIHRoaXMuaW5pdFRhYnMoKTtcblxuICAgICAgICB0aGlzLnRhYkxpc3RTdWJzY3JpcHRpb24gPSB0aGlzLnRhYkxpc3QuY2hhbmdlcy5zdWJzY3JpYmUoKF8pID0+IHtcbiAgICAgICAgICAgIHRoaXMuaW5pdFRhYnMoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaW5pdFRhYnMoKTogYW55IHtcbiAgICAgICAgdGhpcy50YWJzID0gdGhpcy50YWJMaXN0LnRvQXJyYXkoKTtcbiAgICAgICAgdGhpcy51cGRhdGVTZWxlY3Rpb25TdGF0ZSgpO1xuICAgICAgICB0aGlzLmNoYW5nZURldGVjdG9yLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIGdldEJsb2NrYWJsZUVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgICAgICByZXR1cm4gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBhY3RpdmVJbmRleCgpOiBhbnkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlSW5kZXg7XG4gICAgfVxuXG4gICAgc2V0IGFjdGl2ZUluZGV4KHZhbDogYW55KSB7XG4gICAgICAgIHRoaXMuX2FjdGl2ZUluZGV4ID0gdmFsO1xuICAgICAgICBpZiAodGhpcy5wcmV2ZW50QWN0aXZlSW5kZXhQcm9wYWdhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5wcmV2ZW50QWN0aXZlSW5kZXhQcm9wYWdhdGlvbiA9IGZhbHNlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVTZWxlY3Rpb25TdGF0ZSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZVNlbGVjdGlvblN0YXRlKCkge1xuICAgICAgICBpZiAodGhpcy50YWJzICYmIHRoaXMudGFicy5sZW5ndGggJiYgdGhpcy5fYWN0aXZlSW5kZXggIT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRhYnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgc2VsZWN0ZWQgPSB0aGlzLm11bHRpcGxlID8gdGhpcy5fYWN0aXZlSW5kZXguaW5jbHVkZXMoaSkgOiBpID09PSB0aGlzLl9hY3RpdmVJbmRleDtcbiAgICAgICAgICAgICAgICBsZXQgY2hhbmdlZCA9IHNlbGVjdGVkICE9PSB0aGlzLnRhYnNbaV0uc2VsZWN0ZWQ7XG5cbiAgICAgICAgICAgICAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYnNbaV0uc2VsZWN0ZWQgPSBzZWxlY3RlZDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YWJzW2ldLnNlbGVjdGVkQ2hhbmdlLmVtaXQoc2VsZWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYnNbaV0uY2hhbmdlRGV0ZWN0b3IubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgdXBkYXRlQWN0aXZlSW5kZXgoKSB7XG4gICAgICAgIGxldCBpbmRleDogYW55ID0gdGhpcy5tdWx0aXBsZSA/IFtdIDogbnVsbDtcbiAgICAgICAgdGhpcy50YWJzLmZvckVhY2goKHRhYiwgaSkgPT4ge1xuICAgICAgICAgICAgaWYgKHRhYi5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm11bHRpcGxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4LnB1c2goaSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnByZXZlbnRBY3RpdmVJbmRleFByb3BhZ2F0aW9uID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5hY3RpdmVJbmRleENoYW5nZS5lbWl0KGluZGV4KTtcbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgaWYgKHRoaXMudGFiTGlzdFN1YnNjcmlwdGlvbikge1xuICAgICAgICAgICAgdGhpcy50YWJMaXN0U3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIH1cbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZV0sXG4gICAgZXhwb3J0czogW0FjY29yZGlvbiwgQWNjb3JkaW9uVGFiLCBTaGFyZWRNb2R1bGVdLFxuICAgIGRlY2xhcmF0aW9uczogW0FjY29yZGlvbiwgQWNjb3JkaW9uVGFiXVxufSlcbmV4cG9ydCBjbGFzcyBBY2NvcmRpb25Nb2R1bGUge31cbiJdfQ==