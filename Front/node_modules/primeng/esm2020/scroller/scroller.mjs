import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ContentChildren, EventEmitter, Input, NgModule, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { PrimeTemplate } from 'primeng/api';
import { DomHandler } from 'primeng/dom';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export class Scroller {
    constructor(cd, zone) {
        this.cd = cd;
        this.zone = zone;
        this.onLazyLoad = new EventEmitter();
        this.onScroll = new EventEmitter();
        this.onScrollIndexChange = new EventEmitter();
        this._tabindex = 0;
        this._itemSize = 0;
        this._orientation = 'vertical';
        this._step = 0;
        this._delay = 0;
        this._resizeDelay = 10;
        this._appendOnly = false;
        this._inline = false;
        this._lazy = false;
        this._disabled = false;
        this._loaderDisabled = false;
        this._showSpacer = true;
        this._showLoader = false;
        this._autoSize = false;
        this.d_loading = false;
        this.first = 0;
        this.last = 0;
        this.page = 0;
        this.isRangeChanged = false;
        this.numItemsInViewport = 0;
        this.lastScrollPos = 0;
        this.lazyLoadState = {};
        this.loaderArr = [];
        this.spacerStyle = {};
        this.contentStyle = {};
        this.initialized = false;
    }
    get id() {
        return this._id;
    }
    set id(val) {
        this._id = val;
    }
    get style() {
        return this._style;
    }
    set style(val) {
        this._style = val;
    }
    get styleClass() {
        return this._styleClass;
    }
    set styleClass(val) {
        this._styleClass = val;
    }
    get tabindex() {
        return this._tabindex;
    }
    set tabindex(val) {
        this._tabindex = val;
    }
    get items() {
        return this._items;
    }
    set items(val) {
        this._items = val;
    }
    get itemSize() {
        return this._itemSize;
    }
    set itemSize(val) {
        this._itemSize = val;
    }
    get scrollHeight() {
        return this._scrollHeight;
    }
    set scrollHeight(val) {
        this._scrollHeight = val;
    }
    get scrollWidth() {
        return this._scrollWidth;
    }
    set scrollWidth(val) {
        this._scrollWidth = val;
    }
    get orientation() {
        return this._orientation;
    }
    set orientation(val) {
        this._orientation = val;
    }
    get step() {
        return this._step;
    }
    set step(val) {
        this._step = val;
    }
    get delay() {
        return this._delay;
    }
    set delay(val) {
        this._delay = val;
    }
    get resizeDelay() {
        return this._resizeDelay;
    }
    set resizeDelay(val) {
        this._resizeDelay = val;
    }
    get appendOnly() {
        return this._appendOnly;
    }
    set appendOnly(val) {
        this._appendOnly = val;
    }
    get inline() {
        return this._inline;
    }
    set inline(val) {
        this._inline = val;
    }
    get lazy() {
        return this._lazy;
    }
    set lazy(val) {
        this._lazy = val;
    }
    get disabled() {
        return this._disabled;
    }
    set disabled(val) {
        this._disabled = val;
    }
    get loaderDisabled() {
        return this._loaderDisabled;
    }
    set loaderDisabled(val) {
        this._loaderDisabled = val;
    }
    get columns() {
        return this._columns;
    }
    set columns(val) {
        this._columns = val;
    }
    get showSpacer() {
        return this._showSpacer;
    }
    set showSpacer(val) {
        this._showSpacer = val;
    }
    get showLoader() {
        return this._showLoader;
    }
    set showLoader(val) {
        this._showLoader = val;
    }
    get numToleratedItems() {
        return this._numToleratedItems;
    }
    set numToleratedItems(val) {
        this._numToleratedItems = val;
    }
    get loading() {
        return this._loading;
    }
    set loading(val) {
        this._loading = val;
    }
    get autoSize() {
        return this._autoSize;
    }
    set autoSize(val) {
        this._autoSize = val;
    }
    get trackBy() {
        return this._trackBy;
    }
    set trackBy(val) {
        this._trackBy = val;
    }
    get options() {
        return this._options;
    }
    set options(val) {
        this._options = val;
        if (val && typeof val === 'object') {
            Object.entries(val).forEach(([k, v]) => this[`_${k}`] !== v && (this[`_${k}`] = v));
        }
    }
    get vertical() {
        return this._orientation === 'vertical';
    }
    get horizontal() {
        return this._orientation === 'horizontal';
    }
    get both() {
        return this._orientation === 'both';
    }
    get loadedItems() {
        if (this._items && !this.d_loading) {
            if (this.both)
                return this._items.slice(this._appendOnly ? 0 : this.first.rows, this.last.rows).map((item) => (this._columns ? item : item.slice(this._appendOnly ? 0 : this.first.cols, this.last.cols)));
            else if (this.horizontal && this._columns)
                return this._items;
            else
                return this._items.slice(this._appendOnly ? 0 : this.first, this.last);
        }
        return [];
    }
    get loadedRows() {
        return this.d_loading ? (this._loaderDisabled ? this.loaderArr : []) : this.loadedItems;
    }
    get loadedColumns() {
        if (this._columns && (this.both || this.horizontal)) {
            return this.d_loading && this._loaderDisabled ? (this.both ? this.loaderArr[0] : this.loaderArr) : this._columns.slice(this.both ? this.first.cols : this.first, this.both ? this.last.cols : this.last);
        }
        return this._columns;
    }
    get isPageChanged() {
        return this._step ? this.page !== this.getPageByFirst() : true;
    }
    ngOnInit() {
        this.setInitialState();
    }
    ngOnChanges(simpleChanges) {
        let isLoadingChanged = false;
        if (simpleChanges.loading) {
            const { previousValue, currentValue } = simpleChanges.loading;
            if (this.lazy && previousValue !== currentValue && currentValue !== this.d_loading) {
                this.d_loading = currentValue;
                isLoadingChanged = true;
            }
        }
        if (simpleChanges.orientation) {
            this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
        }
        if (simpleChanges.numToleratedItems) {
            const { previousValue, currentValue } = simpleChanges.numToleratedItems;
            if (previousValue !== currentValue && currentValue !== this.d_numToleratedItems) {
                this.d_numToleratedItems = currentValue;
            }
        }
        if (simpleChanges.options) {
            const { previousValue, currentValue } = simpleChanges.options;
            if (this.lazy && previousValue?.loading !== currentValue?.loading && currentValue?.loading !== this.d_loading) {
                this.d_loading = currentValue.loading;
                isLoadingChanged = true;
            }
            if (previousValue?.numToleratedItems !== currentValue?.numToleratedItems && currentValue?.numToleratedItems !== this.d_numToleratedItems) {
                this.d_numToleratedItems = currentValue.numToleratedItems;
            }
        }
        if (this.initialized) {
            const isChanged = !isLoadingChanged && (simpleChanges.items?.previousValue?.length !== simpleChanges.items?.currentValue?.length || simpleChanges.itemSize || simpleChanges.scrollHeight || simpleChanges.scrollWidth);
            if (isChanged) {
                this.init();
                this.calculateAutoSize();
            }
        }
    }
    ngAfterContentInit() {
        this.templates.forEach((item) => {
            switch (item.getType()) {
                case 'content':
                    this.contentTemplate = item.template;
                    break;
                case 'item':
                    this.itemTemplate = item.template;
                    break;
                case 'loader':
                    this.loaderTemplate = item.template;
                    break;
                case 'loadericon':
                    this.loaderIconTemplate = item.template;
                    break;
                default:
                    this.itemTemplate = item.template;
                    break;
            }
        });
    }
    ngAfterViewInit() {
        Promise.resolve().then(() => {
            this.viewInit();
        });
    }
    ngAfterViewChecked() {
        if (!this.initialized) {
            this.viewInit();
        }
    }
    ngOnDestroy() {
        this.unbindResizeListener();
        this.contentEl = null;
        this.initialized = false;
    }
    viewInit() {
        if (DomHandler.isVisible(this.elementViewChild?.nativeElement)) {
            this.setInitialState();
            this.setContentEl(this.contentEl);
            this.init();
            this.defaultWidth = DomHandler.getWidth(this.elementViewChild.nativeElement);
            this.defaultHeight = DomHandler.getHeight(this.elementViewChild.nativeElement);
            this.defaultContentWidth = DomHandler.getWidth(this.contentEl);
            this.defaultContentHeight = DomHandler.getHeight(this.contentEl);
            this.initialized = true;
        }
    }
    init() {
        if (!this._disabled) {
            this.setSize();
            this.calculateOptions();
            this.setSpacerSize();
            this.bindResizeListener();
            this.cd.detectChanges();
        }
    }
    setContentEl(el) {
        this.contentEl = el || this.contentViewChild?.nativeElement || DomHandler.findSingle(this.elementViewChild?.nativeElement, '.p-scroller-content');
    }
    setInitialState() {
        this.first = this.both ? { rows: 0, cols: 0 } : 0;
        this.last = this.both ? { rows: 0, cols: 0 } : 0;
        this.numItemsInViewport = this.both ? { rows: 0, cols: 0 } : 0;
        this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
        this.d_loading = this._loading || false;
        this.d_numToleratedItems = this._numToleratedItems;
        this.loaderArr = [];
        this.spacerStyle = {};
        this.contentStyle = {};
    }
    getElementRef() {
        return this.elementViewChild;
    }
    getPageByFirst() {
        return Math.floor((this.first + this.d_numToleratedItems * 4) / (this._step || 1));
    }
    scrollTo(options) {
        this.lastScrollPos = this.both ? { top: 0, left: 0 } : 0;
        this.elementViewChild?.nativeElement?.scrollTo(options);
    }
    scrollToIndex(index, behavior = 'auto') {
        const { numToleratedItems } = this.calculateNumItems();
        const contentPos = this.getContentPosition();
        const calculateFirst = (_index = 0, _numT) => (_index <= _numT ? 0 : _index);
        const calculateCoord = (_first, _size, _cpos) => _first * _size + _cpos;
        const scrollTo = (left = 0, top = 0) => this.scrollTo({ left, top, behavior });
        let newFirst = 0;
        if (this.both) {
            newFirst = { rows: calculateFirst(index[0], numToleratedItems[0]), cols: calculateFirst(index[1], numToleratedItems[1]) };
            scrollTo(calculateCoord(newFirst.cols, this._itemSize[1], contentPos.left), calculateCoord(newFirst.rows, this._itemSize[0], contentPos.top));
        }
        else {
            newFirst = calculateFirst(index, numToleratedItems);
            this.horizontal ? scrollTo(calculateCoord(newFirst, this._itemSize, contentPos.left), 0) : scrollTo(0, calculateCoord(newFirst, this._itemSize, contentPos.top));
        }
        this.isRangeChanged = this.first !== newFirst;
        this.first = newFirst;
    }
    scrollInView(index, to, behavior = 'auto') {
        if (to) {
            const { first, viewport } = this.getRenderedRange();
            const scrollTo = (left = 0, top = 0) => this.scrollTo({ left, top, behavior });
            const isToStart = to === 'to-start';
            const isToEnd = to === 'to-end';
            if (isToStart) {
                if (this.both) {
                    if (viewport.first.rows - first.rows > index[0]) {
                        scrollTo(viewport.first.cols * this._itemSize[1], (viewport.first.rows - 1) * this._itemSize[0]);
                    }
                    else if (viewport.first.cols - first.cols > index[1]) {
                        scrollTo((viewport.first.cols - 1) * this._itemSize[1], viewport.first.rows * this._itemSize[0]);
                    }
                }
                else {
                    if (viewport.first - first > index) {
                        const pos = (viewport.first - 1) * this._itemSize;
                        this.horizontal ? scrollTo(pos, 0) : scrollTo(0, pos);
                    }
                }
            }
            else if (isToEnd) {
                if (this.both) {
                    if (viewport.last.rows - first.rows <= index[0] + 1) {
                        scrollTo(viewport.first.cols * this._itemSize[1], (viewport.first.rows + 1) * this._itemSize[0]);
                    }
                    else if (viewport.last.cols - first.cols <= index[1] + 1) {
                        scrollTo((viewport.first.cols + 1) * this._itemSize[1], viewport.first.rows * this._itemSize[0]);
                    }
                }
                else {
                    if (viewport.last - first <= index + 1) {
                        const pos = (viewport.first + 1) * this._itemSize;
                        this.horizontal ? scrollTo(pos, 0) : scrollTo(0, pos);
                    }
                }
            }
        }
        else {
            this.scrollToIndex(index, behavior);
        }
    }
    getRenderedRange() {
        const calculateFirstInViewport = (_pos, _size) => Math.floor(_pos / (_size || _pos));
        let firstInViewport = this.first;
        let lastInViewport = 0;
        if (this.elementViewChild?.nativeElement) {
            const { scrollTop, scrollLeft } = this.elementViewChild.nativeElement;
            if (this.both) {
                firstInViewport = { rows: calculateFirstInViewport(scrollTop, this._itemSize[0]), cols: calculateFirstInViewport(scrollLeft, this._itemSize[1]) };
                lastInViewport = { rows: firstInViewport.rows + this.numItemsInViewport.rows, cols: firstInViewport.cols + this.numItemsInViewport.cols };
            }
            else {
                const scrollPos = this.horizontal ? scrollLeft : scrollTop;
                firstInViewport = calculateFirstInViewport(scrollPos, this._itemSize);
                lastInViewport = firstInViewport + this.numItemsInViewport;
            }
        }
        return {
            first: this.first,
            last: this.last,
            viewport: {
                first: firstInViewport,
                last: lastInViewport
            }
        };
    }
    calculateNumItems() {
        const contentPos = this.getContentPosition();
        const contentWidth = this.elementViewChild?.nativeElement ? this.elementViewChild.nativeElement.offsetWidth - contentPos.left : 0;
        const contentHeight = this.elementViewChild?.nativeElement ? this.elementViewChild.nativeElement.offsetHeight - contentPos.top : 0;
        const calculateNumItemsInViewport = (_contentSize, _itemSize) => Math.ceil(_contentSize / (_itemSize || _contentSize));
        const calculateNumToleratedItems = (_numItems) => Math.ceil(_numItems / 2);
        const numItemsInViewport = this.both
            ? { rows: calculateNumItemsInViewport(contentHeight, this._itemSize[0]), cols: calculateNumItemsInViewport(contentWidth, this._itemSize[1]) }
            : calculateNumItemsInViewport(this.horizontal ? contentWidth : contentHeight, this._itemSize);
        const numToleratedItems = this.d_numToleratedItems || (this.both ? [calculateNumToleratedItems(numItemsInViewport.rows), calculateNumToleratedItems(numItemsInViewport.cols)] : calculateNumToleratedItems(numItemsInViewport));
        return { numItemsInViewport, numToleratedItems };
    }
    calculateOptions() {
        const { numItemsInViewport, numToleratedItems } = this.calculateNumItems();
        const calculateLast = (_first, _num, _numT, _isCols = false) => this.getLast(_first + _num + (_first < _numT ? 2 : 3) * _numT, _isCols);
        const first = this.first;
        const last = this.both
            ? { rows: calculateLast(this.first.rows, numItemsInViewport.rows, numToleratedItems[0]), cols: calculateLast(this.first.cols, numItemsInViewport.cols, numToleratedItems[1], true) }
            : calculateLast(this.first, numItemsInViewport, numToleratedItems);
        this.last = last;
        this.numItemsInViewport = numItemsInViewport;
        this.d_numToleratedItems = numToleratedItems;
        if (this.showLoader) {
            this.loaderArr = this.both ? Array.from({ length: numItemsInViewport.rows }).map(() => Array.from({ length: numItemsInViewport.cols })) : Array.from({ length: numItemsInViewport });
        }
        if (this._lazy) {
            Promise.resolve().then(() => {
                this.lazyLoadState = {
                    first: this._step ? (this.both ? { rows: 0, cols: first.cols } : 0) : first,
                    last: Math.min(this._step ? this._step : this.last, this.items.length)
                };
                this.handleEvents('onLazyLoad', this.lazyLoadState);
            });
        }
    }
    calculateAutoSize() {
        if (this._autoSize && !this.d_loading) {
            Promise.resolve().then(() => {
                if (this.contentEl) {
                    this.contentEl.style.minHeight = this.contentEl.style.minWidth = 'auto';
                    this.contentEl.style.position = 'relative';
                    this.elementViewChild.nativeElement.style.contain = 'none';
                    const [contentWidth, contentHeight] = [DomHandler.getWidth(this.contentEl), DomHandler.getHeight(this.contentEl)];
                    contentWidth !== this.defaultContentWidth && (this.elementViewChild.nativeElement.style.width = '');
                    contentHeight !== this.defaultContentHeight && (this.elementViewChild.nativeElement.style.height = '');
                    const [width, height] = [DomHandler.getWidth(this.elementViewChild.nativeElement), DomHandler.getHeight(this.elementViewChild.nativeElement)];
                    (this.both || this.horizontal) && (this.elementViewChild.nativeElement.style.width = width < this.defaultWidth ? width + 'px' : this._scrollWidth || this.defaultWidth + 'px');
                    (this.both || this.vertical) && (this.elementViewChild.nativeElement.style.height = height < this.defaultHeight ? height + 'px' : this._scrollHeight || this.defaultHeight + 'px');
                    this.contentEl.style.minHeight = this.contentEl.style.minWidth = '';
                    this.contentEl.style.position = '';
                    this.elementViewChild.nativeElement.style.contain = '';
                }
            });
        }
    }
    getLast(last = 0, isCols = false) {
        return this._items ? Math.min(isCols ? (this._columns || this._items[0]).length : this._items.length, last) : 0;
    }
    getContentPosition() {
        if (this.contentEl) {
            const style = getComputedStyle(this.contentEl);
            const left = parseFloat(style.paddingLeft) + Math.max(parseFloat(style.left) || 0, 0);
            const right = parseFloat(style.paddingRight) + Math.max(parseFloat(style.right) || 0, 0);
            const top = parseFloat(style.paddingTop) + Math.max(parseFloat(style.top) || 0, 0);
            const bottom = parseFloat(style.paddingBottom) + Math.max(parseFloat(style.bottom) || 0, 0);
            return { left, right, top, bottom, x: left + right, y: top + bottom };
        }
        return { left: 0, right: 0, top: 0, bottom: 0, x: 0, y: 0 };
    }
    setSize() {
        if (this.elementViewChild?.nativeElement) {
            const parentElement = this.elementViewChild.nativeElement.parentElement.parentElement;
            const width = this._scrollWidth || `${this.elementViewChild.nativeElement.offsetWidth || parentElement.offsetWidth}px`;
            const height = this._scrollHeight || `${this.elementViewChild.nativeElement.offsetHeight || parentElement.offsetHeight}px`;
            const setProp = (_name, _value) => (this.elementViewChild.nativeElement.style[_name] = _value);
            if (this.both || this.horizontal) {
                setProp('height', height);
                setProp('width', width);
            }
            else {
                setProp('height', height);
            }
        }
    }
    setSpacerSize() {
        if (this._items) {
            const contentPos = this.getContentPosition();
            const setProp = (_name, _value, _size, _cpos = 0) => (this.spacerStyle = { ...this.spacerStyle, ...{ [`${_name}`]: (_value || []).length * _size + _cpos + 'px' } });
            if (this.both) {
                setProp('height', this._items, this._itemSize[0], contentPos.y);
                setProp('width', this._columns || this._items[1], this._itemSize[1], contentPos.x);
            }
            else {
                this.horizontal ? setProp('width', this._columns || this._items, this._itemSize, contentPos.x) : setProp('height', this._items, this._itemSize, contentPos.y);
            }
        }
    }
    setContentPosition(pos) {
        if (this.contentEl && !this._appendOnly) {
            const first = pos ? pos.first : this.first;
            const calculateTranslateVal = (_first, _size) => _first * _size;
            const setTransform = (_x = 0, _y = 0) => (this.contentStyle = { ...this.contentStyle, ...{ transform: `translate3d(${_x}px, ${_y}px, 0)` } });
            if (this.both) {
                setTransform(calculateTranslateVal(first.cols, this._itemSize[1]), calculateTranslateVal(first.rows, this._itemSize[0]));
            }
            else {
                const translateVal = calculateTranslateVal(first, this._itemSize);
                this.horizontal ? setTransform(translateVal, 0) : setTransform(0, translateVal);
            }
        }
    }
    onScrollPositionChange(event) {
        const target = event.target;
        const contentPos = this.getContentPosition();
        const calculateScrollPos = (_pos, _cpos) => (_pos ? (_pos > _cpos ? _pos - _cpos : _pos) : 0);
        const calculateCurrentIndex = (_pos, _size) => Math.floor(_pos / (_size || _pos));
        const calculateTriggerIndex = (_currentIndex, _first, _last, _num, _numT, _isScrollDownOrRight) => {
            return _currentIndex <= _numT ? _numT : _isScrollDownOrRight ? _last - _num - _numT : _first + _numT - 1;
        };
        const calculateFirst = (_currentIndex, _triggerIndex, _first, _last, _num, _numT, _isScrollDownOrRight) => {
            if (_currentIndex <= _numT)
                return 0;
            else
                return Math.max(0, _isScrollDownOrRight ? (_currentIndex < _triggerIndex ? _first : _currentIndex - _numT) : _currentIndex > _triggerIndex ? _first : _currentIndex - 2 * _numT);
        };
        const calculateLast = (_currentIndex, _first, _last, _num, _numT, _isCols = false) => {
            let lastValue = _first + _num + 2 * _numT;
            if (_currentIndex >= _numT) {
                lastValue += _numT + 1;
            }
            return this.getLast(lastValue, _isCols);
        };
        const scrollTop = calculateScrollPos(target.scrollTop, contentPos.top);
        const scrollLeft = calculateScrollPos(target.scrollLeft, contentPos.left);
        let newFirst = this.both ? { rows: 0, cols: 0 } : 0;
        let newLast = this.last;
        let isRangeChanged = false;
        let newScrollPos = this.lastScrollPos;
        if (this.both) {
            const isScrollDown = this.lastScrollPos.top <= scrollTop;
            const isScrollRight = this.lastScrollPos.left <= scrollLeft;
            if (!this._appendOnly || (this._appendOnly && (isScrollDown || isScrollRight))) {
                const currentIndex = { rows: calculateCurrentIndex(scrollTop, this._itemSize[0]), cols: calculateCurrentIndex(scrollLeft, this._itemSize[1]) };
                const triggerIndex = {
                    rows: calculateTriggerIndex(currentIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
                    cols: calculateTriggerIndex(currentIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
                };
                newFirst = {
                    rows: calculateFirst(currentIndex.rows, triggerIndex.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], isScrollDown),
                    cols: calculateFirst(currentIndex.cols, triggerIndex.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], isScrollRight)
                };
                newLast = {
                    rows: calculateLast(currentIndex.rows, newFirst.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0]),
                    cols: calculateLast(currentIndex.cols, newFirst.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], true)
                };
                isRangeChanged = newFirst.rows !== this.first.rows || newLast.rows !== this.last.rows || newFirst.cols !== this.first.cols || newLast.cols !== this.last.cols || this.isRangeChanged;
                newScrollPos = { top: scrollTop, left: scrollLeft };
            }
        }
        else {
            const scrollPos = this.horizontal ? scrollLeft : scrollTop;
            const isScrollDownOrRight = this.lastScrollPos <= scrollPos;
            if (!this._appendOnly || (this._appendOnly && isScrollDownOrRight)) {
                const currentIndex = calculateCurrentIndex(scrollPos, this._itemSize);
                const triggerIndex = calculateTriggerIndex(currentIndex, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
                newFirst = calculateFirst(currentIndex, triggerIndex, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, isScrollDownOrRight);
                newLast = calculateLast(currentIndex, newFirst, this.last, this.numItemsInViewport, this.d_numToleratedItems);
                isRangeChanged = newFirst !== this.first || newLast !== this.last || this.isRangeChanged;
                newScrollPos = scrollPos;
            }
        }
        return {
            first: newFirst,
            last: newLast,
            isRangeChanged,
            scrollPos: newScrollPos
        };
    }
    onScrollChange(event) {
        const { first, last, isRangeChanged, scrollPos } = this.onScrollPositionChange(event);
        if (isRangeChanged) {
            const newState = { first, last };
            this.setContentPosition(newState);
            this.first = first;
            this.last = last;
            this.lastScrollPos = scrollPos;
            this.handleEvents('onScrollIndexChange', newState);
            if (this._lazy && this.isPageChanged) {
                const lazyLoadState = {
                    first: this._step ? Math.min(this.getPageByFirst() * this._step, this.items.length - this._step) : first,
                    last: Math.min(this._step ? (this.getPageByFirst() + 1) * this._step : last, this.items.length)
                };
                const isLazyStateChanged = this.lazyLoadState.first !== lazyLoadState.first || this.lazyLoadState.last !== lazyLoadState.last;
                isLazyStateChanged && this.handleEvents('onLazyLoad', lazyLoadState);
                this.lazyLoadState = lazyLoadState;
            }
        }
    }
    onContainerScroll(event) {
        this.handleEvents('onScroll', { originalEvent: event });
        if (this._delay && this.isPageChanged) {
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }
            if (!this.d_loading && this.showLoader) {
                const { isRangeChanged } = this.onScrollPositionChange(event);
                const changed = isRangeChanged || (this._step ? this.isPageChanged : false);
                if (changed) {
                    this.d_loading = true;
                    this.cd.detectChanges();
                }
            }
            this.scrollTimeout = setTimeout(() => {
                this.onScrollChange(event);
                if (this.d_loading && this.showLoader && (!this._lazy || this._loading === undefined)) {
                    this.d_loading = false;
                    this.page = this.getPageByFirst();
                    this.cd.detectChanges();
                }
            }, this._delay);
        }
        else {
            !this.d_loading && this.onScrollChange(event);
        }
    }
    bindResizeListener() {
        if (!this.windowResizeListener) {
            this.zone.runOutsideAngular(() => {
                this.windowResizeListener = this.onWindowResize.bind(this);
                window.addEventListener('resize', this.windowResizeListener);
                window.addEventListener('orientationchange', this.windowResizeListener);
            });
        }
    }
    unbindResizeListener() {
        if (this.windowResizeListener) {
            window.removeEventListener('resize', this.windowResizeListener);
            window.removeEventListener('orientationchange', this.windowResizeListener);
            this.windowResizeListener = null;
        }
    }
    onWindowResize() {
        if (this.resizeTimeout) {
            clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout(() => {
            if (DomHandler.isVisible(this.elementViewChild?.nativeElement)) {
                const [width, height] = [DomHandler.getWidth(this.elementViewChild.nativeElement), DomHandler.getHeight(this.elementViewChild.nativeElement)];
                const [isDiffWidth, isDiffHeight] = [width !== this.defaultWidth, height !== this.defaultHeight];
                const reinit = this.both ? isDiffWidth || isDiffHeight : this.horizontal ? isDiffWidth : this.vertical ? isDiffHeight : false;
                reinit &&
                    this.zone.run(() => {
                        this.d_numToleratedItems = this._numToleratedItems;
                        this.defaultWidth = width;
                        this.defaultHeight = height;
                        this.defaultContentWidth = DomHandler.getWidth(this.contentEl);
                        this.defaultContentHeight = DomHandler.getHeight(this.contentEl);
                        this.init();
                    });
            }
        }, this._resizeDelay);
    }
    handleEvents(name, params) {
        return this.options && this.options[name] ? this.options[name](params) : this[name].emit(params);
    }
    getContentOptions() {
        return {
            contentStyleClass: `p-scroller-content ${this.d_loading ? 'p-scroller-loading' : ''}`,
            items: this.loadedItems,
            getItemOptions: (index) => this.getOptions(index),
            loading: this.d_loading,
            getLoaderOptions: (index, options) => this.getLoaderOptions(index, options),
            itemSize: this._itemSize,
            rows: this.loadedRows,
            columns: this.loadedColumns,
            spacerStyle: this.spacerStyle,
            contentStyle: this.contentStyle,
            vertical: this.vertical,
            horizontal: this.horizontal,
            both: this.both
        };
    }
    getOptions(renderedIndex) {
        const count = (this._items || []).length;
        const index = this.both ? this.first.rows + renderedIndex : this.first + renderedIndex;
        return {
            index,
            count,
            first: index === 0,
            last: index === count - 1,
            even: index % 2 === 0,
            odd: index % 2 !== 0
        };
    }
    getLoaderOptions(index, extOptions) {
        const count = this.loaderArr.length;
        return {
            index,
            count,
            first: index === 0,
            last: index === count - 1,
            even: index % 2 === 0,
            odd: index % 2 !== 0,
            ...extOptions
        };
    }
}
Scroller.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: Scroller, deps: [{ token: i0.ChangeDetectorRef }, { token: i0.NgZone }], target: i0.ɵɵFactoryTarget.Component });
Scroller.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "15.1.0", type: Scroller, selector: "p-scroller", inputs: { id: "id", style: "style", styleClass: "styleClass", tabindex: "tabindex", items: "items", itemSize: "itemSize", scrollHeight: "scrollHeight", scrollWidth: "scrollWidth", orientation: "orientation", step: "step", delay: "delay", resizeDelay: "resizeDelay", appendOnly: "appendOnly", inline: "inline", lazy: "lazy", disabled: "disabled", loaderDisabled: "loaderDisabled", columns: "columns", showSpacer: "showSpacer", showLoader: "showLoader", numToleratedItems: "numToleratedItems", loading: "loading", autoSize: "autoSize", trackBy: "trackBy", options: "options" }, outputs: { onLazyLoad: "onLazyLoad", onScroll: "onScroll", onScrollIndexChange: "onScrollIndexChange" }, host: { classAttribute: "p-scroller-viewport p-element" }, queries: [{ propertyName: "templates", predicate: PrimeTemplate }], viewQueries: [{ propertyName: "elementViewChild", first: true, predicate: ["element"], descendants: true }, { propertyName: "contentViewChild", first: true, predicate: ["content"], descendants: true }], usesOnChanges: true, ngImport: i0, template: `
        <ng-container *ngIf="!_disabled; else disabledContainer">
            <div
                #element
                [attr.id]="_id"
                [attr.tabindex]="tabindex"
                [ngStyle]="_style"
                [class]="_styleClass"
                [ngClass]="{ 'p-scroller': true, 'p-scroller-inline': inline, 'p-both-scroll': both, 'p-horizontal-scroll': horizontal }"
                (scroll)="onContainerScroll($event)"
            >
                <ng-container *ngIf="contentTemplate; else buildInContent">
                    <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: loadedItems, options: getContentOptions() }"></ng-container>
                </ng-container>
                <ng-template #buildInContent>
                    <div #content class="p-scroller-content" [ngClass]="{ 'p-scroller-loading': d_loading }" [ngStyle]="contentStyle">
                        <ng-container *ngFor="let item of loadedItems; let index = index; trackBy: _trackBy || index">
                            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, options: getOptions(index) }"></ng-container>
                        </ng-container>
                    </div>
                </ng-template>
                <div *ngIf="_showSpacer" class="p-scroller-spacer" [ngStyle]="spacerStyle"></div>
                <div *ngIf="!loaderDisabled && _showLoader && d_loading" class="p-scroller-loader" [ngClass]="{ 'p-component-overlay': !loaderTemplate }">
                    <ng-container *ngIf="loaderTemplate; else buildInLoader">
                        <ng-container *ngFor="let item of loaderArr; let index = index">
                            <ng-container *ngTemplateOutlet="loaderTemplate; context: { options: getLoaderOptions(index, both && { numCols: _numItemsInViewport.cols }) }"></ng-container>
                        </ng-container>
                    </ng-container>
                    <ng-template #buildInLoader>
                        <ng-container *ngIf="loaderIconTemplate; else buildInLoaderIcon">
                            <ng-container *ngTemplateOutlet="loaderIconTemplate; context: { options: { styleClass: 'p-scroller-loading-icon' } }"></ng-container>
                        </ng-container>
                        <ng-template #buildInLoaderIcon>
                            <i class="p-scroller-loading-icon pi pi-spinner pi-spin"></i>
                        </ng-template>
                    </ng-template>
                </div>
            </div>
        </ng-container>
        <ng-template #disabledContainer>
            <ng-content></ng-content>
            <ng-container *ngIf="contentTemplate">
                <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: items, options: { rows: _items, columns: loadedColumns } }"></ng-container>
            </ng-container>
        </ng-template>
    `, isInline: true, styles: ["p-scroller{flex:1;outline:0 none}.p-scroller{position:relative;overflow:auto;contain:strict;transform:translateZ(0);will-change:scroll-position;outline:0 none}.p-scroller-content{position:absolute;top:0;left:0;min-height:100%;min-width:100%;will-change:transform}.p-scroller-spacer{position:absolute;top:0;left:0;height:1px;width:1px;transform-origin:0 0;pointer-events:none}.p-scroller-loader{position:sticky;top:0;left:0;width:100%;height:100%}.p-scroller-loader.p-component-overlay{display:flex;align-items:center;justify-content:center}.p-scroller-loading-icon{font-size:2rem}.p-scroller-inline .p-scroller-content{position:static}\n"], dependencies: [{ kind: "directive", type: i1.NgClass, selector: "[ngClass]", inputs: ["class", "ngClass"] }, { kind: "directive", type: i1.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }, { kind: "directive", type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { kind: "directive", type: i1.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet", "ngTemplateOutletInjector"] }, { kind: "directive", type: i1.NgStyle, selector: "[ngStyle]", inputs: ["ngStyle"] }], changeDetection: i0.ChangeDetectionStrategy.Default, encapsulation: i0.ViewEncapsulation.None });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: Scroller, decorators: [{
            type: Component,
            args: [{ selector: 'p-scroller', template: `
        <ng-container *ngIf="!_disabled; else disabledContainer">
            <div
                #element
                [attr.id]="_id"
                [attr.tabindex]="tabindex"
                [ngStyle]="_style"
                [class]="_styleClass"
                [ngClass]="{ 'p-scroller': true, 'p-scroller-inline': inline, 'p-both-scroll': both, 'p-horizontal-scroll': horizontal }"
                (scroll)="onContainerScroll($event)"
            >
                <ng-container *ngIf="contentTemplate; else buildInContent">
                    <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: loadedItems, options: getContentOptions() }"></ng-container>
                </ng-container>
                <ng-template #buildInContent>
                    <div #content class="p-scroller-content" [ngClass]="{ 'p-scroller-loading': d_loading }" [ngStyle]="contentStyle">
                        <ng-container *ngFor="let item of loadedItems; let index = index; trackBy: _trackBy || index">
                            <ng-container *ngTemplateOutlet="itemTemplate; context: { $implicit: item, options: getOptions(index) }"></ng-container>
                        </ng-container>
                    </div>
                </ng-template>
                <div *ngIf="_showSpacer" class="p-scroller-spacer" [ngStyle]="spacerStyle"></div>
                <div *ngIf="!loaderDisabled && _showLoader && d_loading" class="p-scroller-loader" [ngClass]="{ 'p-component-overlay': !loaderTemplate }">
                    <ng-container *ngIf="loaderTemplate; else buildInLoader">
                        <ng-container *ngFor="let item of loaderArr; let index = index">
                            <ng-container *ngTemplateOutlet="loaderTemplate; context: { options: getLoaderOptions(index, both && { numCols: _numItemsInViewport.cols }) }"></ng-container>
                        </ng-container>
                    </ng-container>
                    <ng-template #buildInLoader>
                        <ng-container *ngIf="loaderIconTemplate; else buildInLoaderIcon">
                            <ng-container *ngTemplateOutlet="loaderIconTemplate; context: { options: { styleClass: 'p-scroller-loading-icon' } }"></ng-container>
                        </ng-container>
                        <ng-template #buildInLoaderIcon>
                            <i class="p-scroller-loading-icon pi pi-spinner pi-spin"></i>
                        </ng-template>
                    </ng-template>
                </div>
            </div>
        </ng-container>
        <ng-template #disabledContainer>
            <ng-content></ng-content>
            <ng-container *ngIf="contentTemplate">
                <ng-container *ngTemplateOutlet="contentTemplate; context: { $implicit: items, options: { rows: _items, columns: loadedColumns } }"></ng-container>
            </ng-container>
        </ng-template>
    `, changeDetection: ChangeDetectionStrategy.Default, encapsulation: ViewEncapsulation.None, host: {
                        class: 'p-scroller-viewport p-element'
                    }, styles: ["p-scroller{flex:1;outline:0 none}.p-scroller{position:relative;overflow:auto;contain:strict;transform:translateZ(0);will-change:scroll-position;outline:0 none}.p-scroller-content{position:absolute;top:0;left:0;min-height:100%;min-width:100%;will-change:transform}.p-scroller-spacer{position:absolute;top:0;left:0;height:1px;width:1px;transform-origin:0 0;pointer-events:none}.p-scroller-loader{position:sticky;top:0;left:0;width:100%;height:100%}.p-scroller-loader.p-component-overlay{display:flex;align-items:center;justify-content:center}.p-scroller-loading-icon{font-size:2rem}.p-scroller-inline .p-scroller-content{position:static}\n"] }]
        }], ctorParameters: function () { return [{ type: i0.ChangeDetectorRef }, { type: i0.NgZone }]; }, propDecorators: { id: [{
                type: Input
            }], style: [{
                type: Input
            }], styleClass: [{
                type: Input
            }], tabindex: [{
                type: Input
            }], items: [{
                type: Input
            }], itemSize: [{
                type: Input
            }], scrollHeight: [{
                type: Input
            }], scrollWidth: [{
                type: Input
            }], orientation: [{
                type: Input
            }], step: [{
                type: Input
            }], delay: [{
                type: Input
            }], resizeDelay: [{
                type: Input
            }], appendOnly: [{
                type: Input
            }], inline: [{
                type: Input
            }], lazy: [{
                type: Input
            }], disabled: [{
                type: Input
            }], loaderDisabled: [{
                type: Input
            }], columns: [{
                type: Input
            }], showSpacer: [{
                type: Input
            }], showLoader: [{
                type: Input
            }], numToleratedItems: [{
                type: Input
            }], loading: [{
                type: Input
            }], autoSize: [{
                type: Input
            }], trackBy: [{
                type: Input
            }], options: [{
                type: Input
            }], elementViewChild: [{
                type: ViewChild,
                args: ['element']
            }], contentViewChild: [{
                type: ViewChild,
                args: ['content']
            }], templates: [{
                type: ContentChildren,
                args: [PrimeTemplate]
            }], onLazyLoad: [{
                type: Output
            }], onScroll: [{
                type: Output
            }], onScrollIndexChange: [{
                type: Output
            }] } });
export class ScrollerModule {
}
ScrollerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: ScrollerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
ScrollerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "15.1.0", ngImport: i0, type: ScrollerModule, declarations: [Scroller], imports: [CommonModule], exports: [Scroller] });
ScrollerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: ScrollerModule, imports: [CommonModule] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "15.1.0", ngImport: i0, type: ScrollerModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    exports: [Scroller],
                    declarations: [Scroller]
                }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nyb2xsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvYXBwL2NvbXBvbmVudHMvc2Nyb2xsZXIvc2Nyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFHSCx1QkFBdUIsRUFFdkIsU0FBUyxFQUNULGVBQWUsRUFFZixZQUFZLEVBQ1osS0FBSyxFQUNMLFFBQVEsRUFJUixNQUFNLEVBSU4sU0FBUyxFQUNULGlCQUFpQixFQUNwQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzVDLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxhQUFhLENBQUM7OztBQTJGekMsTUFBTSxPQUFPLFFBQVE7SUEwVWpCLFlBQW9CLEVBQXFCLEVBQVUsSUFBWTtRQUEzQyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUFVLFNBQUksR0FBSixJQUFJLENBQVE7UUFoSnJELGVBQVUsR0FBc0IsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVuRCxhQUFRLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFFakQsd0JBQW1CLEdBQXNCLElBQUksWUFBWSxFQUFFLENBQUM7UUFRdEUsY0FBUyxHQUFXLENBQUMsQ0FBQztRQUl0QixjQUFTLEdBQVEsQ0FBQyxDQUFDO1FBTW5CLGlCQUFZLEdBQVcsVUFBVSxDQUFDO1FBRWxDLFVBQUssR0FBVyxDQUFDLENBQUM7UUFFbEIsV0FBTSxHQUFXLENBQUMsQ0FBQztRQUVuQixpQkFBWSxHQUFXLEVBQUUsQ0FBQztRQUUxQixnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUU3QixZQUFPLEdBQVksS0FBSyxDQUFDO1FBRXpCLFVBQUssR0FBWSxLQUFLLENBQUM7UUFFdkIsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUUzQixvQkFBZSxHQUFZLEtBQUssQ0FBQztRQUlq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LEVBQUUsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztvQkFDbEgsWUFBWSxLQUFLLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQztvQkFDcEcsYUFBYSxLQUFLLElBQUksQ0FBQyxvQkFBb0IsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUMsQ0FBQztvQkFFdkcsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7b0JBQzlJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsQ0FBQztvQkFDL0ssQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFB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b2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgICBBZnRlckNvbnRlbnRJbml0LFxuICAgIEFmdGVyVmlld0NoZWNrZWQsXG4gICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gICAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgQ29tcG9uZW50LFxuICAgIENvbnRlbnRDaGlsZHJlbixcbiAgICBFbGVtZW50UmVmLFxuICAgIEV2ZW50RW1pdHRlcixcbiAgICBJbnB1dCxcbiAgICBOZ01vZHVsZSxcbiAgICBOZ1pvbmUsXG4gICAgT25EZXN0cm95LFxuICAgIE9uSW5pdCxcbiAgICBPdXRwdXQsXG4gICAgUXVlcnlMaXN0LFxuICAgIFNpbXBsZUNoYW5nZXMsXG4gICAgVGVtcGxhdGVSZWYsXG4gICAgVmlld0NoaWxkLFxuICAgIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUHJpbWVUZW1wbGF0ZSB9IGZyb20gJ3ByaW1lbmcvYXBpJztcbmltcG9ydCB7IERvbUhhbmRsZXIgfSBmcm9tICdwcmltZW5nL2RvbSc7XG5cbmV4cG9ydCB0eXBlIFNjcm9sbGVyVG9UeXBlID0gJ3RvLXN0YXJ0JyB8ICd0by1lbmQnIHwgdW5kZWZpbmVkO1xuXG5leHBvcnQgdHlwZSBTY3JvbGxlck9yaWVudGF0aW9uVHlwZSA9ICd2ZXJ0aWNhbCcgfCAnaG9yaXpvbnRhbCcgfCAnYm90aCc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgU2Nyb2xsZXJPcHRpb25zIHtcbiAgICBpZD86IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBzdHlsZT86IGFueTtcbiAgICBzdHlsZUNsYXNzPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIHRhYmluZGV4PzogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICAgIGl0ZW1zPzogYW55W107XG4gICAgaXRlbVNpemU/OiBhbnk7XG4gICAgc2Nyb2xsSGVpZ2h0Pzogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIHNjcm9sbFdpZHRoPzogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIG9yaWVudGF0aW9uPzogU2Nyb2xsZXJPcmllbnRhdGlvblR5cGU7XG4gICAgc3RlcD86IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgICBkZWxheT86IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgICByZXNpemVEZWxheT86IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgICBhcHBlbmRPbmx5PzogYm9vbGVhbjtcbiAgICBpbmxpbmU/OiBib29sZWFuO1xuICAgIGxhenk/OiBib29sZWFuO1xuICAgIGRpc2FibGVkPzogYm9vbGVhbjtcbiAgICBsb2FkZXJEaXNhYmxlZD86IGJvb2xlYW47XG4gICAgY29sdW1ucz86IGFueVtdIHwgdW5kZWZpbmVkO1xuICAgIHNob3dTcGFjZXI/OiBib29sZWFuO1xuICAgIHNob3dMb2FkZXI/OiBib29sZWFuO1xuICAgIG51bVRvbGVyYXRlZEl0ZW1zPzogYW55O1xuICAgIGxvYWRpbmc/OiBib29sZWFuO1xuICAgIGF1dG9TaXplPzogYm9vbGVhbjtcbiAgICB0cmFja0J5PzogYW55O1xuICAgIG9uTGF6eUxvYWQ/OiBGdW5jdGlvbiB8IHVuZGVmaW5lZDtcbiAgICBvblNjcm9sbD86IEZ1bmN0aW9uIHwgdW5kZWZpbmVkO1xuICAgIG9uU2Nyb2xsSW5kZXhDaGFuZ2U/OiBGdW5jdGlvbiB8IHVuZGVmaW5lZDtcbn1cblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6ICdwLXNjcm9sbGVyJyxcbiAgICB0ZW1wbGF0ZTogYFxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIV9kaXNhYmxlZDsgZWxzZSBkaXNhYmxlZENvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdlxuICAgICAgICAgICAgICAgICNlbGVtZW50XG4gICAgICAgICAgICAgICAgW2F0dHIuaWRdPVwiX2lkXCJcbiAgICAgICAgICAgICAgICBbYXR0ci50YWJpbmRleF09XCJ0YWJpbmRleFwiXG4gICAgICAgICAgICAgICAgW25nU3R5bGVdPVwiX3N0eWxlXCJcbiAgICAgICAgICAgICAgICBbY2xhc3NdPVwiX3N0eWxlQ2xhc3NcIlxuICAgICAgICAgICAgICAgIFtuZ0NsYXNzXT1cInsgJ3Atc2Nyb2xsZXInOiB0cnVlLCAncC1zY3JvbGxlci1pbmxpbmUnOiBpbmxpbmUsICdwLWJvdGgtc2Nyb2xsJzogYm90aCwgJ3AtaG9yaXpvbnRhbC1zY3JvbGwnOiBob3Jpem9udGFsIH1cIlxuICAgICAgICAgICAgICAgIChzY3JvbGwpPVwib25Db250YWluZXJTY3JvbGwoJGV2ZW50KVwiXG4gICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImNvbnRlbnRUZW1wbGF0ZTsgZWxzZSBidWlsZEluQ29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwiY29udGVudFRlbXBsYXRlOyBjb250ZXh0OiB7ICRpbXBsaWNpdDogbG9hZGVkSXRlbXMsIG9wdGlvbnM6IGdldENvbnRlbnRPcHRpb25zKCkgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjYnVpbGRJbkNvbnRlbnQ+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgI2NvbnRlbnQgY2xhc3M9XCJwLXNjcm9sbGVyLWNvbnRlbnRcIiBbbmdDbGFzc109XCJ7ICdwLXNjcm9sbGVyLWxvYWRpbmcnOiBkX2xvYWRpbmcgfVwiIFtuZ1N0eWxlXT1cImNvbnRlbnRTdHlsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgaXRlbSBvZiBsb2FkZWRJdGVtczsgbGV0IGluZGV4ID0gaW5kZXg7IHRyYWNrQnk6IF90cmFja0J5IHx8IGluZGV4XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cIml0ZW1UZW1wbGF0ZTsgY29udGV4dDogeyAkaW1wbGljaXQ6IGl0ZW0sIG9wdGlvbnM6IGdldE9wdGlvbnMoaW5kZXgpIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDxkaXYgKm5nSWY9XCJfc2hvd1NwYWNlclwiIGNsYXNzPVwicC1zY3JvbGxlci1zcGFjZXJcIiBbbmdTdHlsZV09XCJzcGFjZXJTdHlsZVwiPjwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgKm5nSWY9XCIhbG9hZGVyRGlzYWJsZWQgJiYgX3Nob3dMb2FkZXIgJiYgZF9sb2FkaW5nXCIgY2xhc3M9XCJwLXNjcm9sbGVyLWxvYWRlclwiIFtuZ0NsYXNzXT1cInsgJ3AtY29tcG9uZW50LW92ZXJsYXknOiAhbG9hZGVyVGVtcGxhdGUgfVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwibG9hZGVyVGVtcGxhdGU7IGVsc2UgYnVpbGRJbkxvYWRlclwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgaXRlbSBvZiBsb2FkZXJBcnI7IGxldCBpbmRleCA9IGluZGV4XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImxvYWRlclRlbXBsYXRlOyBjb250ZXh0OiB7IG9wdGlvbnM6IGdldExvYWRlck9wdGlvbnMoaW5kZXgsIGJvdGggJiYgeyBudW1Db2xzOiBfbnVtSXRlbXNJblZpZXdwb3J0LmNvbHMgfSkgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2J1aWxkSW5Mb2FkZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwibG9hZGVySWNvblRlbXBsYXRlOyBlbHNlIGJ1aWxkSW5Mb2FkZXJJY29uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImxvYWRlckljb25UZW1wbGF0ZTsgY29udGV4dDogeyBvcHRpb25zOiB7IHN0eWxlQ2xhc3M6ICdwLXNjcm9sbGVyLWxvYWRpbmctaWNvbicgfSB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjYnVpbGRJbkxvYWRlckljb24+XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3M9XCJwLXNjcm9sbGVyLWxvYWRpbmctaWNvbiBwaSBwaS1zcGlubmVyIHBpLXNwaW5cIj48L2k+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8bmctdGVtcGxhdGUgI2Rpc2FibGVkQ29udGFpbmVyPlxuICAgICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImNvbnRlbnRUZW1wbGF0ZVwiPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJjb250ZW50VGVtcGxhdGU7IGNvbnRleHQ6IHsgJGltcGxpY2l0OiBpdGVtcywgb3B0aW9uczogeyByb3dzOiBfaXRlbXMsIGNvbHVtbnM6IGxvYWRlZENvbHVtbnMgfSB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICBgLFxuICAgIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdCxcbiAgICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICAgIHN0eWxlVXJsczogWycuL3Njcm9sbGVyLmNzcyddLFxuICAgIGhvc3Q6IHtcbiAgICAgICAgY2xhc3M6ICdwLXNjcm9sbGVyLXZpZXdwb3J0IHAtZWxlbWVudCdcbiAgICB9XG59KVxuZXhwb3J0IGNsYXNzIFNjcm9sbGVyIGltcGxlbWVudHMgT25Jbml0LCBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdDaGVja2VkLCBPbkRlc3Ryb3kge1xuICAgIEBJbnB1dCgpIGdldCBpZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lkO1xuICAgIH1cbiAgICBzZXQgaWQodmFsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5faWQgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHN0eWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3R5bGU7XG4gICAgfVxuICAgIHNldCBzdHlsZSh2YWw6IGFueSkge1xuICAgICAgICB0aGlzLl9zdHlsZSA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgc3R5bGVDbGFzcygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3N0eWxlQ2xhc3M7XG4gICAgfVxuICAgIHNldCBzdHlsZUNsYXNzKHZhbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX3N0eWxlQ2xhc3MgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHRhYmluZGV4KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGFiaW5kZXg7XG4gICAgfVxuICAgIHNldCB0YWJpbmRleCh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl90YWJpbmRleCA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgaXRlbXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pdGVtcztcbiAgICB9XG4gICAgc2V0IGl0ZW1zKHZhbDogYW55W10pIHtcbiAgICAgICAgdGhpcy5faXRlbXMgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGl0ZW1TaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5faXRlbVNpemU7XG4gICAgfVxuICAgIHNldCBpdGVtU2l6ZSh2YWw6IGFueSkge1xuICAgICAgICB0aGlzLl9pdGVtU2l6ZSA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgc2Nyb2xsSGVpZ2h0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2Nyb2xsSGVpZ2h0O1xuICAgIH1cbiAgICBzZXQgc2Nyb2xsSGVpZ2h0KHZhbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX3Njcm9sbEhlaWdodCA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgc2Nyb2xsV2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY3JvbGxXaWR0aDtcbiAgICB9XG4gICAgc2V0IHNjcm9sbFdpZHRoKHZhbDogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuX3Njcm9sbFdpZHRoID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBvcmllbnRhdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29yaWVudGF0aW9uO1xuICAgIH1cbiAgICBzZXQgb3JpZW50YXRpb24odmFsOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5fb3JpZW50YXRpb24gPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHN0ZXAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGVwO1xuICAgIH1cbiAgICBzZXQgc3RlcCh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9zdGVwID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBkZWxheSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RlbGF5O1xuICAgIH1cbiAgICBzZXQgZGVsYXkodmFsOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fZGVsYXkgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHJlc2l6ZURlbGF5KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fcmVzaXplRGVsYXk7XG4gICAgfVxuICAgIHNldCByZXNpemVEZWxheSh2YWw6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9yZXNpemVEZWxheSA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgYXBwZW5kT25seSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2FwcGVuZE9ubHk7XG4gICAgfVxuICAgIHNldCBhcHBlbmRPbmx5KHZhbDogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9hcHBlbmRPbmx5ID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBpbmxpbmUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbmxpbmU7XG4gICAgfVxuICAgIHNldCBpbmxpbmUodmFsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2lubGluZSA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgbGF6eSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xhenk7XG4gICAgfVxuICAgIHNldCBsYXp5KHZhbDogYm9vbGVhbikge1xuICAgICAgICB0aGlzLl9sYXp5ID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBkaXNhYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Rpc2FibGVkO1xuICAgIH1cbiAgICBzZXQgZGlzYWJsZWQodmFsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2Rpc2FibGVkID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBsb2FkZXJEaXNhYmxlZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2xvYWRlckRpc2FibGVkO1xuICAgIH1cbiAgICBzZXQgbG9hZGVyRGlzYWJsZWQodmFsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2xvYWRlckRpc2FibGVkID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBjb2x1bW5zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fY29sdW1ucztcbiAgICB9XG4gICAgc2V0IGNvbHVtbnModmFsOiBhbnlbXSkge1xuICAgICAgICB0aGlzLl9jb2x1bW5zID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBzaG93U3BhY2VyKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hvd1NwYWNlcjtcbiAgICB9XG4gICAgc2V0IHNob3dTcGFjZXIodmFsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX3Nob3dTcGFjZXIgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHNob3dMb2FkZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaG93TG9hZGVyO1xuICAgIH1cbiAgICBzZXQgc2hvd0xvYWRlcih2YWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fc2hvd0xvYWRlciA9IHZhbDtcbiAgICB9XG5cbiAgICBASW5wdXQoKSBnZXQgbnVtVG9sZXJhdGVkSXRlbXMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9udW1Ub2xlcmF0ZWRJdGVtcztcbiAgICB9XG4gICAgc2V0IG51bVRvbGVyYXRlZEl0ZW1zKHZhbDogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX251bVRvbGVyYXRlZEl0ZW1zID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBsb2FkaW5nKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbG9hZGluZztcbiAgICB9XG4gICAgc2V0IGxvYWRpbmcodmFsOiBib29sZWFuKSB7XG4gICAgICAgIHRoaXMuX2xvYWRpbmcgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IGF1dG9TaXplKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYXV0b1NpemU7XG4gICAgfVxuICAgIHNldCBhdXRvU2l6ZSh2YWw6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5fYXV0b1NpemUgPSB2YWw7XG4gICAgfVxuXG4gICAgQElucHV0KCkgZ2V0IHRyYWNrQnkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl90cmFja0J5O1xuICAgIH1cbiAgICBzZXQgdHJhY2tCeSh2YWw6IGFueSkge1xuICAgICAgICB0aGlzLl90cmFja0J5ID0gdmFsO1xuICAgIH1cblxuICAgIEBJbnB1dCgpIGdldCBvcHRpb25zKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3B0aW9ucztcbiAgICB9XG4gICAgc2V0IG9wdGlvbnModmFsOiBTY3JvbGxlck9wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IHZhbDtcblxuICAgICAgICBpZiAodmFsICYmIHR5cGVvZiB2YWwgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBPYmplY3QuZW50cmllcyh2YWwpLmZvckVhY2goKFtrLCB2XSkgPT4gdGhpc1tgXyR7a31gXSAhPT0gdiAmJiAodGhpc1tgXyR7a31gXSA9IHYpKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIEBWaWV3Q2hpbGQoJ2VsZW1lbnQnKSBlbGVtZW50Vmlld0NoaWxkOiBFbGVtZW50UmVmO1xuXG4gICAgQFZpZXdDaGlsZCgnY29udGVudCcpIGNvbnRlbnRWaWV3Q2hpbGQ6IEVsZW1lbnRSZWY7XG5cbiAgICBAQ29udGVudENoaWxkcmVuKFByaW1lVGVtcGxhdGUpIHRlbXBsYXRlczogUXVlcnlMaXN0PGFueT47XG5cbiAgICBAT3V0cHV0KCkgb25MYXp5TG9hZDogRXZlbnRFbWl0dGVyPGFueT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBAT3V0cHV0KCkgb25TY3JvbGw6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgQE91dHB1dCgpIG9uU2Nyb2xsSW5kZXhDaGFuZ2U6IEV2ZW50RW1pdHRlcjxhbnk+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuXG4gICAgX2lkOiBzdHJpbmc7XG5cbiAgICBfc3R5bGU6IGFueTtcblxuICAgIF9zdHlsZUNsYXNzOiBzdHJpbmc7XG5cbiAgICBfdGFiaW5kZXg6IG51bWJlciA9IDA7XG5cbiAgICBfaXRlbXM6IGFueVtdO1xuXG4gICAgX2l0ZW1TaXplOiBhbnkgPSAwO1xuXG4gICAgX3Njcm9sbEhlaWdodDogc3RyaW5nO1xuXG4gICAgX3Njcm9sbFdpZHRoOiBzdHJpbmc7XG5cbiAgICBfb3JpZW50YXRpb246IHN0cmluZyA9ICd2ZXJ0aWNhbCc7XG5cbiAgICBfc3RlcDogbnVtYmVyID0gMDtcblxuICAgIF9kZWxheTogbnVtYmVyID0gMDtcblxuICAgIF9yZXNpemVEZWxheTogbnVtYmVyID0gMTA7XG5cbiAgICBfYXBwZW5kT25seTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgX2lubGluZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgX2xhenk6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIF9kaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgX2xvYWRlckRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG5cbiAgICBfY29sdW1uczogYW55W107XG5cbiAgICBfc2hvd1NwYWNlcjogYm9vbGVhbiA9IHRydWU7XG5cbiAgICBfc2hvd0xvYWRlcjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgX251bVRvbGVyYXRlZEl0ZW1zOiBhbnk7XG5cbiAgICBfbG9hZGluZzogYm9vbGVhbjtcblxuICAgIF9hdXRvU2l6ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgX3RyYWNrQnk6IGFueTtcblxuICAgIF9vcHRpb25zOiBTY3JvbGxlck9wdGlvbnM7XG5cbiAgICBkX2xvYWRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIGRfbnVtVG9sZXJhdGVkSXRlbXM6IGFueTtcblxuICAgIGNvbnRlbnRFbDogYW55O1xuXG4gICAgY29udGVudFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgaXRlbVRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxhbnk+O1xuXG4gICAgbG9hZGVyVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBsb2FkZXJJY29uVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XG5cbiAgICBmaXJzdDogYW55ID0gMDtcblxuICAgIGxhc3Q6IGFueSA9IDA7XG5cbiAgICBwYWdlOiBudW1iZXIgPSAwO1xuXG4gICAgaXNSYW5nZUNoYW5nZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAgIG51bUl0ZW1zSW5WaWV3cG9ydDogYW55ID0gMDtcblxuICAgIGxhc3RTY3JvbGxQb3M6IGFueSA9IDA7XG5cbiAgICBsYXp5TG9hZFN0YXRlOiBhbnkgPSB7fTtcblxuICAgIGxvYWRlckFycjogYW55W10gPSBbXTtcblxuICAgIHNwYWNlclN0eWxlOiBhbnkgPSB7fTtcblxuICAgIGNvbnRlbnRTdHlsZTogYW55ID0ge307XG5cbiAgICBzY3JvbGxUaW1lb3V0OiBhbnk7XG5cbiAgICByZXNpemVUaW1lb3V0OiBhbnk7XG5cbiAgICBpbml0aWFsaXplZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgd2luZG93UmVzaXplTGlzdGVuZXI6IGFueTtcblxuICAgIGRlZmF1bHRXaWR0aDogbnVtYmVyO1xuXG4gICAgZGVmYXVsdEhlaWdodDogbnVtYmVyO1xuXG4gICAgZGVmYXVsdENvbnRlbnRXaWR0aDogbnVtYmVyO1xuXG4gICAgZGVmYXVsdENvbnRlbnRIZWlnaHQ6IG51bWJlcjtcblxuICAgIGdldCB2ZXJ0aWNhbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29yaWVudGF0aW9uID09PSAndmVydGljYWwnO1xuICAgIH1cblxuICAgIGdldCBob3Jpem9udGFsKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fb3JpZW50YXRpb24gPT09ICdob3Jpem9udGFsJztcbiAgICB9XG5cbiAgICBnZXQgYm90aCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX29yaWVudGF0aW9uID09PSAnYm90aCc7XG4gICAgfVxuXG4gICAgZ2V0IGxvYWRlZEl0ZW1zKCkge1xuICAgICAgICBpZiAodGhpcy5faXRlbXMgJiYgIXRoaXMuZF9sb2FkaW5nKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5ib3RoKSByZXR1cm4gdGhpcy5faXRlbXMuc2xpY2UodGhpcy5fYXBwZW5kT25seSA/IDAgOiB0aGlzLmZpcnN0LnJvd3MsIHRoaXMubGFzdC5yb3dzKS5tYXAoKGl0ZW0pID0+ICh0aGlzLl9jb2x1bW5zID8gaXRlbSA6IGl0ZW0uc2xpY2UodGhpcy5fYXBwZW5kT25seSA/IDAgOiB0aGlzLmZpcnN0LmNvbHMsIHRoaXMubGFzdC5jb2xzKSkpO1xuICAgICAgICAgICAgZWxzZSBpZiAodGhpcy5ob3Jpem9udGFsICYmIHRoaXMuX2NvbHVtbnMpIHJldHVybiB0aGlzLl9pdGVtcztcbiAgICAgICAgICAgIGVsc2UgcmV0dXJuIHRoaXMuX2l0ZW1zLnNsaWNlKHRoaXMuX2FwcGVuZE9ubHkgPyAwIDogdGhpcy5maXJzdCwgdGhpcy5sYXN0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBnZXQgbG9hZGVkUm93cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZF9sb2FkaW5nID8gKHRoaXMuX2xvYWRlckRpc2FibGVkID8gdGhpcy5sb2FkZXJBcnIgOiBbXSkgOiB0aGlzLmxvYWRlZEl0ZW1zO1xuICAgIH1cblxuICAgIGdldCBsb2FkZWRDb2x1bW5zKCkge1xuICAgICAgICBpZiAodGhpcy5fY29sdW1ucyAmJiAodGhpcy5ib3RoIHx8IHRoaXMuaG9yaXpvbnRhbCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRfbG9hZGluZyAmJiB0aGlzLl9sb2FkZXJEaXNhYmxlZCA/ICh0aGlzLmJvdGggPyB0aGlzLmxvYWRlckFyclswXSA6IHRoaXMubG9hZGVyQXJyKSA6IHRoaXMuX2NvbHVtbnMuc2xpY2UodGhpcy5ib3RoID8gdGhpcy5maXJzdC5jb2xzIDogdGhpcy5maXJzdCwgdGhpcy5ib3RoID8gdGhpcy5sYXN0LmNvbHMgOiB0aGlzLmxhc3QpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX2NvbHVtbnM7XG4gICAgfVxuXG4gICAgZ2V0IGlzUGFnZUNoYW5nZWQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGVwID8gdGhpcy5wYWdlICE9PSB0aGlzLmdldFBhZ2VCeUZpcnN0KCkgOiB0cnVlO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmLCBwcml2YXRlIHpvbmU6IE5nWm9uZSkge31cblxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICB0aGlzLnNldEluaXRpYWxTdGF0ZSgpO1xuICAgIH1cblxuICAgIG5nT25DaGFuZ2VzKHNpbXBsZUNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcbiAgICAgICAgbGV0IGlzTG9hZGluZ0NoYW5nZWQgPSBmYWxzZTtcblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlcy5sb2FkaW5nKSB7XG4gICAgICAgICAgICBjb25zdCB7IHByZXZpb3VzVmFsdWUsIGN1cnJlbnRWYWx1ZSB9ID0gc2ltcGxlQ2hhbmdlcy5sb2FkaW5nO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5sYXp5ICYmIHByZXZpb3VzVmFsdWUgIT09IGN1cnJlbnRWYWx1ZSAmJiBjdXJyZW50VmFsdWUgIT09IHRoaXMuZF9sb2FkaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kX2xvYWRpbmcgPSBjdXJyZW50VmFsdWU7XG4gICAgICAgICAgICAgICAgaXNMb2FkaW5nQ2hhbmdlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlcy5vcmllbnRhdGlvbikge1xuICAgICAgICAgICAgdGhpcy5sYXN0U2Nyb2xsUG9zID0gdGhpcy5ib3RoID8geyB0b3A6IDAsIGxlZnQ6IDAgfSA6IDA7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlcy5udW1Ub2xlcmF0ZWRJdGVtcykge1xuICAgICAgICAgICAgY29uc3QgeyBwcmV2aW91c1ZhbHVlLCBjdXJyZW50VmFsdWUgfSA9IHNpbXBsZUNoYW5nZXMubnVtVG9sZXJhdGVkSXRlbXM7XG5cbiAgICAgICAgICAgIGlmIChwcmV2aW91c1ZhbHVlICE9PSBjdXJyZW50VmFsdWUgJiYgY3VycmVudFZhbHVlICE9PSB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXMgPSBjdXJyZW50VmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoc2ltcGxlQ2hhbmdlcy5vcHRpb25zKSB7XG4gICAgICAgICAgICBjb25zdCB7IHByZXZpb3VzVmFsdWUsIGN1cnJlbnRWYWx1ZSB9ID0gc2ltcGxlQ2hhbmdlcy5vcHRpb25zO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5sYXp5ICYmIHByZXZpb3VzVmFsdWU/LmxvYWRpbmcgIT09IGN1cnJlbnRWYWx1ZT8ubG9hZGluZyAmJiBjdXJyZW50VmFsdWU/LmxvYWRpbmcgIT09IHRoaXMuZF9sb2FkaW5nKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kX2xvYWRpbmcgPSBjdXJyZW50VmFsdWUubG9hZGluZztcbiAgICAgICAgICAgICAgICBpc0xvYWRpbmdDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHByZXZpb3VzVmFsdWU/Lm51bVRvbGVyYXRlZEl0ZW1zICE9PSBjdXJyZW50VmFsdWU/Lm51bVRvbGVyYXRlZEl0ZW1zICYmIGN1cnJlbnRWYWx1ZT8ubnVtVG9sZXJhdGVkSXRlbXMgIT09IHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtcykge1xuICAgICAgICAgICAgICAgIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtcyA9IGN1cnJlbnRWYWx1ZS5udW1Ub2xlcmF0ZWRJdGVtcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLmluaXRpYWxpemVkKSB7XG4gICAgICAgICAgICBjb25zdCBpc0NoYW5nZWQgPSAhaXNMb2FkaW5nQ2hhbmdlZCAmJiAoc2ltcGxlQ2hhbmdlcy5pdGVtcz8ucHJldmlvdXNWYWx1ZT8ubGVuZ3RoICE9PSBzaW1wbGVDaGFuZ2VzLml0ZW1zPy5jdXJyZW50VmFsdWU/Lmxlbmd0aCB8fCBzaW1wbGVDaGFuZ2VzLml0ZW1TaXplIHx8IHNpbXBsZUNoYW5nZXMuc2Nyb2xsSGVpZ2h0IHx8IHNpbXBsZUNoYW5nZXMuc2Nyb2xsV2lkdGgpO1xuXG4gICAgICAgICAgICBpZiAoaXNDaGFuZ2VkKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVBdXRvU2l6ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgbmdBZnRlckNvbnRlbnRJbml0KCkge1xuICAgICAgICB0aGlzLnRlbXBsYXRlcy5mb3JFYWNoKChpdGVtKSA9PiB7XG4gICAgICAgICAgICBzd2l0Y2ggKGl0ZW0uZ2V0VHlwZSgpKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAnY29udGVudCc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudFRlbXBsYXRlID0gaXRlbS50ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlICdpdGVtJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2xvYWRlcic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubG9hZGVyVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgJ2xvYWRlcmljb24nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRlckljb25UZW1wbGF0ZSA9IGl0ZW0udGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pdGVtVGVtcGxhdGUgPSBpdGVtLnRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdJbml0KCkge1xuICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudmlld0luaXQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbmdBZnRlclZpZXdDaGVja2VkKCkge1xuICAgICAgICBpZiAoIXRoaXMuaW5pdGlhbGl6ZWQpIHtcbiAgICAgICAgICAgIHRoaXMudmlld0luaXQoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIG5nT25EZXN0cm95KCkge1xuICAgICAgICB0aGlzLnVuYmluZFJlc2l6ZUxpc3RlbmVyKCk7XG5cbiAgICAgICAgdGhpcy5jb250ZW50RWwgPSBudWxsO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgdmlld0luaXQoKSB7XG4gICAgICAgIGlmIChEb21IYW5kbGVyLmlzVmlzaWJsZSh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgICAgICB0aGlzLnNldEluaXRpYWxTdGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5zZXRDb250ZW50RWwodGhpcy5jb250ZW50RWwpO1xuICAgICAgICAgICAgdGhpcy5pbml0KCk7XG5cbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdFdpZHRoID0gRG9tSGFuZGxlci5nZXRXaWR0aCh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRIZWlnaHQgPSBEb21IYW5kbGVyLmdldEhlaWdodCh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCk7XG4gICAgICAgICAgICB0aGlzLmRlZmF1bHRDb250ZW50V2lkdGggPSBEb21IYW5kbGVyLmdldFdpZHRoKHRoaXMuY29udGVudEVsKTtcbiAgICAgICAgICAgIHRoaXMuZGVmYXVsdENvbnRlbnRIZWlnaHQgPSBEb21IYW5kbGVyLmdldEhlaWdodCh0aGlzLmNvbnRlbnRFbCk7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemVkID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGluaXQoKSB7XG4gICAgICAgIGlmICghdGhpcy5fZGlzYWJsZWQpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U2l6ZSgpO1xuICAgICAgICAgICAgdGhpcy5jYWxjdWxhdGVPcHRpb25zKCk7XG4gICAgICAgICAgICB0aGlzLnNldFNwYWNlclNpemUoKTtcbiAgICAgICAgICAgIHRoaXMuYmluZFJlc2l6ZUxpc3RlbmVyKCk7XG5cbiAgICAgICAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc2V0Q29udGVudEVsKGVsPzogSFRNTEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5jb250ZW50RWwgPSBlbCB8fCB0aGlzLmNvbnRlbnRWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQgfHwgRG9tSGFuZGxlci5maW5kU2luZ2xlKHRoaXMuZWxlbWVudFZpZXdDaGlsZD8ubmF0aXZlRWxlbWVudCwgJy5wLXNjcm9sbGVyLWNvbnRlbnQnKTtcbiAgICB9XG5cbiAgICBzZXRJbml0aWFsU3RhdGUoKSB7XG4gICAgICAgIHRoaXMuZmlyc3QgPSB0aGlzLmJvdGggPyB7IHJvd3M6IDAsIGNvbHM6IDAgfSA6IDA7XG4gICAgICAgIHRoaXMubGFzdCA9IHRoaXMuYm90aCA/IHsgcm93czogMCwgY29sczogMCB9IDogMDtcbiAgICAgICAgdGhpcy5udW1JdGVtc0luVmlld3BvcnQgPSB0aGlzLmJvdGggPyB7IHJvd3M6IDAsIGNvbHM6IDAgfSA6IDA7XG4gICAgICAgIHRoaXMubGFzdFNjcm9sbFBvcyA9IHRoaXMuYm90aCA/IHsgdG9wOiAwLCBsZWZ0OiAwIH0gOiAwO1xuICAgICAgICB0aGlzLmRfbG9hZGluZyA9IHRoaXMuX2xvYWRpbmcgfHwgZmFsc2U7XG4gICAgICAgIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtcyA9IHRoaXMuX251bVRvbGVyYXRlZEl0ZW1zO1xuICAgICAgICB0aGlzLmxvYWRlckFyciA9IFtdO1xuICAgICAgICB0aGlzLnNwYWNlclN0eWxlID0ge307XG4gICAgICAgIHRoaXMuY29udGVudFN0eWxlID0ge307XG4gICAgfVxuXG4gICAgZ2V0RWxlbWVudFJlZigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudFZpZXdDaGlsZDtcbiAgICB9XG5cbiAgICBnZXRQYWdlQnlGaXJzdCgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoKHRoaXMuZmlyc3QgKyB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXMgKiA0KSAvICh0aGlzLl9zdGVwIHx8IDEpKTtcbiAgICB9XG5cbiAgICBzY3JvbGxUbyhvcHRpb25zOiBTY3JvbGxUb09wdGlvbnMpIHtcbiAgICAgICAgdGhpcy5sYXN0U2Nyb2xsUG9zID0gdGhpcy5ib3RoID8geyB0b3A6IDAsIGxlZnQ6IDAgfSA6IDA7XG4gICAgICAgIHRoaXMuZWxlbWVudFZpZXdDaGlsZD8ubmF0aXZlRWxlbWVudD8uc2Nyb2xsVG8ob3B0aW9ucyk7XG4gICAgfVxuXG4gICAgc2Nyb2xsVG9JbmRleChpbmRleDogbnVtYmVyLCBiZWhhdmlvcjogU2Nyb2xsQmVoYXZpb3IgPSAnYXV0bycpIHtcbiAgICAgICAgY29uc3QgeyBudW1Ub2xlcmF0ZWRJdGVtcyB9ID0gdGhpcy5jYWxjdWxhdGVOdW1JdGVtcygpO1xuICAgICAgICBjb25zdCBjb250ZW50UG9zID0gdGhpcy5nZXRDb250ZW50UG9zaXRpb24oKTtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlRmlyc3QgPSAoX2luZGV4ID0gMCwgX251bVQpID0+IChfaW5kZXggPD0gX251bVQgPyAwIDogX2luZGV4KTtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlQ29vcmQgPSAoX2ZpcnN0LCBfc2l6ZSwgX2Nwb3MpID0+IF9maXJzdCAqIF9zaXplICsgX2Nwb3M7XG4gICAgICAgIGNvbnN0IHNjcm9sbFRvID0gKGxlZnQgPSAwLCB0b3AgPSAwKSA9PiB0aGlzLnNjcm9sbFRvKHsgbGVmdCwgdG9wLCBiZWhhdmlvciB9KTtcbiAgICAgICAgbGV0IG5ld0ZpcnN0OiBhbnkgPSAwO1xuXG4gICAgICAgIGlmICh0aGlzLmJvdGgpIHtcbiAgICAgICAgICAgIG5ld0ZpcnN0ID0geyByb3dzOiBjYWxjdWxhdGVGaXJzdChpbmRleFswXSwgbnVtVG9sZXJhdGVkSXRlbXNbMF0pLCBjb2xzOiBjYWxjdWxhdGVGaXJzdChpbmRleFsxXSwgbnVtVG9sZXJhdGVkSXRlbXNbMV0pIH07XG4gICAgICAgICAgICBzY3JvbGxUbyhjYWxjdWxhdGVDb29yZChuZXdGaXJzdC5jb2xzLCB0aGlzLl9pdGVtU2l6ZVsxXSwgY29udGVudFBvcy5sZWZ0KSwgY2FsY3VsYXRlQ29vcmQobmV3Rmlyc3Qucm93cywgdGhpcy5faXRlbVNpemVbMF0sIGNvbnRlbnRQb3MudG9wKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBuZXdGaXJzdCA9IGNhbGN1bGF0ZUZpcnN0KGluZGV4LCBudW1Ub2xlcmF0ZWRJdGVtcyk7XG4gICAgICAgICAgICB0aGlzLmhvcml6b250YWwgPyBzY3JvbGxUbyhjYWxjdWxhdGVDb29yZChuZXdGaXJzdCwgdGhpcy5faXRlbVNpemUsIGNvbnRlbnRQb3MubGVmdCksIDApIDogc2Nyb2xsVG8oMCwgY2FsY3VsYXRlQ29vcmQobmV3Rmlyc3QsIHRoaXMuX2l0ZW1TaXplLCBjb250ZW50UG9zLnRvcCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pc1JhbmdlQ2hhbmdlZCA9IHRoaXMuZmlyc3QgIT09IG5ld0ZpcnN0O1xuICAgICAgICB0aGlzLmZpcnN0ID0gbmV3Rmlyc3Q7XG4gICAgfVxuXG4gICAgc2Nyb2xsSW5WaWV3KGluZGV4OiBudW1iZXIsIHRvOiBTY3JvbGxlclRvVHlwZSwgYmVoYXZpb3I6IFNjcm9sbEJlaGF2aW9yID0gJ2F1dG8nKSB7XG4gICAgICAgIGlmICh0bykge1xuICAgICAgICAgICAgY29uc3QgeyBmaXJzdCwgdmlld3BvcnQgfSA9IHRoaXMuZ2V0UmVuZGVyZWRSYW5nZSgpO1xuICAgICAgICAgICAgY29uc3Qgc2Nyb2xsVG8gPSAobGVmdCA9IDAsIHRvcCA9IDApID0+IHRoaXMuc2Nyb2xsVG8oeyBsZWZ0LCB0b3AsIGJlaGF2aW9yIH0pO1xuICAgICAgICAgICAgY29uc3QgaXNUb1N0YXJ0ID0gdG8gPT09ICd0by1zdGFydCc7XG4gICAgICAgICAgICBjb25zdCBpc1RvRW5kID0gdG8gPT09ICd0by1lbmQnO1xuXG4gICAgICAgICAgICBpZiAoaXNUb1N0YXJ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYm90aCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodmlld3BvcnQuZmlyc3Qucm93cyAtIGZpcnN0LnJvd3MgPiBpbmRleFswXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2Nyb2xsVG8odmlld3BvcnQuZmlyc3QuY29scyAqIHRoaXMuX2l0ZW1TaXplWzFdLCAodmlld3BvcnQuZmlyc3Qucm93cyAtIDEpICogdGhpcy5faXRlbVNpemVbMF0pO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHZpZXdwb3J0LmZpcnN0LmNvbHMgLSBmaXJzdC5jb2xzID4gaW5kZXhbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvKCh2aWV3cG9ydC5maXJzdC5jb2xzIC0gMSkgKiB0aGlzLl9pdGVtU2l6ZVsxXSwgdmlld3BvcnQuZmlyc3Qucm93cyAqIHRoaXMuX2l0ZW1TaXplWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2aWV3cG9ydC5maXJzdCAtIGZpcnN0ID4gaW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvcyA9ICh2aWV3cG9ydC5maXJzdCAtIDEpICogdGhpcy5faXRlbVNpemU7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmhvcml6b250YWwgPyBzY3JvbGxUbyhwb3MsIDApIDogc2Nyb2xsVG8oMCwgcG9zKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaXNUb0VuZCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmJvdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZpZXdwb3J0Lmxhc3Qucm93cyAtIGZpcnN0LnJvd3MgPD0gaW5kZXhbMF0gKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUbyh2aWV3cG9ydC5maXJzdC5jb2xzICogdGhpcy5faXRlbVNpemVbMV0sICh2aWV3cG9ydC5maXJzdC5yb3dzICsgMSkgKiB0aGlzLl9pdGVtU2l6ZVswXSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodmlld3BvcnQubGFzdC5jb2xzIC0gZmlyc3QuY29scyA8PSBpbmRleFsxXSArIDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjcm9sbFRvKCh2aWV3cG9ydC5maXJzdC5jb2xzICsgMSkgKiB0aGlzLl9pdGVtU2l6ZVsxXSwgdmlld3BvcnQuZmlyc3Qucm93cyAqIHRoaXMuX2l0ZW1TaXplWzBdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh2aWV3cG9ydC5sYXN0IC0gZmlyc3QgPD0gaW5kZXggKyAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3MgPSAodmlld3BvcnQuZmlyc3QgKyAxKSAqIHRoaXMuX2l0ZW1TaXplO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsID8gc2Nyb2xsVG8ocG9zLCAwKSA6IHNjcm9sbFRvKDAsIHBvcyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNjcm9sbFRvSW5kZXgoaW5kZXgsIGJlaGF2aW9yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldFJlbmRlcmVkUmFuZ2UoKSB7XG4gICAgICAgIGNvbnN0IGNhbGN1bGF0ZUZpcnN0SW5WaWV3cG9ydCA9IChfcG9zLCBfc2l6ZSkgPT4gTWF0aC5mbG9vcihfcG9zIC8gKF9zaXplIHx8IF9wb3MpKTtcblxuICAgICAgICBsZXQgZmlyc3RJblZpZXdwb3J0ID0gdGhpcy5maXJzdDtcbiAgICAgICAgbGV0IGxhc3RJblZpZXdwb3J0OiBhbnkgPSAwO1xuXG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHsgc2Nyb2xsVG9wLCBzY3JvbGxMZWZ0IH0gPSB0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudDtcblxuICAgICAgICAgICAgaWYgKHRoaXMuYm90aCkge1xuICAgICAgICAgICAgICAgIGZpcnN0SW5WaWV3cG9ydCA9IHsgcm93czogY2FsY3VsYXRlRmlyc3RJblZpZXdwb3J0KHNjcm9sbFRvcCwgdGhpcy5faXRlbVNpemVbMF0pLCBjb2xzOiBjYWxjdWxhdGVGaXJzdEluVmlld3BvcnQoc2Nyb2xsTGVmdCwgdGhpcy5faXRlbVNpemVbMV0pIH07XG4gICAgICAgICAgICAgICAgbGFzdEluVmlld3BvcnQgPSB7IHJvd3M6IGZpcnN0SW5WaWV3cG9ydC5yb3dzICsgdGhpcy5udW1JdGVtc0luVmlld3BvcnQucm93cywgY29sczogZmlyc3RJblZpZXdwb3J0LmNvbHMgKyB0aGlzLm51bUl0ZW1zSW5WaWV3cG9ydC5jb2xzIH07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNjcm9sbFBvcyA9IHRoaXMuaG9yaXpvbnRhbCA/IHNjcm9sbExlZnQgOiBzY3JvbGxUb3A7XG4gICAgICAgICAgICAgICAgZmlyc3RJblZpZXdwb3J0ID0gY2FsY3VsYXRlRmlyc3RJblZpZXdwb3J0KHNjcm9sbFBvcywgdGhpcy5faXRlbVNpemUpO1xuICAgICAgICAgICAgICAgIGxhc3RJblZpZXdwb3J0ID0gZmlyc3RJblZpZXdwb3J0ICsgdGhpcy5udW1JdGVtc0luVmlld3BvcnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZmlyc3Q6IHRoaXMuZmlyc3QsXG4gICAgICAgICAgICBsYXN0OiB0aGlzLmxhc3QsXG4gICAgICAgICAgICB2aWV3cG9ydDoge1xuICAgICAgICAgICAgICAgIGZpcnN0OiBmaXJzdEluVmlld3BvcnQsXG4gICAgICAgICAgICAgICAgbGFzdDogbGFzdEluVmlld3BvcnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVOdW1JdGVtcygpIHtcbiAgICAgICAgY29uc3QgY29udGVudFBvcyA9IHRoaXMuZ2V0Q29udGVudFBvc2l0aW9uKCk7XG4gICAgICAgIGNvbnN0IGNvbnRlbnRXaWR0aCA9IHRoaXMuZWxlbWVudFZpZXdDaGlsZD8ubmF0aXZlRWxlbWVudCA/IHRoaXMuZWxlbWVudFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoIC0gY29udGVudFBvcy5sZWZ0IDogMDtcbiAgICAgICAgY29uc3QgY29udGVudEhlaWdodCA9IHRoaXMuZWxlbWVudFZpZXdDaGlsZD8ubmF0aXZlRWxlbWVudCA/IHRoaXMuZWxlbWVudFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodCAtIGNvbnRlbnRQb3MudG9wIDogMDtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlTnVtSXRlbXNJblZpZXdwb3J0ID0gKF9jb250ZW50U2l6ZSwgX2l0ZW1TaXplKSA9PiBNYXRoLmNlaWwoX2NvbnRlbnRTaXplIC8gKF9pdGVtU2l6ZSB8fCBfY29udGVudFNpemUpKTtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlTnVtVG9sZXJhdGVkSXRlbXMgPSAoX251bUl0ZW1zKSA9PiBNYXRoLmNlaWwoX251bUl0ZW1zIC8gMik7XG4gICAgICAgIGNvbnN0IG51bUl0ZW1zSW5WaWV3cG9ydDogYW55ID0gdGhpcy5ib3RoXG4gICAgICAgICAgICA/IHsgcm93czogY2FsY3VsYXRlTnVtSXRlbXNJblZpZXdwb3J0KGNvbnRlbnRIZWlnaHQsIHRoaXMuX2l0ZW1TaXplWzBdKSwgY29sczogY2FsY3VsYXRlTnVtSXRlbXNJblZpZXdwb3J0KGNvbnRlbnRXaWR0aCwgdGhpcy5faXRlbVNpemVbMV0pIH1cbiAgICAgICAgICAgIDogY2FsY3VsYXRlTnVtSXRlbXNJblZpZXdwb3J0KHRoaXMuaG9yaXpvbnRhbCA/IGNvbnRlbnRXaWR0aCA6IGNvbnRlbnRIZWlnaHQsIHRoaXMuX2l0ZW1TaXplKTtcblxuICAgICAgICBjb25zdCBudW1Ub2xlcmF0ZWRJdGVtcyA9IHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtcyB8fCAodGhpcy5ib3RoID8gW2NhbGN1bGF0ZU51bVRvbGVyYXRlZEl0ZW1zKG51bUl0ZW1zSW5WaWV3cG9ydC5yb3dzKSwgY2FsY3VsYXRlTnVtVG9sZXJhdGVkSXRlbXMobnVtSXRlbXNJblZpZXdwb3J0LmNvbHMpXSA6IGNhbGN1bGF0ZU51bVRvbGVyYXRlZEl0ZW1zKG51bUl0ZW1zSW5WaWV3cG9ydCkpO1xuXG4gICAgICAgIHJldHVybiB7IG51bUl0ZW1zSW5WaWV3cG9ydCwgbnVtVG9sZXJhdGVkSXRlbXMgfTtcbiAgICB9XG5cbiAgICBjYWxjdWxhdGVPcHRpb25zKCkge1xuICAgICAgICBjb25zdCB7IG51bUl0ZW1zSW5WaWV3cG9ydCwgbnVtVG9sZXJhdGVkSXRlbXMgfSA9IHRoaXMuY2FsY3VsYXRlTnVtSXRlbXMoKTtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlTGFzdCA9IChfZmlyc3QsIF9udW0sIF9udW1ULCBfaXNDb2xzID0gZmFsc2UpID0+IHRoaXMuZ2V0TGFzdChfZmlyc3QgKyBfbnVtICsgKF9maXJzdCA8IF9udW1UID8gMiA6IDMpICogX251bVQsIF9pc0NvbHMpO1xuICAgICAgICBjb25zdCBmaXJzdCA9IHRoaXMuZmlyc3Q7XG4gICAgICAgIGNvbnN0IGxhc3QgPSB0aGlzLmJvdGhcbiAgICAgICAgICAgID8geyByb3dzOiBjYWxjdWxhdGVMYXN0KHRoaXMuZmlyc3Qucm93cywgbnVtSXRlbXNJblZpZXdwb3J0LnJvd3MsIG51bVRvbGVyYXRlZEl0ZW1zWzBdKSwgY29sczogY2FsY3VsYXRlTGFzdCh0aGlzLmZpcnN0LmNvbHMsIG51bUl0ZW1zSW5WaWV3cG9ydC5jb2xzLCBudW1Ub2xlcmF0ZWRJdGVtc1sxXSwgdHJ1ZSkgfVxuICAgICAgICAgICAgOiBjYWxjdWxhdGVMYXN0KHRoaXMuZmlyc3QsIG51bUl0ZW1zSW5WaWV3cG9ydCwgbnVtVG9sZXJhdGVkSXRlbXMpO1xuXG4gICAgICAgIHRoaXMubGFzdCA9IGxhc3Q7XG4gICAgICAgIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0ID0gbnVtSXRlbXNJblZpZXdwb3J0O1xuICAgICAgICB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXMgPSBudW1Ub2xlcmF0ZWRJdGVtcztcblxuICAgICAgICBpZiAodGhpcy5zaG93TG9hZGVyKSB7XG4gICAgICAgICAgICB0aGlzLmxvYWRlckFyciA9IHRoaXMuYm90aCA/IEFycmF5LmZyb20oeyBsZW5ndGg6IG51bUl0ZW1zSW5WaWV3cG9ydC5yb3dzIH0pLm1hcCgoKSA9PiBBcnJheS5mcm9tKHsgbGVuZ3RoOiBudW1JdGVtc0luVmlld3BvcnQuY29scyB9KSkgOiBBcnJheS5mcm9tKHsgbGVuZ3RoOiBudW1JdGVtc0luVmlld3BvcnQgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fbGF6eSkge1xuICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXp5TG9hZFN0YXRlID0ge1xuICAgICAgICAgICAgICAgICAgICBmaXJzdDogdGhpcy5fc3RlcCA/ICh0aGlzLmJvdGggPyB7IHJvd3M6IDAsIGNvbHM6IGZpcnN0LmNvbHMgfSA6IDApIDogZmlyc3QsXG4gICAgICAgICAgICAgICAgICAgIGxhc3Q6IE1hdGgubWluKHRoaXMuX3N0ZXAgPyB0aGlzLl9zdGVwIDogdGhpcy5sYXN0LCB0aGlzLml0ZW1zLmxlbmd0aClcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVFdmVudHMoJ29uTGF6eUxvYWQnLCB0aGlzLmxhenlMb2FkU3RhdGUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjYWxjdWxhdGVBdXRvU2l6ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2F1dG9TaXplICYmICF0aGlzLmRfbG9hZGluZykge1xuICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udGVudEVsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudEVsLnN0eWxlLm1pbkhlaWdodCA9IHRoaXMuY29udGVudEVsLnN0eWxlLm1pbldpZHRoID0gJ2F1dG8nO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbnRlbnRFbC5zdHlsZS5wb3NpdGlvbiA9ICdyZWxhdGl2ZSc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmNvbnRhaW4gPSAnbm9uZSc7XG5cbiAgICAgICAgICAgICAgICAgICAgY29uc3QgW2NvbnRlbnRXaWR0aCwgY29udGVudEhlaWdodF0gPSBbRG9tSGFuZGxlci5nZXRXaWR0aCh0aGlzLmNvbnRlbnRFbCksIERvbUhhbmRsZXIuZ2V0SGVpZ2h0KHRoaXMuY29udGVudEVsKV07XG4gICAgICAgICAgICAgICAgICAgIGNvbnRlbnRXaWR0aCAhPT0gdGhpcy5kZWZhdWx0Q29udGVudFdpZHRoICYmICh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS53aWR0aCA9ICcnKTtcbiAgICAgICAgICAgICAgICAgICAgY29udGVudEhlaWdodCAhPT0gdGhpcy5kZWZhdWx0Q29udGVudEhlaWdodCAmJiAodGhpcy5lbGVtZW50Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gJycpO1xuXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IFt3aWR0aCwgaGVpZ2h0XSA9IFtEb21IYW5kbGVyLmdldFdpZHRoKHRoaXMuZWxlbWVudFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50KSwgRG9tSGFuZGxlci5nZXRIZWlnaHQodGhpcy5lbGVtZW50Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpXTtcbiAgICAgICAgICAgICAgICAgICAgKHRoaXMuYm90aCB8fCB0aGlzLmhvcml6b250YWwpICYmICh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS53aWR0aCA9IHdpZHRoIDwgdGhpcy5kZWZhdWx0V2lkdGggPyB3aWR0aCArICdweCcgOiB0aGlzLl9zY3JvbGxXaWR0aCB8fCB0aGlzLmRlZmF1bHRXaWR0aCArICdweCcpO1xuICAgICAgICAgICAgICAgICAgICAodGhpcy5ib3RoIHx8IHRoaXMudmVydGljYWwpICYmICh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZS5oZWlnaHQgPSBoZWlnaHQgPCB0aGlzLmRlZmF1bHRIZWlnaHQgPyBoZWlnaHQgKyAncHgnIDogdGhpcy5fc2Nyb2xsSGVpZ2h0IHx8IHRoaXMuZGVmYXVsdEhlaWdodCArICdweCcpO1xuXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudEVsLnN0eWxlLm1pbkhlaWdodCA9IHRoaXMuY29udGVudEVsLnN0eWxlLm1pbldpZHRoID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudEVsLnN0eWxlLnBvc2l0aW9uID0gJyc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZWxlbWVudFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50LnN0eWxlLmNvbnRhaW4gPSAnJztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldExhc3QobGFzdCA9IDAsIGlzQ29scyA9IGZhbHNlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pdGVtcyA/IE1hdGgubWluKGlzQ29scyA/ICh0aGlzLl9jb2x1bW5zIHx8IHRoaXMuX2l0ZW1zWzBdKS5sZW5ndGggOiB0aGlzLl9pdGVtcy5sZW5ndGgsIGxhc3QpIDogMDtcbiAgICB9XG5cbiAgICBnZXRDb250ZW50UG9zaXRpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnRFbCkge1xuICAgICAgICAgICAgY29uc3Qgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKHRoaXMuY29udGVudEVsKTtcbiAgICAgICAgICAgIGNvbnN0IGxlZnQgPSBwYXJzZUZsb2F0KHN0eWxlLnBhZGRpbmdMZWZ0KSArIE1hdGgubWF4KHBhcnNlRmxvYXQoc3R5bGUubGVmdCkgfHwgMCwgMCk7XG4gICAgICAgICAgICBjb25zdCByaWdodCA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ1JpZ2h0KSArIE1hdGgubWF4KHBhcnNlRmxvYXQoc3R5bGUucmlnaHQpIHx8IDAsIDApO1xuICAgICAgICAgICAgY29uc3QgdG9wID0gcGFyc2VGbG9hdChzdHlsZS5wYWRkaW5nVG9wKSArIE1hdGgubWF4KHBhcnNlRmxvYXQoc3R5bGUudG9wKSB8fCAwLCAwKTtcbiAgICAgICAgICAgIGNvbnN0IGJvdHRvbSA9IHBhcnNlRmxvYXQoc3R5bGUucGFkZGluZ0JvdHRvbSkgKyBNYXRoLm1heChwYXJzZUZsb2F0KHN0eWxlLmJvdHRvbSkgfHwgMCwgMCk7XG5cbiAgICAgICAgICAgIHJldHVybiB7IGxlZnQsIHJpZ2h0LCB0b3AsIGJvdHRvbSwgeDogbGVmdCArIHJpZ2h0LCB5OiB0b3AgKyBib3R0b20gfTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7IGxlZnQ6IDAsIHJpZ2h0OiAwLCB0b3A6IDAsIGJvdHRvbTogMCwgeDogMCwgeTogMCB9O1xuICAgIH1cblxuICAgIHNldFNpemUoKSB7XG4gICAgICAgIGlmICh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IHBhcmVudEVsZW1lbnQgPSB0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5wYXJlbnRFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gICAgICAgICAgICBjb25zdCB3aWR0aCA9IHRoaXMuX3Njcm9sbFdpZHRoIHx8IGAke3RoaXMuZWxlbWVudFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoIHx8IHBhcmVudEVsZW1lbnQub2Zmc2V0V2lkdGh9cHhgO1xuICAgICAgICAgICAgY29uc3QgaGVpZ2h0ID0gdGhpcy5fc2Nyb2xsSGVpZ2h0IHx8IGAke3RoaXMuZWxlbWVudFZpZXdDaGlsZC5uYXRpdmVFbGVtZW50Lm9mZnNldEhlaWdodCB8fCBwYXJlbnRFbGVtZW50Lm9mZnNldEhlaWdodH1weGA7XG4gICAgICAgICAgICBjb25zdCBzZXRQcm9wID0gKF9uYW1lLCBfdmFsdWUpID0+ICh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudC5zdHlsZVtfbmFtZV0gPSBfdmFsdWUpO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5ib3RoIHx8IHRoaXMuaG9yaXpvbnRhbCkge1xuICAgICAgICAgICAgICAgIHNldFByb3AoJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgICAgICAgICAgICAgc2V0UHJvcCgnd2lkdGgnLCB3aWR0aCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHNldFByb3AoJ2hlaWdodCcsIGhlaWdodCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzZXRTcGFjZXJTaXplKCkge1xuICAgICAgICBpZiAodGhpcy5faXRlbXMpIHtcbiAgICAgICAgICAgIGNvbnN0IGNvbnRlbnRQb3MgPSB0aGlzLmdldENvbnRlbnRQb3NpdGlvbigpO1xuICAgICAgICAgICAgY29uc3Qgc2V0UHJvcCA9IChfbmFtZSwgX3ZhbHVlLCBfc2l6ZSwgX2Nwb3MgPSAwKSA9PiAodGhpcy5zcGFjZXJTdHlsZSA9IHsgLi4udGhpcy5zcGFjZXJTdHlsZSwgLi4ueyBbYCR7X25hbWV9YF06IChfdmFsdWUgfHwgW10pLmxlbmd0aCAqIF9zaXplICsgX2Nwb3MgKyAncHgnIH0gfSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmJvdGgpIHtcbiAgICAgICAgICAgICAgICBzZXRQcm9wKCdoZWlnaHQnLCB0aGlzLl9pdGVtcywgdGhpcy5faXRlbVNpemVbMF0sIGNvbnRlbnRQb3MueSk7XG4gICAgICAgICAgICAgICAgc2V0UHJvcCgnd2lkdGgnLCB0aGlzLl9jb2x1bW5zIHx8IHRoaXMuX2l0ZW1zWzFdLCB0aGlzLl9pdGVtU2l6ZVsxXSwgY29udGVudFBvcy54KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsID8gc2V0UHJvcCgnd2lkdGgnLCB0aGlzLl9jb2x1bW5zIHx8IHRoaXMuX2l0ZW1zLCB0aGlzLl9pdGVtU2l6ZSwgY29udGVudFBvcy54KSA6IHNldFByb3AoJ2hlaWdodCcsIHRoaXMuX2l0ZW1zLCB0aGlzLl9pdGVtU2l6ZSwgY29udGVudFBvcy55KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldENvbnRlbnRQb3NpdGlvbihwb3MpIHtcbiAgICAgICAgaWYgKHRoaXMuY29udGVudEVsICYmICF0aGlzLl9hcHBlbmRPbmx5KSB7XG4gICAgICAgICAgICBjb25zdCBmaXJzdCA9IHBvcyA/IHBvcy5maXJzdCA6IHRoaXMuZmlyc3Q7XG4gICAgICAgICAgICBjb25zdCBjYWxjdWxhdGVUcmFuc2xhdGVWYWwgPSAoX2ZpcnN0LCBfc2l6ZSkgPT4gX2ZpcnN0ICogX3NpemU7XG4gICAgICAgICAgICBjb25zdCBzZXRUcmFuc2Zvcm0gPSAoX3ggPSAwLCBfeSA9IDApID0+ICh0aGlzLmNvbnRlbnRTdHlsZSA9IHsgLi4udGhpcy5jb250ZW50U3R5bGUsIC4uLnsgdHJhbnNmb3JtOiBgdHJhbnNsYXRlM2QoJHtfeH1weCwgJHtfeX1weCwgMClgIH0gfSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmJvdGgpIHtcbiAgICAgICAgICAgICAgICBzZXRUcmFuc2Zvcm0oY2FsY3VsYXRlVHJhbnNsYXRlVmFsKGZpcnN0LmNvbHMsIHRoaXMuX2l0ZW1TaXplWzFdKSwgY2FsY3VsYXRlVHJhbnNsYXRlVmFsKGZpcnN0LnJvd3MsIHRoaXMuX2l0ZW1TaXplWzBdKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyYW5zbGF0ZVZhbCA9IGNhbGN1bGF0ZVRyYW5zbGF0ZVZhbChmaXJzdCwgdGhpcy5faXRlbVNpemUpO1xuICAgICAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbCA/IHNldFRyYW5zZm9ybSh0cmFuc2xhdGVWYWwsIDApIDogc2V0VHJhbnNmb3JtKDAsIHRyYW5zbGF0ZVZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvblNjcm9sbFBvc2l0aW9uQ2hhbmdlKGV2ZW50KSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IGV2ZW50LnRhcmdldDtcbiAgICAgICAgY29uc3QgY29udGVudFBvcyA9IHRoaXMuZ2V0Q29udGVudFBvc2l0aW9uKCk7XG4gICAgICAgIGNvbnN0IGNhbGN1bGF0ZVNjcm9sbFBvcyA9IChfcG9zLCBfY3BvcykgPT4gKF9wb3MgPyAoX3BvcyA+IF9jcG9zID8gX3BvcyAtIF9jcG9zIDogX3BvcykgOiAwKTtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlQ3VycmVudEluZGV4ID0gKF9wb3MsIF9zaXplKSA9PiBNYXRoLmZsb29yKF9wb3MgLyAoX3NpemUgfHwgX3BvcykpO1xuICAgICAgICBjb25zdCBjYWxjdWxhdGVUcmlnZ2VySW5kZXggPSAoX2N1cnJlbnRJbmRleCwgX2ZpcnN0LCBfbGFzdCwgX251bSwgX251bVQsIF9pc1Njcm9sbERvd25PclJpZ2h0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gX2N1cnJlbnRJbmRleCA8PSBfbnVtVCA/IF9udW1UIDogX2lzU2Nyb2xsRG93bk9yUmlnaHQgPyBfbGFzdCAtIF9udW0gLSBfbnVtVCA6IF9maXJzdCArIF9udW1UIC0gMTtcbiAgICAgICAgfTtcbiAgICAgICAgY29uc3QgY2FsY3VsYXRlRmlyc3QgPSAoX2N1cnJlbnRJbmRleCwgX3RyaWdnZXJJbmRleCwgX2ZpcnN0LCBfbGFzdCwgX251bSwgX251bVQsIF9pc1Njcm9sbERvd25PclJpZ2h0KSA9PiB7XG4gICAgICAgICAgICBpZiAoX2N1cnJlbnRJbmRleCA8PSBfbnVtVCkgcmV0dXJuIDA7XG4gICAgICAgICAgICBlbHNlIHJldHVybiBNYXRoLm1heCgwLCBfaXNTY3JvbGxEb3duT3JSaWdodCA/IChfY3VycmVudEluZGV4IDwgX3RyaWdnZXJJbmRleCA/IF9maXJzdCA6IF9jdXJyZW50SW5kZXggLSBfbnVtVCkgOiBfY3VycmVudEluZGV4ID4gX3RyaWdnZXJJbmRleCA/IF9maXJzdCA6IF9jdXJyZW50SW5kZXggLSAyICogX251bVQpO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBjYWxjdWxhdGVMYXN0ID0gKF9jdXJyZW50SW5kZXgsIF9maXJzdCwgX2xhc3QsIF9udW0sIF9udW1ULCBfaXNDb2xzID0gZmFsc2UpID0+IHtcbiAgICAgICAgICAgIGxldCBsYXN0VmFsdWUgPSBfZmlyc3QgKyBfbnVtICsgMiAqIF9udW1UO1xuXG4gICAgICAgICAgICBpZiAoX2N1cnJlbnRJbmRleCA+PSBfbnVtVCkge1xuICAgICAgICAgICAgICAgIGxhc3RWYWx1ZSArPSBfbnVtVCArIDE7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldExhc3QobGFzdFZhbHVlLCBfaXNDb2xzKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCBzY3JvbGxUb3AgPSBjYWxjdWxhdGVTY3JvbGxQb3ModGFyZ2V0LnNjcm9sbFRvcCwgY29udGVudFBvcy50b3ApO1xuICAgICAgICBjb25zdCBzY3JvbGxMZWZ0ID0gY2FsY3VsYXRlU2Nyb2xsUG9zKHRhcmdldC5zY3JvbGxMZWZ0LCBjb250ZW50UG9zLmxlZnQpO1xuXG4gICAgICAgIGxldCBuZXdGaXJzdCA9IHRoaXMuYm90aCA/IHsgcm93czogMCwgY29sczogMCB9IDogMDtcbiAgICAgICAgbGV0IG5ld0xhc3QgPSB0aGlzLmxhc3Q7XG4gICAgICAgIGxldCBpc1JhbmdlQ2hhbmdlZCA9IGZhbHNlO1xuICAgICAgICBsZXQgbmV3U2Nyb2xsUG9zID0gdGhpcy5sYXN0U2Nyb2xsUG9zO1xuXG4gICAgICAgIGlmICh0aGlzLmJvdGgpIHtcbiAgICAgICAgICAgIGNvbnN0IGlzU2Nyb2xsRG93biA9IHRoaXMubGFzdFNjcm9sbFBvcy50b3AgPD0gc2Nyb2xsVG9wO1xuICAgICAgICAgICAgY29uc3QgaXNTY3JvbGxSaWdodCA9IHRoaXMubGFzdFNjcm9sbFBvcy5sZWZ0IDw9IHNjcm9sbExlZnQ7XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5fYXBwZW5kT25seSB8fCAodGhpcy5fYXBwZW5kT25seSAmJiAoaXNTY3JvbGxEb3duIHx8IGlzU2Nyb2xsUmlnaHQpKSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IHsgcm93czogY2FsY3VsYXRlQ3VycmVudEluZGV4KHNjcm9sbFRvcCwgdGhpcy5faXRlbVNpemVbMF0pLCBjb2xzOiBjYWxjdWxhdGVDdXJyZW50SW5kZXgoc2Nyb2xsTGVmdCwgdGhpcy5faXRlbVNpemVbMV0pIH07XG4gICAgICAgICAgICAgICAgY29uc3QgdHJpZ2dlckluZGV4ID0ge1xuICAgICAgICAgICAgICAgICAgICByb3dzOiBjYWxjdWxhdGVUcmlnZ2VySW5kZXgoY3VycmVudEluZGV4LnJvd3MsIHRoaXMuZmlyc3Qucm93cywgdGhpcy5sYXN0LnJvd3MsIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0LnJvd3MsIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtc1swXSwgaXNTY3JvbGxEb3duKSxcbiAgICAgICAgICAgICAgICAgICAgY29sczogY2FsY3VsYXRlVHJpZ2dlckluZGV4KGN1cnJlbnRJbmRleC5jb2xzLCB0aGlzLmZpcnN0LmNvbHMsIHRoaXMubGFzdC5jb2xzLCB0aGlzLm51bUl0ZW1zSW5WaWV3cG9ydC5jb2xzLCB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXNbMV0sIGlzU2Nyb2xsUmlnaHQpXG4gICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgIG5ld0ZpcnN0ID0ge1xuICAgICAgICAgICAgICAgICAgICByb3dzOiBjYWxjdWxhdGVGaXJzdChjdXJyZW50SW5kZXgucm93cywgdHJpZ2dlckluZGV4LnJvd3MsIHRoaXMuZmlyc3Qucm93cywgdGhpcy5sYXN0LnJvd3MsIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0LnJvd3MsIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtc1swXSwgaXNTY3JvbGxEb3duKSxcbiAgICAgICAgICAgICAgICAgICAgY29sczogY2FsY3VsYXRlRmlyc3QoY3VycmVudEluZGV4LmNvbHMsIHRyaWdnZXJJbmRleC5jb2xzLCB0aGlzLmZpcnN0LmNvbHMsIHRoaXMubGFzdC5jb2xzLCB0aGlzLm51bUl0ZW1zSW5WaWV3cG9ydC5jb2xzLCB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXNbMV0sIGlzU2Nyb2xsUmlnaHQpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBuZXdMYXN0ID0ge1xuICAgICAgICAgICAgICAgICAgICByb3dzOiBjYWxjdWxhdGVMYXN0KGN1cnJlbnRJbmRleC5yb3dzLCBuZXdGaXJzdC5yb3dzLCB0aGlzLmxhc3Qucm93cywgdGhpcy5udW1JdGVtc0luVmlld3BvcnQucm93cywgdGhpcy5kX251bVRvbGVyYXRlZEl0ZW1zWzBdKSxcbiAgICAgICAgICAgICAgICAgICAgY29sczogY2FsY3VsYXRlTGFzdChjdXJyZW50SW5kZXguY29scywgbmV3Rmlyc3QuY29scywgdGhpcy5sYXN0LmNvbHMsIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0LmNvbHMsIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtc1sxXSwgdHJ1ZSlcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgaXNSYW5nZUNoYW5nZWQgPSBuZXdGaXJzdC5yb3dzICE9PSB0aGlzLmZpcnN0LnJvd3MgfHwgbmV3TGFzdC5yb3dzICE9PSB0aGlzLmxhc3Qucm93cyB8fCBuZXdGaXJzdC5jb2xzICE9PSB0aGlzLmZpcnN0LmNvbHMgfHwgbmV3TGFzdC5jb2xzICE9PSB0aGlzLmxhc3QuY29scyB8fCB0aGlzLmlzUmFuZ2VDaGFuZ2VkO1xuICAgICAgICAgICAgICAgIG5ld1Njcm9sbFBvcyA9IHsgdG9wOiBzY3JvbGxUb3AsIGxlZnQ6IHNjcm9sbExlZnQgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHNjcm9sbFBvcyA9IHRoaXMuaG9yaXpvbnRhbCA/IHNjcm9sbExlZnQgOiBzY3JvbGxUb3A7XG4gICAgICAgICAgICBjb25zdCBpc1Njcm9sbERvd25PclJpZ2h0ID0gdGhpcy5sYXN0U2Nyb2xsUG9zIDw9IHNjcm9sbFBvcztcblxuICAgICAgICAgICAgaWYgKCF0aGlzLl9hcHBlbmRPbmx5IHx8ICh0aGlzLl9hcHBlbmRPbmx5ICYmIGlzU2Nyb2xsRG93bk9yUmlnaHQpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY3VycmVudEluZGV4ID0gY2FsY3VsYXRlQ3VycmVudEluZGV4KHNjcm9sbFBvcywgdGhpcy5faXRlbVNpemUpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHRyaWdnZXJJbmRleCA9IGNhbGN1bGF0ZVRyaWdnZXJJbmRleChjdXJyZW50SW5kZXgsIHRoaXMuZmlyc3QsIHRoaXMubGFzdCwgdGhpcy5udW1JdGVtc0luVmlld3BvcnQsIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtcywgaXNTY3JvbGxEb3duT3JSaWdodCk7XG5cbiAgICAgICAgICAgICAgICBuZXdGaXJzdCA9IGNhbGN1bGF0ZUZpcnN0KGN1cnJlbnRJbmRleCwgdHJpZ2dlckluZGV4LCB0aGlzLmZpcnN0LCB0aGlzLmxhc3QsIHRoaXMubnVtSXRlbXNJblZpZXdwb3J0LCB0aGlzLmRfbnVtVG9sZXJhdGVkSXRlbXMsIGlzU2Nyb2xsRG93bk9yUmlnaHQpO1xuICAgICAgICAgICAgICAgIG5ld0xhc3QgPSBjYWxjdWxhdGVMYXN0KGN1cnJlbnRJbmRleCwgbmV3Rmlyc3QsIHRoaXMubGFzdCwgdGhpcy5udW1JdGVtc0luVmlld3BvcnQsIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtcyk7XG4gICAgICAgICAgICAgICAgaXNSYW5nZUNoYW5nZWQgPSBuZXdGaXJzdCAhPT0gdGhpcy5maXJzdCB8fCBuZXdMYXN0ICE9PSB0aGlzLmxhc3QgfHwgdGhpcy5pc1JhbmdlQ2hhbmdlZDtcbiAgICAgICAgICAgICAgICBuZXdTY3JvbGxQb3MgPSBzY3JvbGxQb3M7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZmlyc3Q6IG5ld0ZpcnN0LFxuICAgICAgICAgICAgbGFzdDogbmV3TGFzdCxcbiAgICAgICAgICAgIGlzUmFuZ2VDaGFuZ2VkLFxuICAgICAgICAgICAgc2Nyb2xsUG9zOiBuZXdTY3JvbGxQb3NcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBvblNjcm9sbENoYW5nZShldmVudCkge1xuICAgICAgICBjb25zdCB7IGZpcnN0LCBsYXN0LCBpc1JhbmdlQ2hhbmdlZCwgc2Nyb2xsUG9zIH0gPSB0aGlzLm9uU2Nyb2xsUG9zaXRpb25DaGFuZ2UoZXZlbnQpO1xuXG4gICAgICAgIGlmIChpc1JhbmdlQ2hhbmdlZCkge1xuICAgICAgICAgICAgY29uc3QgbmV3U3RhdGUgPSB7IGZpcnN0LCBsYXN0IH07XG5cbiAgICAgICAgICAgIHRoaXMuc2V0Q29udGVudFBvc2l0aW9uKG5ld1N0YXRlKTtcblxuICAgICAgICAgICAgdGhpcy5maXJzdCA9IGZpcnN0O1xuICAgICAgICAgICAgdGhpcy5sYXN0ID0gbGFzdDtcbiAgICAgICAgICAgIHRoaXMubGFzdFNjcm9sbFBvcyA9IHNjcm9sbFBvcztcblxuICAgICAgICAgICAgdGhpcy5oYW5kbGVFdmVudHMoJ29uU2Nyb2xsSW5kZXhDaGFuZ2UnLCBuZXdTdGF0ZSk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLl9sYXp5ICYmIHRoaXMuaXNQYWdlQ2hhbmdlZCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IGxhenlMb2FkU3RhdGUgPSB7XG4gICAgICAgICAgICAgICAgICAgIGZpcnN0OiB0aGlzLl9zdGVwID8gTWF0aC5taW4odGhpcy5nZXRQYWdlQnlGaXJzdCgpICogdGhpcy5fc3RlcCwgdGhpcy5pdGVtcy5sZW5ndGggLSB0aGlzLl9zdGVwKSA6IGZpcnN0LFxuICAgICAgICAgICAgICAgICAgICBsYXN0OiBNYXRoLm1pbih0aGlzLl9zdGVwID8gKHRoaXMuZ2V0UGFnZUJ5Rmlyc3QoKSArIDEpICogdGhpcy5fc3RlcCA6IGxhc3QsIHRoaXMuaXRlbXMubGVuZ3RoKVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgY29uc3QgaXNMYXp5U3RhdGVDaGFuZ2VkID0gdGhpcy5sYXp5TG9hZFN0YXRlLmZpcnN0ICE9PSBsYXp5TG9hZFN0YXRlLmZpcnN0IHx8IHRoaXMubGF6eUxvYWRTdGF0ZS5sYXN0ICE9PSBsYXp5TG9hZFN0YXRlLmxhc3Q7XG5cbiAgICAgICAgICAgICAgICBpc0xhenlTdGF0ZUNoYW5nZWQgJiYgdGhpcy5oYW5kbGVFdmVudHMoJ29uTGF6eUxvYWQnLCBsYXp5TG9hZFN0YXRlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhenlMb2FkU3RhdGUgPSBsYXp5TG9hZFN0YXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgb25Db250YWluZXJTY3JvbGwoZXZlbnQpIHtcbiAgICAgICAgdGhpcy5oYW5kbGVFdmVudHMoJ29uU2Nyb2xsJywgeyBvcmlnaW5hbEV2ZW50OiBldmVudCB9KTtcblxuICAgICAgICBpZiAodGhpcy5fZGVsYXkgJiYgdGhpcy5pc1BhZ2VDaGFuZ2VkKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5zY3JvbGxUaW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMuc2Nyb2xsVGltZW91dCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghdGhpcy5kX2xvYWRpbmcgJiYgdGhpcy5zaG93TG9hZGVyKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgeyBpc1JhbmdlQ2hhbmdlZCB9ID0gdGhpcy5vblNjcm9sbFBvc2l0aW9uQ2hhbmdlKGV2ZW50KTtcbiAgICAgICAgICAgICAgICBjb25zdCBjaGFuZ2VkID0gaXNSYW5nZUNoYW5nZWQgfHwgKHRoaXMuX3N0ZXAgPyB0aGlzLmlzUGFnZUNoYW5nZWQgOiBmYWxzZSk7XG5cbiAgICAgICAgICAgICAgICBpZiAoY2hhbmdlZCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRfbG9hZGluZyA9IHRydWU7XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2Nyb2xsQ2hhbmdlKGV2ZW50KTtcblxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRfbG9hZGluZyAmJiB0aGlzLnNob3dMb2FkZXIgJiYgKCF0aGlzLl9sYXp5IHx8IHRoaXMuX2xvYWRpbmcgPT09IHVuZGVmaW5lZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kX2xvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlID0gdGhpcy5nZXRQYWdlQnlGaXJzdCgpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNkLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCB0aGlzLl9kZWxheSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAhdGhpcy5kX2xvYWRpbmcgJiYgdGhpcy5vblNjcm9sbENoYW5nZShldmVudCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBiaW5kUmVzaXplTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICghdGhpcy53aW5kb3dSZXNpemVMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy56b25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLndpbmRvd1Jlc2l6ZUxpc3RlbmVyID0gdGhpcy5vbldpbmRvd1Jlc2l6ZS5iaW5kKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMud2luZG93UmVzaXplTGlzdGVuZXIpO1xuICAgICAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIHRoaXMud2luZG93UmVzaXplTGlzdGVuZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1bmJpbmRSZXNpemVMaXN0ZW5lcigpIHtcbiAgICAgICAgaWYgKHRoaXMud2luZG93UmVzaXplTGlzdGVuZXIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLndpbmRvd1Jlc2l6ZUxpc3RlbmVyKTtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdvcmllbnRhdGlvbmNoYW5nZScsIHRoaXMud2luZG93UmVzaXplTGlzdGVuZXIpO1xuICAgICAgICAgICAgdGhpcy53aW5kb3dSZXNpemVMaXN0ZW5lciA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBvbldpbmRvd1Jlc2l6ZSgpIHtcbiAgICAgICAgaWYgKHRoaXMucmVzaXplVGltZW91dCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMucmVzaXplVGltZW91dCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlc2l6ZVRpbWVvdXQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgIGlmIChEb21IYW5kbGVyLmlzVmlzaWJsZSh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQ/Lm5hdGl2ZUVsZW1lbnQpKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgW3dpZHRoLCBoZWlnaHRdID0gW0RvbUhhbmRsZXIuZ2V0V2lkdGgodGhpcy5lbGVtZW50Vmlld0NoaWxkLm5hdGl2ZUVsZW1lbnQpLCBEb21IYW5kbGVyLmdldEhlaWdodCh0aGlzLmVsZW1lbnRWaWV3Q2hpbGQubmF0aXZlRWxlbWVudCldO1xuICAgICAgICAgICAgICAgIGNvbnN0IFtpc0RpZmZXaWR0aCwgaXNEaWZmSGVpZ2h0XSA9IFt3aWR0aCAhPT0gdGhpcy5kZWZhdWx0V2lkdGgsIGhlaWdodCAhPT0gdGhpcy5kZWZhdWx0SGVpZ2h0XTtcbiAgICAgICAgICAgICAgICBjb25zdCByZWluaXQgPSB0aGlzLmJvdGggPyBpc0RpZmZXaWR0aCB8fCBpc0RpZmZIZWlnaHQgOiB0aGlzLmhvcml6b250YWwgPyBpc0RpZmZXaWR0aCA6IHRoaXMudmVydGljYWwgPyBpc0RpZmZIZWlnaHQgOiBmYWxzZTtcblxuICAgICAgICAgICAgICAgIHJlaW5pdCAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZF9udW1Ub2xlcmF0ZWRJdGVtcyA9IHRoaXMuX251bVRvbGVyYXRlZEl0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0V2lkdGggPSB3aWR0aDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdEhlaWdodCA9IGhlaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGVmYXVsdENvbnRlbnRXaWR0aCA9IERvbUhhbmRsZXIuZ2V0V2lkdGgodGhpcy5jb250ZW50RWwpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kZWZhdWx0Q29udGVudEhlaWdodCA9IERvbUhhbmRsZXIuZ2V0SGVpZ2h0KHRoaXMuY29udGVudEVsKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5pbml0KCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0aGlzLl9yZXNpemVEZWxheSk7XG4gICAgfVxuXG4gICAgaGFuZGxlRXZlbnRzKG5hbWUsIHBhcmFtcykge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9uc1tuYW1lXSA/IHRoaXMub3B0aW9uc1tuYW1lXShwYXJhbXMpIDogdGhpc1tuYW1lXS5lbWl0KHBhcmFtcyk7XG4gICAgfVxuXG4gICAgZ2V0Q29udGVudE9wdGlvbnMoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBjb250ZW50U3R5bGVDbGFzczogYHAtc2Nyb2xsZXItY29udGVudCAke3RoaXMuZF9sb2FkaW5nID8gJ3Atc2Nyb2xsZXItbG9hZGluZycgOiAnJ31gLFxuICAgICAgICAgICAgaXRlbXM6IHRoaXMubG9hZGVkSXRlbXMsXG4gICAgICAgICAgICBnZXRJdGVtT3B0aW9uczogKGluZGV4KSA9PiB0aGlzLmdldE9wdGlvbnMoaW5kZXgpLFxuICAgICAgICAgICAgbG9hZGluZzogdGhpcy5kX2xvYWRpbmcsXG4gICAgICAgICAgICBnZXRMb2FkZXJPcHRpb25zOiAoaW5kZXgsIG9wdGlvbnM/KSA9PiB0aGlzLmdldExvYWRlck9wdGlvbnMoaW5kZXgsIG9wdGlvbnMpLFxuICAgICAgICAgICAgaXRlbVNpemU6IHRoaXMuX2l0ZW1TaXplLFxuICAgICAgICAgICAgcm93czogdGhpcy5sb2FkZWRSb3dzLFxuICAgICAgICAgICAgY29sdW1uczogdGhpcy5sb2FkZWRDb2x1bW5zLFxuICAgICAgICAgICAgc3BhY2VyU3R5bGU6IHRoaXMuc3BhY2VyU3R5bGUsXG4gICAgICAgICAgICBjb250ZW50U3R5bGU6IHRoaXMuY29udGVudFN0eWxlLFxuICAgICAgICAgICAgdmVydGljYWw6IHRoaXMudmVydGljYWwsXG4gICAgICAgICAgICBob3Jpem9udGFsOiB0aGlzLmhvcml6b250YWwsXG4gICAgICAgICAgICBib3RoOiB0aGlzLmJvdGhcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXRPcHRpb25zKHJlbmRlcmVkSW5kZXgpIHtcbiAgICAgICAgY29uc3QgY291bnQgPSAodGhpcy5faXRlbXMgfHwgW10pLmxlbmd0aDtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmJvdGggPyB0aGlzLmZpcnN0LnJvd3MgKyByZW5kZXJlZEluZGV4IDogdGhpcy5maXJzdCArIHJlbmRlcmVkSW5kZXg7XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGluZGV4LFxuICAgICAgICAgICAgY291bnQsXG4gICAgICAgICAgICBmaXJzdDogaW5kZXggPT09IDAsXG4gICAgICAgICAgICBsYXN0OiBpbmRleCA9PT0gY291bnQgLSAxLFxuICAgICAgICAgICAgZXZlbjogaW5kZXggJSAyID09PSAwLFxuICAgICAgICAgICAgb2RkOiBpbmRleCAlIDIgIT09IDBcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBnZXRMb2FkZXJPcHRpb25zKGluZGV4LCBleHRPcHRpb25zKSB7XG4gICAgICAgIGNvbnN0IGNvdW50ID0gdGhpcy5sb2FkZXJBcnIubGVuZ3RoO1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpbmRleCxcbiAgICAgICAgICAgIGNvdW50LFxuICAgICAgICAgICAgZmlyc3Q6IGluZGV4ID09PSAwLFxuICAgICAgICAgICAgbGFzdDogaW5kZXggPT09IGNvdW50IC0gMSxcbiAgICAgICAgICAgIGV2ZW46IGluZGV4ICUgMiA9PT0gMCxcbiAgICAgICAgICAgIG9kZDogaW5kZXggJSAyICE9PSAwLFxuICAgICAgICAgICAgLi4uZXh0T3B0aW9uc1xuICAgICAgICB9O1xuICAgIH1cbn1cblxuQE5nTW9kdWxlKHtcbiAgICBpbXBvcnRzOiBbQ29tbW9uTW9kdWxlXSxcbiAgICBleHBvcnRzOiBbU2Nyb2xsZXJdLFxuICAgIGRlY2xhcmF0aW9uczogW1Njcm9sbGVyXVxufSlcbmV4cG9ydCBjbGFzcyBTY3JvbGxlck1vZHVsZSB7fVxuIl19