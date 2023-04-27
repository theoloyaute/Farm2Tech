import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "primeng/icons/check";
import * as i3 from "primeng/icons/infocircle";
import * as i4 from "primeng/icons/timescircle";
import * as i5 from "primeng/icons/exclamationtriangle";
export declare class UIMessage {
    severity: string;
    text: string;
    escape: boolean;
    style: any;
    styleClass: string;
    get icon(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<UIMessage, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UIMessage, "p-message", never, { "severity": "severity"; "text": "text"; "escape": "escape"; "style": "style"; "styleClass": "styleClass"; }, {}, never, never, false, never>;
}
export declare class MessageModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MessageModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MessageModule, [typeof UIMessage], [typeof i1.CommonModule, typeof i2.CheckIcon, typeof i3.InfoCircleIcon, typeof i4.TimesCircleIcon, typeof i5.ExclamationTriangleIcon], [typeof UIMessage]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MessageModule>;
}
