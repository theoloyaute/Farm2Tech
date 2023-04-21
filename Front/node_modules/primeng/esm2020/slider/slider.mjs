import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, NgModule, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomHandler } from 'primeng/dom';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export const SLIDER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => Slider),
    multi: true
};
export class Slider {
    constructor(el, renderer, ngZone, cd) {
        this.el = el;
        this.renderer = renderer;
        this.ngZone = ngZone;
        this.cd = cd;
        this.min = 0;
        this.max = 100;
        this.orientation = 'horizontal';
        this.tabindex = 0;
        this.onChange = new EventEmitter();
        this.onSlideEnd = new EventEmitter();
        this.handleValues = [];
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
        this.handleIndex = 0;
    }
    onMouseDown(event, index) {
        if (this.disabled) {
            return;
        }
        this.dragging = true;
        this.updateDomData();
        this.sliderHandleClick = true;
        if (this.range && this.handleValues && this.handleValues[0] === this.max) {
            this.handleIndex = 0;
        }
        else {
            this.handleIndex = index;
        }
        this.bindDragListeners();
        event.target.focus();
        event.preventDefault();
        if (this.animate) {
            DomHandler.removeClass(this.el.nativeElement.children[0], 'p-slider-animate');
        }
    }
    onTouchStart(event, index) {
        if (this.disabled) {
            return;
        }
        var touchobj = event.changedTouches[0];
        this.startHandleValue = this.range ? this.handleValues[index] : this.handleValue;
        this.dragging = true;
        if (this.range && this.handleValues && this.handleValues[0] === this.max) {
            this.handleIndex = 0;
        }
        else {
            this.handleIndex = index;
        }
        if (this.orientation === 'horizontal') {
            this.startx = parseInt(touchobj.clientX, 10);
            this.barWidth = this.el.nativeElement.children[0].offsetWidth;
        }
        else {
            this.starty = parseInt(touchobj.clientY, 10);
            this.barHeight = this.el.nativeElement.children[0].offsetHeight;
        }
        if (this.animate) {
            DomHandler.removeClass(this.el.nativeElement.children[0], 'p-slider-animate');
        }
        event.preventDefault();
    }
    onTouchMove(event, index) {
        if (this.disabled) {
            return;
        }
        var touchobj = event.changedTouches[0], handleValue = 0;
        if (this.orientation === 'horizontal') {
            handleValue = Math.floor(((parseInt(touchobj.clientX, 10) - this.startx) * 100) / this.barWidth) + this.startHandleValue;
        }
        else {
            handleValue = Math.floor(((this.starty - parseInt(touchobj.clientY, 10)) * 100) / this.barHeight) + this.startHandleValue;
        }
        this.setValueFromHandle(event, handleValue);
        event.preventDefault();
    }
    onTouchEnd(event, index) {
        if (this.disabled) {
            return;
        }
        this.dragging = false;
        if (this.range)
            this.onSlideEnd.emit({ originalEvent: event, values: this.values });
        else
            this.onSlideEnd.emit({ originalEvent: event, value: this.value });
        if (this.animate) {
            DomHandler.addClass(this.el.nativeElement.children[0], 'p-slider-animate');
        }
        event.preventDefault();
    }
    onBarClick(event) {
        if (this.disabled) {
            return;
        }
        if (!this.sliderHandleClick) {
            this.updateDomData();
            this.handleChange(event);
        }
        this.sliderHandleClick = false;
    }
    onHandleKeydown(event, handleIndex) {
        if (this.disabled) {
            return;
        }
        if (event.which == 38 || event.which == 39) {
            this.spin(event, 1, handleIndex);
        }
        else if (event.which == 37 || event.which == 40) {
            this.spin(event, -1, handleIndex);
        }
    }
    spin(event, dir, handleIndex) {
        let step = (this.step || 1) * dir;
        if (this.range) {
            this.handleIndex = handleIndex;
            this.updateValue(this.values[this.handleIndex] + step);
            this.updateHandleValue();
        }
        else {
            this.updateValue(this.value + step);
            this.updateHandleValue();
        }
        event.preventDefault();
    }
    handleChange(event) {
        let handleValue = this.calculateHandleValue(event);
        this.setValueFromHandle(event, handleValue);
    }
    bindDragListeners() {
        this.ngZone.runOutsideAngular(() => {
            const documentTarget = this.el ? this.el.nativeElement.ownerDocument : 'document';
            if (!this.dragListener) {
                this.dragListener = this.renderer.listen(documentTarget, 'mousemove', (event) => {
                    if (this.dragging) {
                        this.ngZone.run(() => {
                            this.handleChange(event);
                        });
                    }
                });
            }
            if (!this.mouseupListener) {
                this.mouseupListener = this.renderer.listen(documentTarget, 'mouseup', (event) => {
                    if (this.dragging) {
                        this.dragging = false;
                        this.ngZone.run(() => {
                            if (this.range)
                                this.onSlideEnd.emit({ originalEvent: event, values: this.values });
                            else
                                this.onSlideEnd.emit({ originalEvent: event, value: this.value });
                            if (this.animate) {
                                DomHandler.addClass(this.el.nativeElement.children[0], 'p-slider-animate');
                            }
                        });
                    }
                });
            }
        });
    }
    unbindDragListeners() {
        if (this.dragListener) {
            this.dragListener();
        }
        if (this.mouseupListener) {
            this.mouseupListener();
        }
    }
    setValueFromHandle(event, handleValue) {
        this.sliderHandleClick = false;
        let newValue = this.getValueFromHandle(handleValue);
        if (this.range) {
            if (this.step) {
                this.handleStepChange(newValue, this.values[this.handleIndex]);
            }
            else {
                this.handleValues[this.handleIndex] = handleValue;
                this.updateValue(newValue, event);
            }
        }
        else {
            if (this.step) {
                this.handleStepChange(newValue, this.value);
            }
            else {
                this.handleValue = handleValue;
                this.updateValue(newValue, event);
            }
        }
        this.cd.markForCheck();
    }
    handleStepChange(newValue, oldValue) {
        let diff = newValue - oldValue;
        let val = oldValue;
        if (diff < 0) {
            val = oldValue + Math.ceil(newValue / this.step - oldValue / this.step) * this.step;
        }
        else if (diff > 0) {
            val = oldValue + Math.floor(newValue / this.step - oldValue / this.step) * this.step;
        }
        this.updateValue(val);
        this.updateHandleValue();
    }
    writeValue(value) {
        if (this.range)
            this.values = value || [0, 0];
        else
            this.value = value || 0;
        this.updateHandleValue();
        this.updateDiffAndOffset();
        this.cd.markForCheck();
    }
    registerOnChange(fn) {
        this.onModelChange = fn;
    }
    registerOnTouched(fn) {
        this.onModelTouched = fn;
    }
    setDisabledState(val) {
        this.disabled = val;
        this.cd.markForCheck();
    }
    get rangeStartLeft() {
        if (!this.isVertical())
            return this.handleValues[0] > 100 ? 100 + '%' : this.handleValues[0] + '%';
        return null;
    }
    get rangeStartBottom() {
        return this.isVertical() ? this.handleValues[0] + '%' : 'auto';
    }
    get rangeEndLeft() {
        return this.isVertical() ? null : this.handleValues[1] + '%';
    }
    get rangeEndBottom() {
        return this.isVertical() ? this.handleValues[1] + '%' : 'auto';
    }
    isVertical() {
        return this.orientation === 'vertical';
    }
    updateDomData() {
        let rect = this.el.nativeElement.children[0].getBoundingClientRect();
        this.initX = rect.left + DomHandler.getWindowScrollLeft();
        this.initY = rect.top + DomHandler.getWindowScrollTop();
        this.barWidth = this.el.nativeElement.children[0].offsetWidth;
        this.barHeight = this.el.nativeElement.children[0].offsetHeight;
    }
    calculateHandleValue(event) {
        if (this.orientation === 'horizontal')
            return ((event.pageX - this.initX) * 100) / this.barWidth;
        else
            return ((this.initY + this.barHeight - event.pageY) * 100) / this.barHeight;
    }
    updateHandleValue() {
        if (this.range) {
            this.handleValues[0] = ((this.values[0] < this.min ? 0 : this.values[0] - this.min) * 100) / (this.max - this.min);
            this.handleValues[1] = ((this.values[1] > this.max ? 100 : this.values[1] - this.min) * 100) / (this.max - this.min);
        }
        else {
            if (this.value < this.min)
                this.handleValue = 0;
            else if (this.value > this.max)
                this.handleValue = 100;
            else
                this.handleValue = ((this.value - this.min) * 100) / (this.max - this.min);
        }
        if (this.step) {
            this.updateDiffAndOffset();
        }
    }
    updateDiffAndOffset() {
        this.diff = this.getDiff();
        this.offset = this.getOffset();
    }
    getDiff() {
        return Math.abs(this.handleValues[0] - this.handleValues[1]);
    }
    getOffset() {
        return Math.min(this.handleValues[0], this.handleValues[1]);
    }
    updateValue(val, event) {
        if (this.range) {
            let value = val;
            if (this.handleIndex == 0) {
                if (value < this.min) {
                    value = this.min;
                    this.handleValues[0] = 0;
                }
                else if (value > this.values[1]) {
                    if (value > this.max) {
                        value = this.max;
                        this.handleValues[0] = 100;
                    }
                }
                this.sliderHandleStart.nativeElement.focus();
            }
            else {
                if (value > this.max) {
                    value = this.max;
                    this.handleValues[1] = 100;
                    this.offset = this.handleValues[1];
                }
                else if (value < this.min) {
                    value = this.min;
                    this.handleValues[1] = 0;
                }
                else if (value < this.values[0]) {
                    this.offset = this.handleValues[1];
                }
                this.sliderHandleEnd.nativeElement.focus();
            }
            if (this.step) {
                this.updateHandleValue();
            }
            else {
                this.updateDiffAndOffset();
            }
            this.values[this.handleIndex] = this.getNormalizedValue(value);
            let newValues = [this.minVal, this.maxVal];
            this.onModelChange(newValues);
            this.onChange.emit({ event: event, values: this.values });
        }
        else {
            if (val < this.min) {
                val = this.min;
                this.handleValue = 0;
            }
            else if (val > this.max) {
                val = this.max;
                this.handleValue = 100;
            }
            this.value = this.getNormalizedValue(val);
            this.onModelChange(this.value);
            this.onChange.emit({ event: event, value: this.value });
            this.sliderHandle.nativeElement.focus();
        }
    }
    getValueFromHandle(handleValue) {
        return (this.max - this.min) * (handleValue / 100) + this.min;
    }
    getDecimalsCount(value) {
        if (value && Math.floor(value) !== value)
            return value.toString().split('.')[1].length || 0;
        return 0;
    }
    getNormalizedValue(val) {
        let decimalsCount = this.getDecimalsCount(this.step);
        if (decimalsCount > 0) {
            return +parseFloat(val.toString()).toFixed(decimalsCount);
        }
        else {
            return Math.floor(val);
        }
    }
    ngOnDestroy() {
        this.unbindDragListeners();
    }
    get minVal() {
        return Math.min(this.values[1], this.values[0]);
    }
    get maxVal() {
        return Math.max(this.values[1], this.values[0]);
    }
}
Slider.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: Slider, deps: [{ token: i0.ElementRef }, { token: i0.Renderer2 }, { token: i0.NgZone }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
Slider.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.0", type: Slider, selector: "p-slider", inputs: { animate: "animate", disabled: "disabled", min: "min", max: "max", orientation: "orientation", step: "step", range: "range", style: "style", styleClass: "styleClass", ariaLabelledBy: "ariaLabelledBy", tabindex: "tabindex" }, outputs: { onChange: "onChange", onSlideEnd: "onSlideEnd" }, host: { classAttribute: "p-element" }, providers: [SLIDER_VALUE_ACCESSOR], viewQueries: [{ propertyName: "sliderHandle", first: true, predicate: ["sliderHandle"], descendants: true }, { propertyName: "sliderHandleStart", first: true, predicate: ["sliderHandleStart"], descendants: true }, { propertyName: "sliderHandleEnd", first: true, predicate: ["sliderHandleEnd"], descendants: true }], ngImport: i0, template: `
        <div
            [ngStyle]="style"
            [class]="styleClass"
            [ngClass]="{ 'p-slider p-component': true, 'p-disabled': disabled, 'p-slider-horizontal': orientation == 'horizontal', 'p-slider-vertical': orientation == 'vertical', 'p-slider-animate': animate }"
            (click)="onBarClick($event)"
        >
            <span
                *ngIf="range && orientation == 'horizontal'"
                class="p-slider-range"
                [ngStyle]="{ left: offset !== null && offset !== undefined ? offset + '%' : handleValues[0] + '%', width: diff ? diff + '%' : handleValues[1] - handleValues[0] + '%' }"
            ></span>
            <span
                *ngIf="range && orientation == 'vertical'"
                class="p-slider-range"
                [ngStyle]="{ bottom: offset !== null && offset !== undefined ? offset + '%' : handleValues[0] + '%', height: diff ? diff + '%' : handleValues[1] - handleValues[0] + '%' }"
            ></span>
            <span *ngIf="!range && orientation == 'vertical'" class="p-slider-range" [ngStyle]="{ height: handleValue + '%' }"></span>
            <span *ngIf="!range && orientation == 'horizontal'" class="p-slider-range" [ngStyle]="{ width: handleValue + '%' }"></span>
            <span
                #sliderHandle
                *ngIf="!range"
                [attr.tabindex]="disabled ? null : tabindex"
                (keydown)="onHandleKeydown($event)"
                class="p-slider-handle"
                (mousedown)="onMouseDown($event)"
                (touchstart)="onTouchStart($event)"
                (touchmove)="onTouchMove($event)"
                (touchend)="onTouchEnd($event)"
                [style.transition]="dragging ? 'none' : null"
                [ngStyle]="{ left: orientation == 'horizontal' ? handleValue + '%' : null, bottom: orientation == 'vertical' ? handleValue + '%' : null }"
                [attr.aria-valuemin]="min"
                [attr.aria-valuenow]="value"
                [attr.aria-valuemax]="max"
                [attr.aria-labelledby]="ariaLabelledBy"
            ></span>
            <span
                #sliderHandleStart
                *ngIf="range"
                [attr.tabindex]="disabled ? null : tabindex"
                (keydown)="onHandleKeydown($event, 0)"
                (mousedown)="onMouseDown($event, 0)"
                (touchstart)="onTouchStart($event, 0)"
                (touchmove)="onTouchMove($event, 0)"
                (touchend)="onTouchEnd($event)"
                [style.transition]="dragging ? 'none' : null"
                class="p-slider-handle"
                [ngStyle]="{ left: rangeStartLeft, bottom: rangeStartBottom }"
                [ngClass]="{ 'p-slider-handle-active': handleIndex == 0 }"
                [attr.aria-valuemin]="min"
                [attr.aria-valuenow]="value ? value[0] : null"
                [attr.aria-valuemax]="max"
                [attr.aria-labelledby]="ariaLabelledBy"
            ></span>
            <span
                #sliderHandleEnd
                *ngIf="range"
                [attr.tabindex]="disabled ? null : tabindex"
                (keydown)="onHandleKeydown($event, 1)"
                (mousedown)="onMouseDown($event, 1)"
                (touchstart)="onTouchStart($event, 1)"
                (touchmove)="onTouchMove($event, 1)"
                (touchend)="onTouchEnd($event)"
                [style.transition]="dragging ? 'none' : null"
                class="p-slider-handle"
                [ngStyle]="{ left: rangeEndLeft, bottom: rangeEndBottom }"
                [ngClass]="{ 'p-slider-handle-active': handleIndex == 1 }"
                [attr.aria-valuemin]="min"
                [attr.aria-valuenow]="value ? value[1] : null"
                [attr.aria-valuemax]="max"
                [attr.aria-labelledby]="ariaLabelledBy"
            ></span>
        </div>
    `, isInline: true, styles: [".p-slider{position:relative}.p-slider .p-slider-handle{position:absolute;cursor:grab;touch-action:none;display:block}.p-slider-range{position:absolute;display:block}.p-slider-horizontal .p-slider-range{top:0;left:0;height:100%}.p-slider-horizontal .p-slider-handle{top:50%}.p-slider-vertical{height:100px}.p-slider-vertical .p-slider-handle{left:50%}.p-slider-vertical .p-slider-range{bottom:0;left:0;width:100%}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: Slider, decorators: [{
            type: Component,
            args: [{ selector: 'p-slider', template: `
        <div
            [ngStyle]="style"
            [class]="styleClass"
            [ngClass]="{ 'p-slider p-component': true, 'p-disabled': disabled, 'p-slider-horizontal': orientation == 'horizontal', 'p-slider-vertical': orientation == 'vertical', 'p-slider-animate': animate }"
            (click)="onBarClick($event)"
        >
            <span
                *ngIf="range && orientation == 'horizontal'"
                class="p-slider-range"
                [ngStyle]="{ left: offset !== null && offset !== undefined ? offset + '%' : handleValues[0] + '%', width: diff ? diff + '%' : handleValues[1] - handleValues[0] + '%' }"
            ></span>
            <span
                *ngIf="range && orientation == 'vertical'"
                class="p-slider-range"
                [ngStyle]="{ bottom: offset !== null && offset !== undefined ? offset + '%' : handleValues[0] + '%', height: diff ? diff + '%' : handleValues[1] - handleValues[0] + '%' }"
            ></span>
            <span *ngIf="!range && orientation == 'vertical'" class="p-slider-range" [ngStyle]="{ height: handleValue + '%' }"></span>
            <span *ngIf="!range && orientation == 'horizontal'" class="p-slider-range" [ngStyle]="{ width: handleValue + '%' }"></span>
            <span
                #sliderHandle
                *ngIf="!range"
                [attr.tabindex]="disabled ? null : tabindex"
                (keydown)="onHandleKeydown($event)"
                class="p-slider-handle"
                (mousedown)="onMouseDown($event)"
                (touchstart)="onTouchStart($event)"
                (touchmove)="onTouchMove($event)"
                (touchend)="onTouchEnd($event)"
                [style.transition]="dragging ? 'none' : null"
                [ngStyle]="{ left: orientation == 'horizontal' ? handleValue + '%' : null, bottom: orientation == 'vertical' ? handleValue + '%' : null }"
                [attr.aria-valuemin]="min"
                [attr.aria-valuenow]="value"
                [attr.aria-valuemax]="max"
                [attr.aria-labelledby]="ariaLabelledBy"
            ></span>
            <span
                #sliderHandleStart
                *ngIf="range"
                [attr.tabindex]="disabled ? null : tabindex"
                (keydown)="onHandleKeydown($event, 0)"
                (mousedown)="onMouseDown($event, 0)"
                (touchstart)="onTouchStart($event, 0)"
                (touchmove)="onTouchMove($event, 0)"
                (touchend)="onTouchEnd($event)"
                [style.transition]="dragging ? 'none' : null"
                class="p-slider-handle"
                [ngStyle]="{ left: rangeStartLeft, bottom: rangeStartBottom }"
                [ngClass]="{ 'p-slider-handle-active': handleIndex == 0 }"
                [attr.aria-valuemin]="min"
                [attr.aria-valuenow]="value ? value[0] : null"
                [attr.aria-valuemax]="max"
                [attr.aria-labelledby]="ariaLabelledBy"
            ></span>
            <span
                #sliderHandleEnd
                *ngIf="range"
                [attr.tabindex]="disabled ? null : tabindex"
                (keydown)="onHandleKeydown($event, 1)"
                (mousedown)="onMouseDown($event, 1)"
                (touchstart)="onTouchStart($event, 1)"
                (touchmove)="onTouchMove($event, 1)"
                (touchend)="onTouchEnd($event)"
                [style.transition]="dragging ? 'none' : null"
                class="p-slider-handle"
                [ngStyle]="{ left: rangeEndLeft, bottom: rangeEndBottom }"
                [ngClass]="{ 'p-slider-handle-active': handleIndex == 1 }"
                [attr.aria-valuemin]="min"
                [attr.aria-valuenow]="value ? value[1] : null"
                [attr.aria-valuemax]="max"
                [attr.aria-labelledby]="ariaLabelledBy"
            ></span>
        </div>
    `, providers: [SLIDER_VALUE_ACCESSOR], changeDetection: ChangeDetectionStrategy.OnPush, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element'
                    }, styles: [".p-slider{position:relative}.p-slider .p-slider-handle{position:absolute;cursor:grab;touch-action:none;display:block}.p-slider-range{position:absolute;display:block}.p-slider-horizontal .p-slider-range{top:0;left:0;height:100%}.p-slider-horizontal .p-slider-handle{top:50%}.p-slider-vertical{height:100px}.p-slider-vertical .p-slider-handle{left:50%}.p-slider-vertical .p-slider-range{bottom:0;left:0;width:100%}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.Renderer2 }, { type: i0.NgZone }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { animate: [{
                type: Input
            }], disabled: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], orientation: [{
                type: Input
            }], step: [{
                type: Input
            }], range: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], ariaLabelledBy: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], onChange: [{
                type: Output
            }], onSlideEnd: [{
                type: Output
            }], sliderHandle: [{
                type: ViewChild,
                args: ['sliderHandle']
            }], sliderHandleStart: [{
                type: ViewChild,
                args: ['sliderHandleStart']
            }], sliderHandleEnd: [{
                type: ViewChild,
                args: ['sliderHandleEnd']
            }] } });
export class SliderModule {
}
SliderModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: SliderModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
SliderModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.1.0", ngImport: i0, type: SliderModule, declarations: [Slider], imports: [CommonModule], exports: [Slider] });
SliderModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: SliderModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: SliderModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Slider],
                    declarations: [Slider]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2xpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2FwcC9jb21wb25lbnRzL3NsaWRlci9zbGlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSx1QkFBdUIsRUFBcUIsU0FBUyxFQUFjLFlBQVksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBcUIsTUFBTSxFQUFhLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNqTixPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGFBQWEsQ0FBQzs7O0FBRXpDLE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFRO0lBQ3RDLE9BQU8sRUFBRSxpQkFBaUI7SUFDMUIsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDckMsS0FBSyxFQUFFLElBQUk7Q0FDZCxDQUFDO0FBc0ZGLE1BQU0sT0FBTyxNQUFNO0lBMkVmLFlBQW1CLEVBQWMsRUFBUyxRQUFtQixFQUFVLE1BQWMsRUFBUyxFQUFxQjtRQUFoRyxPQUFFLEdBQUYsRUFBRSxDQUFZO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUFVLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBUyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQXRFMUcsUUFBRyxHQUFXLENBQUMsQ0FBQztRQUVoQixRQUFHLEdBQVcsR0FBRyxDQUFDO1FBRWxCLGdCQUFXLEdBQVcsWUFBWSxDQUFDO1FBWW5DLGFBQVEsR0FBVyxDQUFDLENBQUM7UUFFcEIsYUFBUSxHQUFzQixJQUFJLFlBQVksRUFBRSxDQUFDO1FBRWpELGVBQVUsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQWN0RCxpQkFBWSxHQUFhLEVBQUUs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UTtzQkFBaEIsS0FBSztnQkFFSSxRQUFRO3NCQUFqQixNQUFNO2dCQUVHLFVBQVU7c0JBQW5CLE1BQU07Z0JBRW9CLFlBQVk7c0JBQXRDLFNBQVM7dUJBQUMsY0FBYztnQkFFTyxpQkFBaUI7c0JBQWhELFNBQVM7dUJBQUMsbUJBQW1CO2dCQUVBLGVBQWU7c0JBQTVDLFNBQVM7dUJBQUMsaUJBQWlCOztBQWdiaEMsTUFBTSxPQUFPLFlBQVk7O3lHQUFaLFlBQVk7MEdBQVosWUFBWSxpQkEvY1osTUFBTSxhQTJjTCxZQUFZLGFBM2NiLE1BQU07MEdBK2NOLFlBQVksWUFKWCxZQUFZOzJGQUliLFlBQVk7a0JBTHhCLFFBQVE7bUJBQUM7b0JBQ04sT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO29CQUN2QixPQUFPLEVBQUUsQ0FBQyxNQUFNLENBQUM7b0JBQ2pCLFlBQVksRUFBRSxDQUFDLE1BQU0sQ0FBQztpQkFDekIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENoYW5nZURldGVjdG9yUmVmLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEV2ZW50RW1pdHRlciwgZm9yd2FyZFJlZiwgSW5wdXQsIE5nTW9kdWxlLCBOZ1pvbmUsIE9uRGVzdHJveSwgT3V0cHV0LCBSZW5kZXJlcjIsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IERvbUhhbmRsZXIgfSBmcm9tICdwcmltZW5nL2RvbSc7XG5cbmV4cG9ydCBjb25zdCBTTElERVJfVkFMVUVfQUNDRVNTT1I6IGFueSA9IHtcbiAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBTbGlkZXIpLFxuICAgIG11bHRpOiB0cnVlXG59O1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3RvcjogJ3Atc2xpZGVyJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8ZGl2XG4gICAgICAgICAgICBbbmdTdHlsZV09XCJzdHlsZVwiXG4gICAgICAgICAgICBbY2xhc3NdPVwic3R5bGVDbGFzc1wiXG4gICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdwLXNsaWRlciBwLWNvbXBvbmVudCc6IHRydWUsICdwLWRpc2FibGVkJzogZGlzYWJsZWQsICdwLXNsaWRlci1ob3Jpem9udGFsJzogb3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnLCAncC1zbGlkZXItdmVydGljYWwnOiBvcmllbnRhdGlvbiA9PSAndmVydGljYWwnLCAncC1zbGlkZXItYW5pbWF0ZSc6IGFuaW1hdGUgfVwiXG4gICAgICAgICAgICAoY2xpY2spPVwib25CYXJDbGljaygkZXZlbnQpXCJcbiAgICAgICAgPlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICAqbmdJZj1cInJhbmdlICYmIG9yaWVudGF0aW9uID09ICdob3Jpem9udGFsJ1wiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJwLXNsaWRlci1yYW5nZVwiXG4gICAgICAgICAgICAgICAgW25nU3R5bGVdPVwieyBsZWZ0OiBvZmZzZXQgIT09IG51bGwgJiYgb2Zmc2V0ICE9PSB1bmRlZmluZWQgPyBvZmZzZXQgKyAnJScgOiBoYW5kbGVWYWx1ZXNbMF0gKyAnJScsIHdpZHRoOiBkaWZmID8gZGlmZiArICclJyA6IGhhbmRsZVZhbHVlc1sxXSAtIGhhbmRsZVZhbHVlc1swXSArICclJyB9XCJcbiAgICAgICAgICAgID48L3NwYW4+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICpuZ0lmPVwicmFuZ2UgJiYgb3JpZW50YXRpb24gPT0gJ3ZlcnRpY2FsJ1wiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJwLXNsaWRlci1yYW5nZVwiXG4gICAgICAgICAgICAgICAgW25nU3R5bGVdPVwieyBib3R0b206IG9mZnNldCAhPT0gbnVsbCAmJiBvZmZzZXQgIT09IHVuZGVmaW5lZCA/IG9mZnNldCArICclJyA6IGhhbmRsZVZhbHVlc1swXSArICclJywgaGVpZ2h0OiBkaWZmID8gZGlmZiArICclJyA6IGhhbmRsZVZhbHVlc1sxXSAtIGhhbmRsZVZhbHVlc1swXSArICclJyB9XCJcbiAgICAgICAgICAgID48L3NwYW4+XG4gICAgICAgICAgICA8c3BhbiAqbmdJZj1cIiFyYW5nZSAmJiBvcmllbnRhdGlvbiA9PSAndmVydGljYWwnXCIgY2xhc3M9XCJwLXNsaWRlci1yYW5nZVwiIFtuZ1N0eWxlXT1cInsgaGVpZ2h0OiBoYW5kbGVWYWx1ZSArICclJyB9XCI+PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW4gKm5nSWY9XCIhcmFuZ2UgJiYgb3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnXCIgY2xhc3M9XCJwLXNsaWRlci1yYW5nZVwiIFtuZ1N0eWxlXT1cInsgd2lkdGg6IGhhbmRsZVZhbHVlICsgJyUnIH1cIj48L3NwYW4+XG4gICAgICAgICAgICA8c3BhblxuICAgICAgICAgICAgICAgICNzbGlkZXJIYW5kbGVcbiAgICAgICAgICAgICAgICAqbmdJZj1cIiFyYW5nZVwiXG4gICAgICAgICAgICAgICAgW2F0dHIudGFiaW5kZXhdPVwiZGlzYWJsZWQgPyBudWxsIDogdGFiaW5kZXhcIlxuICAgICAgICAgICAgICAgIChrZXlkb3duKT1cIm9uSGFuZGxlS2V5ZG93bigkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cInAtc2xpZGVyLWhhbmRsZVwiXG4gICAgICAgICAgICAgICAgKG1vdXNlZG93bik9XCJvbk1vdXNlRG93bigkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAodG91Y2hzdGFydCk9XCJvblRvdWNoU3RhcnQoJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgKHRvdWNobW92ZSk9XCJvblRvdWNoTW92ZSgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAodG91Y2hlbmQpPVwib25Ub3VjaEVuZCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICBbc3R5bGUudHJhbnNpdGlvbl09XCJkcmFnZ2luZyA/ICdub25lJyA6IG51bGxcIlxuICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cInsgbGVmdDogb3JpZW50YXRpb24gPT0gJ2hvcml6b250YWwnID8gaGFuZGxlVmFsdWUgKyAnJScgOiBudWxsLCBib3R0b206IG9yaWVudGF0aW9uID09ICd2ZXJ0aWNhbCcgPyBoYW5kbGVWYWx1ZSArICclJyA6IG51bGwgfVwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS12YWx1ZW1pbl09XCJtaW5cIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtdmFsdWVub3ddPVwidmFsdWVcIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtdmFsdWVtYXhdPVwibWF4XCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLWxhYmVsbGVkYnldPVwiYXJpYUxhYmVsbGVkQnlcIlxuICAgICAgICAgICAgPjwvc3Bhbj5cbiAgICAgICAgICAgIDxzcGFuXG4gICAgICAgICAgICAgICAgI3NsaWRlckhhbmRsZVN0YXJ0XG4gICAgICAgICAgICAgICAgKm5nSWY9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgW2F0dHIudGFiaW5kZXhdPVwiZGlzYWJsZWQgPyBudWxsIDogdGFiaW5kZXhcIlxuICAgICAgICAgICAgICAgIChrZXlkb3duKT1cIm9uSGFuZGxlS2V5ZG93bigkZXZlbnQsIDApXCJcbiAgICAgICAgICAgICAgICAobW91c2Vkb3duKT1cIm9uTW91c2VEb3duKCRldmVudCwgMClcIlxuICAgICAgICAgICAgICAgICh0b3VjaHN0YXJ0KT1cIm9uVG91Y2hTdGFydCgkZXZlbnQsIDApXCJcbiAgICAgICAgICAgICAgICAodG91Y2htb3ZlKT1cIm9uVG91Y2hNb3ZlKCRldmVudCwgMClcIlxuICAgICAgICAgICAgICAgICh0b3VjaGVuZCk9XCJvblRvdWNoRW5kKCRldmVudClcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS50cmFuc2l0aW9uXT1cImRyYWdnaW5nID8gJ25vbmUnIDogbnVsbFwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJwLXNsaWRlci1oYW5kbGVcIlxuICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cInsgbGVmdDogcmFuZ2VTdGFydExlZnQsIGJvdHRvbTogcmFuZ2VTdGFydEJvdHRvbSB9XCJcbiAgICAgICAgICAgICAgICBbbmdDbGFzc109XCJ7ICdwLXNsaWRlci1oYW5kbGUtYWN0aXZlJzogaGFuZGxlSW5kZXggPT0gMCB9XCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXZhbHVlbWluXT1cIm1pblwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS12YWx1ZW5vd109XCJ2YWx1ZSA/IHZhbHVlWzBdIDogbnVsbFwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS12YWx1ZW1heF09XCJtYXhcIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtbGFiZWxsZWRieV09XCJhcmlhTGFiZWxsZWRCeVwiXG4gICAgICAgICAgICA+PC9zcGFuPlxuICAgICAgICAgICAgPHNwYW5cbiAgICAgICAgICAgICAgICAjc2xpZGVySGFuZGxlRW5kXG4gICAgICAgICAgICAgICAgKm5nSWY9XCJyYW5nZVwiXG4gICAgICAgICAgICAgICAgW2F0dHIudGFiaW5kZXhdPVwiZGlzYWJsZWQgPyBudWxsIDogdGFiaW5kZXhcIlxuICAgICAgICAgICAgICAgIChrZXlkb3duKT1cIm9uSGFuZGxlS2V5ZG93bigkZXZlbnQsIDEpXCJcbiAgICAgICAgICAgICAgICAobW91c2Vkb3duKT1cIm9uTW91c2VEb3duKCRldmVudCwgMSlcIlxuICAgICAgICAgICAgICAgICh0b3VjaHN0YXJ0KT1cIm9uVG91Y2hTdGFydCgkZXZlbnQsIDEpXCJcbiAgICAgICAgICAgICAgICAodG91Y2htb3ZlKT1cIm9uVG91Y2hNb3ZlKCRldmVudCwgMSlcIlxuICAgICAgICAgICAgICAgICh0b3VjaGVuZCk9XCJvblRvdWNoRW5kKCRldmVudClcIlxuICAgICAgICAgICAgICAgIFtzdHlsZS50cmFuc2l0aW9uXT1cImRyYWdnaW5nID8gJ25vbmUnIDogbnVsbFwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJwLXNsaWRlci1oYW5kbGVcIlxuICAgICAgICAgICAgICAgIFtuZ1N0eWxlXT1cInsgbGVmdDogcmFuZ2VFbmRMZWZ0LCBib3R0b206IHJhbmdlRW5kQm90dG9tIH1cIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3Atc2xpZGVyLWhhbmRsZS1hY3RpdmUnOiBoYW5kbGVJbmRleCA9PSAxIH1cIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtdmFsdWVtaW5dPVwibWluXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXZhbHVlbm93XT1cInZhbHVlID8gdmFsdWVbMV0gOiBudWxsXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hcmlhLXZhbHVlbWF4XT1cIm1heFwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbGxlZGJ5XT1cImFyaWFMYWJlbGxlZEJ5XCJcbiAgICAgICAgICAgID48L3NwYW4+XG4gICAgICAgIDwvZGl2PlxuICAgIGAsXG4gICAgcHJvdmlkZXJzOiBbU0xJREVSX1ZBTFVFX0FDQ0VTU09SXSxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL3NsaWRlci5jc3MnXSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50J1xuICAgIH1cbn0pXG5leHBvcnQgY2xhc3MgU2xpZGVyIGltcGxlbWVudHMgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gICAgQElucHV0KCkgYW5pbWF0ZTogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGRpc2FibGVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgbWluOiBudW1iZXIgPSAwO1xuXG4gICAgQElucHV0KCkgbWF4OiBudW1iZXIgPSAxMDA7XG5cbiAgICBASW5wdXQoKSBvcmllbnRhdGlvbjogc3RyaW5nID0gJ2hvcml6b250YWwnO1xuXG4gICAgQElucHV0KCkgc3RlcDogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgcmFuZ2U6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBzdHlsZTogYW55O1xuXG4gICAgQElucHV0KCkgc3R5bGVDbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgYXJpYUxhYmVsbGVkQnk6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHRhYmluZGV4OiBudW1iZXIgPSAwO1xuXG4gICAgQE91dHB1dCgpIG9uQ2hhbmdlOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvblNsaWRlRW5kOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBWaWV3Q2hpbGQoJ3NsaWRlckhhbmRsZScpIHNsaWRlckhhbmRsZTogRWxlbWVudFJlZjtcblxuICAgIEBWaWV3Q2hpbGQoJ3NsaWRlckhhbmRsZVN0YXJ0Jykgc2xpZGVySGFuZGxlU3RhcnQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAVmlld0NoaWxkKCdzbGlkZXJIYW5kbGVFbmQnKSBzbGlkZXJIYW5kbGVFbmQ6IEVsZW1lbnRSZWY7XG5cbiAgICBwdWJsaWMgdmFsdWU6IG51bWJlcjtcblxuICAgIHB1YmxpYyB2YWx1ZXM6IG51bWJlcltdO1xuXG4gICAgcHVibGljIGhhbmRsZVZhbHVlOiBudW1iZXI7XG5cbiAgICBwdWJsaWMgaGFuZGxlVmFsdWVzOiBudW1iZXJbXSA9IFtdO1xuXG4gICAgZGlmZjogbnVtYmVyO1xuXG4gICAgb2Zmc2V0OiBudW1iZXI7XG5cbiAgICBib3R0b206IG51bWJlcjtcblxuICAgIHB1YmxpYyBvbk1vZGVsQ2hhbmdlOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuXG4gICAgcHVibGljIG9uTW9kZWxUb3VjaGVkOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuXG4gICAgcHVibGljIGRyYWdnaW5nOiBib29sZWFuO1xuXG4gICAgcHVibGljIGRyYWdMaXN0ZW5lcjogYW55O1xuXG4gICAgcHVibGljIG1vdXNldXBMaXN0ZW5lcjogYW55O1xuXG4gICAgcHVibGljIGluaXRYOiBudW1iZXI7XG5cbiAgICBwdWJsaWMgaW5pdFk6IG51bWJlcjtcblxuICAgIHB1YmxpYyBiYXJXaWR0aDogbnVtYmVyO1xuXG4gICAgcHVibGljIGJhckhlaWdodDogbnVtYmVyO1xuXG4gICAgcHVibGljIHNsaWRlckhhbmRsZUNsaWNrOiBib29sZWFuO1xuXG4gICAgcHVibGljIGhhbmRsZUluZGV4OiBudW1iZXIgPSAwO1xuXG4gICAgcHVibGljIHN0YXJ0SGFuZGxlVmFsdWU6IGFueTtcblxuICAgIHB1YmxpYyBzdGFydHg6IG51bWJlcjtcblxuICAgIHB1YmxpYyBzdGFydHk6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsIHB1YmxpYyBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9XG5cbiAgICBvbk1vdXNlRG93bihldmVudCwgaW5kZXg/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZHJhZ2dpbmcgPSB0cnVlO1xuICAgICAgICB0aGlzLnVwZGF0ZURvbURhdGEoKTtcbiAgICAgICAgdGhpcy5zbGlkZXJIYW5kbGVDbGljayA9IHRydWU7XG4gICAgICAgIGlmICh0aGlzLnJhbmdlICYmIHRoaXMuaGFuZGxlVmFsdWVzICYmIHRoaXMuaGFuZGxlVmFsdWVzWzBdID09PSB0aGlzLm1heCkge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVJbmRleCA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUluZGV4ID0gaW5kZXg7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmJpbmREcmFnTGlzdGVuZXJzKCk7XG4gICAgICAgIGV2ZW50LnRhcmdldC5mb2N1cygpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGlmICh0aGlzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIucmVtb3ZlQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdLCAncC1zbGlkZXItYW5pbWF0ZScpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Ub3VjaFN0YXJ0KGV2ZW50LCBpbmRleD86IG51bWJlcikge1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRvdWNob2JqID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF07XG4gICAgICAgIHRoaXMuc3RhcnRIYW5kbGVWYWx1ZSA9IHRoaXMucmFuZ2UgPyB0aGlzLmhhbmRsZVZhbHVlc1tpbmRleF0gOiB0aGlzLmhhbmRsZVZhbHVlO1xuICAgICAgICB0aGlzLmRyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgaWYgKHRoaXMucmFuZ2UgJiYgdGhpcy5oYW5kbGVWYWx1ZXMgJiYgdGhpcy5oYW5kbGVWYWx1ZXNbMF0gPT09IHRoaXMubWF4KSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUluZGV4ID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlSW5kZXggPSBpbmRleDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm9yaWVudGF0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnR4ID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WCwgMTApO1xuICAgICAgICAgICAgdGhpcy5iYXJXaWR0aCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXS5vZmZzZXRXaWR0aDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3RhcnR5ID0gcGFyc2VJbnQodG91Y2hvYmouY2xpZW50WSwgMTApO1xuICAgICAgICAgICAgdGhpcy5iYXJIZWlnaHQgPSB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0ub2Zmc2V0SGVpZ2h0O1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgICAgICAgRG9tSGFuZGxlci5yZW1vdmVDbGFzcyh0aGlzLmVsLm5hdGl2ZUVsZW1lbnQuY2hpbGRyZW5bMF0sICdwLXNsaWRlci1hbmltYXRlJyk7XG4gICAgICAgIH1cblxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIG9uVG91Y2hNb3ZlKGV2ZW50LCBpbmRleD86IG51bWJlcikge1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIHRvdWNob2JqID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0sXG4gICAgICAgICAgICBoYW5kbGVWYWx1ZSA9IDA7XG5cbiAgICAgICAgaWYgKHRoaXMub3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJykge1xuICAgICAgICAgICAgaGFuZGxlVmFsdWUgPSBNYXRoLmZsb29yKCgocGFyc2VJbnQodG91Y2hvYmouY2xpZW50WCwgMTApIC0gdGhpcy5zdGFydHgpICogMTAwKSAvIHRoaXMuYmFyV2lkdGgpICsgdGhpcy5zdGFydEhhbmRsZVZhbHVlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaGFuZGxlVmFsdWUgPSBNYXRoLmZsb29yKCgodGhpcy5zdGFydHkgLSBwYXJzZUludCh0b3VjaG9iai5jbGllbnRZLCAxMCkpICogMTAwKSAvIHRoaXMuYmFySGVpZ2h0KSArIHRoaXMuc3RhcnRIYW5kbGVWYWx1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0VmFsdWVGcm9tSGFuZGxlKGV2ZW50LCBoYW5kbGVWYWx1ZSk7XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBvblRvdWNoRW5kKGV2ZW50LCBpbmRleD86IG51bWJlcikge1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuXG4gICAgICAgIGlmICh0aGlzLnJhbmdlKSB0aGlzLm9uU2xpZGVFbmQuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50LCB2YWx1ZXM6IHRoaXMudmFsdWVzIH0pO1xuICAgICAgICBlbHNlIHRoaXMub25TbGlkZUVuZC5lbWl0KHsgb3JpZ2luYWxFdmVudDogZXZlbnQsIHZhbHVlOiB0aGlzLnZhbHVlIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgIERvbUhhbmRsZXIuYWRkQ2xhc3ModGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdLCAncC1zbGlkZXItYW5pbWF0ZScpO1xuICAgICAgICB9XG5cbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBvbkJhckNsaWNrKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoIXRoaXMuc2xpZGVySGFuZGxlQ2xpY2spIHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlRG9tRGF0YSgpO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVDaGFuZ2UoZXZlbnQpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zbGlkZXJIYW5kbGVDbGljayA9IGZhbHNlO1xuICAgIH1cblxuICAgIG9uSGFuZGxlS2V5ZG93bihldmVudCwgaGFuZGxlSW5kZXg/OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZXZlbnQud2hpY2ggPT0gMzggfHwgZXZlbnQud2hpY2ggPT0gMzkpIHtcbiAgICAgICAgICAgIHRoaXMuc3BpbihldmVudCwgMSwgaGFuZGxlSW5kZXgpO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LndoaWNoID09IDM3IHx8IGV2ZW50LndoaWNoID09IDQwKSB7XG4gICAgICAgICAgICB0aGlzLnNwaW4oZXZlbnQsIC0xLCBoYW5kbGVJbmRleCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzcGluKGV2ZW50LCBkaXI6IG51bWJlciwgaGFuZGxlSW5kZXg/OiBudW1iZXIpIHtcbiAgICAgICAgbGV0IHN0ZXAgPSAodGhpcy5zdGVwIHx8IDEpICogZGlyO1xuXG4gICAgICAgIGlmICh0aGlzLnJhbmdlKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZUluZGV4ID0gaGFuZGxlSW5kZXg7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKHRoaXMudmFsdWVzW3RoaXMuaGFuZGxlSW5kZXhdICsgc3RlcCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUhhbmRsZVZhbHVlKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKHRoaXMudmFsdWUgKyBzdGVwKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlSGFuZGxlVmFsdWUoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuXG4gICAgaGFuZGxlQ2hhbmdlKGV2ZW50OiBFdmVudCkge1xuICAgICAgICBsZXQgaGFuZGxlVmFsdWUgPSB0aGlzLmNhbGN1bGF0ZUhhbmRsZVZhbHVlKGV2ZW50KTtcbiAgICAgICAgdGhpcy5zZXRWYWx1ZUZyb21IYW5kbGUoZXZlbnQsIGhhbmRsZVZhbHVlKTtcbiAgICB9XG5cbiAgICBiaW5kRHJhZ0xpc3RlbmVycygpIHtcbiAgICAgICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZG9jdW1lbnRUYXJnZXQ6IGFueSA9IHRoaXMuZWwgPyB0aGlzLmVsLm5hdGl2ZUVsZW1lbnQub3duZXJEb2N1bWVudCA6ICdkb2N1bWVudCc7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5kcmFnTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKGRvY3VtZW50VGFyZ2V0LCAnbW91c2Vtb3ZlJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRyYWdnaW5nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5nWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2hhbmdlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5tb3VzZXVwTGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm1vdXNldXBMaXN0ZW5lciA9IHRoaXMucmVuZGVyZXIubGlzdGVuKGRvY3VtZW50VGFyZ2V0LCAnbW91c2V1cCcsIChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kcmFnZ2luZykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZ1pvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5yYW5nZSkgdGhpcy5vblNsaWRlRW5kLmVtaXQoeyBvcmlnaW5hbEV2ZW50OiBldmVudCwgdmFsdWVzOiB0aGlzLnZhbHVlcyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbHNlIHRoaXMub25TbGlkZUVuZC5lbWl0KHsgb3JpZ2luYWxFdmVudDogZXZlbnQsIHZhbHVlOiB0aGlzLnZhbHVlIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuYW5pbWF0ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBEb21IYW5kbGVyLmFkZENsYXNzKHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXSwgJ3Atc2xpZGVyLWFuaW1hdGUnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICB1bmJpbmREcmFnTGlzdGVuZXJzKCkge1xuICAgICAgICBpZiAodGhpcy5kcmFnTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0xpc3RlbmVyKCk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5tb3VzZXVwTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHRoaXMubW91c2V1cExpc3RlbmVyKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRWYWx1ZUZyb21IYW5kbGUoZXZlbnQ6IEV2ZW50LCBoYW5kbGVWYWx1ZTogYW55KSB7XG4gICAgICAgIHRoaXMuc2xpZGVySGFuZGxlQ2xpY2sgPSBmYWxzZTtcbiAgICAgICAgbGV0IG5ld1ZhbHVlID0gdGhpcy5nZXRWYWx1ZUZyb21IYW5kbGUoaGFuZGxlVmFsdWUpO1xuXG4gICAgICAgIGlmICh0aGlzLnJhbmdlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zdGVwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVTdGVwQ2hhbmdlKG5ld1ZhbHVlLCB0aGlzLnZhbHVlc1t0aGlzLmhhbmRsZUluZGV4XSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWVzW3RoaXMuaGFuZGxlSW5kZXhdID0gaGFuZGxlVmFsdWU7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVWYWx1ZShuZXdWYWx1ZSwgZXZlbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMuc3RlcCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlU3RlcENoYW5nZShuZXdWYWx1ZSwgdGhpcy52YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWUgPSBoYW5kbGVWYWx1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKG5ld1ZhbHVlLCBldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIGhhbmRsZVN0ZXBDaGFuZ2UobmV3VmFsdWU6IG51bWJlciwgb2xkVmFsdWU6IG51bWJlcikge1xuICAgICAgICBsZXQgZGlmZiA9IG5ld1ZhbHVlIC0gb2xkVmFsdWU7XG4gICAgICAgIGxldCB2YWwgPSBvbGRWYWx1ZTtcblxuICAgICAgICBpZiAoZGlmZiA8IDApIHtcbiAgICAgICAgICAgIHZhbCA9IG9sZFZhbHVlICsgTWF0aC5jZWlsKG5ld1ZhbHVlIC8gdGhpcy5zdGVwIC0gb2xkVmFsdWUgLyB0aGlzLnN0ZXApICogdGhpcy5zdGVwO1xuICAgICAgICB9IGVsc2UgaWYgKGRpZmYgPiAwKSB7XG4gICAgICAgICAgICB2YWwgPSBvbGRWYWx1ZSArIE1hdGguZmxvb3IobmV3VmFsdWUgLyB0aGlzLnN0ZXAgLSBvbGRWYWx1ZSAvIHRoaXMuc3RlcCkgKiB0aGlzLnN0ZXA7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKHZhbCk7XG4gICAgICAgIHRoaXMudXBkYXRlSGFuZGxlVmFsdWUoKTtcbiAgICB9XG5cbiAgICB3cml0ZVZhbHVlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMucmFuZ2UpIHRoaXMudmFsdWVzID0gdmFsdWUgfHwgWzAsIDBdO1xuICAgICAgICBlbHNlIHRoaXMudmFsdWUgPSB2YWx1ZSB8fCAwO1xuXG4gICAgICAgIHRoaXMudXBkYXRlSGFuZGxlVmFsdWUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVEaWZmQW5kT2Zmc2V0KCk7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlID0gZm47XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQgPSBmbjtcbiAgICB9XG5cbiAgICBzZXREaXNhYmxlZFN0YXRlKHZhbDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gdmFsO1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIGdldCByYW5nZVN0YXJ0TGVmdCgpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVmVydGljYWwoKSkgcmV0dXJuIHRoaXMuaGFuZGxlVmFsdWVzWzBdID4gMTAwID8gMTAwICsgJyUnIDogdGhpcy5oYW5kbGVWYWx1ZXNbMF0gKyAnJSc7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGdldCByYW5nZVN0YXJ0Qm90dG9tKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1ZlcnRpY2FsKCkgPyB0aGlzLmhhbmRsZVZhbHVlc1swXSArICclJyA6ICdhdXRvJztcbiAgICB9XG5cbiAgICBnZXQgcmFuZ2VFbmRMZWZ0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1ZlcnRpY2FsKCkgPyBudWxsIDogdGhpcy5oYW5kbGVWYWx1ZXNbMV0gKyAnJSc7XG4gICAgfVxuXG4gICAgZ2V0IHJhbmdlRW5kQm90dG9tKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5pc1ZlcnRpY2FsKCkgPyB0aGlzLmhhbmRsZVZhbHVlc1sxXSArICclJyA6ICdhdXRvJztcbiAgICB9XG5cbiAgICBpc1ZlcnRpY2FsKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5vcmllbnRhdGlvbiA9PT0gJ3ZlcnRpY2FsJztcbiAgICB9XG5cbiAgICB1cGRhdGVEb21EYXRhKCk6IHZvaWQge1xuICAgICAgICBsZXQgcmVjdCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdGhpcy5pbml0WCA9IHJlY3QubGVmdCArIERvbUhhbmRsZXIuZ2V0V2luZG93U2Nyb2xsTGVmdCgpO1xuICAgICAgICB0aGlzLmluaXRZID0gcmVjdC50b3AgKyBEb21IYW5kbGVyLmdldFdpbmRvd1Njcm9sbFRvcCgpO1xuICAgICAgICB0aGlzLmJhcldpZHRoID0gdGhpcy5lbC5uYXRpdmVFbGVtZW50LmNoaWxkcmVuWzBdLm9mZnNldFdpZHRoO1xuICAgICAgICB0aGlzLmJhckhlaWdodCA9IHRoaXMuZWwubmF0aXZlRWxlbWVudC5jaGlsZHJlblswXS5vZmZzZXRIZWlnaHQ7XG4gICAgfVxuXG4gICAgY2FsY3VsYXRlSGFuZGxlVmFsdWUoZXZlbnQpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5vcmllbnRhdGlvbiA9PT0gJ2hvcml6b250YWwnKSByZXR1cm4gKChldmVudC5wYWdlWCAtIHRoaXMuaW5pdFgpICogMTAwKSAvIHRoaXMuYmFyV2lkdGg7XG4gICAgICAgIGVsc2UgcmV0dXJuICgodGhpcy5pbml0WSArIHRoaXMuYmFySGVpZ2h0IC0gZXZlbnQucGFnZVkpICogMTAwKSAvIHRoaXMuYmFySGVpZ2h0O1xuICAgIH1cblxuICAgIHVwZGF0ZUhhbmRsZVZhbHVlKCk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5yYW5nZSkge1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZXNbMF0gPSAoKHRoaXMudmFsdWVzWzBdIDwgdGhpcy5taW4gPyAwIDogdGhpcy52YWx1ZXNbMF0gLSB0aGlzLm1pbikgKiAxMDApIC8gKHRoaXMubWF4IC0gdGhpcy5taW4pO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZXNbMV0gPSAoKHRoaXMudmFsdWVzWzFdID4gdGhpcy5tYXggPyAxMDAgOiB0aGlzLnZhbHVlc1sxXSAtIHRoaXMubWluKSAqIDEwMCkgLyAodGhpcy5tYXggLSB0aGlzLm1pbik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZSA8IHRoaXMubWluKSB0aGlzLmhhbmRsZVZhbHVlID0gMDtcbiAgICAgICAgICAgIGVsc2UgaWYgKHRoaXMudmFsdWUgPiB0aGlzLm1heCkgdGhpcy5oYW5kbGVWYWx1ZSA9IDEwMDtcbiAgICAgICAgICAgIGVsc2UgdGhpcy5oYW5kbGVWYWx1ZSA9ICgodGhpcy52YWx1ZSAtIHRoaXMubWluKSAqIDEwMCkgLyAodGhpcy5tYXggLSB0aGlzLm1pbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5zdGVwKSB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZURpZmZBbmRPZmZzZXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHVwZGF0ZURpZmZBbmRPZmZzZXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlmZiA9IHRoaXMuZ2V0RGlmZigpO1xuICAgICAgICB0aGlzLm9mZnNldCA9IHRoaXMuZ2V0T2Zmc2V0KCk7XG4gICAgfVxuXG4gICAgZ2V0RGlmZigpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5hYnModGhpcy5oYW5kbGVWYWx1ZXNbMF0gLSB0aGlzLmhhbmRsZVZhbHVlc1sxXSk7XG4gICAgfVxuXG4gICAgZ2V0T2Zmc2V0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLm1pbih0aGlzLmhhbmRsZVZhbHVlc1swXSwgdGhpcy5oYW5kbGVWYWx1ZXNbMV0pO1xuICAgIH1cblxuICAgIHVwZGF0ZVZhbHVlKHZhbDogbnVtYmVyLCBldmVudD86IEV2ZW50KTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLnJhbmdlKSB7XG4gICAgICAgICAgICBsZXQgdmFsdWUgPSB2YWw7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmhhbmRsZUluZGV4ID09IDApIHtcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgPCB0aGlzLm1pbikge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMubWluO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlc1swXSA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA+IHRoaXMudmFsdWVzWzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA+IHRoaXMubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMubWF4O1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVWYWx1ZXNbMF0gPSAxMDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5zbGlkZXJIYW5kbGVTdGFydC5uYXRpdmVFbGVtZW50LmZvY3VzKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSA+IHRoaXMubWF4KSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy5tYXg7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlVmFsdWVzWzFdID0gMTAwO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9mZnNldCA9IHRoaXMuaGFuZGxlVmFsdWVzWzFdO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPCB0aGlzLm1pbikge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMubWluO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlc1sxXSA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh2YWx1ZSA8IHRoaXMudmFsdWVzWzBdKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMub2Zmc2V0ID0gdGhpcy5oYW5kbGVWYWx1ZXNbMV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuc2xpZGVySGFuZGxlRW5kLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHRoaXMuc3RlcCkge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSGFuZGxlVmFsdWUoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVEaWZmQW5kT2Zmc2V0KCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMudmFsdWVzW3RoaXMuaGFuZGxlSW5kZXhdID0gdGhpcy5nZXROb3JtYWxpemVkVmFsdWUodmFsdWUpO1xuICAgICAgICAgICAgbGV0IG5ld1ZhbHVlcyA9IFt0aGlzLm1pblZhbCwgdGhpcy5tYXhWYWxdO1xuICAgICAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKG5ld1ZhbHVlcyk7XG4gICAgICAgICAgICB0aGlzLm9uQ2hhbmdlLmVtaXQoeyBldmVudDogZXZlbnQsIHZhbHVlczogdGhpcy52YWx1ZXMgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodmFsIDwgdGhpcy5taW4pIHtcbiAgICAgICAgICAgICAgICB2YWwgPSB0aGlzLm1pbjtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlID0gMDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodmFsID4gdGhpcy5tYXgpIHtcbiAgICAgICAgICAgICAgICB2YWwgPSB0aGlzLm1heDtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZVZhbHVlID0gMTAwO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdGhpcy5nZXROb3JtYWxpemVkVmFsdWUodmFsKTtcblxuICAgICAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlKHRoaXMudmFsdWUpO1xuICAgICAgICAgICAgdGhpcy5vbkNoYW5nZS5lbWl0KHsgZXZlbnQ6IGV2ZW50LCB2YWx1ZTogdGhpcy52YWx1ZSB9KTtcbiAgICAgICAgICAgIHRoaXMuc2xpZGVySGFuZGxlLm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFZhbHVlRnJvbUhhbmRsZShoYW5kbGVWYWx1ZTogbnVtYmVyKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLm1heCAtIHRoaXMubWluKSAqIChoYW5kbGVWYWx1ZSAvIDEwMCkgKyB0aGlzLm1pbjtcbiAgICB9XG5cbiAgICBnZXREZWNpbWFsc0NvdW50KHZhbHVlOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBpZiAodmFsdWUgJiYgTWF0aC5mbG9vcih2YWx1ZSkgIT09IHZhbHVlKSByZXR1cm4gdmFsdWUudG9TdHJpbmcoKS5zcGxpdCgnLicpWzFdLmxlbmd0aCB8fCAwO1xuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBnZXROb3JtYWxpemVkVmFsdWUodmFsOiBudW1iZXIpOiBudW1iZXIge1xuICAgICAgICBsZXQgZGVjaW1hbHNDb3VudCA9IHRoaXMuZ2V0RGVjaW1hbHNDb3VudCh0aGlzLnN0ZXApO1xuICAgICAgICBpZiAoZGVjaW1hbHNDb3VudCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiArcGFyc2VGbG9hdCh2YWwudG9TdHJpbmcoKSkudG9GaXhlZChkZWNpbWFsc0NvdW50KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKHZhbCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy51bmJpbmREcmFnTGlzdGVuZXJzKCk7XG4gICAgfVxuXG4gICAgZ2V0IG1pblZhbCgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgubWluKHRoaXMudmFsdWVzWzFdLCB0aGlzLnZhbHVlc1swXSk7XG4gICAgfVxuICAgIGdldCBtYXhWYWwoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLm1heCh0aGlzLnZhbHVlc1sxXSwgdGhpcy52YWx1ZXNbMF0pO1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbU2xpZGVyXSxcbiAgICBkZWNsYXJhdGlvbnM6IFtTbGlkZXJdXG59KVxuZXhwb3J0IGNsYXNzIFNsaWRlck1vZHVsZSB7fVxuIl19