/// <reference types="react" />
import type { MdxTemplate } from '../../../types';
import type { Form } from '../../../../../../../forms';
export declare function Toolbar({ templates, tinaForm, }: {
    tinaForm: Form;
    inlineOnly: boolean;
    templates: MdxTemplate[];
}): JSX.Element;
export declare const FloatingToolbar: ({ templates, tinaForm, }: {
    tinaForm: Form;
    templates: MdxTemplate[];
}) => JSX.Element;
export declare const FloatingLink: () => JSX.Element;
