import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, Directive, EventEmitter, Input, NgModule, Output, ViewEncapsulation } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import { RippleModule } from 'primeng/ripple';
import { ObjectUtils } from 'primeng/utils';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/ripple";
const INTERNAL_BUTTON_CLASSES = {
    button: 'p-button',
    component: 'p-component',
    iconOnly: 'p-button-icon-only',
    disabled: 'p-disabled',
    loading: 'p-button-loading',
    labelOnly: 'p-button-loading-label-only'
};
export class ButtonDirective {
    constructor(el) {
        this.el = el;
        this.iconPos = 'left';
        this.loadingIcon = 'pi pi-spinner pi-spin';
        this._loading = false;
        this._internalClasses = Object.values(INTERNAL_BUTTON_CLASSES);
    }
    get label() {
        return this._label;
    }
    set label(val) {
        this._label = val;
        if (this.initialized) {
            this.updateLabel();
            this.updateIcon();
            this.setStyleClass();
        }
    }
    get icon() {
        return this._icon;
    }
    set icon(val) {
        this._icon = val;
        if (this.initialized) {
            this.updateIcon();
            this.setStyleClass();
        }
    }
    get loading() {
        return this._loading;
    }
    set loading(val) {
        this._loading = val;
        if (this.initialized) {
            this.updateIcon();
            this.setStyleClass();
        }
    }
    get htmlElement() {
        return this.el.nativeElement;
    }
    ngAfterViewInit() {
        DomHandler.addMultipleClasses(this.htmlElement, this.getStyleClass().join(' '));
        this.createIcon();
        this.createLabel();
        this.initialized = true;
    }
    getStyleClass() {
        const styleClass = [INTERNAL_BUTTON_CLASSES.button, INTERNAL_BUTTON_CLASSES.component];
        if (this.icon && !this.label && ObjectUtils.isEmpty(this.htmlElement.textContent)) {
            styleClass.push(INTERNAL_BUTTON_CLASSES.iconOnly);
        }
        if (this.loading) {
            styleClass.push(INTERNAL_BUTTON_CLASSES.disabled, INTERNAL_BUTTON_CLASSES.loading);
            if (!this.icon && this.label) {
                styleClass.push(INTERNAL_BUTTON_CLASSES.labelOnly);
            }
        }
        return styleClass;
    }
    setStyleClass() {
        const styleClass = this.getStyleClass();
        this.htmlElement.classList.remove(...this._internalClasses);
        this.htmlElement.classList.add(...styleClass);
    }
    createLabel() {
        if (this.label) {
            let labelElement = document.createElement('span');
            if (this.icon && !this.label) {
                labelElement.setAttribute('aria-hidden', 'true');
            }
            labelElement.className = 'p-button-label';
            labelElement.appendChild(document.createTextNode(this.label));
            this.htmlElement.appendChild(labelElement);
        }
    }
    createIcon() {
        if (this.icon || this.loading) {
            let iconElement = document.createElement('span');
            iconElement.className = 'p-button-icon';
            iconElement.setAttribute('aria-hidden', 'true');
            let iconPosClass = this.label ? 'p-button-icon-' + this.iconPos : null;
            if (iconPosClass) {
                DomHandler.addClass(iconElement, iconPosClass);
            }
            let iconClass = this.getIconClass();
            if (iconClass) {
                DomHandler.addMultipleClasses(iconElement, iconClass);
            }
            this.htmlElement.insertBefore(iconElement, this.htmlElement.firstChild);
        }
    }
    updateLabel() {
        let labelElement = DomHandler.findSingle(this.htmlElement, '.p-button-label');
        if (!this.label) {
            labelElement && this.htmlElement.removeChild(labelElement);
            return;
        }
        labelElement ? (labelElement.textContent = this.label) : this.createLabel();
    }
    updateIcon() {
        let iconElement = DomHandler.findSingle(this.htmlElement, '.p-button-icon');
        if (!this.icon && !this.loading) {
            iconElement && this.htmlElement.removeChild(iconElement);
            return;
        }
        if (iconElement) {
            if (this.iconPos)
                iconElement.className = 'p-button-icon p-button-icon-' + this.iconPos + ' ' + this.getIconClass();
            else
                iconElement.className = 'p-button-icon ' + this.getIconClass();
        }
        else {
            this.createIcon();
        }
    }
    getIconClass() {
        return this.loading ? 'p-button-loading-icon ' + this.loadingIcon : this._icon;
    }
    ngOnDestroy() {
        this.initialized = false;
    }
}
ButtonDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: ButtonDirective, deps: [{ token: i0.ElementRef }], target: i0.ɵɵFactoryTarget.Directive });
ButtonDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.0", type: ButtonDirective, selector: "[pButton]", inputs: { iconPos: "iconPos", loadingIcon: "loadingIcon", label: "label", icon: "icon", loading: "loading" }, host: { classAttribute: "p-element" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: ButtonDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pButton]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }]; }, propDecorators: { iconPos: [{
                type: Input
            }], loadingIcon: [{
                type: Input
            }], label: [{
                type: Input
            }], icon: [{
                type: Input
            }], loading: [{
                type: Input
            }] } });
export class Button {
    constructor() {
        this.type = 'button';
        this.iconPos = 'left';
        this.loading = false;
        this.loadingIcon = 'pi pi-spinner pi-spin';
        this.onClick = new EventEmitter();
        this.onFocus = new EventEmitter();
        this.onBlur = new EventEmitter();
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                default:
                    this.contentTemplate = item.template;
                    break;
            }
        });
    }
    badgeStyleClass() {
        return {
            'p-badge p-component': true,
            'p-badge-no-gutter': this.badge && String(this.badge).length === 1
        };
    }
}
Button.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: Button, deps: [], target: i0.ɵɵFactoryTarget.Component });
Button.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.0", type: Button, selector: "p-button", inputs: { type: "type", iconPos: "iconPos", icon: "icon", badge: "badge", label: "label", disabled: "disabled", loading: "loading", loadingIcon: "loadingIcon", style: "style", styleClass: "styleClass", badgeClass: "badgeClass", ariaLabel: "ariaLabel" }, outputs: { onClick: "onClick", onFocus: "onFocus", onBlur: "onBlur" }, host: { classAttribute: "p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], ngImport: i0, template: `
        <button
            [attr.type]="type"
            [attr.aria-label]="ariaLabel"
            [class]="styleClass"
            [ngStyle]="style"
            [disabled]="disabled || loading"
            [ngClass]="{
                'p-button p-component': true,
                'p-button-icon-only': icon && !label,
                'p-button-vertical': (iconPos === 'top' || iconPos === 'bottom') && label,
                'p-disabled': this.disabled || this.loading,
                'p-button-loading': this.loading,
                'p-button-loading-label-only': this.loading && !this.icon && this.label
            }"
            (click)="onClick.emit($event)"
            (focus)="onFocus.emit($event)"
            (blur)="onBlur.emit($event)"
            pRipple
        >
            <ng-content></ng-content>
            <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
            <span
                [ngClass]="{
                    'p-button-icon': true,
                    'p-button-icon-left': iconPos === 'left' && label,
                    'p-button-icon-right': iconPos === 'right' && label,
                    'p-button-icon-top': iconPos === 'top' && label,
                    'p-button-icon-bottom': iconPos === 'bottom' && label
                }"
                [class]="loading ? 'p-button-loading-icon ' + loadingIcon : icon"
                *ngIf="!contentTemplate && (icon || loading)"
                [attr.aria-hidden]="true"
            ></span>
            <span class="p-button-label" [attr.aria-hidden]="icon && !label" *ngIf="!contentTemplate && label">{{ label }}</span>
            <span [ngClass]="badgeStyleClass()" [class]="badgeClass" *ngIf="!contentTemplate && badge">{{ badge }}</span>
        </button>
    `, isInline: true, dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.Ripple, selector: "[pRipple]" }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: Button, decorators: [{
            type: Component,
            args: [{
                    selector: 'p-button',
                    template: `
        <button
            [attr.type]="type"
            [attr.aria-label]="ariaLabel"
            [class]="styleClass"
            [ngStyle]="style"
            [disabled]="disabled || loading"
            [ngClass]="{
                'p-button p-component': true,
                'p-button-icon-only': icon && !label,
                'p-button-vertical': (iconPos === 'top' || iconPos === 'bottom') && label,
                'p-disabled': this.disabled || this.loading,
                'p-button-loading': this.loading,
                'p-button-loading-label-only': this.loading && !this.icon && this.label
            }"
            (click)="onClick.emit($event)"
            (focus)="onFocus.emit($event)"
            (blur)="onBlur.emit($event)"
            pRipple
        >
            <ng-content></ng-content>
            <ng-container *ngTemplateOutlet="contentTemplate"></ng-container>
            <span
                [ngClass]="{
                    'p-button-icon': true,
                    'p-button-icon-left': iconPos === 'left' && label,
                    'p-button-icon-right': iconPos === 'right' && label,
                    'p-button-icon-top': iconPos === 'top' && label,
                    'p-button-icon-bottom': iconPos === 'bottom' && label
                }"
                [class]="loading ? 'p-button-loading-icon ' + loadingIcon : icon"
                *ngIf="!contentTemplate && (icon || loading)"
                [attr.aria-hidden]="true"
            ></span>
            <span class="p-button-label" [attr.aria-hidden]="icon && !label" *ngIf="!contentTemplate && label">{{ label }}</span>
            <span [ngClass]="badgeStyleClass()" [class]="badgeClass" *ngIf="!contentTemplate && badge">{{ badge }}</span>
        </button>
    `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    encapsulation: ViewEncapsulation.None,
                    host: {
                        class: 'p-element'
                    }
                }]
        }], propDecorators: { type: [{
                type: Input
            }], iconPos: [{
                type: Input
            }], icon: [{
                type: Input
            }], badge: [{
                type: Input
            }], label: [{
                type: Input
            }], disabled: [{
                type: Input
            }], loading: [{
                type: Input
            }], loadingIcon: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], badgeClass: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], onClick: [{
                type: Output
            }], onFocus: [{
                type: Output
            }], onBlur: [{
                type: Output
            }] } });
export class ButtonModule {
}
ButtonModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: ButtonModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ButtonModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.1.0", ngImport: i0, type: ButtonModule, declarations: [ButtonDirective, Button], imports: [CommonModule, RippleModule], exports: [ButtonDirective, Button] });
ButtonModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: ButtonModule, imports: [CommonModule, RippleModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: ButtonModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, RippleModule],
                    exports: [ButtonDirective, Button],
                    declarations: [ButtonDirective, Button]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnV0dG9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL2J1dHRvbi9idXR0b24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBbUMsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxTQUFTLEVBQWMsWUFBWSxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQWEsTUFBTSxFQUEwQixpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6TyxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDekMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxlQUFlLENBQUM7Ozs7QUFJNUMsTUFBTSx1QkFBdUIsR0FBRztJQUM1QixNQUFNLEVBQUUsVUFBVTtJQUNsQixTQUFTLEVBQUUsYUFBYTtJQUN4QixRQUFRLEVBQUUsb0JBQW9CO0lBQzlCLFFBQVEsRUFBRSxZQUFZO0lBQ3RCLE9BQU8sRUFBRSxrQkFBa0I7SUFDM0IsU0FBUyxFQUFFLDZCQUE2QjtDQUNsQyxDQUFDO0FBUVgsTUFBTSxPQUFPLGVBQWU7SUEyRHhCLFlBQW1CLEVBQWM7UUFBZCxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBMUR4QixZQUFPLEdBQXVCLE1BQU0sQ0FBQztRQUVyQyxnQkFBVyxHQUFXLHVCQUF1QixDQUFDO1FBOENoRCxhQUFRLEdBQVksS0FBSyxDQUFDO1FBUXpCLHFCQUFnQixHQUFhLE1BQU0sQ0FBQyxNQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUV4QyxDQUFDO0lBdERyQyxJQUFhLEtBQUs7UUFDZCxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIs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MkZBSTNCLFlBQVk7a0JBTHhCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxFQUFFLFlBQVksQ0FBQztvQkFDckMsT0FBTyxFQUFFLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQztvQkFDbEMsWUFBWSxFQUFFLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQztpQkFDMUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJWaWV3SW5pdCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgQ29udGVudENoaWxkcmVuLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE5nTW9kdWxlLCBPbkRlc3Ryb3ksIE91dHB1dCwgUXVlcnlMaXN0LCBUZW1wbGF0ZVJlZiwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFByaW1lVGVtcGxhdGUgfSBmcm9tICdwcmltZW5nL2FwaSc7XG5pbXBvcnQgeyBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgUmlwcGxlTW9kdWxlIH0gZnJvbSAncHJpbWVuZy9yaXBwbGUnO1xuaW1wb3J0IHsgT2JqZWN0VXRpbHMgfSBmcm9tICdwcmltZW5nL3V0aWxzJztcblxudHlwZSBCdXR0b25JY29uUG9zaXRpb24gPSAnbGVmdCcgfCAncmlnaHQnIHwgJ3RvcCcgfCAnYm90dG9tJztcblxuY29uc3QgSU5URVJOQUxfQlVUVE9OX0NMQVNTRVMgPSB7XG4gICAgYnV0dG9uOiAncC1idXR0b24nLFxuICAgIGNvbXBvbmVudDogJ3AtY29tcG9uZW50JyxcbiAgICBpY29uT25seTogJ3AtYnV0dG9uLWljb24tb25seScsXG4gICAgZGlzYWJsZWQ6ICdwLWRpc2FibGVkJyxcbiAgICBsb2FkaW5nOiAncC1idXR0b24tbG9hZGluZycsXG4gICAgbGFiZWxPbmx5OiAncC1idXR0b24tbG9hZGluZy1sYWJlbC1vbmx5J1xufSBhcyBjb25zdDtcblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6ICdbcEJ1dHRvbl0nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBCdXR0b25EaXJlY3RpdmUgaW1wbGVtZW50cyBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3kge1xuICAgIEBJbnB1dCgpIGljb25Qb3M6IEJ1dHRvbkljb25Qb3NpdGlvbiA9ICdsZWZ0JztcblxuICAgIEBJbnB1dCgpIGxvYWRpbmdJY29uOiBzdHJpbmcgPSAncGkgcGktc3Bpbm5lciBwaS1zcGluJztcblxuICAgIEBJbnB1dCgpIGdldCBsYWJlbCgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gdGhpcy5fbGFiZWw7XG4gICAgfVxuXG4gICAgc2V0IGxhYmVsKHZhbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX2xhYmVsID0gdmFsO1xuXG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxhYmVsKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUljb24oKTtcbiAgICAgICAgICAgIHRoaXMuc2V0U3R5bGVDbGFzcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGljb24oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ljb247XG4gICAgfVxuXG4gICAgc2V0IGljb24odmFsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5faWNvbiA9IHZhbDtcblxuICAgICAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVJY29uKCk7XG4gICAgICAgICAgICB0aGlzLnNldFN0eWxlQ2xhc3MoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBsb2FkaW5nKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9hZGluZztcbiAgICB9XG5cbiAgICBzZXQgbG9hZGluZyh2YWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fbG9hZGluZyA9IHZhbDtcblxuICAgICAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVJY29uKCk7XG4gICAgICAgICAgICB0aGlzLnNldFN0eWxlQ2xhc3MoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBfbGFiZWw6IHN0cmluZztcblxuICAgIHB1YmxpYyBfaWNvbjogc3RyaW5nO1xuXG4gICAgcHVibGljIF9sb2FkaW5nOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBwdWJsaWMgaW5pdGlhbGl6ZWQ6IGJvb2xlYW47XG5cbiAgICBwcml2YXRlIGdldCBodG1sRWxlbWVudCgpOiBIVE1MRWxlbWVudCB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBfaW50ZXJuYWxDbGFzc2VzOiBzdHJpbmdbXSA9IE9iamVjdC52YWx1ZXMoSU5URVJOQUxfQlVUVE9OX0NMQVNTRVMpO1xuXG4gICAgY29uc3RydWN0b3IocHVibGljIGVsOiBFbGVtZW50UmVmKSB7fVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBEb21IYW5kbGVyLmFkZE11bHRpcGxlQ2xhc3Nlcyh0aGlzLmh0bWxFbGVtZW50LCB0aGlzLmdldFN0eWxlQ2xhc3MoKS5qb2luKCcgJykpO1xuXG4gICAgICAgIHRoaXMuY3JlYXRlSWNvbigpO1xuICAgICAgICB0aGlzLmNyZWF0ZUxhYmVsKCk7XG5cbiAgICAgICAgdGhpcy5pbml0aWFsaXplZCA9IHRydWU7XG4gICAgfVxuXG4gICAgZ2V0U3R5bGVDbGFzcygpOiBzdHJpbmdbXSB7XG4gICAgICAgIGNvbnN0IHN0eWxlQ2xhc3M6IHN0cmluZ1tdID0gW0lOVEVSTkFMX0JVVFRPTl9DTEFTU0VTLmJ1dHRvbiwgSU5URVJOQUxfQlVUVE9OX0NMQVNTRVMuY29tcG9uZW50XTtcblxuICAgICAgICBpZiAodGhpcy5pY29uICYmICF0aGlzLmxhYmVsICYmIE9iamVjdFV0aWxzLmlzRW1wdHkodGhpcy5odG1sRWxlbWVudC50ZXh0Q29udGVudCkpIHtcbiAgICAgICAgICAgIHN0eWxlQ2xhc3MucHVzaChJTlRFUk5BTF9CVVRUT05fQ0xBU1NFUy5pY29uT25seSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5sb2FkaW5nKSB7XG4gICAgICAgICAgICBzdHlsZUNsYXNzLnB1c2goSU5URVJOQUxfQlVUVE9OX0NMQVNTRVMuZGlzYWJsZWQsIElOVEVSTkFMX0JVVFRPTl9DTEFTU0VTLmxvYWRpbmcpO1xuXG4gICAgICAgICAgICBpZiAoIXRoaXMuaWNvbiAmJiB0aGlzLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgc3R5bGVDbGFzcy5wdXNoKElOVEVSTkFMX0JVVFRPTl9DTEFTU0VTLmxhYmVsT25seSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3R5bGVDbGFzcztcbiAgICB9XG5cbiAgICBzZXRTdHlsZUNsYXNzKCkge1xuICAgICAgICBjb25zdCBzdHlsZUNsYXNzID0gdGhpcy5nZXRTdHlsZUNsYXNzKCk7XG4gICAgICAgIHRoaXMuaHRtbEVsZW1lbnQuY2xhc3NMaXN0LnJlbW92ZSguLi50aGlzLl9pbnRlcm5hbENsYXNzZXMpO1xuICAgICAgICB0aGlzLmh0bWxFbGVtZW50LmNsYXNzTGlzdC5hZGQoLi4uc3R5bGVDbGFzcyk7XG4gICAgfVxuXG4gICAgY3JlYXRlTGFiZWwoKSB7XG4gICAgICAgIGlmICh0aGlzLmxhYmVsKSB7XG4gICAgICAgICAgICBsZXQgbGFiZWxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaWNvbiAmJiAhdGhpcy5sYWJlbCkge1xuICAgICAgICAgICAgICAgIGxhYmVsRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgJ3RydWUnKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGFiZWxFbGVtZW50LmNsYXNzTmFtZSA9ICdwLWJ1dHRvbi1sYWJlbCc7XG4gICAgICAgICAgICBsYWJlbEVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUodGhpcy5sYWJlbCkpO1xuXG4gICAgICAgICAgICB0aGlzLmh0bWxFbGVtZW50LmFwcGVuZENoaWxkKGxhYmVsRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVJY29uKCkge1xuICAgICAgICBpZiAodGhpcy5pY29uIHx8IHRoaXMubG9hZGluZykge1xuICAgICAgICAgICAgbGV0IGljb25FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgICAgICAgICAgaWNvbkVsZW1lbnQuY2xhc3NOYW1lID0gJ3AtYnV0dG9uLWljb24nO1xuICAgICAgICAgICAgaWNvbkVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsICd0cnVlJyk7XG4gICAgICAgICAgICBsZXQgaWNvblBvc0NsYXNzID0gdGhpcy5sYWJlbCA/ICdwLWJ1dHRvbi1pY29uLScgKyB0aGlzLmljb25Qb3MgOiBudWxsO1xuXG4gICAgICAgICAgICBpZiAoaWNvblBvc0NsYXNzKSB7XG4gICAgICAgICAgICAgICAgRG9tSGFuZGxlci5hZGRDbGFzcyhpY29uRWxlbWVudCwgaWNvblBvc0NsYXNzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGljb25DbGFzcyA9IHRoaXMuZ2V0SWNvbkNsYXNzKCk7XG5cbiAgICAgICAgICAgIGlmIChpY29uQ2xhc3MpIHtcbiAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmFkZE11bHRpcGxlQ2xhc3NlcyhpY29uRWxlbWVudCwgaWNvbkNsYXNzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5odG1sRWxlbWVudC5pbnNlcnRCZWZvcmUoaWNvbkVsZW1lbnQsIHRoaXMuaHRtbEVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVMYWJlbCgpIHtcbiAgICAgICAgbGV0IGxhYmVsRWxlbWVudCA9IERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmh0bWxFbGVtZW50LCAnLnAtYnV0dG9uLWxhYmVsJyk7XG5cbiAgICAgICAgaWYgKCF0aGlzLmxhYmVsKSB7XG4gICAgICAgICAgICBsYWJlbEVsZW1lbnQgJiYgdGhpcy5odG1sRWxlbWVudC5yZW1vdmVDaGlsZChsYWJlbEVsZW1lbnQpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGFiZWxFbGVtZW50ID8gKGxhYmVsRWxlbWVudC50ZXh0Q29udGVudCA9IHRoaXMubGFiZWwpIDogdGhpcy5jcmVhdGVMYWJlbCgpO1xuICAgIH1cblxuICAgIHVwZGF0ZUljb24oKSB7XG4gICAgICAgIGxldCBpY29uRWxlbWVudCA9IERvbUhhbmRsZXIuZmluZFNpbmdsZSh0aGlzLmh0bWxFbGVtZW50LCAnLnAtYnV0dG9uLWljb24nKTtcblxuICAgICAgICBpZiAoIXRoaXMuaWNvbiAmJiAhdGhpcy5sb2FkaW5nKSB7XG4gICAgICAgICAgICBpY29uRWxlbWVudCAmJiB0aGlzLmh0bWxFbGVtZW50LnJlbW92ZUNoaWxkKGljb25FbGVtZW50KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpY29uRWxlbWVudCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuaWNvblBvcykgaWNvbkVsZW1lbnQuY2xhc3NOYW1lID0gJ3AtYnV0dG9uLWljb24gcC1idXR0b24taWNvbi0nICsgdGhpcy5pY29uUG9zICsgJyAnICsgdGhpcy5nZXRJY29uQ2xhc3MoKTtcbiAgICAgICAgICAgIGVsc2UgaWNvbkVsZW1lbnQuY2xhc3NOYW1lID0gJ3AtYnV0dG9uLWljb24gJyArIHRoaXMuZ2V0SWNvbkNsYXNzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUljb24oKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldEljb25DbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubG9hZGluZyA/ICdwLWJ1dHRvbi1sb2FkaW5nLWljb24gJyArIHRoaXMubG9hZGluZ0ljb24gOiB0aGlzLl9pY29uO1xuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgfVxufVxuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3AtYnV0dG9uJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBbYXR0ci50eXBlXT1cInR5cGVcIlxuICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIlxuICAgICAgICAgICAgW2NsYXNzXT1cInN0eWxlQ2xhc3NcIlxuICAgICAgICAgICAgW25nU3R5bGVdPVwic3R5bGVcIlxuICAgICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkIHx8IGxvYWRpbmdcIlxuICAgICAgICAgICAgW25nQ2xhc3NdPVwie1xuICAgICAgICAgICAgICAgICdwLWJ1dHRvbiBwLWNvbXBvbmVudCc6IHRydWUsXG4gICAgICAgICAgICAgICAgJ3AtYnV0dG9uLWljb24tb25seSc6IGljb24gJiYgIWxhYmVsLFxuICAgICAgICAgICAgICAgICdwLWJ1dHRvbi12ZXJ0aWNhbCc6IChpY29uUG9zID09PSAndG9wJyB8fCBpY29uUG9zID09PSAnYm90dG9tJykgJiYgbGFiZWwsXG4gICAgICAgICAgICAgICAgJ3AtZGlzYWJsZWQnOiB0aGlzLmRpc2FibGVkIHx8IHRoaXMubG9hZGluZyxcbiAgICAgICAgICAgICAgICAncC1idXR0b24tbG9hZGluZyc6IHRoaXMubG9hZGluZyxcbiAgICAgICAgICAgICAgICAncC1idXR0b24tbG9hZGluZy1sYWJlbC1vbmx5JzogdGhpcy5sb2FkaW5nICYmICF0aGlzLmljb24gJiYgdGhpcy5sYWJlbFxuICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICAoY2xpY2spPVwib25DbGljay5lbWl0KCRldmVudClcIlxuICAgICAgICAgICAgKGZvY3VzKT1cIm9uRm9jdXMuZW1pdCgkZXZlbnQpXCJcbiAgICAgICAgICAgIChibHVyKT1cIm9uQmx1ci5lbWl0KCRldmVudClcIlxuICAgICAgICAgICAgcFJpcHBsZVxuICAgICAgICA+XG4gICAgICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29udGVudFRlbXBsYXRlXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cIntcbiAgICAgICAgICAgICAgICAgICAgJ3AtYnV0dG9uLWljb24nOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAncC1idXR0b24taWNvbi1sZWZ0JzogaWNvblBvcyA9PT0gJ2xlZnQnICYmIGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAncC1idXR0b24taWNvbi1yaWdodCc6IGljb25Qb3MgPT09ICdyaWdodCcgJiYgbGFiZWwsXG4gICAgICAgICAgICAgICAgICAgICdwLWJ1dHRvbi1pY29uLXRvcCc6IGljb25Qb3MgPT09ICd0b3AnICYmIGxhYmVsLFxuICAgICAgICAgICAgICAgICAgICAncC1idXR0b24taWNvbi1ib3R0b20nOiBpY29uUG9zID09PSAnYm90dG9tJyAmJiBsYWJlbFxuICAgICAgICAgICAgICAgIH1cIlxuICAgICAgICAgICAgICAgIFtjbGFzc109XCJsb2FkaW5nID8gJ3AtYnV0dG9uLWxvYWRpbmctaWNvbiAnICsgbG9hZGluZ0ljb24gOiBpY29uXCJcbiAgICAgICAgICAgICAgICAqbmdJZj1cIiFjb250ZW50VGVtcGxhdGUgJiYgKGljb24gfHwgbG9hZGluZylcIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtaGlkZGVuXT1cInRydWVcIlxuICAgICAgICAgICAgPjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwicC1idXR0b24tbGFiZWxcIiBbYXR0ci5hcmlhLWhpZGRlbl09XCJpY29uICYmICFsYWJlbFwiICpuZ0lmPVwiIWNvbnRlbnRUZW1wbGF0ZSAmJiBsYWJlbFwiPnt7IGxhYmVsIH19PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gW25nQ2xhc3NdPVwiYmFkZ2VTdHlsZUNsYXNzKClcIiBbY2xhc3NdPVwiYmFkZ2VDbGFzc1wiICpuZ0lmPVwiIWNvbnRlbnRUZW1wbGF0ZSAmJiBiYWRnZVwiPnt7IGJhZGdlIH19PC9zcGFuPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAgIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gICAgaG9zdDoge1xuICAgICAgICBjbGFzczogJ3AtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIEJ1dHRvbiBpbXBsZW1lbnRzIEFmdGVyQ29udGVudEluaXQge1xuICAgIEBJbnB1dCgpIHR5cGU6IHN0cmluZyA9ICdidXR0b24nO1xuXG4gICAgQElucHV0KCkgaWNvblBvczogQnV0dG9uSWNvblBvc2l0aW9uID0gJ2xlZnQnO1xuXG4gICAgQElucHV0KCkgaWNvbjogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgYmFkZ2U6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGxhYmVsOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBkaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGxvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpIGxvYWRpbmdJY29uOiBzdHJpbmcgPSAncGkgcGktc3Bpbm5lciBwaS1zcGluJztcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBiYWRnZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBhcmlhTGFiZWw6IHN0cmluZztcblxuICAgIGNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8YW55PjtcblxuICAgIEBDb250ZW50Q2hpbGRyZW4oUHJpbWVUZW1wbGF0ZSkgdGVtcGxhdGVzOiBRdWVyeUxpc3Q8YW55PjtcblxuICAgIEBPdXRwdXQoKSBvbkNsaWNrOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkZvY3VzOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkJsdXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY29udGVudCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudFRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRUZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBiYWRnZVN0eWxlQ2xhc3MoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAncC1iYWRnZSBwLWNvbXBvbmVudCc6IHRydWUsXG4gICAgICAgICAgICAncC1iYWRnZS1uby1ndXR0ZXInOiB0aGlzLmJhZGdlICYmIFN0cmluZyh0aGlzLmJhZGdlKS5sZW5ndGggPT09IDFcbiAgICAgICAgfTtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgUmlwcGxlTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbQnV0dG9uRGlyZWN0aXZlLCBCdXR0b25dLFxuICAgIGRlY2xhcmF0aW9uczogW0J1dHRvbkRpcmVjdGl2ZSwgQnV0dG9uXVxufSlcbmV4cG9ydCBjbGFzcyBCdXR0b25Nb2R1bGUge31cbiJdfQ==