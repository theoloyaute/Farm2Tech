import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, NgModule, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DomHandler } from 'primeng/dom';
import { InputTextModule } from 'primeng/inputtext';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/inputtext";
import * as i3 from "primeng/button";
export const INPUTNUMBER_VALUE_ACCESSOR = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => InputNumber),
    multi: true
};
export class InputNumber {
    constructor(el, cd) {
        this.el = el;
        this.cd = cd;
        this.showButtons = false;
        this.format = true;
        this.buttonLayout = 'stacked';
        this.incrementButtonIcon = 'pi pi-angle-up';
        this.decrementButtonIcon = 'pi pi-angle-down';
        this.readonly = false;
        this.step = 1;
        this.allowEmpty = true;
        this.mode = 'decimal';
        this.useGrouping = true;
        this.showClear = false;
        this.onInput = new EventEmitter();
        this.onFocus = new EventEmitter();
        this.onBlur = new EventEmitter();
        this.onKeyDown = new EventEmitter();
        this.onClear = new EventEmitter();
        this.onModelChange = () => { };
        this.onModelTouched = () => { };
        this.groupChar = '';
        this.prefixChar = '';
        this.suffixChar = '';
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(disabled) {
        if (disabled)
            this.focused = false;
        this._disabled = disabled;
        if (this.timer)
            this.clearTimer();
    }
    ngOnChanges(simpleChange) {
        const props = ['locale', 'localeMatcher', 'mode', 'currency', 'currencyDisplay', 'useGrouping', 'minFractionDigits', 'maxFractionDigits', 'prefix', 'suffix'];
        if (props.some((p) => !!simpleChange[p])) {
            this.updateConstructParser();
        }
    }
    ngOnInit() {
        this.constructParser();
        this.initialized = true;
    }
    getOptions() {
        return {
            localeMatcher: this.localeMatcher,
            style: this.mode,
            currency: this.currency,
            currencyDisplay: this.currencyDisplay,
            useGrouping: this.useGrouping,
            minimumFractionDigits: this.minFractionDigits,
            maximumFractionDigits: this.maxFractionDigits
        };
    }
    constructParser() {
        this.numberFormat = new Intl.NumberFormat(this.locale, this.getOptions());
        const numerals = [...new Intl.NumberFormat(this.locale, { useGrouping: false }).format(9876543210)].reverse();
        const index = new Map(numerals.map((d, i) => [d, i]));
        this._numeral = new RegExp(`[${numerals.join('')}]`, 'g');
        this._group = this.getGroupingExpression();
        this._minusSign = this.getMinusSignExpression();
        this._currency = this.getCurrencyExpression();
        this._decimal = this.getDecimalExpression();
        this._suffix = this.getSuffixExpression();
        this._prefix = this.getPrefixExpression();
        this._index = (d) => index.get(d);
    }
    updateConstructParser() {
        if (this.initialized) {
            this.constructParser();
        }
    }
    escapeRegExp(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    }
    getDecimalExpression() {
        const formatter = new Intl.NumberFormat(this.locale, { ...this.getOptions(), useGrouping: false });
        return new RegExp(`[${formatter.format(1.1).replace(this._currency, '').trim().replace(this._numeral, '')}]`, 'g');
    }
    getGroupingExpression() {
        const formatter = new Intl.NumberFormat(this.locale, { useGrouping: true });
        this.groupChar = formatter.format(1000000).trim().replace(this._numeral, '').charAt(0);
        return new RegExp(`[${this.groupChar}]`, 'g');
    }
    getMinusSignExpression() {
        const formatter = new Intl.NumberFormat(this.locale, { useGrouping: false });
        return new RegExp(`[${formatter.format(-1).trim().replace(this._numeral, '')}]`, 'g');
    }
    getCurrencyExpression() {
        if (this.currency) {
            const formatter = new Intl.NumberFormat(this.locale, { style: 'currency', currency: this.currency, currencyDisplay: this.currencyDisplay, minimumFractionDigits: 0, maximumFractionDigits: 0 });
            return new RegExp(`[${formatter.format(1).replace(/\s/g, '').replace(this._numeral, '').replace(this._group, '')}]`, 'g');
        }
        return new RegExp(`[]`, 'g');
    }
    getPrefixExpression() {
        if (this.prefix) {
            this.prefixChar = this.prefix;
        }
        else {
            const formatter = new Intl.NumberFormat(this.locale, { style: this.mode, currency: this.currency, currencyDisplay: this.currencyDisplay });
            this.prefixChar = formatter.format(1).split('1')[0];
        }
        return new RegExp(`${this.escapeRegExp(this.prefixChar || '')}`, 'g');
    }
    getSuffixExpression() {
        if (this.suffix) {
            this.suffixChar = this.suffix;
        }
        else {
            const formatter = new Intl.NumberFormat(this.locale, { style: this.mode, currency: this.currency, currencyDisplay: this.currencyDisplay, minimumFractionDigits: 0, maximumFractionDigits: 0 });
            this.suffixChar = formatter.format(1).split('1')[1];
        }
        return new RegExp(`${this.escapeRegExp(this.suffixChar || '')}`, 'g');
    }
    formatValue(value) {
        if (value != null) {
            if (value === '-') {
                // Minus sign
                return value;
            }
            if (this.format) {
                let formatter = new Intl.NumberFormat(this.locale, this.getOptions());
                let formattedValue = formatter.format(value);
                if (this.prefix) {
                    formattedValue = this.prefix + formattedValue;
                }
                if (this.suffix) {
                    formattedValue = formattedValue + this.suffix;
                }
                return formattedValue;
            }
            return value.toString();
        }
        return '';
    }
    parseValue(text) {
        let filteredText = text
            .replace(this._suffix, '')
            .replace(this._prefix, '')
            .trim()
            .replace(/\s/g, '')
            .replace(this._currency, '')
            .replace(this._group, '')
            .replace(this._minusSign, '-')
            .replace(this._decimal, '.')
            .replace(this._numeral, this._index);
        if (filteredText) {
            if (filteredText === '-')
                // Minus sign
                return filteredText;
            let parsedValue = +filteredText;
            return isNaN(parsedValue) ? null : parsedValue;
        }
        return null;
    }
    repeat(event, interval, dir) {
        if (this.readonly) {
            return;
        }
        let i = interval || 500;
        this.clearTimer();
        this.timer = setTimeout(() => {
            this.repeat(event, 40, dir);
        }, i);
        this.spin(event, dir);
    }
    spin(event, dir) {
        let step = this.step * dir;
        let currentValue = this.parseValue(this.input.nativeElement.value) || 0;
        let newValue = this.validateValue(currentValue + step);
        if (this.maxlength && this.maxlength < this.formatValue(newValue).length) {
            return;
        }
        this.updateInput(newValue, null, 'spin', null);
        this.updateModel(event, newValue);
        this.handleOnInput(event, currentValue, newValue);
    }
    clear() {
        this.value = null;
        this.onModelChange(this.value);
        this.onClear.emit();
    }
    onUpButtonMouseDown(event) {
        this.input.nativeElement.focus();
        this.repeat(event, null, 1);
        event.preventDefault();
    }
    onUpButtonMouseUp() {
        this.clearTimer();
    }
    onUpButtonMouseLeave() {
        this.clearTimer();
    }
    onUpButtonKeyDown(event) {
        if (event.keyCode === 32 || event.keyCode === 13) {
            this.repeat(event, null, 1);
        }
    }
    onUpButtonKeyUp() {
        this.clearTimer();
    }
    onDownButtonMouseDown(event) {
        this.input.nativeElement.focus();
        this.repeat(event, null, -1);
        event.preventDefault();
    }
    onDownButtonMouseUp() {
        this.clearTimer();
    }
    onDownButtonMouseLeave() {
        this.clearTimer();
    }
    onDownButtonKeyUp() {
        this.clearTimer();
    }
    onDownButtonKeyDown(event) {
        if (event.keyCode === 32 || event.keyCode === 13) {
            this.repeat(event, null, -1);
        }
    }
    onUserInput(event) {
        if (this.readonly) {
            return;
        }
        if (this.isSpecialChar) {
            event.target.value = this.lastValue;
        }
        this.isSpecialChar = false;
    }
    onInputKeyDown(event) {
        if (this.readonly) {
            return;
        }
        this.lastValue = event.target.value;
        if (event.shiftKey || event.altKey) {
            this.isSpecialChar = true;
            return;
        }
        let selectionStart = event.target.selectionStart;
        let selectionEnd = event.target.selectionEnd;
        let inputValue = event.target.value;
        let newValueStr = null;
        if (event.altKey) {
            event.preventDefault();
        }
        switch (event.which) {
            //up
            case 38:
                this.spin(event, 1);
                event.preventDefault();
                break;
            //down
            case 40:
                this.spin(event, -1);
                event.preventDefault();
                break;
            //left
            case 37:
                if (!this.isNumeralChar(inputValue.charAt(selectionStart - 1))) {
                    event.preventDefault();
                }
                break;
            //right
            case 39:
                if (!this.isNumeralChar(inputValue.charAt(selectionStart))) {
                    event.preventDefault();
                }
                break;
            //enter
            case 13:
                newValueStr = this.validateValue(this.parseValue(this.input.nativeElement.value));
                this.input.nativeElement.value = this.formatValue(newValueStr);
                this.input.nativeElement.setAttribute('aria-valuenow', newValueStr);
                this.updateModel(event, newValueStr);
                break;
            //backspace
            case 8: {
                event.preventDefault();
                if (selectionStart === selectionEnd) {
                    const deleteChar = inputValue.charAt(selectionStart - 1);
                    const { decimalCharIndex, decimalCharIndexWithoutPrefix } = this.getDecimalCharIndexes(inputValue);
                    if (this.isNumeralChar(deleteChar)) {
                        const decimalLength = this.getDecimalLength(inputValue);
                        if (this._group.test(deleteChar)) {
                            this._group.lastIndex = 0;
                            newValueStr = inputValue.slice(0, selectionStart - 2) + inputValue.slice(selectionStart - 1);
                        }
                        else if (this._decimal.test(deleteChar)) {
                            this._decimal.lastIndex = 0;
                            if (decimalLength) {
                                this.input.nativeElement.setSelectionRange(selectionStart - 1, selectionStart - 1);
                            }
                            else {
                                newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
                            }
                        }
                        else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                            const insertedText = this.isDecimalMode() && (this.minFractionDigits || 0) < decimalLength ? '' : '0';
                            newValueStr = inputValue.slice(0, selectionStart - 1) + insertedText + inputValue.slice(selectionStart);
                        }
                        else if (decimalCharIndexWithoutPrefix === 1) {
                            newValueStr = inputValue.slice(0, selectionStart - 1) + '0' + inputValue.slice(selectionStart);
                            newValueStr = this.parseValue(newValueStr) > 0 ? newValueStr : '';
                        }
                        else {
                            newValueStr = inputValue.slice(0, selectionStart - 1) + inputValue.slice(selectionStart);
                        }
                    }
                    this.updateValue(event, newValueStr, null, 'delete-single');
                }
                else {
                    newValueStr = this.deleteRange(inputValue, selectionStart, selectionEnd);
                    this.updateValue(event, newValueStr, null, 'delete-range');
                }
                break;
            }
            // del
            case 46:
                event.preventDefault();
                if (selectionStart === selectionEnd) {
                    const deleteChar = inputValue.charAt(selectionStart);
                    const { decimalCharIndex, decimalCharIndexWithoutPrefix } = this.getDecimalCharIndexes(inputValue);
                    if (this.isNumeralChar(deleteChar)) {
                        const decimalLength = this.getDecimalLength(inputValue);
                        if (this._group.test(deleteChar)) {
                            this._group.lastIndex = 0;
                            newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 2);
                        }
                        else if (this._decimal.test(deleteChar)) {
                            this._decimal.lastIndex = 0;
                            if (decimalLength) {
                                this.input.nativeElement.setSelectionRange(selectionStart + 1, selectionStart + 1);
                            }
                            else {
                                newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
                            }
                        }
                        else if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                            const insertedText = this.isDecimalMode() && (this.minFractionDigits || 0) < decimalLength ? '' : '0';
                            newValueStr = inputValue.slice(0, selectionStart) + insertedText + inputValue.slice(selectionStart + 1);
                        }
                        else if (decimalCharIndexWithoutPrefix === 1) {
                            newValueStr = inputValue.slice(0, selectionStart) + '0' + inputValue.slice(selectionStart + 1);
                            newValueStr = this.parseValue(newValueStr) > 0 ? newValueStr : '';
                        }
                        else {
                            newValueStr = inputValue.slice(0, selectionStart) + inputValue.slice(selectionStart + 1);
                        }
                    }
                    this.updateValue(event, newValueStr, null, 'delete-back-single');
                }
                else {
                    newValueStr = this.deleteRange(inputValue, selectionStart, selectionEnd);
                    this.updateValue(event, newValueStr, null, 'delete-range');
                }
                break;
            default:
                break;
        }
        this.onKeyDown.emit(event);
    }
    onInputKeyPress(event) {
        if (this.readonly) {
            return;
        }
        let code = event.which || event.keyCode;
        let char = String.fromCharCode(code);
        const isDecimalSign = this.isDecimalSign(char);
        const isMinusSign = this.isMinusSign(char);
        if (code != 13) {
            event.preventDefault();
        }
        if ((48 <= code && code <= 57) || isMinusSign || isDecimalSign) {
            this.insert(event, char, { isDecimalSign, isMinusSign });
        }
    }
    onPaste(event) {
        if (!this.disabled && !this.readonly) {
            event.preventDefault();
            let data = (event.clipboardData || window['clipboardData']).getData('Text');
            if (data) {
                let filteredData = this.parseValue(data);
                if (filteredData != null) {
                    this.insert(event, filteredData.toString());
                }
            }
        }
    }
    allowMinusSign() {
        return this.min == null || this.min < 0;
    }
    isMinusSign(char) {
        if (this._minusSign.test(char) || char === '-') {
            this._minusSign.lastIndex = 0;
            return true;
        }
        return false;
    }
    isDecimalSign(char) {
        if (this._decimal.test(char)) {
            this._decimal.lastIndex = 0;
            return true;
        }
        return false;
    }
    isDecimalMode() {
        return this.mode === 'decimal';
    }
    getDecimalCharIndexes(val) {
        let decimalCharIndex = val.search(this._decimal);
        this._decimal.lastIndex = 0;
        const filteredVal = val.replace(this._prefix, '').trim().replace(/\s/g, '').replace(this._currency, '');
        const decimalCharIndexWithoutPrefix = filteredVal.search(this._decimal);
        this._decimal.lastIndex = 0;
        return { decimalCharIndex, decimalCharIndexWithoutPrefix };
    }
    getCharIndexes(val) {
        const decimalCharIndex = val.search(this._decimal);
        this._decimal.lastIndex = 0;
        const minusCharIndex = val.search(this._minusSign);
        this._minusSign.lastIndex = 0;
        const suffixCharIndex = val.search(this._suffix);
        this._suffix.lastIndex = 0;
        const currencyCharIndex = val.search(this._currency);
        this._currency.lastIndex = 0;
        return { decimalCharIndex, minusCharIndex, suffixCharIndex, currencyCharIndex };
    }
    insert(event, text, sign = { isDecimalSign: false, isMinusSign: false }) {
        const minusCharIndexOnText = text.search(this._minusSign);
        this._minusSign.lastIndex = 0;
        if (!this.allowMinusSign() && minusCharIndexOnText !== -1) {
            return;
        }
        let selectionStart = this.input.nativeElement.selectionStart;
        let selectionEnd = this.input.nativeElement.selectionEnd;
        let inputValue = this.input.nativeElement.value.trim();
        const { decimalCharIndex, minusCharIndex, suffixCharIndex, currencyCharIndex } = this.getCharIndexes(inputValue);
        let newValueStr;
        if (sign.isMinusSign) {
            if (selectionStart === 0) {
                newValueStr = inputValue;
                if (minusCharIndex === -1 || selectionEnd !== 0) {
                    newValueStr = this.insertText(inputValue, text, 0, selectionEnd);
                }
                this.updateValue(event, newValueStr, text, 'insert');
            }
        }
        else if (sign.isDecimalSign) {
            if (decimalCharIndex > 0 && selectionStart === decimalCharIndex) {
                this.updateValue(event, inputValue, text, 'insert');
            }
            else if (decimalCharIndex > selectionStart && decimalCharIndex < selectionEnd) {
                newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
                this.updateValue(event, newValueStr, text, 'insert');
            }
            else if (decimalCharIndex === -1 && this.maxFractionDigits) {
                newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
                this.updateValue(event, newValueStr, text, 'insert');
            }
        }
        else {
            const maxFractionDigits = this.numberFormat.resolvedOptions().maximumFractionDigits;
            const operation = selectionStart !== selectionEnd ? 'range-insert' : 'insert';
            if (decimalCharIndex > 0 && selectionStart > decimalCharIndex) {
                if (selectionStart + text.length - (decimalCharIndex + 1) <= maxFractionDigits) {
                    const charIndex = currencyCharIndex >= selectionStart ? currencyCharIndex - 1 : suffixCharIndex >= selectionStart ? suffixCharIndex : inputValue.length;
                    newValueStr = inputValue.slice(0, selectionStart) + text + inputValue.slice(selectionStart + text.length, charIndex) + inputValue.slice(charIndex);
                    this.updateValue(event, newValueStr, text, operation);
                }
            }
            else {
                newValueStr = this.insertText(inputValue, text, selectionStart, selectionEnd);
                this.updateValue(event, newValueStr, text, operation);
            }
        }
    }
    insertText(value, text, start, end) {
        let textSplit = text === '.' ? text : text.split('.');
        if (textSplit.length === 2) {
            const decimalCharIndex = value.slice(start, end).search(this._decimal);
            this._decimal.lastIndex = 0;
            return decimalCharIndex > 0 ? value.slice(0, start) + this.formatValue(text) + value.slice(end) : value || this.formatValue(text);
        }
        else if (end - start === value.length) {
            return this.formatValue(text);
        }
        else if (start === 0) {
            return text + value.slice(end);
        }
        else if (end === value.length) {
            return value.slice(0, start) + text;
        }
        else {
            return value.slice(0, start) + text + value.slice(end);
        }
    }
    deleteRange(value, start, end) {
        let newValueStr;
        if (end - start === value.length)
            newValueStr = '';
        else if (start === 0)
            newValueStr = value.slice(end);
        else if (end === value.length)
            newValueStr = value.slice(0, start);
        else
            newValueStr = value.slice(0, start) + value.slice(end);
        return newValueStr;
    }
    initCursor() {
        let selectionStart = this.input.nativeElement.selectionStart;
        let inputValue = this.input.nativeElement.value;
        let valueLength = inputValue.length;
        let index = null;
        // remove prefix
        let prefixLength = (this.prefixChar || '').length;
        inputValue = inputValue.replace(this._prefix, '');
        selectionStart = selectionStart - prefixLength;
        let char = inputValue.charAt(selectionStart);
        if (this.isNumeralChar(char)) {
            return selectionStart + prefixLength;
        }
        //left
        let i = selectionStart - 1;
        while (i >= 0) {
            char = inputValue.charAt(i);
            if (this.isNumeralChar(char)) {
                index = i + prefixLength;
                break;
            }
            else {
                i--;
            }
        }
        if (index !== null) {
            this.input.nativeElement.setSelectionRange(index + 1, index + 1);
        }
        else {
            i = selectionStart;
            while (i < valueLength) {
                char = inputValue.charAt(i);
                if (this.isNumeralChar(char)) {
                    index = i + prefixLength;
                    break;
                }
                else {
                    i++;
                }
            }
            if (index !== null) {
                this.input.nativeElement.setSelectionRange(index, index);
            }
        }
        return index || 0;
    }
    onInputClick() {
        const currentValue = this.input.nativeElement.value;
        if (!this.readonly && currentValue !== DomHandler.getSelection()) {
            this.initCursor();
        }
    }
    isNumeralChar(char) {
        if (char.length === 1 && (this._numeral.test(char) || this._decimal.test(char) || this._group.test(char) || this._minusSign.test(char))) {
            this.resetRegex();
            return true;
        }
        return false;
    }
    resetRegex() {
        this._numeral.lastIndex = 0;
        this._decimal.lastIndex = 0;
        this._group.lastIndex = 0;
        this._minusSign.lastIndex = 0;
    }
    updateValue(event, valueStr, insertedValueStr, operation) {
        let currentValue = this.input.nativeElement.value;
        let newValue = null;
        if (valueStr != null) {
            newValue = this.parseValue(valueStr);
            newValue = !newValue && !this.allowEmpty ? 0 : newValue;
            this.updateInput(newValue, insertedValueStr, operation, valueStr);
            this.handleOnInput(event, currentValue, newValue);
        }
    }
    handleOnInput(event, currentValue, newValue) {
        if (this.isValueChanged(currentValue, newValue)) {
            this.onInput.emit({ originalEvent: event, value: newValue, formattedValue: currentValue });
        }
    }
    isValueChanged(currentValue, newValue) {
        if (newValue === null && currentValue !== null) {
            return true;
        }
        if (newValue != null) {
            let parsedCurrentValue = typeof currentValue === 'string' ? this.parseValue(currentValue) : currentValue;
            return newValue !== parsedCurrentValue;
        }
        return false;
    }
    validateValue(value) {
        if (value === '-' || value == null) {
            return null;
        }
        if (this.min != null && value < this.min) {
            return this.min;
        }
        if (this.max != null && value > this.max) {
            return this.max;
        }
        return value;
    }
    updateInput(value, insertedValueStr, operation, valueStr) {
        insertedValueStr = insertedValueStr || '';
        let inputValue = this.input.nativeElement.value;
        let newValue = this.formatValue(value);
        let currentLength = inputValue.length;
        if (newValue !== valueStr) {
            newValue = this.concatValues(newValue, valueStr);
        }
        if (currentLength === 0) {
            this.input.nativeElement.value = newValue;
            this.input.nativeElement.setSelectionRange(0, 0);
            const index = this.initCursor();
            const selectionEnd = index + insertedValueStr.length;
            this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
        }
        else {
            let selectionStart = this.input.nativeElement.selectionStart;
            let selectionEnd = this.input.nativeElement.selectionEnd;
            if (this.maxlength && this.maxlength < newValue.length) {
                return;
            }
            this.input.nativeElement.value = newValue;
            let newLength = newValue.length;
            if (operation === 'range-insert') {
                const startValue = this.parseValue((inputValue || '').slice(0, selectionStart));
                const startValueStr = startValue !== null ? startValue.toString() : '';
                const startExpr = startValueStr.split('').join(`(${this.groupChar})?`);
                const sRegex = new RegExp(startExpr, 'g');
                sRegex.test(newValue);
                const tExpr = insertedValueStr.split('').join(`(${this.groupChar})?`);
                const tRegex = new RegExp(tExpr, 'g');
                tRegex.test(newValue.slice(sRegex.lastIndex));
                selectionEnd = sRegex.lastIndex + tRegex.lastIndex;
                this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
            }
            else if (newLength === currentLength) {
                if (operation === 'insert' || operation === 'delete-back-single')
                    this.input.nativeElement.setSelectionRange(selectionEnd + 1, selectionEnd + 1);
                else if (operation === 'delete-single')
                    this.input.nativeElement.setSelectionRange(selectionEnd - 1, selectionEnd - 1);
                else if (operation === 'delete-range' || operation === 'spin')
                    this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
            }
            else if (operation === 'delete-back-single') {
                let prevChar = inputValue.charAt(selectionEnd - 1);
                let nextChar = inputValue.charAt(selectionEnd);
                let diff = currentLength - newLength;
                let isGroupChar = this._group.test(nextChar);
                if (isGroupChar && diff === 1) {
                    selectionEnd += 1;
                }
                else if (!isGroupChar && this.isNumeralChar(prevChar)) {
                    selectionEnd += -1 * diff + 1;
                }
                this._group.lastIndex = 0;
                this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
            }
            else if (inputValue === '-' && operation === 'insert') {
                this.input.nativeElement.setSelectionRange(0, 0);
                const index = this.initCursor();
                const selectionEnd = index + insertedValueStr.length + 1;
                this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
            }
            else {
                selectionEnd = selectionEnd + (newLength - currentLength);
                this.input.nativeElement.setSelectionRange(selectionEnd, selectionEnd);
            }
        }
        this.input.nativeElement.setAttribute('aria-valuenow', value);
    }
    concatValues(val1, val2) {
        if (val1 && val2) {
            let decimalCharIndex = val2.search(this._decimal);
            this._decimal.lastIndex = 0;
            if (this.suffixChar) {
                return val1.replace(this.suffixChar, '').split(this._decimal)[0] + val2.replace(this.suffixChar, '').slice(decimalCharIndex) + this.suffixChar;
            }
            else {
                return decimalCharIndex !== -1 ? val1.split(this._decimal)[0] + val2.slice(decimalCharIndex) : val1;
            }
        }
        return val1;
    }
    getDecimalLength(value) {
        if (value) {
            const valueSplit = value.split(this._decimal);
            if (valueSplit.length === 2) {
                return valueSplit[1].replace(this._suffix, '').trim().replace(/\s/g, '').replace(this._currency, '').length;
            }
        }
        return 0;
    }
    onInputFocus(event) {
        this.focused = true;
        this.onFocus.emit(event);
    }
    onInputBlur(event) {
        this.focused = false;
        let newValue = this.validateValue(this.parseValue(this.input.nativeElement.value));
        this.input.nativeElement.value = this.formatValue(newValue);
        this.input.nativeElement.setAttribute('aria-valuenow', newValue);
        this.updateModel(event, newValue);
        this.onBlur.emit(event);
    }
    formattedValue() {
        const val = !this.value && !this.allowEmpty ? 0 : this.value;
        return this.formatValue(val);
    }
    updateModel(event, value) {
        if (this.value !== value) {
            this.value = value;
            this.onModelChange(value);
        }
        this.onModelTouched();
    }
    writeValue(value) {
        this.value = value;
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
    get filled() {
        return this.value != null && this.value.toString().length > 0;
    }
    clearTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }
    getFormatter() {
        return this.numberFormat;
    }
}
InputNumber.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: InputNumber, deps: [{ token: i0.ElementRef }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
InputNumber.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.0", type: InputNumber, selector: "p-inputNumber", inputs: { showButtons: "showButtons", format: "format", buttonLayout: "buttonLayout", inputId: "inputId", styleClass: "styleClass", style: "style", placeholder: "placeholder", size: "size", maxlength: "maxlength", tabindex: "tabindex", title: "title", ariaLabel: "ariaLabel", ariaRequired: "ariaRequired", name: "name", required: "required", autocomplete: "autocomplete", min: "min", max: "max", incrementButtonClass: "incrementButtonClass", decrementButtonClass: "decrementButtonClass", incrementButtonIcon: "incrementButtonIcon", decrementButtonIcon: "decrementButtonIcon", readonly: "readonly", step: "step", allowEmpty: "allowEmpty", locale: "locale", localeMatcher: "localeMatcher", mode: "mode", currency: "currency", currencyDisplay: "currencyDisplay", useGrouping: "useGrouping", minFractionDigits: "minFractionDigits", maxFractionDigits: "maxFractionDigits", prefix: "prefix", suffix: "suffix", inputStyle: "inputStyle", inputStyleClass: "inputStyleClass", showClear: "showClear", disabled: "disabled" }, outputs: { onInput: "onInput", onFocus: "onFocus", onBlur: "onBlur", onKeyDown: "onKeyDown", onClear: "onClear" }, host: { properties: { "class.p-inputwrapper-filled": "filled", "class.p-inputwrapper-focus": "focused", "class.p-inputnumber-clearable": "showClear && buttonLayout != \"vertical\"" }, classAttribute: "p-element p-inputwrapper" }, providers: [INPUTNUMBER_VALUE_ACCESSOR], viewQueries: [{ propertyName: "input", first: true, predicate: ["input"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
        <span
            [ngClass]="{
                'p-inputnumber p-component': true,
                'p-inputnumber-buttons-stacked': this.showButtons && this.buttonLayout === 'stacked',
                'p-inputnumber-buttons-horizontal': this.showButtons && this.buttonLayout === 'horizontal',
                'p-inputnumber-buttons-vertical': this.showButtons && this.buttonLayout === 'vertical'
            }"
            [ngStyle]="style"
            [class]="styleClass"
        >
            <input
                #input
                [ngClass]="'p-inputnumber-input'"
                [ngStyle]="inputStyle"
                [class]="inputStyleClass"
                pInputText
                [value]="formattedValue()"
                [attr.placeholder]="placeholder"
                [attr.title]="title"
                [attr.id]="inputId"
                [attr.size]="size"
                [attr.name]="name"
                [attr.autocomplete]="autocomplete"
                [attr.maxlength]="maxlength"
                [attr.tabindex]="tabindex"
                [attr.aria-label]="ariaLabel"
                [attr.aria-required]="ariaRequired"
                [disabled]="disabled"
                [attr.required]="required"
                [attr.min]="min"
                [attr.max]="max"
                [readonly]="readonly"
                inputmode="decimal"
                (input)="onUserInput($event)"
                (keydown)="onInputKeyDown($event)"
                (keypress)="onInputKeyPress($event)"
                (paste)="onPaste($event)"
                (click)="onInputClick()"
                (focus)="onInputFocus($event)"
                (blur)="onInputBlur($event)"
            />
            <i *ngIf="buttonLayout != 'vertical' && showClear && value" class="p-inputnumber-clear-icon pi pi-times" (click)="clear()"></i>
            <span class="p-inputnumber-button-group" *ngIf="showButtons && buttonLayout === 'stacked'">
                <button
                    type="button"
                    pButton
                    [ngClass]="{ 'p-inputnumber-button p-inputnumber-button-up': true }"
                    [class]="incrementButtonClass"
                    [icon]="incrementButtonIcon"
                    [disabled]="disabled"
                    (mousedown)="this.onUpButtonMouseDown($event)"
                    (mouseup)="onUpButtonMouseUp()"
                    (mouseleave)="onUpButtonMouseLeave()"
                    (keydown)="onUpButtonKeyDown($event)"
                    (keyup)="onUpButtonKeyUp()"
                    tabindex="-1"
                ></button>
                <button
                    type="button"
                    pButton
                    [ngClass]="{ 'p-inputnumber-button p-inputnumber-button-down': true }"
                    [class]="decrementButtonClass"
                    [icon]="decrementButtonIcon"
                    [disabled]="disabled"
                    (mousedown)="this.onDownButtonMouseDown($event)"
                    (mouseup)="onDownButtonMouseUp()"
                    (mouseleave)="onDownButtonMouseLeave()"
                    (keydown)="onDownButtonKeyDown($event)"
                    (keyup)="onDownButtonKeyUp()"
                    tabindex="-1"
                ></button>
            </span>
            <button
                type="button"
                pButton
                [ngClass]="{ 'p-inputnumber-button p-inputnumber-button-up': true }"
                [class]="incrementButtonClass"
                [icon]="incrementButtonIcon"
                *ngIf="showButtons && buttonLayout !== 'stacked'"
                [disabled]="disabled"
                (mousedown)="this.onUpButtonMouseDown($event)"
                (mouseup)="onUpButtonMouseUp()"
                (mouseleave)="onUpButtonMouseLeave()"
                (keydown)="onUpButtonKeyDown($event)"
                (keyup)="onUpButtonKeyUp()"
                tabindex="-1"
            ></button>
            <button
                type="button"
                pButton
                [ngClass]="{ 'p-inputnumber-button p-inputnumber-button-down': true }"
                [class]="decrementButtonClass"
                [icon]="decrementButtonIcon"
                *ngIf="showButtons && buttonLayout !== 'stacked'"
                [disabled]="disabled"
                (mousedown)="this.onDownButtonMouseDown($event)"
                (mouseup)="onDownButtonMouseUp()"
                (mouseleave)="onDownButtonMouseLeave()"
                (keydown)="onDownButtonKeyDown($event)"
                (keyup)="onDownButtonKeyUp()"
                tabindex="-1"
            ></button>
        </span>
    `, isInline: true, styles: ["p-inputnumber,.p-inputnumber{display:inline-flex}.p-inputnumber-button{display:flex;align-items:center;justify-content:center;flex:0 0 auto}.p-inputnumber-buttons-stacked .p-button.p-inputnumber-button .p-button-label,.p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button .p-button-label{display:none}.p-inputnumber-buttons-stacked .p-button.p-inputnumber-button-up{border-top-left-radius:0;border-bottom-left-radius:0;border-bottom-right-radius:0;padding:0}.p-inputnumber-buttons-stacked .p-inputnumber-input{border-top-right-radius:0;border-bottom-right-radius:0}.p-inputnumber-buttons-stacked .p-button.p-inputnumber-button-down{border-top-left-radius:0;border-top-right-radius:0;border-bottom-left-radius:0;padding:0}.p-inputnumber-buttons-stacked .p-inputnumber-button-group{display:flex;flex-direction:column}.p-inputnumber-buttons-stacked .p-inputnumber-button-group .p-button.p-inputnumber-button{flex:1 1 auto}.p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button-up{order:3;border-top-left-radius:0;border-bottom-left-radius:0}.p-inputnumber-buttons-horizontal .p-inputnumber-input{order:2;border-radius:0}.p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button-down{order:1;border-top-right-radius:0;border-bottom-right-radius:0}.p-inputnumber-buttons-vertical{flex-direction:column}.p-inputnumber-buttons-vertical .p-button.p-inputnumber-button-up{order:1;border-bottom-left-radius:0;border-bottom-right-radius:0;width:100%}.p-inputnumber-buttons-vertical .p-inputnumber-input{order:2;border-radius:0;text-align:center}.p-inputnumber-buttons-vertical .p-button.p-inputnumber-button-down{order:3;border-top-left-radius:0;border-top-right-radius:0;width:100%}.p-inputnumber-input{flex:1 1 auto}.p-fluid p-inputnumber,.p-fluid .p-inputnumber{width:100%}.p-fluid .p-inputnumber .p-inputnumber-input{width:1%}.p-fluid .p-inputnumber-buttons-vertical .p-inputnumber-input{width:100%}.p-inputnumber-clear-icon{position:absolute;top:50%;margin-top:-.5rem;cursor:pointer}.p-inputnumber-clearable{position:relative}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }, { kind: "directive", type: i2.InputText, selector: "[pInputText]" }, { kind: "directive", type: i3.ButtonDirective, selector: "[pButton]", inputs: ["iconPos", "loadingIcon", "label", "icon", "loading"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: InputNumber, decorators: [{
            type: Component,
            args: [{ selector: 'p-inputNumber', template: `
        <span
            [ngClass]="{
                'p-inputnumber p-component': true,
                'p-inputnumber-buttons-stacked': this.showButtons && this.buttonLayout === 'stacked',
                'p-inputnumber-buttons-horizontal': this.showButtons && this.buttonLayout === 'horizontal',
                'p-inputnumber-buttons-vertical': this.showButtons && this.buttonLayout === 'vertical'
            }"
            [ngStyle]="style"
            [class]="styleClass"
        >
            <input
                #input
                [ngClass]="'p-inputnumber-input'"
                [ngStyle]="inputStyle"
                [class]="inputStyleClass"
                pInputText
                [value]="formattedValue()"
                [attr.placeholder]="placeholder"
                [attr.title]="title"
                [attr.id]="inputId"
                [attr.size]="size"
                [attr.name]="name"
                [attr.autocomplete]="autocomplete"
                [attr.maxlength]="maxlength"
                [attr.tabindex]="tabindex"
                [attr.aria-label]="ariaLabel"
                [attr.aria-required]="ariaRequired"
                [disabled]="disabled"
                [attr.required]="required"
                [attr.min]="min"
                [attr.max]="max"
                [readonly]="readonly"
                inputmode="decimal"
                (input)="onUserInput($event)"
                (keydown)="onInputKeyDown($event)"
                (keypress)="onInputKeyPress($event)"
                (paste)="onPaste($event)"
                (click)="onInputClick()"
                (focus)="onInputFocus($event)"
                (blur)="onInputBlur($event)"
            />
            <i *ngIf="buttonLayout != 'vertical' && showClear && value" class="p-inputnumber-clear-icon pi pi-times" (click)="clear()"></i>
            <span class="p-inputnumber-button-group" *ngIf="showButtons && buttonLayout === 'stacked'">
                <button
                    type="button"
                    pButton
                    [ngClass]="{ 'p-inputnumber-button p-inputnumber-button-up': true }"
                    [class]="incrementButtonClass"
                    [icon]="incrementButtonIcon"
                    [disabled]="disabled"
                    (mousedown)="this.onUpButtonMouseDown($event)"
                    (mouseup)="onUpButtonMouseUp()"
                    (mouseleave)="onUpButtonMouseLeave()"
                    (keydown)="onUpButtonKeyDown($event)"
                    (keyup)="onUpButtonKeyUp()"
                    tabindex="-1"
                ></button>
                <button
                    type="button"
                    pButton
                    [ngClass]="{ 'p-inputnumber-button p-inputnumber-button-down': true }"
                    [class]="decrementButtonClass"
                    [icon]="decrementButtonIcon"
                    [disabled]="disabled"
                    (mousedown)="this.onDownButtonMouseDown($event)"
                    (mouseup)="onDownButtonMouseUp()"
                    (mouseleave)="onDownButtonMouseLeave()"
                    (keydown)="onDownButtonKeyDown($event)"
                    (keyup)="onDownButtonKeyUp()"
                    tabindex="-1"
                ></button>
            </span>
            <button
                type="button"
                pButton
                [ngClass]="{ 'p-inputnumber-button p-inputnumber-button-up': true }"
                [class]="incrementButtonClass"
                [icon]="incrementButtonIcon"
                *ngIf="showButtons && buttonLayout !== 'stacked'"
                [disabled]="disabled"
                (mousedown)="this.onUpButtonMouseDown($event)"
                (mouseup)="onUpButtonMouseUp()"
                (mouseleave)="onUpButtonMouseLeave()"
                (keydown)="onUpButtonKeyDown($event)"
                (keyup)="onUpButtonKeyUp()"
                tabindex="-1"
            ></button>
            <button
                type="button"
                pButton
                [ngClass]="{ 'p-inputnumber-button p-inputnumber-button-down': true }"
                [class]="decrementButtonClass"
                [icon]="decrementButtonIcon"
                *ngIf="showButtons && buttonLayout !== 'stacked'"
                [disabled]="disabled"
                (mousedown)="this.onDownButtonMouseDown($event)"
                (mouseup)="onDownButtonMouseUp()"
                (mouseleave)="onDownButtonMouseLeave()"
                (keydown)="onDownButtonKeyDown($event)"
                (keyup)="onDownButtonKeyUp()"
                tabindex="-1"
            ></button>
        </span>
    `, changeDetection: ChangeDetectionStrategy.OnPush, providers: [INPUTNUMBER_VALUE_ACCESSOR], encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-element p-inputwrapper',
                        '[class.p-inputwrapper-filled]': 'filled',
                        '[class.p-inputwrapper-focus]': 'focused',
                        '[class.p-inputnumber-clearable]': 'showClear && buttonLayout != "vertical"'
                    }, styles: ["p-inputnumber,.p-inputnumber{display:inline-flex}.p-inputnumber-button{display:flex;align-items:center;justify-content:center;flex:0 0 auto}.p-inputnumber-buttons-stacked .p-button.p-inputnumber-button .p-button-label,.p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button .p-button-label{display:none}.p-inputnumber-buttons-stacked .p-button.p-inputnumber-button-up{border-top-left-radius:0;border-bottom-left-radius:0;border-bottom-right-radius:0;padding:0}.p-inputnumber-buttons-stacked .p-inputnumber-input{border-top-right-radius:0;border-bottom-right-radius:0}.p-inputnumber-buttons-stacked .p-button.p-inputnumber-button-down{border-top-left-radius:0;border-top-right-radius:0;border-bottom-left-radius:0;padding:0}.p-inputnumber-buttons-stacked .p-inputnumber-button-group{display:flex;flex-direction:column}.p-inputnumber-buttons-stacked .p-inputnumber-button-group .p-button.p-inputnumber-button{flex:1 1 auto}.p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button-up{order:3;border-top-left-radius:0;border-bottom-left-radius:0}.p-inputnumber-buttons-horizontal .p-inputnumber-input{order:2;border-radius:0}.p-inputnumber-buttons-horizontal .p-button.p-inputnumber-button-down{order:1;border-top-right-radius:0;border-bottom-right-radius:0}.p-inputnumber-buttons-vertical{flex-direction:column}.p-inputnumber-buttons-vertical .p-button.p-inputnumber-button-up{order:1;border-bottom-left-radius:0;border-bottom-right-radius:0;width:100%}.p-inputnumber-buttons-vertical .p-inputnumber-input{order:2;border-radius:0;text-align:center}.p-inputnumber-buttons-vertical .p-button.p-inputnumber-button-down{order:3;border-top-left-radius:0;border-top-right-radius:0;width:100%}.p-inputnumber-input{flex:1 1 auto}.p-fluid p-inputnumber,.p-fluid .p-inputnumber{width:100%}.p-fluid .p-inputnumber .p-inputnumber-input{width:1%}.p-fluid .p-inputnumber-buttons-vertical .p-inputnumber-input{width:100%}.p-inputnumber-clear-icon{position:absolute;top:50%;margin-top:-.5rem;cursor:pointer}.p-inputnumber-clearable{position:relative}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { showButtons: [{
                type: Input
            }], format: [{
                type: Input
            }], buttonLayout: [{
                type: Input
            }], inputId: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], style: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], size: [{
                type: Input
            }], maxlength: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], title: [{
                type: Input
            }], ariaLabel: [{
                type: Input
            }], ariaRequired: [{
                type: Input
            }], name: [{
                type: Input
            }], required: [{
                type: Input
            }], autocomplete: [{
                type: Input
            }], min: [{
                type: Input
            }], max: [{
                type: Input
            }], incrementButtonClass: [{
                type: Input
            }], decrementButtonClass: [{
                type: Input
            }], incrementButtonIcon: [{
                type: Input
            }], decrementButtonIcon: [{
                type: Input
            }], readonly: [{
                type: Input
            }], step: [{
                type: Input
            }], allowEmpty: [{
                type: Input
            }], locale: [{
                type: Input
            }], localeMatcher: [{
                type: Input
            }], mode: [{
                type: Input
            }], currency: [{
                type: Input
            }], currencyDisplay: [{
                type: Input
            }], useGrouping: [{
                type: Input
            }], minFractionDigits: [{
                type: Input
            }], maxFractionDigits: [{
                type: Input
            }], prefix: [{
                type: Input
            }], suffix: [{
                type: Input
            }], inputStyle: [{
                type: Input
            }], inputStyleClass: [{
                type: Input
            }], showClear: [{
                type: Input
            }], input: [{
                type: ViewChild,
                args: ['input']
            }], onInput: [{
                type: Output
            }], onFocus: [{
                type: Output
            }], onBlur: [{
                type: Output
            }], onKeyDown: [{
                type: Output
            }], onClear: [{
                type: Output
            }], disabled: [{
                type: Input
            }] } });
export class InputNumberModule {
}
InputNumberModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: InputNumberModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
InputNumberModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.1.0", ngImport: i0, type: InputNumberModule, declarations: [InputNumber], imports: [CommonModule, InputTextModule, ButtonModule], exports: [InputNumber] });
InputNumberModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: InputNumberModule, imports: [CommonModule, InputTextModule, ButtonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: InputNumberModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, InputTextModule, ButtonModule],
                    exports: [InputNumber],
                    declarations: [InputNumber]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXRudW1iZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvaW5wdXRudW1iZXIvaW5wdXRudW1iZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSx1QkFBdUIsRUFBcUIsU0FBUyxFQUFjLFlBQVksRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBVSxNQUFNLEVBQWlCLFNBQVMsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMxTSxPQUFPLEVBQXdCLGlCQUFpQixFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDekUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDekMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG1CQUFtQixDQUFDOzs7OztBQUVwRCxNQUFNLENBQUMsTUFBTSwwQkFBMEIsR0FBUTtJQUMzQyxPQUFPLEVBQUUsaUJBQWlCO0lBQzFCLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsV0FBVyxDQUFDO0lBQzFDLEtBQUssRUFBRSxJQUFJO0NBQ2QsQ0FBQztBQXVIRixNQUFNLE9BQU8sV0FBVztJQStJcEIsWUFBbUIsRUFBYyxFQUFVLEVBQXFCO1FBQTdDLE9BQUUsR0FBRixFQUFFLENBQVk7UUFBVSxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQTlJdkQsZ0JBQVcsR0FBWSxLQUFLLENBQUM7UUFFN0IsV0FBTSxHQUFZLElBQUksQ0FBQztRQUV2QixpQkFBWSxHQUFXLFNBQVMsQ0FBQztRQW9DakMsd0JBQW1CLEdBQVcsZ0JBQWdCLENBQUM7UUFFL0Msd0JBQW1CLEdBQVcsa0JBQWtCLENBQUM7UUFFakQsYUFBUSxHQUFZLEtBQUssQ0FBQztR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ZTtzQkFBdkIsS0FBSztnQkFFRyxXQUFXO3NCQUFuQixLQUFLO2dCQUVHLGlCQUFpQjtzQkFBekIsS0FBSztnQkFFRyxpQkFBaUI7c0JBQXpCLEtBQUs7Z0JBRUcsTUFBTTtzQkFBZCxLQUFLO2dCQUVHLE1BQU07c0JBQWQsS0FBSztnQkFFRyxVQUFVO3NCQUFsQixLQUFLO2dCQUVHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBRUcsU0FBUztzQkFBakIsS0FBSztnQkFFYyxLQUFLO3NCQUF4QixTQUFTO3VCQUFDLE9BQU87Z0JBRVIsT0FBTztzQkFBaEIsTUFBTTtnQkFFRyxPQUFPO3NCQUFoQixNQUFNO2dCQUVHLE1BQU07c0JBQWYsTUFBTTtnQkFFRyxTQUFTO3NCQUFsQixNQUFNO2dCQUVHLE9BQU87c0JBQWhCLE1BQU07Z0JBNENNLFFBQVE7c0JBQXBCLEtBQUs7O0FBKzBCVixNQUFNLE9BQU8saUJBQWlCOzs4R0FBakIsaUJBQWlCOytHQUFqQixpQkFBaUIsaUJBbDlCakIsV0FBVyxhQTg4QlYsWUFBWSxFQUFFLGVBQWUsRUFBRSxZQUFZLGFBOThCNUMsV0FBVzsrR0FrOUJYLGlCQUFpQixZQUpoQixZQUFZLEVBQUUsZUFBZSxFQUFFLFlBQVk7MkZBSTVDLGlCQUFpQjtrQkFMN0IsUUFBUTttQkFBQztvQkFDTixPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsZUFBZSxFQUFFLFlBQVksQ0FBQztvQkFDdEQsT0FBTyxFQUFFLENBQUMsV0FBVyxDQUFDO29CQUN0QixZQUFZLEVBQUUsQ0FBQyxXQUFXLENBQUM7aUJBQzlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDaGFuZ2VEZXRlY3RvclJlZiwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBFdmVudEVtaXR0ZXIsIGZvcndhcmRSZWYsIElucHV0LCBOZ01vZHVsZSwgT25Jbml0LCBPdXRwdXQsIFNpbXBsZUNoYW5nZXMsIFZpZXdDaGlsZCwgVmlld0VuY2Fwc3VsYXRpb24gfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IEJ1dHRvbk1vZHVsZSB9IGZyb20gJ3ByaW1lbmcvYnV0dG9uJztcbmltcG9ydCB7IERvbUhhbmRsZXIgfSBmcm9tICdwcmltZW5nL2RvbSc7XG5pbXBvcnQgeyBJbnB1dFRleHRNb2R1bGUgfSBmcm9tICdwcmltZW5nL2lucHV0dGV4dCc7XG5cbmV4cG9ydCBjb25zdCBJTlBVVE5VTUJFUl9WQUxVRV9BQ0NFU1NPUjogYW55ID0ge1xuICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IElucHV0TnVtYmVyKSxcbiAgICBtdWx0aTogdHJ1ZVxufTtcbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiAncC1pbnB1dE51bWJlcicsXG4gICAgdGVtcGxhdGU6IGBcbiAgICAgICAgPHNwYW5cbiAgICAgICAgICAgIFtuZ0NsYXNzXT1cIntcbiAgICAgICAgICAgICAgICAncC1pbnB1dG51bWJlciBwLWNvbXBvbmVudCc6IHRydWUsXG4gICAgICAgICAgICAgICAgJ3AtaW5wdXRudW1iZXItYnV0dG9ucy1zdGFja2VkJzogdGhpcy5zaG93QnV0dG9ucyAmJiB0aGlzLmJ1dHRvbkxheW91dCA9PT0gJ3N0YWNrZWQnLFxuICAgICAgICAgICAgICAgICdwLWlucHV0bnVtYmVyLWJ1dHRvbnMtaG9yaXpvbnRhbCc6IHRoaXMuc2hvd0J1dHRvbnMgJiYgdGhpcy5idXR0b25MYXlvdXQgPT09ICdob3Jpem9udGFsJyxcbiAgICAgICAgICAgICAgICAncC1pbnB1dG51bWJlci1idXR0b25zLXZlcnRpY2FsJzogdGhpcy5zaG93QnV0dG9ucyAmJiB0aGlzLmJ1dHRvbkxheW91dCA9PT0gJ3ZlcnRpY2FsJ1xuICAgICAgICAgICAgfVwiXG4gICAgICAgICAgICBbbmdTdHlsZV09XCJzdHlsZVwiXG4gICAgICAgICAgICBbY2xhc3NdPVwic3R5bGVDbGFzc1wiXG4gICAgICAgID5cbiAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICNpbnB1dFxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cIidwLWlucHV0bnVtYmVyLWlucHV0J1wiXG4gICAgICAgICAgICAgICAgW25nU3R5bGVdPVwiaW5wdXRTdHlsZVwiXG4gICAgICAgICAgICAgICAgW2NsYXNzXT1cImlucHV0U3R5bGVDbGFzc1wiXG4gICAgICAgICAgICAgICAgcElucHV0VGV4dFxuICAgICAgICAgICAgICAgIFt2YWx1ZV09XCJmb3JtYXR0ZWRWYWx1ZSgpXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5wbGFjZWhvbGRlcl09XCJwbGFjZWhvbGRlclwiXG4gICAgICAgICAgICAgICAgW2F0dHIudGl0bGVdPVwidGl0bGVcIlxuICAgICAgICAgICAgICAgIFthdHRyLmlkXT1cImlucHV0SWRcIlxuICAgICAgICAgICAgICAgIFthdHRyLnNpemVdPVwic2l6ZVwiXG4gICAgICAgICAgICAgICAgW2F0dHIubmFtZV09XCJuYW1lXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5hdXRvY29tcGxldGVdPVwiYXV0b2NvbXBsZXRlXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5tYXhsZW5ndGhdPVwibWF4bGVuZ3RoXCJcbiAgICAgICAgICAgICAgICBbYXR0ci50YWJpbmRleF09XCJ0YWJpbmRleFwiXG4gICAgICAgICAgICAgICAgW2F0dHIuYXJpYS1sYWJlbF09XCJhcmlhTGFiZWxcIlxuICAgICAgICAgICAgICAgIFthdHRyLmFyaWEtcmVxdWlyZWRdPVwiYXJpYVJlcXVpcmVkXCJcbiAgICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgICAgICAgIFthdHRyLnJlcXVpcmVkXT1cInJlcXVpcmVkXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5taW5dPVwibWluXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5tYXhdPVwibWF4XCJcbiAgICAgICAgICAgICAgICBbcmVhZG9ubHldPVwicmVhZG9ubHlcIlxuICAgICAgICAgICAgICAgIGlucHV0bW9kZT1cImRlY2ltYWxcIlxuICAgICAgICAgICAgICAgIChpbnB1dCk9XCJvblVzZXJJbnB1dCgkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAoa2V5ZG93bik9XCJvbklucHV0S2V5RG93bigkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAoa2V5cHJlc3MpPVwib25JbnB1dEtleVByZXNzKCRldmVudClcIlxuICAgICAgICAgICAgICAgIChwYXN0ZSk9XCJvblBhc3RlKCRldmVudClcIlxuICAgICAgICAgICAgICAgIChjbGljayk9XCJvbklucHV0Q2xpY2soKVwiXG4gICAgICAgICAgICAgICAgKGZvY3VzKT1cIm9uSW5wdXRGb2N1cygkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAoYmx1cik9XCJvbklucHV0Qmx1cigkZXZlbnQpXCJcbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgICA8aSAqbmdJZj1cImJ1dHRvbkxheW91dCAhPSAndmVydGljYWwnICYmIHNob3dDbGVhciAmJiB2YWx1ZVwiIGNsYXNzPVwicC1pbnB1dG51bWJlci1jbGVhci1pY29uIHBpIHBpLXRpbWVzXCIgKGNsaWNrKT1cImNsZWFyKClcIj48L2k+XG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInAtaW5wdXRudW1iZXItYnV0dG9uLWdyb3VwXCIgKm5nSWY9XCJzaG93QnV0dG9ucyAmJiBidXR0b25MYXlvdXQgPT09ICdzdGFja2VkJ1wiPlxuICAgICAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgICAgIHBCdXR0b25cbiAgICAgICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1pbnB1dG51bWJlci1idXR0b24gcC1pbnB1dG51bWJlci1idXR0b24tdXAnOiB0cnVlIH1cIlxuICAgICAgICAgICAgICAgICAgICBbY2xhc3NdPVwiaW5jcmVtZW50QnV0dG9uQ2xhc3NcIlxuICAgICAgICAgICAgICAgICAgICBbaWNvbl09XCJpbmNyZW1lbnRCdXR0b25JY29uXCJcbiAgICAgICAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgICAgICAgICAgICAgKG1vdXNlZG93bik9XCJ0aGlzLm9uVXBCdXR0b25Nb3VzZURvd24oJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICAgIChtb3VzZXVwKT1cIm9uVXBCdXR0b25Nb3VzZVVwKClcIlxuICAgICAgICAgICAgICAgICAgICAobW91c2VsZWF2ZSk9XCJvblVwQnV0dG9uTW91c2VMZWF2ZSgpXCJcbiAgICAgICAgICAgICAgICAgICAgKGtleWRvd24pPVwib25VcEJ1dHRvbktleURvd24oJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgICAgIChrZXl1cCk9XCJvblVwQnV0dG9uS2V5VXAoKVwiXG4gICAgICAgICAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgICAgICAgID48L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJidXR0b25cIlxuICAgICAgICAgICAgICAgICAgICBwQnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3AtaW5wdXRudW1iZXItYnV0dG9uIHAtaW5wdXRudW1iZXItYnV0dG9uLWRvd24nOiB0cnVlIH1cIlxuICAgICAgICAgICAgICAgICAgICBbY2xhc3NdPVwiZGVjcmVtZW50QnV0dG9uQ2xhc3NcIlxuICAgICAgICAgICAgICAgICAgICBbaWNvbl09XCJkZWNyZW1lbnRCdXR0b25JY29uXCJcbiAgICAgICAgICAgICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgICAgICAgICAgICAgKG1vdXNlZG93bik9XCJ0aGlzLm9uRG93bkJ1dHRvbk1vdXNlRG93bigkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgKG1vdXNldXApPVwib25Eb3duQnV0dG9uTW91c2VVcCgpXCJcbiAgICAgICAgICAgICAgICAgICAgKG1vdXNlbGVhdmUpPVwib25Eb3duQnV0dG9uTW91c2VMZWF2ZSgpXCJcbiAgICAgICAgICAgICAgICAgICAgKGtleWRvd24pPVwib25Eb3duQnV0dG9uS2V5RG93bigkZXZlbnQpXCJcbiAgICAgICAgICAgICAgICAgICAgKGtleXVwKT1cIm9uRG93bkJ1dHRvbktleVVwKClcIlxuICAgICAgICAgICAgICAgICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgICAgICAgICAgICA+PC9idXR0b24+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXG4gICAgICAgICAgICAgICAgcEJ1dHRvblxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3AtaW5wdXRudW1iZXItYnV0dG9uIHAtaW5wdXRudW1iZXItYnV0dG9uLXVwJzogdHJ1ZSB9XCJcbiAgICAgICAgICAgICAgICBbY2xhc3NdPVwiaW5jcmVtZW50QnV0dG9uQ2xhc3NcIlxuICAgICAgICAgICAgICAgIFtpY29uXT1cImluY3JlbWVudEJ1dHRvbkljb25cIlxuICAgICAgICAgICAgICAgICpuZ0lmPVwic2hvd0J1dHRvbnMgJiYgYnV0dG9uTGF5b3V0ICE9PSAnc3RhY2tlZCdcIlxuICAgICAgICAgICAgICAgIFtkaXNhYmxlZF09XCJkaXNhYmxlZFwiXG4gICAgICAgICAgICAgICAgKG1vdXNlZG93bik9XCJ0aGlzLm9uVXBCdXR0b25Nb3VzZURvd24oJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgKG1vdXNldXApPVwib25VcEJ1dHRvbk1vdXNlVXAoKVwiXG4gICAgICAgICAgICAgICAgKG1vdXNlbGVhdmUpPVwib25VcEJ1dHRvbk1vdXNlTGVhdmUoKVwiXG4gICAgICAgICAgICAgICAgKGtleWRvd24pPVwib25VcEJ1dHRvbktleURvd24oJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgKGtleXVwKT1cIm9uVXBCdXR0b25LZXlVcCgpXCJcbiAgICAgICAgICAgICAgICB0YWJpbmRleD1cIi0xXCJcbiAgICAgICAgICAgID48L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcbiAgICAgICAgICAgICAgICBwQnV0dG9uXG4gICAgICAgICAgICAgICAgW25nQ2xhc3NdPVwieyAncC1pbnB1dG51bWJlci1idXR0b24gcC1pbnB1dG51bWJlci1idXR0b24tZG93bic6IHRydWUgfVwiXG4gICAgICAgICAgICAgICAgW2NsYXNzXT1cImRlY3JlbWVudEJ1dHRvbkNsYXNzXCJcbiAgICAgICAgICAgICAgICBbaWNvbl09XCJkZWNyZW1lbnRCdXR0b25JY29uXCJcbiAgICAgICAgICAgICAgICAqbmdJZj1cInNob3dCdXR0b25zICYmIGJ1dHRvbkxheW91dCAhPT0gJ3N0YWNrZWQnXCJcbiAgICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiZGlzYWJsZWRcIlxuICAgICAgICAgICAgICAgIChtb3VzZWRvd24pPVwidGhpcy5vbkRvd25CdXR0b25Nb3VzZURvd24oJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgKG1vdXNldXApPVwib25Eb3duQnV0dG9uTW91c2VVcCgpXCJcbiAgICAgICAgICAgICAgICAobW91c2VsZWF2ZSk9XCJvbkRvd25CdXR0b25Nb3VzZUxlYXZlKClcIlxuICAgICAgICAgICAgICAgIChrZXlkb3duKT1cIm9uRG93bkJ1dHRvbktleURvd24oJGV2ZW50KVwiXG4gICAgICAgICAgICAgICAgKGtleXVwKT1cIm9uRG93bkJ1dHRvbktleVVwKClcIlxuICAgICAgICAgICAgICAgIHRhYmluZGV4PVwiLTFcIlxuICAgICAgICAgICAgPjwvYnV0dG9uPlxuICAgICAgICA8L3NwYW4+XG4gICAgYCxcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgICBwcm92aWRlcnM6IFtJTlBVVE5VTUJFUl9WQUxVRV9BQ0NFU1NPUl0sXG4gICAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgICBzdHlsZVVybHM6IFsnLi9pbnB1dG51bWJlci5jc3MnXSxcbiAgICBob3N0OiB7XG4gICAgICAgIGNsYXNzOiAncC1lbGVtZW50IHAtaW5wdXR3cmFwcGVyJyxcbiAgICAgICAgJ1tjbGFzcy5wLWlucHV0d3JhcHBlci1maWxsZWRdJzogJ2ZpbGxlZCcsXG4gICAgICAgICdbY2xhc3MucC1pbnB1dHdyYXBwZXItZm9jdXNdJzogJ2ZvY3VzZWQnLFxuICAgICAgICAnW2NsYXNzLnAtaW5wdXRudW1iZXItY2xlYXJhYmxlXSc6ICdzaG93Q2xlYXIgJiYgYnV0dG9uTGF5b3V0ICE9IFwidmVydGljYWxcIidcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIElucHV0TnVtYmVyIGltcGxlbWVudHMgT25Jbml0LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gICAgQElucHV0KCkgc2hvd0J1dHRvbnM6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIEBJbnB1dCgpIGZvcm1hdDogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBidXR0b25MYXlvdXQ6IHN0cmluZyA9ICdzdGFja2VkJztcblxuICAgIEBJbnB1dCgpIGlucHV0SWQ6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBwbGFjZWhvbGRlcjogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgc2l6ZTogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgbWF4bGVuZ3RoOiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSB0YWJpbmRleDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgdGl0bGU6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGFyaWFMYWJlbDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgYXJpYVJlcXVpcmVkOiBib29sZWFuO1xuXG4gICAgQElucHV0KCkgbmFtZTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgcmVxdWlyZWQ6IGJvb2xlYW47XG5cbiAgICBASW5wdXQoKSBhdXRvY29tcGxldGU6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIG1pbjogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgbWF4OiBudW1iZXI7XG5cbiAgICBASW5wdXQoKSBpbmNyZW1lbnRCdXR0b25DbGFzczogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgZGVjcmVtZW50QnV0dG9uQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIGluY3JlbWVudEJ1dHRvbkljb246IHN0cmluZyA9ICdwaSBwaS1hbmdsZS11cCc7XG5cbiAgICBASW5wdXQoKSBkZWNyZW1lbnRCdXR0b25JY29uOiBzdHJpbmcgPSAncGkgcGktYW5nbGUtZG93bic7XG5cbiAgICBASW5wdXQoKSByZWFkb25seTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQElucHV0KCkgc3RlcDogbnVtYmVyID0gMTtcblxuICAgIEBJbnB1dCgpIGFsbG93RW1wdHk6IGJvb2xlYW4gPSB0cnVlO1xuXG4gICAgQElucHV0KCkgbG9jYWxlOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBsb2NhbGVNYXRjaGVyOiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBtb2RlOiBzdHJpbmcgPSAnZGVjaW1hbCc7XG5cbiAgICBASW5wdXQoKSBjdXJyZW5jeTogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgY3VycmVuY3lEaXNwbGF5OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSB1c2VHcm91cGluZzogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBASW5wdXQoKSBtaW5GcmFjdGlvbkRpZ2l0czogbnVtYmVyO1xuXG4gICAgQElucHV0KCkgbWF4RnJhY3Rpb25EaWdpdHM6IG51bWJlcjtcblxuICAgIEBJbnB1dCgpIHByZWZpeDogc3RyaW5nO1xuXG4gICAgQElucHV0KCkgc3VmZml4OiBzdHJpbmc7XG5cbiAgICBASW5wdXQoKSBpbnB1dFN0eWxlOiBhbnk7XG5cbiAgICBASW5wdXQoKSBpbnB1dFN0eWxlQ2xhc3M6IHN0cmluZztcblxuICAgIEBJbnB1dCgpIHNob3dDbGVhcjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgQFZpZXdDaGlsZCgnaW5wdXQnKSBpbnB1dDogRWxlbWVudFJlZjtcblxuICAgIEBPdXRwdXQoKSBvbklucHV0OiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkZvY3VzOiBFdmVudEVtaXR0ZXI8YW55PiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICAgIEBPdXRwdXQoKSBvbkJsdXI6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uS2V5RG93bjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25DbGVhcjogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICB2YWx1ZTogbnVtYmVyO1xuXG4gICAgb25Nb2RlbENoYW5nZTogRnVuY3Rpb24gPSAoKSA9PiB7fTtcblxuICAgIG9uTW9kZWxUb3VjaGVkOiBGdW5jdGlvbiA9ICgpID0+IHt9O1xuXG4gICAgZm9jdXNlZDogYm9vbGVhbjtcblxuICAgIGluaXRpYWxpemVkOiBib29sZWFuO1xuXG4gICAgZ3JvdXBDaGFyOiBzdHJpbmcgPSAnJztcblxuICAgIHByZWZpeENoYXI6IHN0cmluZyA9ICcnO1xuXG4gICAgc3VmZml4Q2hhcjogc3RyaW5nID0gJyc7XG5cbiAgICBpc1NwZWNpYWxDaGFyOiBib29sZWFuO1xuXG4gICAgdGltZXI6IGFueTtcblxuICAgIGxhc3RWYWx1ZTogc3RyaW5nO1xuXG4gICAgX251bWVyYWw6IGFueTtcblxuICAgIG51bWJlckZvcm1hdDogYW55O1xuXG4gICAgX2RlY2ltYWw6IGFueTtcblxuICAgIF9ncm91cDogYW55O1xuXG4gICAgX21pbnVzU2lnbjogYW55O1xuXG4gICAgX2N1cnJlbmN5OiBhbnk7XG5cbiAgICBfcHJlZml4OiBhbnk7XG5cbiAgICBfc3VmZml4OiBhbnk7XG5cbiAgICBfaW5kZXg6IGFueTtcblxuICAgIF9kaXNhYmxlZDogYm9vbGVhbjtcblxuICAgIEBJbnB1dCgpIGdldCBkaXNhYmxlZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICAgIH1cblxuICAgIHNldCBkaXNhYmxlZChkaXNhYmxlZDogYm9vbGVhbikge1xuICAgICAgICBpZiAoZGlzYWJsZWQpIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuXG4gICAgICAgIHRoaXMuX2Rpc2FibGVkID0gZGlzYWJsZWQ7XG5cbiAgICAgICAgaWYgKHRoaXMudGltZXIpIHRoaXMuY2xlYXJUaW1lcigpO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBlbDogRWxlbWVudFJlZiwgcHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9XG5cbiAgICBuZ09uQ2hhbmdlcyhzaW1wbGVDaGFuZ2U6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAgICAgY29uc3QgcHJvcHMgPSBbJ2xvY2FsZScsICdsb2NhbGVNYXRjaGVyJywgJ21vZGUnLCAnY3VycmVuY3knLCAnY3VycmVuY3lEaXNwbGF5JywgJ3VzZUdyb3VwaW5nJywgJ21pbkZyYWN0aW9uRGlnaXRzJywgJ21heEZyYWN0aW9uRGlnaXRzJywgJ3ByZWZpeCcsICdzdWZmaXgnXTtcbiAgICAgICAgaWYgKHByb3BzLnNvbWUoKHApID0+ICEhc2ltcGxlQ2hhbmdlW3BdKSkge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVDb25zdHJ1Y3RQYXJzZXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLmNvbnN0cnVjdFBhcnNlcigpO1xuXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZWQgPSB0cnVlO1xuICAgIH1cblxuICAgIGdldE9wdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2NhbGVNYXRjaGVyOiB0aGlzLmxvY2FsZU1hdGNoZXIsXG4gICAgICAgICAgICBzdHlsZTogdGhpcy5tb2RlLFxuICAgICAgICAgICAgY3VycmVuY3k6IHRoaXMuY3VycmVuY3ksXG4gICAgICAgICAgICBjdXJyZW5jeURpc3BsYXk6IHRoaXMuY3VycmVuY3lEaXNwbGF5LFxuICAgICAgICAgICAgdXNlR3JvdXBpbmc6IHRoaXMudXNlR3JvdXBpbmcsXG4gICAgICAgICAgICBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IHRoaXMubWluRnJhY3Rpb25EaWdpdHMsXG4gICAgICAgICAgICBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IHRoaXMubWF4RnJhY3Rpb25EaWdpdHNcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RQYXJzZXIoKSB7XG4gICAgICAgIHRoaXMubnVtYmVyRm9ybWF0ID0gbmV3IEludGwuTnVtYmVyRm9ybWF0KHRoaXMubG9jYWxlLCB0aGlzLmdldE9wdGlvbnMoKSk7XG4gICAgICAgIGNvbnN0IG51bWVyYWxzID0gWy4uLm5ldyBJbnRsLk51bWJlckZvcm1hdCh0aGlzLmxvY2FsZSwgeyB1c2VHcm91cGluZzogZmFsc2UgfSkuZm9ybWF0KDk4NzY1NDMyMTApXS5yZXZlcnNlKCk7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gbmV3IE1hcChudW1lcmFscy5tYXAoKGQsIGkpID0+IFtkLCBpXSkpO1xuICAgICAgICB0aGlzLl9udW1lcmFsID0gbmV3IFJlZ0V4cChgWyR7bnVtZXJhbHMuam9pbignJyl9XWAsICdnJyk7XG4gICAgICAgIHRoaXMuX2dyb3VwID0gdGhpcy5nZXRHcm91cGluZ0V4cHJlc3Npb24oKTtcbiAgICAgICAgdGhpcy5fbWludXNTaWduID0gdGhpcy5nZXRNaW51c1NpZ25FeHByZXNzaW9uKCk7XG4gICAgICAgIHRoaXMuX2N1cnJlbmN5ID0gdGhpcy5nZXRDdXJyZW5jeUV4cHJlc3Npb24oKTtcbiAgICAgICAgdGhpcy5fZGVjaW1hbCA9IHRoaXMuZ2V0RGVjaW1hbEV4cHJlc3Npb24oKTtcbiAgICAgICAgdGhpcy5fc3VmZml4ID0gdGhpcy5nZXRTdWZmaXhFeHByZXNzaW9uKCk7XG4gICAgICAgIHRoaXMuX3ByZWZpeCA9IHRoaXMuZ2V0UHJlZml4RXhwcmVzc2lvbigpO1xuICAgICAgICB0aGlzLl9pbmRleCA9IChkKSA9PiBpbmRleC5nZXQoZCk7XG4gICAgfVxuXG4gICAgdXBkYXRlQ29uc3RydWN0UGFyc2VyKCkge1xuICAgICAgICBpZiAodGhpcy5pbml0aWFsaXplZCkge1xuICAgICAgICAgICAgdGhpcy5jb25zdHJ1Y3RQYXJzZXIoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVzY2FwZVJlZ0V4cCh0ZXh0KSB7XG4gICAgICAgIHJldHVybiB0ZXh0LnJlcGxhY2UoL1stW1xcXXt9KCkqKz8uLFxcXFxeJHwjXFxzXS9nLCAnXFxcXCQmJyk7XG4gICAgfVxuXG4gICAgZ2V0RGVjaW1hbEV4cHJlc3Npb24oKSB7XG4gICAgICAgIGNvbnN0IGZvcm1hdHRlciA9IG5ldyBJbnRsLk51bWJlckZvcm1hdCh0aGlzLmxvY2FsZSwgeyAuLi50aGlzLmdldE9wdGlvbnMoKSwgdXNlR3JvdXBpbmc6IGZhbHNlIH0pO1xuICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChgWyR7Zm9ybWF0dGVyLmZvcm1hdCgxLjEpLnJlcGxhY2UodGhpcy5fY3VycmVuY3ksICcnKS50cmltKCkucmVwbGFjZSh0aGlzLl9udW1lcmFsLCAnJyl9XWAsICdnJyk7XG4gICAgfVxuXG4gICAgZ2V0R3JvdXBpbmdFeHByZXNzaW9uKCkge1xuICAgICAgICBjb25zdCBmb3JtYXR0ZXIgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQodGhpcy5sb2NhbGUsIHsgdXNlR3JvdXBpbmc6IHRydWUgfSk7XG4gICAgICAgIHRoaXMuZ3JvdXBDaGFyID0gZm9ybWF0dGVyLmZvcm1hdCgxMDAwMDAwKS50cmltKCkucmVwbGFjZSh0aGlzLl9udW1lcmFsLCAnJykuY2hhckF0KDApO1xuICAgICAgICByZXR1cm4gbmV3IFJlZ0V4cChgWyR7dGhpcy5ncm91cENoYXJ9XWAsICdnJyk7XG4gICAgfVxuXG4gICAgZ2V0TWludXNTaWduRXhwcmVzc2lvbigpIHtcbiAgICAgICAgY29uc3QgZm9ybWF0dGVyID0gbmV3IEludGwuTnVtYmVyRm9ybWF0KHRoaXMubG9jYWxlLCB7IHVzZUdyb3VwaW5nOiBmYWxzZSB9KTtcbiAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoYFske2Zvcm1hdHRlci5mb3JtYXQoLTEpLnRyaW0oKS5yZXBsYWNlKHRoaXMuX251bWVyYWwsICcnKX1dYCwgJ2cnKTtcbiAgICB9XG5cbiAgICBnZXRDdXJyZW5jeUV4cHJlc3Npb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmN1cnJlbmN5KSB7XG4gICAgICAgICAgICBjb25zdCBmb3JtYXR0ZXIgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQodGhpcy5sb2NhbGUsIHsgc3R5bGU6ICdjdXJyZW5jeScsIGN1cnJlbmN5OiB0aGlzLmN1cnJlbmN5LCBjdXJyZW5jeURpc3BsYXk6IHRoaXMuY3VycmVuY3lEaXNwbGF5LCBtaW5pbXVtRnJhY3Rpb25EaWdpdHM6IDAsIG1heGltdW1GcmFjdGlvbkRpZ2l0czogMCB9KTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmVnRXhwKGBbJHtmb3JtYXR0ZXIuZm9ybWF0KDEpLnJlcGxhY2UoL1xccy9nLCAnJykucmVwbGFjZSh0aGlzLl9udW1lcmFsLCAnJykucmVwbGFjZSh0aGlzLl9ncm91cCwgJycpfV1gLCAnZycpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoYFtdYCwgJ2cnKTtcbiAgICB9XG5cbiAgICBnZXRQcmVmaXhFeHByZXNzaW9uKCkge1xuICAgICAgICBpZiAodGhpcy5wcmVmaXgpIHtcbiAgICAgICAgICAgIHRoaXMucHJlZml4Q2hhciA9IHRoaXMucHJlZml4O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgZm9ybWF0dGVyID0gbmV3IEludGwuTnVtYmVyRm9ybWF0KHRoaXMubG9jYWxlLCB7IHN0eWxlOiB0aGlzLm1vZGUsIGN1cnJlbmN5OiB0aGlzLmN1cnJlbmN5LCBjdXJyZW5jeURpc3BsYXk6IHRoaXMuY3VycmVuY3lEaXNwbGF5IH0pO1xuICAgICAgICAgICAgdGhpcy5wcmVmaXhDaGFyID0gZm9ybWF0dGVyLmZvcm1hdCgxKS5zcGxpdCgnMScpWzBdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoYCR7dGhpcy5lc2NhcGVSZWdFeHAodGhpcy5wcmVmaXhDaGFyIHx8ICcnKX1gLCAnZycpO1xuICAgIH1cblxuICAgIGdldFN1ZmZpeEV4cHJlc3Npb24oKSB7XG4gICAgICAgIGlmICh0aGlzLnN1ZmZpeCkge1xuICAgICAgICAgICAgdGhpcy5zdWZmaXhDaGFyID0gdGhpcy5zdWZmaXg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBmb3JtYXR0ZXIgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQodGhpcy5sb2NhbGUsIHsgc3R5bGU6IHRoaXMubW9kZSwgY3VycmVuY3k6IHRoaXMuY3VycmVuY3ksIGN1cnJlbmN5RGlzcGxheTogdGhpcy5jdXJyZW5jeURpc3BsYXksIG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMCwgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAwIH0pO1xuICAgICAgICAgICAgdGhpcy5zdWZmaXhDaGFyID0gZm9ybWF0dGVyLmZvcm1hdCgxKS5zcGxpdCgnMScpWzFdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG5ldyBSZWdFeHAoYCR7dGhpcy5lc2NhcGVSZWdFeHAodGhpcy5zdWZmaXhDaGFyIHx8ICcnKX1gLCAnZycpO1xuICAgIH1cblxuICAgIGZvcm1hdFZhbHVlKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09ICctJykge1xuICAgICAgICAgICAgICAgIC8vIE1pbnVzIHNpZ25cbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmZvcm1hdCkge1xuICAgICAgICAgICAgICAgIGxldCBmb3JtYXR0ZXIgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQodGhpcy5sb2NhbGUsIHRoaXMuZ2V0T3B0aW9ucygpKTtcbiAgICAgICAgICAgICAgICBsZXQgZm9ybWF0dGVkVmFsdWUgPSBmb3JtYXR0ZXIuZm9ybWF0KHZhbHVlKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wcmVmaXgpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVkVmFsdWUgPSB0aGlzLnByZWZpeCArIGZvcm1hdHRlZFZhbHVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN1ZmZpeCkge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXR0ZWRWYWx1ZSA9IGZvcm1hdHRlZFZhbHVlICsgdGhpcy5zdWZmaXg7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZvcm1hdHRlZFZhbHVlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gdmFsdWUudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAnJztcbiAgICB9XG5cbiAgICBwYXJzZVZhbHVlKHRleHQpIHtcbiAgICAgICAgbGV0IGZpbHRlcmVkVGV4dCA9IHRleHRcbiAgICAgICAgICAgIC5yZXBsYWNlKHRoaXMuX3N1ZmZpeCwgJycpXG4gICAgICAgICAgICAucmVwbGFjZSh0aGlzLl9wcmVmaXgsICcnKVxuICAgICAgICAgICAgLnRyaW0oKVxuICAgICAgICAgICAgLnJlcGxhY2UoL1xccy9nLCAnJylcbiAgICAgICAgICAgIC5yZXBsYWNlKHRoaXMuX2N1cnJlbmN5LCAnJylcbiAgICAgICAgICAgIC5yZXBsYWNlKHRoaXMuX2dyb3VwLCAnJylcbiAgICAgICAgICAgIC5yZXBsYWNlKHRoaXMuX21pbnVzU2lnbiwgJy0nKVxuICAgICAgICAgICAgLnJlcGxhY2UodGhpcy5fZGVjaW1hbCwgJy4nKVxuICAgICAgICAgICAgLnJlcGxhY2UodGhpcy5fbnVtZXJhbCwgdGhpcy5faW5kZXgpO1xuXG4gICAgICAgIGlmIChmaWx0ZXJlZFRleHQpIHtcbiAgICAgICAgICAgIGlmIChmaWx0ZXJlZFRleHQgPT09ICctJylcbiAgICAgICAgICAgICAgICAvLyBNaW51cyBzaWduXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlcmVkVGV4dDtcblxuICAgICAgICAgICAgbGV0IHBhcnNlZFZhbHVlID0gK2ZpbHRlcmVkVGV4dDtcbiAgICAgICAgICAgIHJldHVybiBpc05hTihwYXJzZWRWYWx1ZSkgPyBudWxsIDogcGFyc2VkVmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICByZXBlYXQoZXZlbnQsIGludGVydmFsLCBkaXIpIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZG9ubHkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBpID0gaW50ZXJ2YWwgfHwgNTAwO1xuXG4gICAgICAgIHRoaXMuY2xlYXJUaW1lcigpO1xuICAgICAgICB0aGlzLnRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnJlcGVhdChldmVudCwgNDAsIGRpcik7XG4gICAgICAgIH0sIGkpO1xuXG4gICAgICAgIHRoaXMuc3BpbihldmVudCwgZGlyKTtcbiAgICB9XG5cbiAgICBzcGluKGV2ZW50LCBkaXIpIHtcbiAgICAgICAgbGV0IHN0ZXAgPSB0aGlzLnN0ZXAgKiBkaXI7XG4gICAgICAgIGxldCBjdXJyZW50VmFsdWUgPSB0aGlzLnBhcnNlVmFsdWUodGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlKSB8fCAwO1xuICAgICAgICBsZXQgbmV3VmFsdWUgPSB0aGlzLnZhbGlkYXRlVmFsdWUoY3VycmVudFZhbHVlICsgc3RlcCk7XG4gICAgICAgIGlmICh0aGlzLm1heGxlbmd0aCAmJiB0aGlzLm1heGxlbmd0aCA8IHRoaXMuZm9ybWF0VmFsdWUobmV3VmFsdWUpLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy51cGRhdGVJbnB1dChuZXdWYWx1ZSwgbnVsbCwgJ3NwaW4nLCBudWxsKTtcbiAgICAgICAgdGhpcy51cGRhdGVNb2RlbChldmVudCwgbmV3VmFsdWUpO1xuXG4gICAgICAgIHRoaXMuaGFuZGxlT25JbnB1dChldmVudCwgY3VycmVudFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgfVxuXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodGhpcy52YWx1ZSk7XG4gICAgICAgIHRoaXMub25DbGVhci5lbWl0KCk7XG4gICAgfVxuXG4gICAgb25VcEJ1dHRvbk1vdXNlRG93bihldmVudCkge1xuICAgICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgdGhpcy5yZXBlYXQoZXZlbnQsIG51bGwsIDEpO1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cblxuICAgIG9uVXBCdXR0b25Nb3VzZVVwKCkge1xuICAgICAgICB0aGlzLmNsZWFyVGltZXIoKTtcbiAgICB9XG5cbiAgICBvblVwQnV0dG9uTW91c2VMZWF2ZSgpIHtcbiAgICAgICAgdGhpcy5jbGVhclRpbWVyKCk7XG4gICAgfVxuXG4gICAgb25VcEJ1dHRvbktleURvd24oZXZlbnQpIHtcbiAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDMyIHx8IGV2ZW50LmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgICAgICB0aGlzLnJlcGVhdChldmVudCwgbnVsbCwgMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblVwQnV0dG9uS2V5VXAoKSB7XG4gICAgICAgIHRoaXMuY2xlYXJUaW1lcigpO1xuICAgIH1cblxuICAgIG9uRG93bkJ1dHRvbk1vdXNlRG93bihldmVudCkge1xuICAgICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgdGhpcy5yZXBlYXQoZXZlbnQsIG51bGwsIC0xKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG5cbiAgICBvbkRvd25CdXR0b25Nb3VzZVVwKCkge1xuICAgICAgICB0aGlzLmNsZWFyVGltZXIoKTtcbiAgICB9XG5cbiAgICBvbkRvd25CdXR0b25Nb3VzZUxlYXZlKCkge1xuICAgICAgICB0aGlzLmNsZWFyVGltZXIoKTtcbiAgICB9XG5cbiAgICBvbkRvd25CdXR0b25LZXlVcCgpIHtcbiAgICAgICAgdGhpcy5jbGVhclRpbWVyKCk7XG4gICAgfVxuXG4gICAgb25Eb3duQnV0dG9uS2V5RG93bihldmVudCkge1xuICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzIgfHwgZXZlbnQua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgICAgIHRoaXMucmVwZWF0KGV2ZW50LCBudWxsLCAtMSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblVzZXJJbnB1dChldmVudCkge1xuICAgICAgICBpZiAodGhpcy5yZWFkb25seSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuaXNTcGVjaWFsQ2hhcikge1xuICAgICAgICAgICAgZXZlbnQudGFyZ2V0LnZhbHVlID0gdGhpcy5sYXN0VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pc1NwZWNpYWxDaGFyID0gZmFsc2U7XG4gICAgfVxuXG4gICAgb25JbnB1dEtleURvd24oZXZlbnQpIHtcbiAgICAgICAgaWYgKHRoaXMucmVhZG9ubHkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGFzdFZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgICBpZiAoZXZlbnQuc2hpZnRLZXkgfHwgZXZlbnQuYWx0S2V5KSB7XG4gICAgICAgICAgICB0aGlzLmlzU3BlY2lhbENoYXIgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNlbGVjdGlvblN0YXJ0ID0gZXZlbnQudGFyZ2V0LnNlbGVjdGlvblN0YXJ0O1xuICAgICAgICBsZXQgc2VsZWN0aW9uRW5kID0gZXZlbnQudGFyZ2V0LnNlbGVjdGlvbkVuZDtcbiAgICAgICAgbGV0IGlucHV0VmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgIGxldCBuZXdWYWx1ZVN0ciA9IG51bGw7XG5cbiAgICAgICAgaWYgKGV2ZW50LmFsdEtleSkge1xuICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN3aXRjaCAoZXZlbnQud2hpY2gpIHtcbiAgICAgICAgICAgIC8vdXBcbiAgICAgICAgICAgIGNhc2UgMzg6XG4gICAgICAgICAgICAgICAgdGhpcy5zcGluKGV2ZW50LCAxKTtcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAvL2Rvd25cbiAgICAgICAgICAgIGNhc2UgNDA6XG4gICAgICAgICAgICAgICAgdGhpcy5zcGluKGV2ZW50LCAtMSk7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy9sZWZ0XG4gICAgICAgICAgICBjYXNlIDM3OlxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc051bWVyYWxDaGFyKGlucHV0VmFsdWUuY2hhckF0KHNlbGVjdGlvblN0YXJ0IC0gMSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAvL3JpZ2h0XG4gICAgICAgICAgICBjYXNlIDM5OlxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc051bWVyYWxDaGFyKGlucHV0VmFsdWUuY2hhckF0KHNlbGVjdGlvblN0YXJ0KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIC8vZW50ZXJcbiAgICAgICAgICAgIGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgbmV3VmFsdWVTdHIgPSB0aGlzLnZhbGlkYXRlVmFsdWUodGhpcy5wYXJzZVZhbHVlKHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC52YWx1ZSkpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC52YWx1ZSA9IHRoaXMuZm9ybWF0VmFsdWUobmV3VmFsdWVTdHIpO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnLCBuZXdWYWx1ZVN0cik7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVNb2RlbChldmVudCwgbmV3VmFsdWVTdHIpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAvL2JhY2tzcGFjZVxuICAgICAgICAgICAgY2FzZSA4OiB7XG4gICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICAgIGlmIChzZWxlY3Rpb25TdGFydCA9PT0gc2VsZWN0aW9uRW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGRlbGV0ZUNoYXIgPSBpbnB1dFZhbHVlLmNoYXJBdChzZWxlY3Rpb25TdGFydCAtIDEpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGRlY2ltYWxDaGFySW5kZXgsIGRlY2ltYWxDaGFySW5kZXhXaXRob3V0UHJlZml4IH0gPSB0aGlzLmdldERlY2ltYWxDaGFySW5kZXhlcyhpbnB1dFZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc051bWVyYWxDaGFyKGRlbGV0ZUNoYXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWNpbWFsTGVuZ3RoID0gdGhpcy5nZXREZWNpbWFsTGVuZ3RoKGlucHV0VmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fZ3JvdXAudGVzdChkZWxldGVDaGFyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2dyb3VwLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWVTdHIgPSBpbnB1dFZhbHVlLnNsaWNlKDAsIHNlbGVjdGlvblN0YXJ0IC0gMikgKyBpbnB1dFZhbHVlLnNsaWNlKHNlbGVjdGlvblN0YXJ0IC0gMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2RlY2ltYWwudGVzdChkZWxldGVDaGFyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2RlY2ltYWwubGFzdEluZGV4ID0gMDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkZWNpbWFsTGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZShzZWxlY3Rpb25TdGFydCAtIDEsIHNlbGVjdGlvblN0YXJ0IC0gMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWVTdHIgPSBpbnB1dFZhbHVlLnNsaWNlKDAsIHNlbGVjdGlvblN0YXJ0IC0gMSkgKyBpbnB1dFZhbHVlLnNsaWNlKHNlbGVjdGlvblN0YXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRlY2ltYWxDaGFySW5kZXggPiAwICYmIHNlbGVjdGlvblN0YXJ0ID4gZGVjaW1hbENoYXJJbmRleCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGluc2VydGVkVGV4dCA9IHRoaXMuaXNEZWNpbWFsTW9kZSgpICYmICh0aGlzLm1pbkZyYWN0aW9uRGlnaXRzIHx8IDApIDwgZGVjaW1hbExlbmd0aCA/ICcnIDogJzAnO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlU3RyID0gaW5wdXRWYWx1ZS5zbGljZSgwLCBzZWxlY3Rpb25TdGFydCAtIDEpICsgaW5zZXJ0ZWRUZXh0ICsgaW5wdXRWYWx1ZS5zbGljZShzZWxlY3Rpb25TdGFydCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGRlY2ltYWxDaGFySW5kZXhXaXRob3V0UHJlZml4ID09PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWVTdHIgPSBpbnB1dFZhbHVlLnNsaWNlKDAsIHNlbGVjdGlvblN0YXJ0IC0gMSkgKyAnMCcgKyBpbnB1dFZhbHVlLnNsaWNlKHNlbGVjdGlvblN0YXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZVN0ciA9IHRoaXMucGFyc2VWYWx1ZShuZXdWYWx1ZVN0cikgPiAwID8gbmV3VmFsdWVTdHIgOiAnJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWVTdHIgPSBpbnB1dFZhbHVlLnNsaWNlKDAsIHNlbGVjdGlvblN0YXJ0IC0gMSkgKyBpbnB1dFZhbHVlLnNsaWNlKHNlbGVjdGlvblN0YXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUoZXZlbnQsIG5ld1ZhbHVlU3RyLCBudWxsLCAnZGVsZXRlLXNpbmdsZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlU3RyID0gdGhpcy5kZWxldGVSYW5nZShpbnB1dFZhbHVlLCBzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVWYWx1ZShldmVudCwgbmV3VmFsdWVTdHIsIG51bGwsICdkZWxldGUtcmFuZ2UnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZGVsXG4gICAgICAgICAgICBjYXNlIDQ2OlxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoc2VsZWN0aW9uU3RhcnQgPT09IHNlbGVjdGlvbkVuZCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWxldGVDaGFyID0gaW5wdXRWYWx1ZS5jaGFyQXQoc2VsZWN0aW9uU3RhcnQpO1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB7IGRlY2ltYWxDaGFySW5kZXgsIGRlY2ltYWxDaGFySW5kZXhXaXRob3V0UHJlZml4IH0gPSB0aGlzLmdldERlY2ltYWxDaGFySW5kZXhlcyhpbnB1dFZhbHVlKTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5pc051bWVyYWxDaGFyKGRlbGV0ZUNoYXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBkZWNpbWFsTGVuZ3RoID0gdGhpcy5nZXREZWNpbWFsTGVuZ3RoKGlucHV0VmFsdWUpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5fZ3JvdXAudGVzdChkZWxldGVDaGFyKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2dyb3VwLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWVTdHIgPSBpbnB1dFZhbHVlLnNsaWNlKDAsIHNlbGVjdGlvblN0YXJ0KSArIGlucHV0VmFsdWUuc2xpY2Uoc2VsZWN0aW9uU3RhcnQgKyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5fZGVjaW1hbC50ZXN0KGRlbGV0ZUNoYXIpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fZGVjaW1hbC5sYXN0SW5kZXggPSAwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRlY2ltYWxMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKHNlbGVjdGlvblN0YXJ0ICsgMSwgc2VsZWN0aW9uU3RhcnQgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZVN0ciA9IGlucHV0VmFsdWUuc2xpY2UoMCwgc2VsZWN0aW9uU3RhcnQpICsgaW5wdXRWYWx1ZS5zbGljZShzZWxlY3Rpb25TdGFydCArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVjaW1hbENoYXJJbmRleCA+IDAgJiYgc2VsZWN0aW9uU3RhcnQgPiBkZWNpbWFsQ2hhckluZGV4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgaW5zZXJ0ZWRUZXh0ID0gdGhpcy5pc0RlY2ltYWxNb2RlKCkgJiYgKHRoaXMubWluRnJhY3Rpb25EaWdpdHMgfHwgMCkgPCBkZWNpbWFsTGVuZ3RoID8gJycgOiAnMCc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWVTdHIgPSBpbnB1dFZhbHVlLnNsaWNlKDAsIHNlbGVjdGlvblN0YXJ0KSArIGluc2VydGVkVGV4dCArIGlucHV0VmFsdWUuc2xpY2Uoc2VsZWN0aW9uU3RhcnQgKyAxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVjaW1hbENoYXJJbmRleFdpdGhvdXRQcmVmaXggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZVN0ciA9IGlucHV0VmFsdWUuc2xpY2UoMCwgc2VsZWN0aW9uU3RhcnQpICsgJzAnICsgaW5wdXRWYWx1ZS5zbGljZShzZWxlY3Rpb25TdGFydCArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld1ZhbHVlU3RyID0gdGhpcy5wYXJzZVZhbHVlKG5ld1ZhbHVlU3RyKSA+IDAgPyBuZXdWYWx1ZVN0ciA6ICcnO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZVN0ciA9IGlucHV0VmFsdWUuc2xpY2UoMCwgc2VsZWN0aW9uU3RhcnQpICsgaW5wdXRWYWx1ZS5zbGljZShzZWxlY3Rpb25TdGFydCArIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVWYWx1ZShldmVudCwgbmV3VmFsdWVTdHIsIG51bGwsICdkZWxldGUtYmFjay1zaW5nbGUnKTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZVN0ciA9IHRoaXMuZGVsZXRlUmFuZ2UoaW5wdXRWYWx1ZSwgc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUoZXZlbnQsIG5ld1ZhbHVlU3RyLCBudWxsLCAnZGVsZXRlLXJhbmdlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vbktleURvd24uZW1pdChldmVudCk7XG4gICAgfVxuXG4gICAgb25JbnB1dEtleVByZXNzKGV2ZW50KSB7XG4gICAgICAgIGlmICh0aGlzLnJlYWRvbmx5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY29kZSA9IGV2ZW50LndoaWNoIHx8IGV2ZW50LmtleUNvZGU7XG4gICAgICAgIGxldCBjaGFyID0gU3RyaW5nLmZyb21DaGFyQ29kZShjb2RlKTtcbiAgICAgICAgY29uc3QgaXNEZWNpbWFsU2lnbiA9IHRoaXMuaXNEZWNpbWFsU2lnbihjaGFyKTtcbiAgICAgICAgY29uc3QgaXNNaW51c1NpZ24gPSB0aGlzLmlzTWludXNTaWduKGNoYXIpO1xuXG4gICAgICAgIGlmIChjb2RlICE9IDEzKSB7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKCg0OCA8PSBjb2RlICYmIGNvZGUgPD0gNTcpIHx8IGlzTWludXNTaWduIHx8IGlzRGVjaW1hbFNpZ24pIHtcbiAgICAgICAgICAgIHRoaXMuaW5zZXJ0KGV2ZW50LCBjaGFyLCB7IGlzRGVjaW1hbFNpZ24sIGlzTWludXNTaWduIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25QYXN0ZShldmVudCkge1xuICAgICAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgIXRoaXMucmVhZG9ubHkpIHtcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBsZXQgZGF0YSA9IChldmVudC5jbGlwYm9hcmREYXRhIHx8IHdpbmRvd1snY2xpcGJvYXJkRGF0YSddKS5nZXREYXRhKCdUZXh0Jyk7XG4gICAgICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJlZERhdGEgPSB0aGlzLnBhcnNlVmFsdWUoZGF0YSk7XG4gICAgICAgICAgICAgICAgaWYgKGZpbHRlcmVkRGF0YSAhPSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0KGV2ZW50LCBmaWx0ZXJlZERhdGEudG9TdHJpbmcoKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgYWxsb3dNaW51c1NpZ24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1pbiA9PSBudWxsIHx8IHRoaXMubWluIDwgMDtcbiAgICB9XG5cbiAgICBpc01pbnVzU2lnbihjaGFyKSB7XG4gICAgICAgIGlmICh0aGlzLl9taW51c1NpZ24udGVzdChjaGFyKSB8fCBjaGFyID09PSAnLScpIHtcbiAgICAgICAgICAgIHRoaXMuX21pbnVzU2lnbi5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaXNEZWNpbWFsU2lnbihjaGFyKSB7XG4gICAgICAgIGlmICh0aGlzLl9kZWNpbWFsLnRlc3QoY2hhcikpIHtcbiAgICAgICAgICAgIHRoaXMuX2RlY2ltYWwubGFzdEluZGV4ID0gMDtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlzRGVjaW1hbE1vZGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm1vZGUgPT09ICdkZWNpbWFsJztcbiAgICB9XG5cbiAgICBnZXREZWNpbWFsQ2hhckluZGV4ZXModmFsKSB7XG4gICAgICAgIGxldCBkZWNpbWFsQ2hhckluZGV4ID0gdmFsLnNlYXJjaCh0aGlzLl9kZWNpbWFsKTtcbiAgICAgICAgdGhpcy5fZGVjaW1hbC5sYXN0SW5kZXggPSAwO1xuXG4gICAgICAgIGNvbnN0IGZpbHRlcmVkVmFsID0gdmFsLnJlcGxhY2UodGhpcy5fcHJlZml4LCAnJykudHJpbSgpLnJlcGxhY2UoL1xccy9nLCAnJykucmVwbGFjZSh0aGlzLl9jdXJyZW5jeSwgJycpO1xuICAgICAgICBjb25zdCBkZWNpbWFsQ2hhckluZGV4V2l0aG91dFByZWZpeCA9IGZpbHRlcmVkVmFsLnNlYXJjaCh0aGlzLl9kZWNpbWFsKTtcbiAgICAgICAgdGhpcy5fZGVjaW1hbC5sYXN0SW5kZXggPSAwO1xuXG4gICAgICAgIHJldHVybiB7IGRlY2ltYWxDaGFySW5kZXgsIGRlY2ltYWxDaGFySW5kZXhXaXRob3V0UHJlZml4IH07XG4gICAgfVxuXG4gICAgZ2V0Q2hhckluZGV4ZXModmFsKSB7XG4gICAgICAgIGNvbnN0IGRlY2ltYWxDaGFySW5kZXggPSB2YWwuc2VhcmNoKHRoaXMuX2RlY2ltYWwpO1xuICAgICAgICB0aGlzLl9kZWNpbWFsLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIGNvbnN0IG1pbnVzQ2hhckluZGV4ID0gdmFsLnNlYXJjaCh0aGlzLl9taW51c1NpZ24pO1xuICAgICAgICB0aGlzLl9taW51c1NpZ24ubGFzdEluZGV4ID0gMDtcbiAgICAgICAgY29uc3Qgc3VmZml4Q2hhckluZGV4ID0gdmFsLnNlYXJjaCh0aGlzLl9zdWZmaXgpO1xuICAgICAgICB0aGlzLl9zdWZmaXgubGFzdEluZGV4ID0gMDtcbiAgICAgICAgY29uc3QgY3VycmVuY3lDaGFySW5kZXggPSB2YWwuc2VhcmNoKHRoaXMuX2N1cnJlbmN5KTtcbiAgICAgICAgdGhpcy5fY3VycmVuY3kubGFzdEluZGV4ID0gMDtcblxuICAgICAgICByZXR1cm4geyBkZWNpbWFsQ2hhckluZGV4LCBtaW51c0NoYXJJbmRleCwgc3VmZml4Q2hhckluZGV4LCBjdXJyZW5jeUNoYXJJbmRleCB9O1xuICAgIH1cblxuICAgIGluc2VydChldmVudCwgdGV4dCwgc2lnbiA9IHsgaXNEZWNpbWFsU2lnbjogZmFsc2UsIGlzTWludXNTaWduOiBmYWxzZSB9KSB7XG4gICAgICAgIGNvbnN0IG1pbnVzQ2hhckluZGV4T25UZXh0ID0gdGV4dC5zZWFyY2godGhpcy5fbWludXNTaWduKTtcbiAgICAgICAgdGhpcy5fbWludXNTaWduLmxhc3RJbmRleCA9IDA7XG4gICAgICAgIGlmICghdGhpcy5hbGxvd01pbnVzU2lnbigpICYmIG1pbnVzQ2hhckluZGV4T25UZXh0ICE9PSAtMSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHNlbGVjdGlvblN0YXJ0ID0gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnNlbGVjdGlvblN0YXJ0O1xuICAgICAgICBsZXQgc2VsZWN0aW9uRW5kID0gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnNlbGVjdGlvbkVuZDtcbiAgICAgICAgbGV0IGlucHV0VmFsdWUgPSB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQudmFsdWUudHJpbSgpO1xuICAgICAgICBjb25zdCB7IGRlY2ltYWxDaGFySW5kZXgsIG1pbnVzQ2hhckluZGV4LCBzdWZmaXhDaGFySW5kZXgsIGN1cnJlbmN5Q2hhckluZGV4IH0gPSB0aGlzLmdldENoYXJJbmRleGVzKGlucHV0VmFsdWUpO1xuICAgICAgICBsZXQgbmV3VmFsdWVTdHI7XG5cbiAgICAgICAgaWYgKHNpZ24uaXNNaW51c1NpZ24pIHtcbiAgICAgICAgICAgIGlmIChzZWxlY3Rpb25TdGFydCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIG5ld1ZhbHVlU3RyID0gaW5wdXRWYWx1ZTtcbiAgICAgICAgICAgICAgICBpZiAobWludXNDaGFySW5kZXggPT09IC0xIHx8IHNlbGVjdGlvbkVuZCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZVN0ciA9IHRoaXMuaW5zZXJ0VGV4dChpbnB1dFZhbHVlLCB0ZXh0LCAwLCBzZWxlY3Rpb25FbmQpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUoZXZlbnQsIG5ld1ZhbHVlU3RyLCB0ZXh0LCAnaW5zZXJ0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoc2lnbi5pc0RlY2ltYWxTaWduKSB7XG4gICAgICAgICAgICBpZiAoZGVjaW1hbENoYXJJbmRleCA+IDAgJiYgc2VsZWN0aW9uU3RhcnQgPT09IGRlY2ltYWxDaGFySW5kZXgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZhbHVlKGV2ZW50LCBpbnB1dFZhbHVlLCB0ZXh0LCAnaW5zZXJ0Jyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGRlY2ltYWxDaGFySW5kZXggPiBzZWxlY3Rpb25TdGFydCAmJiBkZWNpbWFsQ2hhckluZGV4IDwgc2VsZWN0aW9uRW5kKSB7XG4gICAgICAgICAgICAgICAgbmV3VmFsdWVTdHIgPSB0aGlzLmluc2VydFRleHQoaW5wdXRWYWx1ZSwgdGV4dCwgc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZCk7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVWYWx1ZShldmVudCwgbmV3VmFsdWVTdHIsIHRleHQsICdpbnNlcnQnKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZGVjaW1hbENoYXJJbmRleCA9PT0gLTEgJiYgdGhpcy5tYXhGcmFjdGlvbkRpZ2l0cykge1xuICAgICAgICAgICAgICAgIG5ld1ZhbHVlU3RyID0gdGhpcy5pbnNlcnRUZXh0KGlucHV0VmFsdWUsIHRleHQsIHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpO1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUoZXZlbnQsIG5ld1ZhbHVlU3RyLCB0ZXh0LCAnaW5zZXJ0Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBtYXhGcmFjdGlvbkRpZ2l0cyA9IHRoaXMubnVtYmVyRm9ybWF0LnJlc29sdmVkT3B0aW9ucygpLm1heGltdW1GcmFjdGlvbkRpZ2l0cztcbiAgICAgICAgICAgIGNvbnN0IG9wZXJhdGlvbiA9IHNlbGVjdGlvblN0YXJ0ICE9PSBzZWxlY3Rpb25FbmQgPyAncmFuZ2UtaW5zZXJ0JyA6ICdpbnNlcnQnO1xuXG4gICAgICAgICAgICBpZiAoZGVjaW1hbENoYXJJbmRleCA+IDAgJiYgc2VsZWN0aW9uU3RhcnQgPiBkZWNpbWFsQ2hhckluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGVjdGlvblN0YXJ0ICsgdGV4dC5sZW5ndGggLSAoZGVjaW1hbENoYXJJbmRleCArIDEpIDw9IG1heEZyYWN0aW9uRGlnaXRzKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IGNoYXJJbmRleCA9IGN1cnJlbmN5Q2hhckluZGV4ID49IHNlbGVjdGlvblN0YXJ0ID8gY3VycmVuY3lDaGFySW5kZXggLSAxIDogc3VmZml4Q2hhckluZGV4ID49IHNlbGVjdGlvblN0YXJ0ID8gc3VmZml4Q2hhckluZGV4IDogaW5wdXRWYWx1ZS5sZW5ndGg7XG5cbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWVTdHIgPSBpbnB1dFZhbHVlLnNsaWNlKDAsIHNlbGVjdGlvblN0YXJ0KSArIHRleHQgKyBpbnB1dFZhbHVlLnNsaWNlKHNlbGVjdGlvblN0YXJ0ICsgdGV4dC5sZW5ndGgsIGNoYXJJbmRleCkgKyBpbnB1dFZhbHVlLnNsaWNlKGNoYXJJbmRleCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUoZXZlbnQsIG5ld1ZhbHVlU3RyLCB0ZXh0LCBvcGVyYXRpb24pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbmV3VmFsdWVTdHIgPSB0aGlzLmluc2VydFRleHQoaW5wdXRWYWx1ZSwgdGV4dCwgc2VsZWN0aW9uU3RhcnQsIHNlbGVjdGlvbkVuZCk7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVWYWx1ZShldmVudCwgbmV3VmFsdWVTdHIsIHRleHQsIG9wZXJhdGlvbik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpbnNlcnRUZXh0KHZhbHVlLCB0ZXh0LCBzdGFydCwgZW5kKSB7XG4gICAgICAgIGxldCB0ZXh0U3BsaXQgPSB0ZXh0ID09PSAnLicgPyB0ZXh0IDogdGV4dC5zcGxpdCgnLicpO1xuXG4gICAgICAgIGlmICh0ZXh0U3BsaXQubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICBjb25zdCBkZWNpbWFsQ2hhckluZGV4ID0gdmFsdWUuc2xpY2Uoc3RhcnQsIGVuZCkuc2VhcmNoKHRoaXMuX2RlY2ltYWwpO1xuICAgICAgICAgICAgdGhpcy5fZGVjaW1hbC5sYXN0SW5kZXggPSAwO1xuICAgICAgICAgICAgcmV0dXJuIGRlY2ltYWxDaGFySW5kZXggPiAwID8gdmFsdWUuc2xpY2UoMCwgc3RhcnQpICsgdGhpcy5mb3JtYXRWYWx1ZSh0ZXh0KSArIHZhbHVlLnNsaWNlKGVuZCkgOiB2YWx1ZSB8fCB0aGlzLmZvcm1hdFZhbHVlKHRleHQpO1xuICAgICAgICB9IGVsc2UgaWYgKGVuZCAtIHN0YXJ0ID09PSB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmZvcm1hdFZhbHVlKHRleHQpO1xuICAgICAgICB9IGVsc2UgaWYgKHN0YXJ0ID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGV4dCArIHZhbHVlLnNsaWNlKGVuZCk7XG4gICAgICAgIH0gZWxzZSBpZiAoZW5kID09PSB2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiB2YWx1ZS5zbGljZSgwLCBzdGFydCkgKyB0ZXh0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHZhbHVlLnNsaWNlKDAsIHN0YXJ0KSArIHRleHQgKyB2YWx1ZS5zbGljZShlbmQpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZGVsZXRlUmFuZ2UodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgICAgICAgbGV0IG5ld1ZhbHVlU3RyO1xuXG4gICAgICAgIGlmIChlbmQgLSBzdGFydCA9PT0gdmFsdWUubGVuZ3RoKSBuZXdWYWx1ZVN0ciA9ICcnO1xuICAgICAgICBlbHNlIGlmIChzdGFydCA9PT0gMCkgbmV3VmFsdWVTdHIgPSB2YWx1ZS5zbGljZShlbmQpO1xuICAgICAgICBlbHNlIGlmIChlbmQgPT09IHZhbHVlLmxlbmd0aCkgbmV3VmFsdWVTdHIgPSB2YWx1ZS5zbGljZSgwLCBzdGFydCk7XG4gICAgICAgIGVsc2UgbmV3VmFsdWVTdHIgPSB2YWx1ZS5zbGljZSgwLCBzdGFydCkgKyB2YWx1ZS5zbGljZShlbmQpO1xuXG4gICAgICAgIHJldHVybiBuZXdWYWx1ZVN0cjtcbiAgICB9XG5cbiAgICBpbml0Q3Vyc29yKCkge1xuICAgICAgICBsZXQgc2VsZWN0aW9uU3RhcnQgPSB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuc2VsZWN0aW9uU3RhcnQ7XG4gICAgICAgIGxldCBpbnB1dFZhbHVlID0gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlO1xuICAgICAgICBsZXQgdmFsdWVMZW5ndGggPSBpbnB1dFZhbHVlLmxlbmd0aDtcbiAgICAgICAgbGV0IGluZGV4ID0gbnVsbDtcblxuICAgICAgICAvLyByZW1vdmUgcHJlZml4XG4gICAgICAgIGxldCBwcmVmaXhMZW5ndGggPSAodGhpcy5wcmVmaXhDaGFyIHx8ICcnKS5sZW5ndGg7XG4gICAgICAgIGlucHV0VmFsdWUgPSBpbnB1dFZhbHVlLnJlcGxhY2UodGhpcy5fcHJlZml4LCAnJyk7XG4gICAgICAgIHNlbGVjdGlvblN0YXJ0ID0gc2VsZWN0aW9uU3RhcnQgLSBwcmVmaXhMZW5ndGg7XG5cbiAgICAgICAgbGV0IGNoYXIgPSBpbnB1dFZhbHVlLmNoYXJBdChzZWxlY3Rpb25TdGFydCk7XG4gICAgICAgIGlmICh0aGlzLmlzTnVtZXJhbENoYXIoY2hhcikpIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxlY3Rpb25TdGFydCArIHByZWZpeExlbmd0aDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vbGVmdFxuICAgICAgICBsZXQgaSA9IHNlbGVjdGlvblN0YXJ0IC0gMTtcbiAgICAgICAgd2hpbGUgKGkgPj0gMCkge1xuICAgICAgICAgICAgY2hhciA9IGlucHV0VmFsdWUuY2hhckF0KGkpO1xuICAgICAgICAgICAgaWYgKHRoaXMuaXNOdW1lcmFsQ2hhcihjaGFyKSkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gaSArIHByZWZpeExlbmd0aDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGluZGV4ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuc2V0U2VsZWN0aW9uUmFuZ2UoaW5kZXggKyAxLCBpbmRleCArIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaSA9IHNlbGVjdGlvblN0YXJ0O1xuICAgICAgICAgICAgd2hpbGUgKGkgPCB2YWx1ZUxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGNoYXIgPSBpbnB1dFZhbHVlLmNoYXJBdChpKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc051bWVyYWxDaGFyKGNoYXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaSArIHByZWZpeExlbmd0aDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKGluZGV4LCBpbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaW5kZXggfHwgMDtcbiAgICB9XG5cbiAgICBvbklucHV0Q2xpY2soKSB7XG4gICAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgICAgICAgaWYgKCF0aGlzLnJlYWRvbmx5ICYmIGN1cnJlbnRWYWx1ZSAhPT0gRG9tSGFuZGxlci5nZXRTZWxlY3Rpb24oKSkge1xuICAgICAgICAgICAgdGhpcy5pbml0Q3Vyc29yKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc051bWVyYWxDaGFyKGNoYXIpIHtcbiAgICAgICAgaWYgKGNoYXIubGVuZ3RoID09PSAxICYmICh0aGlzLl9udW1lcmFsLnRlc3QoY2hhcikgfHwgdGhpcy5fZGVjaW1hbC50ZXN0KGNoYXIpIHx8IHRoaXMuX2dyb3VwLnRlc3QoY2hhcikgfHwgdGhpcy5fbWludXNTaWduLnRlc3QoY2hhcikpKSB7XG4gICAgICAgICAgICB0aGlzLnJlc2V0UmVnZXgoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHJlc2V0UmVnZXgoKSB7XG4gICAgICAgIHRoaXMuX251bWVyYWwubGFzdEluZGV4ID0gMDtcbiAgICAgICAgdGhpcy5fZGVjaW1hbC5sYXN0SW5kZXggPSAwO1xuICAgICAgICB0aGlzLl9ncm91cC5sYXN0SW5kZXggPSAwO1xuICAgICAgICB0aGlzLl9taW51c1NpZ24ubGFzdEluZGV4ID0gMDtcbiAgICB9XG5cbiAgICB1cGRhdGVWYWx1ZShldmVudCwgdmFsdWVTdHIsIGluc2VydGVkVmFsdWVTdHIsIG9wZXJhdGlvbikge1xuICAgICAgICBsZXQgY3VycmVudFZhbHVlID0gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlO1xuICAgICAgICBsZXQgbmV3VmFsdWUgPSBudWxsO1xuXG4gICAgICAgIGlmICh2YWx1ZVN0ciAhPSBudWxsKSB7XG4gICAgICAgICAgICBuZXdWYWx1ZSA9IHRoaXMucGFyc2VWYWx1ZSh2YWx1ZVN0cik7XG4gICAgICAgICAgICBuZXdWYWx1ZSA9ICFuZXdWYWx1ZSAmJiAhdGhpcy5hbGxvd0VtcHR5ID8gMCA6IG5ld1ZhbHVlO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVJbnB1dChuZXdWYWx1ZSwgaW5zZXJ0ZWRWYWx1ZVN0ciwgb3BlcmF0aW9uLCB2YWx1ZVN0cik7XG5cbiAgICAgICAgICAgIHRoaXMuaGFuZGxlT25JbnB1dChldmVudCwgY3VycmVudFZhbHVlLCBuZXdWYWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBoYW5kbGVPbklucHV0KGV2ZW50LCBjdXJyZW50VmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLmlzVmFsdWVDaGFuZ2VkKGN1cnJlbnRWYWx1ZSwgbmV3VmFsdWUpKSB7XG4gICAgICAgICAgICB0aGlzLm9uSW5wdXQuZW1pdCh7IG9yaWdpbmFsRXZlbnQ6IGV2ZW50LCB2YWx1ZTogbmV3VmFsdWUsIGZvcm1hdHRlZFZhbHVlOiBjdXJyZW50VmFsdWUgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpc1ZhbHVlQ2hhbmdlZChjdXJyZW50VmFsdWUsIG5ld1ZhbHVlKSB7XG4gICAgICAgIGlmIChuZXdWYWx1ZSA9PT0gbnVsbCAmJiBjdXJyZW50VmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG5ld1ZhbHVlICE9IG51bGwpIHtcbiAgICAgICAgICAgIGxldCBwYXJzZWRDdXJyZW50VmFsdWUgPSB0eXBlb2YgY3VycmVudFZhbHVlID09PSAnc3RyaW5nJyA/IHRoaXMucGFyc2VWYWx1ZShjdXJyZW50VmFsdWUpIDogY3VycmVudFZhbHVlO1xuICAgICAgICAgICAgcmV0dXJuIG5ld1ZhbHVlICE9PSBwYXJzZWRDdXJyZW50VmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFsaWRhdGVWYWx1ZSh2YWx1ZSkge1xuICAgICAgICBpZiAodmFsdWUgPT09ICctJyB8fCB2YWx1ZSA9PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm1pbiAhPSBudWxsICYmIHZhbHVlIDwgdGhpcy5taW4pIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1pbjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLm1heCAhPSBudWxsICYmIHZhbHVlID4gdGhpcy5tYXgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1heDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG5cbiAgICB1cGRhdGVJbnB1dCh2YWx1ZSwgaW5zZXJ0ZWRWYWx1ZVN0ciwgb3BlcmF0aW9uLCB2YWx1ZVN0cikge1xuICAgICAgICBpbnNlcnRlZFZhbHVlU3RyID0gaW5zZXJ0ZWRWYWx1ZVN0ciB8fCAnJztcblxuICAgICAgICBsZXQgaW5wdXRWYWx1ZSA9IHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC52YWx1ZTtcbiAgICAgICAgbGV0IG5ld1ZhbHVlID0gdGhpcy5mb3JtYXRWYWx1ZSh2YWx1ZSk7XG4gICAgICAgIGxldCBjdXJyZW50TGVuZ3RoID0gaW5wdXRWYWx1ZS5sZW5ndGg7XG5cbiAgICAgICAgaWYgKG5ld1ZhbHVlICE9PSB2YWx1ZVN0cikge1xuICAgICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLmNvbmNhdFZhbHVlcyhuZXdWYWx1ZSwgdmFsdWVTdHIpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGN1cnJlbnRMZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKDAsIDApO1xuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmluaXRDdXJzb3IoKTtcbiAgICAgICAgICAgIGNvbnN0IHNlbGVjdGlvbkVuZCA9IGluZGV4ICsgaW5zZXJ0ZWRWYWx1ZVN0ci5sZW5ndGg7XG4gICAgICAgICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuc2V0U2VsZWN0aW9uUmFuZ2Uoc2VsZWN0aW9uRW5kLCBzZWxlY3Rpb25FbmQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgbGV0IHNlbGVjdGlvblN0YXJ0ID0gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnNlbGVjdGlvblN0YXJ0O1xuICAgICAgICAgICAgbGV0IHNlbGVjdGlvbkVuZCA9IHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5zZWxlY3Rpb25FbmQ7XG4gICAgICAgICAgICBpZiAodGhpcy5tYXhsZW5ndGggJiYgdGhpcy5tYXhsZW5ndGggPCBuZXdWYWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC52YWx1ZSA9IG5ld1ZhbHVlO1xuICAgICAgICAgICAgbGV0IG5ld0xlbmd0aCA9IG5ld1ZhbHVlLmxlbmd0aDtcblxuICAgICAgICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJ3JhbmdlLWluc2VydCcpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzdGFydFZhbHVlID0gdGhpcy5wYXJzZVZhbHVlKChpbnB1dFZhbHVlIHx8ICcnKS5zbGljZSgwLCBzZWxlY3Rpb25TdGFydCkpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHN0YXJ0VmFsdWVTdHIgPSBzdGFydFZhbHVlICE9PSBudWxsID8gc3RhcnRWYWx1ZS50b1N0cmluZygpIDogJyc7XG4gICAgICAgICAgICAgICAgY29uc3Qgc3RhcnRFeHByID0gc3RhcnRWYWx1ZVN0ci5zcGxpdCgnJykuam9pbihgKCR7dGhpcy5ncm91cENoYXJ9KT9gKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzUmVnZXggPSBuZXcgUmVnRXhwKHN0YXJ0RXhwciwgJ2cnKTtcbiAgICAgICAgICAgICAgICBzUmVnZXgudGVzdChuZXdWYWx1ZSk7XG5cbiAgICAgICAgICAgICAgICBjb25zdCB0RXhwciA9IGluc2VydGVkVmFsdWVTdHIuc3BsaXQoJycpLmpvaW4oYCgke3RoaXMuZ3JvdXBDaGFyfSk/YCk7XG4gICAgICAgICAgICAgICAgY29uc3QgdFJlZ2V4ID0gbmV3IFJlZ0V4cCh0RXhwciwgJ2cnKTtcbiAgICAgICAgICAgICAgICB0UmVnZXgudGVzdChuZXdWYWx1ZS5zbGljZShzUmVnZXgubGFzdEluZGV4KSk7XG5cbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25FbmQgPSBzUmVnZXgubGFzdEluZGV4ICsgdFJlZ2V4Lmxhc3RJbmRleDtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuc2V0U2VsZWN0aW9uUmFuZ2Uoc2VsZWN0aW9uRW5kLCBzZWxlY3Rpb25FbmQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChuZXdMZW5ndGggPT09IGN1cnJlbnRMZW5ndGgpIHtcbiAgICAgICAgICAgICAgICBpZiAob3BlcmF0aW9uID09PSAnaW5zZXJ0JyB8fCBvcGVyYXRpb24gPT09ICdkZWxldGUtYmFjay1zaW5nbGUnKSB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuc2V0U2VsZWN0aW9uUmFuZ2Uoc2VsZWN0aW9uRW5kICsgMSwgc2VsZWN0aW9uRW5kICsgMSk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAob3BlcmF0aW9uID09PSAnZGVsZXRlLXNpbmdsZScpIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5zZXRTZWxlY3Rpb25SYW5nZShzZWxlY3Rpb25FbmQgLSAxLCBzZWxlY3Rpb25FbmQgLSAxKTtcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChvcGVyYXRpb24gPT09ICdkZWxldGUtcmFuZ2UnIHx8IG9wZXJhdGlvbiA9PT0gJ3NwaW4nKSB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuc2V0U2VsZWN0aW9uUmFuZ2Uoc2VsZWN0aW9uRW5kLCBzZWxlY3Rpb25FbmQpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09ICdkZWxldGUtYmFjay1zaW5nbGUnKSB7XG4gICAgICAgICAgICAgICAgbGV0IHByZXZDaGFyID0gaW5wdXRWYWx1ZS5jaGFyQXQoc2VsZWN0aW9uRW5kIC0gMSk7XG4gICAgICAgICAgICAgICAgbGV0IG5leHRDaGFyID0gaW5wdXRWYWx1ZS5jaGFyQXQoc2VsZWN0aW9uRW5kKTtcbiAgICAgICAgICAgICAgICBsZXQgZGlmZiA9IGN1cnJlbnRMZW5ndGggLSBuZXdMZW5ndGg7XG4gICAgICAgICAgICAgICAgbGV0IGlzR3JvdXBDaGFyID0gdGhpcy5fZ3JvdXAudGVzdChuZXh0Q2hhcik7XG5cbiAgICAgICAgICAgICAgICBpZiAoaXNHcm91cENoYXIgJiYgZGlmZiA9PT0gMSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxlY3Rpb25FbmQgKz0gMTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKCFpc0dyb3VwQ2hhciAmJiB0aGlzLmlzTnVtZXJhbENoYXIocHJldkNoYXIpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGVjdGlvbkVuZCArPSAtMSAqIGRpZmYgKyAxO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuX2dyb3VwLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKHNlbGVjdGlvbkVuZCwgc2VsZWN0aW9uRW5kKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaW5wdXRWYWx1ZSA9PT0gJy0nICYmIG9wZXJhdGlvbiA9PT0gJ2luc2VydCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuc2V0U2VsZWN0aW9uUmFuZ2UoMCwgMCk7XG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmluaXRDdXJzb3IoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWxlY3Rpb25FbmQgPSBpbmRleCArIGluc2VydGVkVmFsdWVTdHIubGVuZ3RoICsgMTtcbiAgICAgICAgICAgICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuc2V0U2VsZWN0aW9uUmFuZ2Uoc2VsZWN0aW9uRW5kLCBzZWxlY3Rpb25FbmQpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBzZWxlY3Rpb25FbmQgPSBzZWxlY3Rpb25FbmQgKyAobmV3TGVuZ3RoIC0gY3VycmVudExlbmd0aCk7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnNldFNlbGVjdGlvblJhbmdlKHNlbGVjdGlvbkVuZCwgc2VsZWN0aW9uRW5kKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtdmFsdWVub3cnLCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgY29uY2F0VmFsdWVzKHZhbDEsIHZhbDIpIHtcbiAgICAgICAgaWYgKHZhbDEgJiYgdmFsMikge1xuICAgICAgICAgICAgbGV0IGRlY2ltYWxDaGFySW5kZXggPSB2YWwyLnNlYXJjaCh0aGlzLl9kZWNpbWFsKTtcbiAgICAgICAgICAgIHRoaXMuX2RlY2ltYWwubGFzdEluZGV4ID0gMDtcblxuICAgICAgICAgICAgaWYgKHRoaXMuc3VmZml4Q2hhcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWwxLnJlcGxhY2UodGhpcy5zdWZmaXhDaGFyLCAnJykuc3BsaXQodGhpcy5fZGVjaW1hbClbMF0gKyB2YWwyLnJlcGxhY2UodGhpcy5zdWZmaXhDaGFyLCAnJykuc2xpY2UoZGVjaW1hbENoYXJJbmRleCkgKyB0aGlzLnN1ZmZpeENoYXI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWNpbWFsQ2hhckluZGV4ICE9PSAtMSA/IHZhbDEuc3BsaXQodGhpcy5fZGVjaW1hbClbMF0gKyB2YWwyLnNsaWNlKGRlY2ltYWxDaGFySW5kZXgpIDogdmFsMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsMTtcbiAgICB9XG5cbiAgICBnZXREZWNpbWFsTGVuZ3RoKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICAgICAgY29uc3QgdmFsdWVTcGxpdCA9IHZhbHVlLnNwbGl0KHRoaXMuX2RlY2ltYWwpO1xuXG4gICAgICAgICAgICBpZiAodmFsdWVTcGxpdC5sZW5ndGggPT09IDIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWVTcGxpdFsxXS5yZXBsYWNlKHRoaXMuX3N1ZmZpeCwgJycpLnRyaW0oKS5yZXBsYWNlKC9cXHMvZywgJycpLnJlcGxhY2UodGhpcy5fY3VycmVuY3ksICcnKS5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gMDtcbiAgICB9XG5cbiAgICBvbklucHV0Rm9jdXMoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5mb2N1c2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5vbkZvY3VzLmVtaXQoZXZlbnQpO1xuICAgIH1cblxuICAgIG9uSW5wdXRCbHVyKGV2ZW50KSB7XG4gICAgICAgIHRoaXMuZm9jdXNlZCA9IGZhbHNlO1xuXG4gICAgICAgIGxldCBuZXdWYWx1ZSA9IHRoaXMudmFsaWRhdGVWYWx1ZSh0aGlzLnBhcnNlVmFsdWUodGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50LnZhbHVlKSk7XG4gICAgICAgIHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudC52YWx1ZSA9IHRoaXMuZm9ybWF0VmFsdWUobmV3VmFsdWUpO1xuICAgICAgICB0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQuc2V0QXR0cmlidXRlKCdhcmlhLXZhbHVlbm93JywgbmV3VmFsdWUpO1xuICAgICAgICB0aGlzLnVwZGF0ZU1vZGVsKGV2ZW50LCBuZXdWYWx1ZSk7XG5cbiAgICAgICAgdGhpcy5vbkJsdXIuZW1pdChldmVudCk7XG4gICAgfVxuXG4gICAgZm9ybWF0dGVkVmFsdWUoKSB7XG4gICAgICAgIGNvbnN0IHZhbCA9ICF0aGlzLnZhbHVlICYmICF0aGlzLmFsbG93RW1wdHkgPyAwIDogdGhpcy52YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZm9ybWF0VmFsdWUodmFsKTtcbiAgICB9XG5cbiAgICB1cGRhdGVNb2RlbChldmVudCwgdmFsdWUpIHtcbiAgICAgICAgaWYgKHRoaXMudmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICB0aGlzLm9uTW9kZWxDaGFuZ2UodmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5vbk1vZGVsVG91Y2hlZCgpO1xuICAgIH1cblxuICAgIHdyaXRlVmFsdWUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIHRoaXMuY2QubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPbkNoYW5nZShmbjogRnVuY3Rpb24pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5vbk1vZGVsQ2hhbmdlID0gZm47XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJPblRvdWNoZWQoZm46IEZ1bmN0aW9uKTogdm9pZCB7XG4gICAgICAgIHRoaXMub25Nb2RlbFRvdWNoZWQgPSBmbjtcbiAgICB9XG5cbiAgICBzZXREaXNhYmxlZFN0YXRlKHZhbDogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICB0aGlzLmRpc2FibGVkID0gdmFsO1xuICAgICAgICB0aGlzLmNkLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cblxuICAgIGdldCBmaWxsZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnZhbHVlICE9IG51bGwgJiYgdGhpcy52YWx1ZS50b1N0cmluZygpLmxlbmd0aCA+IDA7XG4gICAgfVxuXG4gICAgY2xlYXJUaW1lcigpIHtcbiAgICAgICAgaWYgKHRoaXMudGltZXIpIHtcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRGb3JtYXR0ZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm51bWJlckZvcm1hdDtcbiAgICB9XG59XG5cbkBOZ01vZHVsZSh7XG4gICAgaW1wb3J0czogW0NvbW1vbk1vZHVsZSwgSW5wdXRUZXh0TW9kdWxlLCBCdXR0b25Nb2R1bGVdLFxuICAgIGV4cG9ydHM6IFtJbnB1dE51bWJlcl0sXG4gICAgZGVjbGFyYXRpb25zOiBbSW5wdXROdW1iZXJdXG59KVxuZXhwb3J0IGNsYXNzIElucHV0TnVtYmVyTW9kdWxlIHt9XG4iXX0=