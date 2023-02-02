import clsx from 'clsx';
import { UseFormRegisterReturn } from 'react-hook-form';

import { FieldWrapper, FieldWrapperPassThroughProps } from './FieldWrapper';

type CheckboxFieldProps = FieldWrapperPassThroughProps & {
    type?: 'checkbox';
    className?: string;
    registration?: Partial<UseFormRegisterReturn>;
};

export const CheckboxField = (props: CheckboxFieldProps) => {
    const { type = 'text', label, className, registration, error} = props;
    return (
        <FieldWrapper label={label} error={error}>
            <input
                type={type}
                className={className}
                {...registration}
            />
        </FieldWrapper>
    );
};
