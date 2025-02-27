import * as React from "react";
import ResetIcon from "../svgIcons/resetIcon";

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectOptionComponentProps {
    id: string;
    onChange: (value: string) => void;
    value: string;
    label?: string;
    options: SelectOption[];
    style?: React.CSSProperties;
    className?: string;
    showResetButton?: boolean;
    onReset?: () => void;
}

export const SelectOptionComponent = (props: SelectOptionComponentProps) => {
    return (
        <div className={`sb-optionContainer ${props.className ?? ""}`} style={props.style}>
            {
                props.label &&
                    <label className="sb-optionLabel" htmlFor={props.id}>{props.label}</label>
            }
            <select id={props.id}
                className="sb-selector-element sb-optionsSelector"
                value={props.value}
                onChange={(e) => {
                    props.onChange(e.target.value);
                }}>
                {getOptions(props.options)}
            </select>

            {
                props.showResetButton &&
                <div className="reset-button" onClick={() => {
                    props.onReset?.();
                }}>
                    <ResetIcon/>
                </div>
            }
        </div>
    );
};

function getOptions(options: SelectOption[]): React.ReactNode[] {
    return options.map((option) => {
        return (
            <option value={option.value} key={option.value}>{option.label}</option>
        );
    });
}