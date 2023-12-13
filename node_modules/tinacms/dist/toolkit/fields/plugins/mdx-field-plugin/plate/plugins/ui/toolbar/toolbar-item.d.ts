/// <reference types="react" />
import type { PlateEditor } from '@udecode/plate-headless';
import type { MdxTemplate } from '../../../types';
import { Form } from '../../../../../../../forms';
export declare type ToolbarItemType = {
    label: string;
    name: string;
    inlineOnly?: boolean;
    hidden?: boolean;
    active?: boolean;
    onMouseDown?: (event: any) => void;
    icon?: string;
    options?: {}[];
    isLastItem?: boolean;
    tinaForm: Form;
};
export declare const ToolbarItem: ({ hidden, label, active, onMouseDown, icon, options, name, isLastItem, tinaForm, }: ToolbarItemType) => JSX.Element;
export declare const EmbedButton: ({ editor, templates, }: {
    editor: PlateEditor;
    templates: MdxTemplate[];
}) => JSX.Element;
