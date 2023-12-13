/// <reference types="react" />
import { InputProps } from '../components';
interface ExtraProps {
    placeholder: string;
    confirmPlaceholder: string;
    disabled?: boolean;
}
export declare const PasswordFieldComponent: (props: import("./field-props").FieldProps<InputProps & ExtraProps>) => JSX.Element;
export declare const PasswordFieldPlugin: {
    name: string;
    Component: (props: import("./field-props").FieldProps<InputProps & ExtraProps>) => JSX.Element;
    validate(value: any, values: any, meta: any, field: any): string;
    parse: (value?: string) => string;
};
export {};
