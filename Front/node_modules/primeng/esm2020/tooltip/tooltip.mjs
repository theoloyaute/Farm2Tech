import { CommonModule } from '@angular/common';
import { Directive, Input, NgModule } from '@angular/core';
import { ConnectedOverlayScrollHandler, DomHandler } from 'primeng/dom';
import { ZIndexUtils } from 'primeng/utils';
import * as i0 from "@angular/core";
import * as i1 from "primeng/api";
export class Tooltip {
    constructor(el, zone, config, renderer, changeDetector) {
        this.el = el;
        this.zone = zone;
        this.config = config;
        this.renderer = renderer;
        this.changeDetector = changeDetector;
        this.escape = true;
        this.autoHide = true;
        this.fitContent = true;
        this._tooltipOptions = {
            tooltipPosition: 'right',
            tooltipEvent: 'hover',
            appendTo: 'body',
            tooltipZIndex: 'auto',
            escape: true,
            positionTop: 0,
            positionLeft: 0,
            autoHide: true
        };
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(val) {
        this._disabled = val;
        this.deactivate();
    }
    ngAfterViewInit() {
        this.zone.runOutsideAngular(() => {
            if (this.getOption('tooltipEvent') === 'hover') {
                this.mouseEnterListener = this.onMouseEnter.bind(this);
                this.mouseLeaveListener = this.onMouseLeave.bind(this);
                this.clickListener = this.onInputClick.bind(this);
                this.el.nativeElement.addEventListener('mouseenter', this.mouseEnterListener);
                this.el.nativeElement.addEventListener('click', this.clickListener);
                this.el.nativeElement.addEventListener('mouseleave', this.mouseLeaveListener);
            }
            else if (this.getOption('tooltipEvent') === 'focus') {
                this.focusListener = this.onFocus.bind(this);
                this.blurListener = this.onBlur.bind(this);
                let target = this.getTarget(this.el.nativeElement);
                target.addEventListener('focus', this.focusListener);
                target.addEventListener('blur', this.blurListener);
            }
        });
    }
    ngOnChanges(simpleChange) {
        if (simpleChange.tooltipPosition) {
            this.setOption({ tooltipPosition: simpleChange.tooltipPosition.currentValue });
        }
        if (simpleChange.tooltipEvent) {
            this.setOption({ tooltipEvent: simpleChange.tooltipEvent.currentValue });
        }
        if (simpleChange.appendTo) {
            this.setOption({ appendTo: simpleChange.appendTo.currentValue });
        }
        if (simpleChange.positionStyle) {
            this.setOption({ positionStyle: simpleChange.positionStyle.currentValue });
        }
        if (simpleChange.tooltipStyleClass) {
            this.setOption({ tooltipStyleClass: simpleChange.tooltipStyleClass.currentValue });
        }
        if (simpleChange.tooltipZIndex) {
            this.setOption({ tooltipZIndex: simpleChange.tooltipZIndex.currentValue });
        }
        if (simpleChange.escape) {
            this.setOption({ escape: simpleChange.escape.currentValue });
        }
        if (simpleChange.showDelay) {
            this.setOption({ showDelay: simpleChange.showDelay.currentValue });
        }
        if (simpleChange.hideDelay) {
            this.setOption({ hideDelay: simpleChange.hideDelay.currentValue });
        }
        if (simpleChange.life) {
            this.setOption({ life: simpleChange.life.currentValue });
        }
        if (simpleChange.positionTop) {
            this.setOption({ positionTop: simpleChange.positionTop.currentValue });
        }
        if (simpleChange.positionLeft) {
            this.setOption({ positionLeft: simpleChange.positionLeft.currentValue });
        }
        if (simpleChange.disabled) {
            this.setOption({ disabled: simpleChange.disabled.currentValue });
        }
        if (simpleChange.text) {
            this.setOption({ tooltipLabel: simpleChange.text.currentValue });
            if (this.active) {
                if (simpleChange.text.currentValue) {
                    if (this.container && this.container.offsetParent) {
                        this.updateText();
                        this.align();
                    }
                    else {
                        this.show();
                    }
                }
                else {
                    this.hide();
                }
            }
        }
        if (simpleChange.autoHide) {
            this.setOption({ autoHide: simpleChange.autoHide.currentValue });
        }
        if (simpleChange.tooltipOptions) {
            this._tooltipOptions = { ...this._tooltipOptions, ...simpleChange.tooltipOptions.currentValue };
            this.deactivate();
            if (this.active) {
                if (this.getOption('tooltipLabel')) {
                    if (this.container && this.container.offsetParent) {
                        this.updateText();
                        this.align();
                    }
                    else {
                        this.show();
                    }
                }
                else {
                    this.hide();
                }
            }
        }
    }
    isAutoHide() {
        return this.getOption('autoHide');
    }
    onMouseEnter(e) {
        if (!this.container && !this.showTimeout) {
            this.activate();
        }
    }
    onMouseLeave(e) {
        if (!this.isAutoHide()) {
            const valid = DomHandler.hasClass(e.toElement, 'p-tooltip') || DomHandler.hasClass(e.toElement, 'p-tooltip-arrow') || DomHandler.hasClass(e.toElement, 'p-tooltip-text') || DomHandler.hasClass(e.relatedTarget, 'p-tooltip');
            !valid && this.deactivate();
        }
        else {
            this.deactivate();
        }
    }
    onFocus(e) {
        this.activate();
    }
    onBlur(e) {
        this.deactivate();
    }
    onInputClick(e) {
        this.deactivate();
    }
    activate() {
        this.active = true;
        this.clearHideTimeout();
        if (this.getOption('showDelay'))
            this.showTimeout = setTimeout(() => {
                this.show();
            }, this.getOption('showDelay'));
        else
            this.show();
        if (this.getOption('life')) {
            let duration = this.getOption('showDelay') ? this.getOption('life') + this.getOption('showDelay') : this.getOption('life');
            this.hideTimeout = setTimeout(() => {
                this.hide();
            }, duration);
        }
    }
    deactivate() {
        this.active = false;
        this.clearShowTimeout();
        if (this.getOption('hideDelay')) {
            this.clearHideTimeout(); //life timeout
            this.hideTimeout = setTimeout(() => {
                this.hide();
            }, this.getOption('hideDelay'));
        }
        else {
            this.hide();
        }
    }
    create() {
        if (this.container) {
            this.clearHideTimeout();
            this.remove();
        }
        this.container = document.createElement('div');
        let tooltipArrow = document.createElement('div');
        tooltipArrow.className = 'p-tooltip-arrow';
        this.container.appendChild(tooltipArrow);
        this.tooltipText = document.createElement('div');
        this.tooltipText.className = 'p-tooltip-text';
        this.updateText();
        if (this.getOption('positionStyle')) {
            this.container.style.position = this.getOption('positionStyle');
        }
        this.container.appendChild(this.tooltipText);
        if (this.getOption('appendTo') === 'body')
            document.body.appendChild(this.container);
        else if (this.getOption('appendTo') === 'target')
            DomHandler.appendChild(this.container, this.el.nativeElement);
        else
            DomHandler.appendChild(this.container, this.getOption('appendTo'));
        this.container.style.display = 'inline-block';
        if (this.fitContent) {
            this.container.style.width = 'fit-content';
        }
        if (!this.isAutoHide()) {
            this.bindContainerMouseleaveListener();
        }
    }
    bindContainerMouseleaveListener() {
        if (!this.containerMouseleaveListener) {
            const targetEl = this.container ?? this.container.nativeElement;
            this.containerMouseleaveListener = this.renderer.listen(targetEl, 'mouseleave', (e) => {
                this.deactivate();
            });
        }
    }
    unbindContainerMouseleaveListener() {
        if (this.containerMouseleaveListener) {
            this.bindContainerMouseleaveListener();
            this.containerMouseleaveListener = null;
        }
    }
    show() {
        if (!this.getOption('tooltipLabel') || this.getOption('disabled')) {
            return;
        }
        this.create();
        this.align();
        DomHandler.fadeIn(this.container, 250);
        if (this.getOption('tooltipZIndex') === 'auto')
            ZIndexUtils.set('tooltip', this.container, this.config.zIndex.tooltip);
        else
            this.container.style.zIndex = this.getOption('tooltipZIndex');
        this.bindDocumentResizeListener();
        this.bindScrollListener();
    }
    hide() {
        if (this.getOption('tooltipZIndex') === 'auto') {
            ZIndexUtils.clear(this.container);
        }
        this.remove();
    }
    updateText() {
        if (this.getOption('escape')) {
            this.tooltipText.innerHTML = '';
            this.tooltipText.appendChild(document.createTextNode(this.getOption('tooltipLabel')));
        }
        else {
            this.tooltipText.innerHTML = this.getOption('tooltipLabel');
        }
    }
    align() {
        let position = this.getOption('tooltipPosition');
        switch (position) {
            case 'top':
                this.alignTop();
                if (this.isOutOfBounds()) {
                    this.alignBottom();
                    if (this.isOutOfBounds()) {
                        this.alignRight();
                        if (this.isOutOfBounds()) {
                            this.alignLeft();
                        }
                    }
                }
                break;
            case 'bottom':
                this.alignBottom();
                if (this.isOutOfBounds()) {
                    this.alignTop();
                    if (this.isOutOfBounds()) {
                        this.alignRight();
                        if (this.isOutOfBounds()) {
                            this.alignLeft();
                        }
                    }
                }
                break;
            case 'left':
                this.alignLeft();
                if (this.isOutOfBounds()) {
                    this.alignRight();
                    if (this.isOutOfBounds()) {
                        this.alignTop();
                        if (this.isOutOfBounds()) {
                            this.alignBottom();
                        }
                    }
                }
                break;
            case 'right':
                this.alignRight();
                if (this.isOutOfBounds()) {
                    this.alignLeft();
                    if (this.isOutOfBounds()) {
                        this.alignTop();
                        if (this.isOutOfBounds()) {
                            this.alignBottom();
                        }
                    }
                }
                break;
        }
    }
    getHostOffset() {
        if (this.getOption('appendTo') === 'body' || this.getOption('appendTo') === 'target') {
            let offset = this.el.nativeElement.getBoundingClientRect();
            let targetLeft = offset.left + DomHandler.getWindowScrollLeft();
            let targetTop = offset.top + DomHandler.getWindowScrollTop();
            return { left: targetLeft, top: targetTop };
        }
        else {
            return { left: 0, top: 0 };
        }
    }
    alignRight() {
        this.preAlign('right');
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left + DomHandler.getOuterWidth(this.el.nativeElement);
        let top = hostOffset.top + (DomHandler.getOuterHeight(this.el.nativeElement) - DomHandler.getOuterHeight(this.container)) / 2;
        this.container.style.left = left + this.getOption('positionLeft') + 'px';
        this.container.style.top = top + this.getOption('positionTop') + 'px';
    }
    alignLeft() {
        this.preAlign('left');
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left - DomHandler.getOuterWidth(this.container);
        let top = hostOffset.top + (DomHandler.getOuterHeight(this.el.nativeElement) - DomHandler.getOuterHeight(this.container)) / 2;
        this.container.style.left = left + this.getOption('positionLeft') + 'px';
        this.container.style.top = top + this.getOption('positionTop') + 'px';
    }
    alignTop() {
        this.preAlign('top');
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left + (DomHandler.getOuterWidth(this.el.nativeElement) - DomHandler.getOuterWidth(this.container)) / 2;
        let top = hostOffset.top - DomHandler.getOuterHeight(this.container);
        this.container.style.left = left + this.getOption('positionLeft') + 'px';
        this.container.style.top = top + this.getOption('positionTop') + 'px';
    }
    alignBottom() {
        this.preAlign('bottom');
        let hostOffset = this.getHostOffset();
        let left = hostOffset.left + (DomHandler.getOuterWidth(this.el.nativeElement) - DomHandler.getOuterWidth(this.container)) / 2;
        let top = hostOffset.top + DomHandler.getOuterHeight(this.el.nativeElement);
        this.container.style.left = left + this.getOption('positionLeft') + 'px';
        this.container.style.top = top + this.getOption('positionTop') + 'px';
    }
    setOption(option) {
        this._tooltipOptions = { ...this._tooltipOptions, ...option };
    }
    getOption(option) {
        return this._tooltipOptions[option];
    }
    getTarget(el) {
        return DomHandler.hasClass(el, 'p-inputwrapper') ? DomHandler.findSingle(el, 'input') : el;
    }
    preAlign(position) {
        this.container.style.left = -999 + 'px';
        this.container.style.top = -999 + 'px';
        let defaultClassName = 'p-tooltip p-component p-tooltip-' + position;
        this.container.className = this.getOption('tooltipStyleClass') ? defaultClassName + ' ' + this.getOption('tooltipStyleClass') : defaultClassName;
    }
    isOutOfBounds() {
        let offset = this.container.getBoundingClientRect();
        let targetTop = offset.top;
        let targetLeft = offset.left;
        let width = DomHandler.getOuterWidth(this.container);
        let height = DomHandler.getOuterHeight(this.container);
        let viewport = DomHandler.getViewport();
        return targetLeft + width > viewport.width || targetLeft < 0 || targetTop < 0 || targetTop + height > viewport.height;
    }
    onWindowResize(e) {
        this.hide();
    }
    bindDocumentResizeListener() {
        this.zone.runOutsideAngular(() => {
            this.resizeListener = this.onWindowResize.bind(this);
            window.addEventListener('resize', this.resizeListener);
        });
    }
    unbindDocumentResizeListener() {
        if (this.resizeListener) {
            window.removeEventListener('resize', this.resizeListener);
            this.resizeListener = null;
        }
    }
    bindScrollListener() {
        if (!this.scrollHandler) {
            this.scrollHandler = new ConnectedOverlayScrollHandler(this.el.nativeElement, () => {
                if (this.container) {
                    this.hide();
                }
            });
        }
        this.scrollHandler.bindScrollListener();
    }
    unbindScrollListener() {
        if (this.scrollHandler) {
            this.scrollHandler.unbindScrollListener();
        }
    }
    unbindEvents() {
        if (this.getOption('tooltipEvent') === 'hover') {
            this.el.nativeElement.removeEventListener('mouseenter', this.mouseEnterListener);
            this.el.nativeElement.removeEventListener('mouseleave', this.mouseLeaveListener);
            this.el.nativeElement.removeEventListener('click', this.clickListener);
        }
        else if (this.getOption('tooltipEvent') === 'focus') {
            let target = this.getTarget(this.el.nativeElement);
            target.removeEventListener('focus', this.focusListener);
            target.removeEventListener('blur', this.blurListener);
        }
        this.unbindDocumentResizeListener();
    }
    remove() {
        if (this.container && this.container.parentElement) {
            if (this.getOption('appendTo') === 'body')
                document.body.removeChild(this.container);
            else if (this.getOption('appendTo') === 'target')
                this.el.nativeElement.removeChild(this.container);
            else
                DomHandler.removeChild(this.container, this.getOption('appendTo'));
        }
        this.unbindDocumentResizeListener();
        this.unbindScrollListener();
        this.unbindContainerMouseleaveListener();
        this.clearTimeouts();
        this.container = null;
        this.scrollHandler = null;
    }
    clearShowTimeout() {
        if (this.showTimeout) {
            clearTimeout(this.showTimeout);
            this.showTimeout = null;
        }
    }
    clearHideTimeout() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
            this.hideTimeout = null;
        }
    }
    clearTimeouts() {
        this.clearShowTimeout();
        this.clearHideTimeout();
    }
    ngOnDestroy() {
        this.unbindEvents();
        if (this.container) {
            ZIndexUtils.clear(this.container);
        }
        this.remove();
        if (this.scrollHandler) {
            this.scrollHandler.destroy();
            this.scrollHandler = null;
        }
    }
}
Tooltip.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: Tooltip, deps: [{ token: i0.ElementRef }, { token: i0.NgZone }, { token: i1.PrimeNGConfig }, { token: i0.Renderer2 }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Directive });
Tooltip.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "15.1.0", type: Tooltip, selector: "[pTooltip]", inputs: { tooltipPosition: "tooltipPosition", tooltipEvent: "tooltipEvent", appendTo: "appendTo", positionStyle: "positionStyle", tooltipStyleClass: "tooltipStyleClass", tooltipZIndex: "tooltipZIndex", escape: "escape", showDelay: "showDelay", hideDelay: "hideDelay", life: "life", positionTop: "positionTop", positionLeft: "positionLeft", autoHide: "autoHide", fitContent: "fitContent", text: ["pTooltip", "text"], disabled: ["tooltipDisabled", "disabled"], tooltipOptions: "tooltipOptions" }, host: { classAttribute: "p-element" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: Tooltip, decorators: [{
            type: Directive,
            args: [{
                    selector: '[pTooltip]',
                    host: {
                        class: 'p-element'
                    }
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.NgZone }, { type: i1.PrimeNGConfig }, { type: i0.Renderer2 }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { tooltipPosition: [{
                type: Input
            }], tooltipEvent: [{
                type: Input
            }], appendTo: [{
                type: Input
            }], positionStyle: [{
                type: Input
            }], tooltipStyleClass: [{
                type: Input
            }], tooltipZIndex: [{
                type: Input
            }], escape: [{
                type: Input
            }], showDelay: [{
                type: Input
            }], hideDelay: [{
                type: Input
            }], life: [{
                type: Input
            }], positionTop: [{
                type: Input
            }], positionLeft: [{
                type: Input
            }], autoHide: [{
                type: Input
            }], fitContent: [{
                type: Input
            }], text: [{
                type: Input,
                args: ['pTooltip']
            }], disabled: [{
                type: Input,
                args: ['tooltipDisabled']
            }], tooltipOptions: [{
                type: Input
            }] } });
export class TooltipModule {
}
TooltipModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: TooltipModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
TooltipModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.1.0", ngImport: i0, type: TooltipModule, declarations: [Tooltip], imports: [CommonModule], exports: [Tooltip] });
TooltipModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: TooltipModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: TooltipModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Tooltip],
                    declarations: [Tooltip]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG9vbHRpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvY29tcG9uZW50cy90b29sdGlwL3Rvb2x0aXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBb0MsU0FBUyxFQUFjLEtBQUssRUFBRSxRQUFRLEVBQStDLE1BQU0sZUFBZSxDQUFDO0FBRXRKLE9BQU8sRUFBRSw2QkFBNkIsRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDeEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBMEI1QyxNQUFNLE9BQU8sT0FBTztJQWtGaEIsWUFBbUIsRUFBYyxFQUFTLElBQVksRUFBUyxNQUFxQixFQUFVLFFBQW1CLEVBQVUsY0FBaUM7UUFBekksT0FBRSxHQUFGLEVBQUUsQ0FBWTtRQUFTLFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxXQUFNLEdBQU4sTUFBTSxDQUFlO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUFVLG1CQUFjLEdBQWQsY0FBYyxDQUFtQjtRQXJFbkosV0FBTSxHQUFZLElBQUksQ0FBQztRQVl2QixhQUFRLEdBQVksSUFBSSxDQUFDO1FBRXpCLGVBQVUsR0FBWSxJQUFJLENBQUM7UUFjcEMsb0JBQWUsR0FBbUI7WUFDOUIsZUFBZSxFQUFFLE9BQU87WUFDeEIsWUFBWSxFQUFFLE9BQU87WUFDckIsUUFBUSxFQUFFLE1BQU07WUFDaEIsYUFBYSxFQUFFLE1BQU07WUFDckIsTUFBTSxFQUFFLElBQUk7WUFDWixXQUFXLEVBQUUsQ0FBQztZQUNkLFlBQVksRUFBRSxDQUFDO1lBQ2YsUUFBUSxFQUFFLElBQUk7U0FDakIsQ0FBQztJQWdDNkosQ0FBQztJQW5EaEssSUFBOEIsUUFBUTtRQUNsQyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7SUFDMUIsQ0FBQztJQUNELElBQUks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QUFFLGFBQWEsRUFBRSxZQUFZLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7U0FDOUU7UUFFRCxJQUFJLFlBQVksQ0FBQyxNQUFNLEVBQUU7WUFDckIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7U0FDaEU7UUFFRCxJQUFJLFlBQVksQ0FBQyxTQUFTLEVBQUU7WUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7U0FDdEU7UUFFRCxJQUFJLFlBQVksQ0FBQyxTQUFTLEVBQUU7WUFDeEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxZQUFZLENBQUMsU0FBUyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7U0FDdEU7UUFFRCxJQUFJLFlBQVksQ0FBQyxJQUFJLEVBQUU7WUFDbkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUksRUFBRSxZQUFZLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7U0FDNUQ7UUFFRCxJQUFJLFlBQVksQ0FBQyxXQUFXLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFdBQVcsRUFBRSxZQUFZLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7U0FDMUU7UUFFRCxJQUFJLFlBQVksQ0FBQyxZQUFZLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFlBQVksRUFBRSxZQUFZLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7U0FDNUU7UUFFRCxJQUFJLFlBQVksQ0FBQyxRQUFRLEVBQUU7WUFDdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxZQUFZLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7U0FDcEU7UUFFRCxJQUFJLFlBQVksQ0FBQyxJ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QUM7UUFDdEMsSUFBSSxJQUFJLEdBQUcsVUFBVSxDQUFDLElBQUksR0FBRyxVQUFVLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDN0UsSUFBSSxHQUFHLEdBQUcsVUFBVSxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxhQUFhLENBQUMsR0FBRyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5SCxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ3pFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDMUUsQ0FBQztJQUVELFNBQVM7UUFDTCxJQUFJLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3RCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN0QyxJQUFJLElBQUksR0FBRyxVQUFVLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3RFLElBQUksR0FBRyxHQUFHLFVBQVUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLEdBQUcsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUgsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FB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RUcsYUFBYTtzQkFBckIsS0FBSztnQkFFRyxNQUFNO3NCQUFkLEtBQUs7Z0JBRUcsU0FBUztzQkFBakIsS0FBSztnQkFFRyxTQUFTO3NCQUFqQixLQUFLO2dCQUVHLElBQUk7c0JBQVosS0FBSztnQkFFRyxXQUFXO3NCQUFuQixLQUFLO2dCQUVHLFlBQVk7c0JBQXBCLEtBQUs7Z0JBRUcsUUFBUTtzQkFBaEIsS0FBSztnQkFFRyxVQUFVO3NCQUFsQixLQUFLO2dCQUVhLElBQUk7c0JBQXRCLEtBQUs7dUJBQUMsVUFBVTtnQkFFYSxRQUFRO3NCQUFyQyxLQUFLO3VCQUFDLGlCQUFpQjtnQkFRZixjQUFjO3NCQUF0QixLQUFLOztBQThpQlYsTUFBTSxPQUFPLGFBQWE7OzBHQUFiLGFBQWE7MkdBQWIsYUFBYSxpQkFybEJiLE9BQU8sYUFpbEJOLFlBQVksYUFqbEJiLE9BQU87MkdBcWxCUCxhQUFhLFlBSlosWUFBWTsyRkFJYixhQUFhO2tCQUx6QixRQUFRO21CQUFDO29CQUNOLE9BQU8sRUFBRSxDQUFDLFlBQVksQ0FBQztvQkFDdkIsT0FBTyxFQUFFLENBQUMsT0FBTyxDQUFDO29CQUNsQixZQUFZLEVBQUUsQ0FBQyxPQUFPLENBQUM7aUJBQzFCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEFmdGVyVmlld0luaXQsIENoYW5nZURldGVjdG9yUmVmLCBEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIElucHV0LCBOZ01vZHVsZSwgTmdab25lLCBPbkRlc3Ryb3ksIFJlbmRlcmVyMiwgU2ltcGxlQ2hhbmdlcyB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUHJpbWVOR0NvbmZpZyB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IENvbm5lY3RlZE92ZXJsYXlTY3JvbGxIYW5kbGVyLCBEb21IYW5kbGVyIH0gZnJvbSAncHJpbWVuZy9kb20nO1xuaW1wb3J0IHsgWkluZGV4VXRpbHMgfSBmcm9tICdwcmltZW5nL3V0aWxzJztcblxuZXhwb3J0IGludGVyZmFjZSBUb29sdGlwT3B0aW9ucyB7XG4gICAgdG9vbHRpcExhYmVsPzogc3RyaW5nO1xuICAgIHRvb2x0aXBQb3NpdGlvbj86IHN0cmluZztcbiAgICB0b29sdGlwRXZlbnQ/OiBzdHJpbmc7XG4gICAgYXBwZW5kVG8/OiBhbnk7XG4gICAgcG9zaXRpb25TdHlsZT86IHN0cmluZztcbiAgICB0b29sdGlwU3R5bGVDbGFzcz86IHN0cmluZztcbiAgICB0b29sdGlwWkluZGV4Pzogc3RyaW5nO1xuICAgIGVzY2FwZT86IGJvb2xlYW47XG4gICAgZGlzYWJsZWQ/OiBib29sZWFuO1xuICAgIHNob3dEZWxheT86IG51bWJlcjtcbiAgICBoaWRlRGVsYXk/OiBudW1iZXI7XG4gICAgcG9zaXRpb25Ub3A/OiBudW1iZXI7XG4gICAgcG9zaXRpb25MZWZ0PzogbnVtYmVyO1xuICAgIGxpZmU/OiBudW1iZXI7XG4gICAgYXV0b0hpZGU/OiBib29sZWFuO1xufVxuXG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogJ1twVG9vbHRpcF0nLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLWVsZW1lbnQnXG4gICAgfVxufSlcbmV4cG9ydCBjbGFzcyBUb29sdGlwIGltcGxlbWVudHMgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgICBASW5wdXQoKSB0b29sdGlwUG9zaXRpb246IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHRvb2x0aXBFdmVudDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgYXBwZW5kVG86IGFueTtcblxuICAgIEBJbnB1dCgpIHBvc2l0aW9uU3R5bGU6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHRvb2x0aXBTdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSB0b29sdGlwWkluZGV4OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBlc2NhcGU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgc2hvd0RlbGF5OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBoaWRlRGVsYXk6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIGxpZmU6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIHBvc2l0aW9uVG9wOiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBwb3NpdGlvbkxlZnQ6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIGF1dG9IaWRlOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIEBJbnB1dCgpIGZpdENvbnRlbnQ6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCdwVG9vbHRpcCcpIHRleHQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgndG9vbHRpcERpc2FibGVkJykgZ2V0IGRpc2FibGVkKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWQ7XG4gICAgfVxuICAgIHNldCBkaXNhYmxlZCh2YWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fZGlzYWJsZWQgPSB2YWw7XG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIHRvb2x0aXBPcHRpb25zOiBUb29sdGlwT3B0aW9ucztcblxuICAgIF90b29sdGlwT3B0aW9uczogVG9vbHRpcE9wdGlvbnMgPSB7XG4gICAgICAgIHRvb2x0aXBQb3NpdGlvbjogJ3JpZ2h0JyxcbiAgICAgICAgdG9vbHRpcEV2ZW50OiAnaG92ZXInLFxuICAgICAgICBhcHBlbmRUbzogJ2JvZHknLFxuICAgICAgICB0b29sdGlwWkluZGV4OiAnYXV0bycsXG4gICAgICAgIGVzY2FwZTogdHJ1ZSxcbiAgICAgICAgcG9zaXRpb25Ub3A6IDAsXG4gICAgICAgIHBvc2l0aW9uTGVmdDogMCxcbiAgICAgICAgYXV0b0hpZGU6IHRydWVcbiAgICB9O1xuXG4gICAgX2Rpc2FibGVkOiBib29sZWFuO1xuXG4gICAgY29udGFpbmVyOiBhbnk7XG5cbiAgICBzdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICB0b29sdGlwVGV4dDogYW55O1xuXG4gICAgc2hvd1RpbWVvdXQ6IGFueTtcblxuICAgIGhpZGVUaW1lb3V0OiBhbnk7XG5cbiAgICBhY3RpdmU6IGJvb2xlYW47XG5cbiAgICBtb3VzZUVudGVyTGlzdGVuZXI6IEZ1bmN0aW9uO1xuXG4gICAgbW91c2VMZWF2ZUxpc3RlbmVyOiBGdW5jdGlvbjtcblxuICAgIGNvbnRhaW5lck1vdXNlbGVhdmVMaXN0ZW5lcjogRnVuY3Rpb247XG5cbiAgICBjbGlja0xpc3RlbmVyOiBGdW5jdGlvbjtcblxuICAgIGZvY3VzTGlzdGVuZXI6IEZ1bmN0aW9uO1xuXG4gICAgYmx1ckxpc3RlbmVyOiBGdW5jdGlvbjtcblxuICAgIHNjcm9sbEhhbmRsZXI6IGFueTtcblxuICAgIHJlc2l6ZUxpc3RlbmVyOiBhbnk7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZWw6IEVsZW1lbnRSZWYsIHB1YmxpYyB6b25lOiBOZ1pvbmUsIHB1YmxpYyBjb25maWc6IFByaW1lTkdDb25maWcsIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMiwgcHJpdmF0ZSBjaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9XG5cbiAgICBuZ0FmdGVyVmlld0luaXQoKSB7XG4gICAgICAgIHRoaXMuem9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5nZXRPcHRpb24oJ3Rvb2x0aXBFdmVudCcpID09PSAnaG92ZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5tb3VzZUVudGVyTGlzdGVuZXIgPSB0aGlzLm9uTW91c2VFbnRlci5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMubW91c2VMZWF2ZUxpc3RlbmVyID0gdGhpcy5vbk1vdXNlTGVhdmUuYmluZCh0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWNrTGlzdGVuZXIgPSB0aGlzLm9uSW5wdXRDbGljay5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5tb3VzZUVudGVyTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHRoaXMuY2xpY2tMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLm1vdXNlTGVhdmVMaXN0ZW5lcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0T3B0aW9uKCd0b29sdGlwRXZlbnQnKSA9PT0gJ2ZvY3VzJykge1xuICAgICAgICAgICAgICAgIHRoaXMuZm9jdXNMaXN0ZW5lciA9IHRoaXMub25Gb2N1cy5iaW5kKHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMuYmx1ckxpc3RlbmVyID0gdGhpcy5vbkJsdXIuYmluZCh0aGlzKTtcblxuICAgICAgICAgICAgICAgIGxldCB0YXJnZXQgPSB0aGlzLmdldFRhcmdldCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuZm9jdXNMaXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgdGFyZ2V0LmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCB0aGlzLmJsdXJMaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKHNpbXBsZUNoYW5nZTogU2ltcGxlQ2hhbmdlcykge1xuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLnRvb2x0aXBQb3NpdGlvbikge1xuICAgICAgICAgICAgdGhpcy5zZXRPcHRpb24oeyB0b29sdGlwUG9zaXRpb246IHNpbXBsZUNoYW5nZS50b29sdGlwUG9zaXRpb24uY3VycmVudFZhbHVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS50b29sdGlwRXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T3B0aW9uKHsgdG9vbHRpcEV2ZW50OiBzaW1wbGVDaGFuZ2UudG9vbHRpcEV2ZW50LmN1cnJlbnRWYWx1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2UuYXBwZW5kVG8pIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T3B0aW9uKHsgYXBwZW5kVG86IHNpbXBsZUNoYW5nZS5hcHBlbmRUby5jdXJyZW50VmFsdWUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLnBvc2l0aW9uU3R5bGUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T3B0aW9uKHsgcG9zaXRpb25TdHlsZTogc2ltcGxlQ2hhbmdlLnBvc2l0aW9uU3R5bGUuY3VycmVudFZhbHVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS50b29sdGlwU3R5bGVDbGFzcykge1xuICAgICAgICAgICAgdGhpcy5zZXRPcHRpb24oeyB0b29sdGlwU3R5bGVDbGFzczogc2ltcGxlQ2hhbmdlLnRvb2x0aXBTdHlsZUNsYXNzLmN1cnJlbnRWYWx1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2UudG9vbHRpcFpJbmRleCkge1xuICAgICAgICAgICAgdGhpcy5zZXRPcHRpb24oeyB0b29sdGlwWkluZGV4OiBzaW1wbGVDaGFuZ2UudG9vbHRpcFpJbmRleC5jdXJyZW50VmFsdWUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLmVzY2FwZSkge1xuICAgICAgICAgICAgdGhpcy5zZXRPcHRpb24oeyBlc2NhcGU6IHNpbXBsZUNoYW5nZS5lc2NhcGUuY3VycmVudFZhbHVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS5zaG93RGVsYXkpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T3B0aW9uKHsgc2hvd0RlbGF5OiBzaW1wbGVDaGFuZ2Uuc2hvd0RlbGF5LmN1cnJlbnRWYWx1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2UuaGlkZURlbGF5KSB7XG4gICAgICAgICAgICB0aGlzLnNldE9wdGlvbih7IGhpZGVEZWxheTogc2ltcGxlQ2hhbmdlLmhpZGVEZWxheS5jdXJyZW50VmFsdWUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLmxpZmUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0T3B0aW9uKHsgbGlmZTogc2ltcGxlQ2hhbmdlLmxpZmUuY3VycmVudFZhbHVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS5wb3NpdGlvblRvcCkge1xuICAgICAgICAgICAgdGhpcy5zZXRPcHRpb24oeyBwb3NpdGlvblRvcDogc2ltcGxlQ2hhbmdlLnBvc2l0aW9uVG9wLmN1cnJlbnRWYWx1ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChzaW1wbGVDaGFuZ2UucG9zaXRpb25MZWZ0KSB7XG4gICAgICAgICAgICB0aGlzLnNldE9wdGlvbih7IHBvc2l0aW9uTGVmdDogc2ltcGxlQ2hhbmdlLnBvc2l0aW9uTGVmdC5jdXJyZW50VmFsdWUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLmRpc2FibGVkKSB7XG4gICAgICAgICAgICB0aGlzLnNldE9wdGlvbih7IGRpc2FibGVkOiBzaW1wbGVDaGFuZ2UuZGlzYWJsZWQuY3VycmVudFZhbHVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS50ZXh0KSB7XG4gICAgICAgICAgICB0aGlzLnNldE9wdGlvbih7IHRvb2x0aXBMYWJlbDogc2ltcGxlQ2hhbmdlLnRleHQuY3VycmVudFZhbHVlIH0pO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLnRleHQuY3VycmVudFZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5lciAmJiB0aGlzLmNvbnRhaW5lci5vZmZzZXRQYXJlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVGV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGlnbigpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlLmF1dG9IaWRlKSB7XG4gICAgICAgICAgICB0aGlzLnNldE9wdGlvbih7IGF1dG9IaWRlOiBzaW1wbGVDaGFuZ2UuYXV0b0hpZGUuY3VycmVudFZhbHVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHNpbXBsZUNoYW5nZS50b29sdGlwT3B0aW9ucykge1xuICAgICAgICAgICAgdGhpcy5fdG9vbHRpcE9wdGlvbnMgPSB7IC4uLnRoaXMuX3Rvb2x0aXBPcHRpb25zLCAuLi5zaW1wbGVDaGFuZ2UudG9vbHRpcE9wdGlvbnMuY3VycmVudFZhbHVlIH07XG4gICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ2V0T3B0aW9uKCd0b29sdGlwTGFiZWwnKSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jb250YWluZXIgJiYgdGhpcy5jb250YWluZXIub2Zmc2V0UGFyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVRleHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWxpZ24oKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXNBdXRvSGlkZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0T3B0aW9uKCdhdXRvSGlkZScpO1xuICAgIH1cblxuICAgIG9uTW91c2VFbnRlcihlOiBFdmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuY29udGFpbmVyICYmICF0aGlzLnNob3dUaW1lb3V0KSB7XG4gICAgICAgICAgICB0aGlzLmFjdGl2YXRlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbk1vdXNlTGVhdmUoZSkge1xuICAgICAgICBpZiAoIXRoaXMuaXNBdXRvSGlkZSgpKSB7XG4gICAgICAgICAgICBjb25zdCB2YWxpZCA9IERvbUhhbmRsZXIuaGFzQ2xhc3MoZS50b0VsZW1lbnQsICdwLXRvb2x0aXAnKSB8fCBEb21IYW5kbGVyLmhhc0NsYXNzKGUudG9FbGVtZW50LCAncC10b29sdGlwLWFycm93JykgfHwgRG9tSGFuZGxlci5oYXNDbGFzcyhlLnRvRWxlbWVudCwgJ3AtdG9vbHRpcC10ZXh0JykgfHwgRG9tSGFuZGxlci5oYXNDbGFzcyhlLnJlbGF0ZWRUYXJnZXQsICdwLXRvb2x0aXAnKTtcbiAgICAgICAgICAgICF2YWxpZCAmJiB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Gb2N1cyhlOiBFdmVudCkge1xuICAgICAgICB0aGlzLmFjdGl2YXRlKCk7XG4gICAgfVxuXG4gICAgb25CbHVyKGU6IEV2ZW50KSB7XG4gICAgICAgIHRoaXMuZGVhY3RpdmF0ZSgpO1xuICAgIH1cblxuICAgIG9uSW5wdXRDbGljayhlOiBFdmVudCkge1xuICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgICB9XG5cbiAgICBhY3RpdmF0ZSgpIHtcbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLmNsZWFySGlkZVRpbWVvdXQoKTtcblxuICAgICAgICBpZiAodGhpcy5nZXRPcHRpb24oJ3Nob3dEZWxheScpKVxuICAgICAgICAgICAgdGhpcy5zaG93VGltZW91dCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICAgICAgfSwgdGhpcy5nZXRPcHRpb24oJ3Nob3dEZWxheScpKTtcbiAgICAgICAgZWxzZSB0aGlzLnNob3coKTtcblxuICAgICAgICBpZiAodGhpcy5nZXRPcHRpb24oJ2xpZmUnKSkge1xuICAgICAgICAgICAgbGV0IGR1cmF0aW9uID0gdGhpcy5nZXRPcHRpb24oJ3Nob3dEZWxheScpID8gdGhpcy5nZXRPcHRpb24oJ2xpZmUnKSArIHRoaXMuZ2V0T3B0aW9uKCdzaG93RGVsYXknKSA6IHRoaXMuZ2V0T3B0aW9uKCdsaWZlJyk7XG4gICAgICAgICAgICB0aGlzLmhpZGVUaW1lb3V0ID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICB9LCBkdXJhdGlvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkZWFjdGl2YXRlKCkge1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNsZWFyU2hvd1RpbWVvdXQoKTtcblxuICAgICAgICBpZiAodGhpcy5nZXRPcHRpb24oJ2hpZGVEZWxheScpKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFySGlkZVRpbWVvdXQoKTsgLy9saWZlIHRpbWVvdXRcbiAgICAgICAgICAgIHRoaXMuaGlkZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgIH0sIHRoaXMuZ2V0T3B0aW9uKCdoaWRlRGVsYXknKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFySGlkZVRpbWVvdXQoKTtcbiAgICAgICAgICAgIHRoaXMucmVtb3ZlKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXG4gICAgICAgIGxldCB0b29sdGlwQXJyb3cgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdG9vbHRpcEFycm93LmNsYXNzTmFtZSA9ICdwLXRvb2x0aXAtYXJyb3cnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0b29sdGlwQXJyb3cpO1xuXG4gICAgICAgIHRoaXMudG9vbHRpcFRleHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdGhpcy50b29sdGlwVGV4dC5jbGFzc05hbWUgPSAncC10b29sdGlwLXRleHQnO1xuXG4gICAgICAgIHRoaXMudXBkYXRlVGV4dCgpO1xuXG4gICAgICAgIGlmICh0aGlzLmdldE9wdGlvbigncG9zaXRpb25TdHlsZScpKSB7XG4gICAgICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5wb3NpdGlvbiA9IHRoaXMuZ2V0T3B0aW9uKCdwb3NpdGlvblN0eWxlJyk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLnRvb2x0aXBUZXh0KTtcblxuICAgICAgICBpZiAodGhpcy5nZXRPcHRpb24oJ2FwcGVuZFRvJykgPT09ICdib2R5JykgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lcik7XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuZ2V0T3B0aW9uKCdhcHBlbmRUbycpID09PSAndGFyZ2V0JykgRG9tSGFuZGxlci5hcHBlbmRDaGlsZCh0aGlzLmNvbnRhaW5lciwgdGhpcy5lbC5uYXRpdmVFbGVtZW50KTtcbiAgICAgICAgZWxzZSBEb21IYW5kbGVyLmFwcGVuZENoaWxkKHRoaXMuY29udGFpbmVyLCB0aGlzLmdldE9wdGlvbignYXBwZW5kVG8nKSk7XG5cbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xuXG4gICAgICAgIGlmICh0aGlzLmZpdENvbnRlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLndpZHRoID0gJ2ZpdC1jb250ZW50JztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICghdGhpcy5pc0F1dG9IaWRlKCkpIHtcbiAgICAgICAgICAgIHRoaXMuYmluZENvbnRhaW5lck1vdXNlbGVhdmVMaXN0ZW5lcigpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZENvbnRhaW5lck1vdXNlbGVhdmVMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKCF0aGlzLmNvbnRhaW5lck1vdXNlbGVhdmVMaXN0ZW5lcikge1xuICAgICAgICAgICAgY29uc3QgdGFyZ2V0RWw6IGFueSA9IHRoaXMuY29udGFpbmVyID8/IHRoaXMuY29udGFpbmVyLm5hdGl2ZUVsZW1lbnQ7XG5cbiAgICAgICAgICAgIHRoaXMuY29udGFpbmVyTW91c2VsZWF2ZUxpc3RlbmVyID0gdGhpcy5yZW5kZXJlci5saXN0ZW4odGFyZ2V0RWwsICdtb3VzZWxlYXZlJywgKGUpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlYWN0aXZhdGUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgdW5iaW5kQ29udGFpbmVyTW91c2VsZWF2ZUxpc3RlbmVyKCkge1xuICAgICAgICBpZiAodGhpcy5jb250YWluZXJNb3VzZWxlYXZlTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYmluZENvbnRhaW5lck1vdXNlbGVhdmVMaXN0ZW5lcigpO1xuICAgICAgICAgICAgdGhpcy5jb250YWluZXJNb3VzZWxlYXZlTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2hvdygpIHtcbiAgICAgICAgaWYgKCF0aGlzLmdldE9wdGlvbigndG9vbHRpcExhYmVsJykgfHwgdGhpcy5nZXRPcHRpb24oJ2Rpc2FibGVkJykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuY3JlYXRlKCk7XG4gICAgICAgIHRoaXMuYWxpZ24oKTtcbiAgICAgICAgRG9tSGFuZGxlci5mYWRlSW4odGhpcy5jb250YWluZXIsIDI1MCk7XG5cbiAgICAgICAgaWYgKHRoaXMuZ2V0T3B0aW9uKCd0b29sdGlwWkluZGV4JykgPT09ICdhdXRvJykgWkluZGV4VXRpbHMuc2V0KCd0b29sdGlwJywgdGhpcy5jb250YWluZXIsIHRoaXMuY29uZmlnLnpJbmRleC50b29sdGlwKTtcbiAgICAgICAgZWxzZSB0aGlzLmNvbnRhaW5lci5zdHlsZS56SW5kZXggPSB0aGlzLmdldE9wdGlvbigndG9vbHRpcFpJbmRleCcpO1xuXG4gICAgICAgIHRoaXMuYmluZERvY3VtZW50UmVzaXplTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICBoaWRlKCkge1xuICAgICAgICBpZiAodGhpcy5nZXRPcHRpb24oJ3Rvb2x0aXBaSW5kZXgnKSA9PT0gJ2F1dG8nKSB7XG4gICAgICAgICAgICBaSW5kZXhVdGlscy5jbGVhcih0aGlzLmNvbnRhaW5lcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuICAgIH1cblxuICAgIHVwZGF0ZVRleHQoKSB7XG4gICAgICAgIGlmICh0aGlzLmdldE9wdGlvbignZXNjYXBlJykpIHtcbiAgICAgICAgICAgIHRoaXMudG9vbHRpcFRleHQuaW5uZXJIVE1MID0gJyc7XG4gICAgICAgICAgICB0aGlzLnRvb2x0aXBUZXh0LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKHRoaXMuZ2V0T3B0aW9uKCd0b29sdGlwTGFiZWwnKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy50b29sdGlwVGV4dC5pbm5lckhUTUwgPSB0aGlzLmdldE9wdGlvbigndG9vbHRpcExhYmVsJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbGlnbigpIHtcbiAgICAgICAgbGV0IHBvc2l0aW9uID0gdGhpcy5nZXRPcHRpb24oJ3Rvb2x0aXBQb3NpdGlvbicpO1xuXG4gICAgICAgIHN3aXRjaCAocG9zaXRpb24pIHtcbiAgICAgICAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgICAgICAgICAgdGhpcy5hbGlnblRvcCgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3V0T2ZCb3VuZHMoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFsaWduQm90dG9tKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3V0T2ZCb3VuZHMoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGlnblJpZ2h0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3V0T2ZCb3VuZHMoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWxpZ25MZWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgICAgICAgICAgdGhpcy5hbGlnbkJvdHRvbSgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3V0T2ZCb3VuZHMoKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFsaWduVG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3V0T2ZCb3VuZHMoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGlnblJpZ2h0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3V0T2ZCb3VuZHMoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWxpZ25MZWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgICAgIHRoaXMuYWxpZ25MZWZ0KCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNPdXRPZkJvdW5kcygpKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWxpZ25SaWdodCgpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzT3V0T2ZCb3VuZHMoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGlnblRvcCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc091dE9mQm91bmRzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFsaWduQm90dG9tKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgICAgICAgICB0aGlzLmFsaWduUmlnaHQoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc091dE9mQm91bmRzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGlnbkxlZnQoKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc091dE9mQm91bmRzKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYWxpZ25Ub3AoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNPdXRPZkJvdW5kcygpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hbGlnbkJvdHRvbSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SG9zdE9mZnNldCgpIHtcbiAgICAgICAgaWYgKHRoaXMuZ2V0T3B0aW9uKCdhcHBlbmRUbycpID09PSAnYm9keScgfHwgdGhpcy5nZXRPcHRpb24oJ2FwcGVuZFRvJykgPT09ICd0YXJnZXQnKSB7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0ID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgbGV0IHRhcmdldExlZnQgPSBvZmZzZXQubGVmdCArIERvbUhhbmRsZXIuZ2V0V2luZG93U2Nyb2xsTGVmdCgpO1xuICAgICAgICAgICAgbGV0IHRhcmdldFRvcCA9IG9mZnNldC50b3AgKyBEb21IYW5kbGVyLmdldFdpbmRvd1Njcm9sbFRvcCgpO1xuXG4gICAgICAgICAgICByZXR1cm4geyBsZWZ0OiB0YXJnZXRMZWZ0LCB0b3A6IHRhcmdldFRvcCB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHsgbGVmdDogMCwgdG9wOiAwIH07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhbGlnblJpZ2h0KCkge1xuICAgICAgICB0aGlzLnByZUFsaWduKCdyaWdodCcpO1xuICAgICAgICBsZXQgaG9zdE9mZnNldCA9IHRoaXMuZ2V0SG9zdE9mZnNldCgpO1xuICAgICAgICBsZXQgbGVmdCA9IGhvc3RPZmZzZXQubGVmdCArIERvbUhhbmRsZXIuZ2V0T3V0ZXJXaWR0aCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpO1xuICAgICAgICBsZXQgdG9wID0gaG9zdE9mZnNldC50b3AgKyAoRG9tSGFuZGxlci5nZXRPdXRlckhlaWdodCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpIC0gRG9tSGFuZGxlci5nZXRPdXRlckhlaWdodCh0aGlzLmNvbnRhaW5lcikpIC8gMjtcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUubGVmdCA9IGxlZnQgKyB0aGlzLmdldE9wdGlvbigncG9zaXRpb25MZWZ0JykgKyAncHgnO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS50b3AgPSB0b3AgKyB0aGlzLmdldE9wdGlvbigncG9zaXRpb25Ub3AnKSArICdweCc7XG4gICAgfVxuXG4gICAgYWxpZ25MZWZ0KCkge1xuICAgICAgICB0aGlzLnByZUFsaWduKCdsZWZ0Jyk7XG4gICAgICAgIGxldCBob3N0T2Zmc2V0ID0gdGhpcy5nZXRIb3N0T2Zmc2V0KCk7XG4gICAgICAgIGxldCBsZWZ0ID0gaG9zdE9mZnNldC5sZWZ0IC0gRG9tSGFuZGxlci5nZXRPdXRlcldpZHRoKHRoaXMuY29udGFpbmVyKTtcbiAgICAgICAgbGV0IHRvcCA9IGhvc3RPZmZzZXQudG9wICsgKERvbUhhbmRsZXIuZ2V0T3V0ZXJIZWlnaHQodGhpcy5lbC5uYXRpdmVFbGVtZW50KSAtIERvbUhhbmRsZXIuZ2V0T3V0ZXJIZWlnaHQodGhpcy5jb250YWluZXIpKSAvIDI7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmxlZnQgPSBsZWZ0ICsgdGhpcy5nZXRPcHRpb24oJ3Bvc2l0aW9uTGVmdCcpICsgJ3B4JztcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdG9wICsgdGhpcy5nZXRPcHRpb24oJ3Bvc2l0aW9uVG9wJykgKyAncHgnO1xuICAgIH1cblxuICAgIGFsaWduVG9wKCkge1xuICAgICAgICB0aGlzLnByZUFsaWduKCd0b3AnKTtcbiAgICAgICAgbGV0IGhvc3RPZmZzZXQgPSB0aGlzLmdldEhvc3RPZmZzZXQoKTtcbiAgICAgICAgbGV0IGxlZnQgPSBob3N0T2Zmc2V0LmxlZnQgKyAoRG9tSGFuZGxlci5nZXRPdXRlcldpZHRoKHRoaXMuZWwubmF0aXZlRWxlbWVudCkgLSBEb21IYW5kbGVyLmdldE91dGVyV2lkdGgodGhpcy5jb250YWluZXIpKSAvIDI7XG4gICAgICAgIGxldCB0b3AgPSBob3N0T2Zmc2V0LnRvcCAtIERvbUhhbmRsZXIuZ2V0T3V0ZXJIZWlnaHQodGhpcy5jb250YWluZXIpO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gbGVmdCArIHRoaXMuZ2V0T3B0aW9uKCdwb3NpdGlvbkxlZnQnKSArICdweCc7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IHRvcCArIHRoaXMuZ2V0T3B0aW9uKCdwb3NpdGlvblRvcCcpICsgJ3B4JztcbiAgICB9XG5cbiAgICBhbGlnbkJvdHRvbSgpIHtcbiAgICAgICAgdGhpcy5wcmVBbGlnbignYm90dG9tJyk7XG4gICAgICAgIGxldCBob3N0T2Zmc2V0ID0gdGhpcy5nZXRIb3N0T2Zmc2V0KCk7XG4gICAgICAgIGxldCBsZWZ0ID0gaG9zdE9mZnNldC5sZWZ0ICsgKERvbUhhbmRsZXIuZ2V0T3V0ZXJXaWR0aCh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQpIC0gRG9tSGFuZGxlci5nZXRPdXRlcldpZHRoKHRoaXMuY29udGFpbmVyKSkgLyAyO1xuICAgICAgICBsZXQgdG9wID0gaG9zdE9mZnNldC50b3AgKyBEb21IYW5kbGVyLmdldE91dGVySGVpZ2h0KHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLmxlZnQgPSBsZWZ0ICsgdGhpcy5nZXRPcHRpb24oJ3Bvc2l0aW9uTGVmdCcpICsgJ3B4JztcbiAgICAgICAgdGhpcy5jb250YWluZXIuc3R5bGUudG9wID0gdG9wICsgdGhpcy5nZXRPcHRpb24oJ3Bvc2l0aW9uVG9wJykgKyAncHgnO1xuICAgIH1cblxuICAgIHNldE9wdGlvbihvcHRpb246IFRvb2x0aXBPcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX3Rvb2x0aXBPcHRpb25zID0geyAuLi50aGlzLl90b29sdGlwT3B0aW9ucywgLi4ub3B0aW9uIH07XG4gICAgfVxuXG4gICAgZ2V0T3B0aW9uKG9wdGlvbjogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90b29sdGlwT3B0aW9uc1tvcHRpb25dO1xuICAgIH1cblxuICAgIGdldFRhcmdldChlbCkge1xuICAgICAgICByZXR1cm4gRG9tSGFuZGxlci5oYXNDbGFzcyhlbCwgJ3AtaW5wdXR3cmFwcGVyJykgPyBEb21IYW5kbGVyLmZpbmRTaW5nbGUoZWwsICdpbnB1dCcpIDogZWw7XG4gICAgfVxuXG4gICAgcHJlQWxpZ24ocG9zaXRpb246IHN0cmluZykge1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5zdHlsZS5sZWZ0ID0gLTk5OSArICdweCc7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLnN0eWxlLnRvcCA9IC05OTkgKyAncHgnO1xuXG4gICAgICAgIGxldCBkZWZhdWx0Q2xhc3NOYW1lID0gJ3AtdG9vbHRpcCBwLWNvbXBvbmVudCBwLXRvb2x0aXAtJyArIHBvc2l0aW9uO1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5jbGFzc05hbWUgPSB0aGlzLmdldE9wdGlvbigndG9vbHRpcFN0eWxlQ2xhc3MnKSA/IGRlZmF1bHRDbGFzc05hbWUgKyAnICcgKyB0aGlzLmdldE9wdGlvbigndG9vbHRpcFN0eWxlQ2xhc3MnKSA6IGRlZmF1bHRDbGFzc05hbWU7XG4gICAgfVxuXG4gICAgaXNPdXRPZkJvdW5kcygpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IG9mZnNldCA9IHRoaXMuY29udGFpbmVyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBsZXQgdGFyZ2V0VG9wID0gb2Zmc2V0LnRvcDtcbiAgICAgICAgbGV0IHRhcmdldExlZnQgPSBvZmZzZXQubGVmdDtcbiAgICAgICAgbGV0IHdpZHRoID0gRG9tSGFuZGxlci5nZXRPdXRlcldpZHRoKHRoaXMuY29udGFpbmVyKTtcbiAgICAgICAgbGV0IGhlaWdodCA9IERvbUhhbmRsZXIuZ2V0T3V0ZXJIZWlnaHQodGhpcy5jb250YWluZXIpO1xuICAgICAgICBsZXQgdmlld3BvcnQgPSBEb21IYW5kbGVyLmdldFZpZXdwb3J0KCk7XG5cbiAgICAgICAgcmV0dXJuIHRhcmdldExlZnQgKyB3aWR0aCA+IHZpZXdwb3J0LndpZHRoIHx8IHRhcmdldExlZnQgPCAwIHx8IHRhcmdldFRvcCA8IDAgfHwgdGFyZ2V0VG9wICsgaGVpZ2h0ID4gdmlld3BvcnQuaGVpZ2h0O1xuICAgIH1cblxuICAgIG9uV2luZG93UmVzaXplKGU6IEV2ZW50KSB7XG4gICAgICAgIHRoaXMuaGlkZSgpO1xuICAgIH1cblxuICAgIGJpbmREb2N1bWVudFJlc2l6ZUxpc3RlbmVyKCkge1xuICAgICAgICB0aGlzLnpvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXNpemVMaXN0ZW5lciA9IHRoaXMub25XaW5kb3dSZXNpemUuYmluZCh0aGlzKTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdW5iaW5kRG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzaXplTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLnJlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIHRoaXMucmVzaXplTGlzdGVuZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgYmluZFNjcm9sbExpc3RlbmVyKCkge1xuICAgICAgICBpZiAoIXRoaXMuc2Nyb2xsSGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyID0gbmV3IENvbm5lY3RlZE92ZXJsYXlTY3JvbGxIYW5kbGVyKHRoaXMuZWwubmF0aXZlRWxlbWVudCwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRhaW5lcikge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhpZGUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlci5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICB9XG5cbiAgICB1bmJpbmRTY3JvbGxMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMuc2Nyb2xsSGFuZGxlcikge1xuICAgICAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyLnVuYmluZFNjcm9sbExpc3RlbmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmRFdmVudHMoKSB7XG4gICAgICAgIGlmICh0aGlzLmdldE9wdGlvbigndG9vbHRpcEV2ZW50JykgPT09ICdob3ZlcicpIHtcbiAgICAgICAgICAgIHRoaXMuZWwubmF0aXZlRWxlbWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZWVudGVyJywgdGhpcy5tb3VzZUVudGVyTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCB0aGlzLm1vdXNlTGVhdmVMaXN0ZW5lcik7XG4gICAgICAgICAgICB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLmNsaWNrTGlzdGVuZXIpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZ2V0T3B0aW9uKCd0b29sdGlwRXZlbnQnKSA9PT0gJ2ZvY3VzJykge1xuICAgICAgICAgICAgbGV0IHRhcmdldCA9IHRoaXMuZ2V0VGFyZ2V0KHRoaXMuZWwubmF0aXZlRWxlbWVudCk7XG5cbiAgICAgICAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKCdmb2N1cycsIHRoaXMuZm9jdXNMaXN0ZW5lcik7XG4gICAgICAgICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcignYmx1cicsIHRoaXMuYmx1ckxpc3RlbmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMudW5iaW5kRG9jdW1lbnRSZXNpemVMaXN0ZW5lcigpO1xuICAgIH1cblxuICAgIHJlbW92ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyICYmIHRoaXMuY29udGFpbmVyLnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmdldE9wdGlvbignYXBwZW5kVG8nKSA9PT0gJ2JvZHknKSBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMuY29udGFpbmVyKTtcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMuZ2V0T3B0aW9uKCdhcHBlbmRUbycpID09PSAndGFyZ2V0JykgdGhpcy5lbC5uYXRpdmVFbGVtZW50LnJlbW92ZUNoaWxkKHRoaXMuY29udGFpbmVyKTtcbiAgICAgICAgICAgIGVsc2UgRG9tSGFuZGxlci5yZW1vdmVDaGlsZCh0aGlzLmNvbnRhaW5lciwgdGhpcy5nZXRPcHRpb24oJ2FwcGVuZFRvJykpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51bmJpbmREb2N1bWVudFJlc2l6ZUxpc3RlbmVyKCk7XG4gICAgICAgIHRoaXMudW5iaW5kU2Nyb2xsTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy51bmJpbmRDb250YWluZXJNb3VzZWxlYXZlTGlzdGVuZXIoKTtcbiAgICAgICAgdGhpcy5jbGVhclRpbWVvdXRzKCk7XG4gICAgICAgIHRoaXMuY29udGFpbmVyID0gbnVsbDtcbiAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyID0gbnVsbDtcbiAgICB9XG5cbiAgICBjbGVhclNob3dUaW1lb3V0KCkge1xuICAgICAgICBpZiAodGhpcy5zaG93VGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuc2hvd1RpbWVvdXQpO1xuICAgICAgICAgICAgdGhpcy5zaG93VGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhckhpZGVUaW1lb3V0KCkge1xuICAgICAgICBpZiAodGhpcy5oaWRlVGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuaGlkZVRpbWVvdXQpO1xuICAgICAgICAgICAgdGhpcy5oaWRlVGltZW91dCA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjbGVhclRpbWVvdXRzKCkge1xuICAgICAgICB0aGlzLmNsZWFyU2hvd1RpbWVvdXQoKTtcbiAgICAgICAgdGhpcy5jbGVhckhpZGVUaW1lb3V0KCk7XG4gICAgfVxuXG4gICAgbmdPbkRlc3Ryb3koKSB7XG4gICAgICAgIHRoaXMudW5iaW5kRXZlbnRzKCk7XG5cbiAgICAgICAgaWYgKHRoaXMuY29udGFpbmVyKSB7XG4gICAgICAgICAgICBaSW5kZXhVdGlscy5jbGVhcih0aGlzLmNvbnRhaW5lcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlbW92ZSgpO1xuXG4gICAgICAgIGlmICh0aGlzLnNjcm9sbEhhbmRsZXIpIHtcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsSGFuZGxlci5kZXN0cm95KCk7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbEhhbmRsZXIgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufVxuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHM6IFtDb21tb25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtUb29sdGlwXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtUb29sdGlwXVxufSlcbmV4cG9ydCBjbGFzcyBUb29sdGlwTW9kdWxlIHt9XG4iXX0=