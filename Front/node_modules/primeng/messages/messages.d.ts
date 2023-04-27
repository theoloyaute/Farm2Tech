import { OnDestroy, EventEmitter, AfterContentInit, ElementRef, QueryList, TemplateRef, ChangeDetectorRef } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/ripple";
import * as i3 from "primeng/icons/check";
import * as i4 from "primeng/icons/infocircle";
import * as i5 from "primeng/icons/timescircle";
import * as i6 from "primeng/icons/exclamationtriangle";
import * as i7 from "primeng/icons/times";
export declare class Messages implements AfterContentInit, OnDestroy {
    messageService: MessageService;
    el: ElementRef;
    cd: ChangeDetectorRef;
    set value(messages: Message[]);
    closable: boolean;
    style: any;
    styleClass: string;
    enableService: boolean;
    key: string;
    escape: boolean;
    severity: string;
    showTransitionOptions: string;
    hideTransitionOptions: string;
    templates: QueryList<any>;
    valueChange: EventEmitter<Message[]>;
    messages: Message[];
    messageSubscription: Subscription;
    clearSubscription: Subscription;
    timerSubscriptions: Subscription[];
    contentTemplate: TemplateRef<any>;
    constructor(messageService: MessageService, el: ElementRef, cd: ChangeDetectorRef);
    ngAfterContentInit(): void;
    hasMessages(): boolean;
    clear(): void;
    removeMessage(i: number): void;
    get icon(): string;
    ngOnDestroy(): void;
    private startMessageLifes;
    private startMessageLife;
    static ɵfac: i0.ɵɵFactoryDeclaration<Messages, [{ optional: true; }, null, null]>;
    static ɵcmp: i0.ɵɵComponentDeclaration<Messages, "p-messages", never, { "value": "value"; "closable": "closable"; "style": "style"; "styleClass": "styleClass"; "enableService": "enableService"; "key": "key"; "escape": "escape"; "severity": "severity"; "showTransitionOptions": "showTransitionOptions"; "hideTransitionOptions": "hideTransitionOptions"; }, { "valueChange": "valueChange"; }, ["templates"], never, false, never>;
}
export declare class MessagesModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MessagesModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MessagesModule, [typeof Messages], [typeof i1.CommonModule, typeof i2.RippleModule, typeof i3.CheckIcon, typeof i4.InfoCircleIcon, typeof i5.TimesCircleIcon, typeof i6.ExclamationTriangleIcon, typeof i7.TimesIcon], [typeof Messages]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MessagesModule>;
}
