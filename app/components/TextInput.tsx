interface Props {
  value: string;
  label: string;
  labelClassName?: string;
  containerClassName?: string;
  inputClassName?: string;
  placeholder?: string;
  onChange?: (e: any) => void;
}

export default function CustomTextInput(props: Props) {
  return (
    <div className={`flex flex-col space-y-1 ${props.containerClassName}`}>
      <label className={props.labelClassName}>{props.label}</label>
      <input
        type="text"
        className={props.inputClassName}
        placeholder={props.placeholder ? props.placeholder : "Your text here"}
        value={props.value}
        onChange={props.onChange}
      />
    </div>
  );
}
