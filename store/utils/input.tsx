import {
  Address,
  InputDatePicker,
  Select,
  TextArea,
  TextInput,
  Toggle,
} from "blixify-ui-web/lib";

export interface ChangeParam {
  state: any;
  hook: any;
  exclude?: string[];
}

export interface DataInputComponent {
  id: string;
  type:
    | "textInput"
    | "emailInput"
    | "passwordInput"
    | "numberInput"
    | "phoneInput"
    | "textArea"
    | "selectInput"
    | "multiSelectInput"
    | "addressInput"
    | "imageInput"
    | "fileInput"
    | "dateInput"
    | "toggleInput"
    | "others";
  selectType?: "default" | "button" | "icon";
  assetPreview?: { collectionId: string; objectId: string };
  otherType?: string;
  label: string;
  subLabel?: string;
  extraLabel?: string;
  direction?: "left" | "right";
  class?: string;
  placeholder?: string;
  options?: any[];
  optional?: boolean;
  disabled?: boolean;
  minDate?: boolean;
  onChange?: (e: any, index?: number) => void;
  onSearch?: (searchText: string) => void;
  render?: (item: any, index: number, ref?: any) => any;
}

export const handleCloneDataInput = ({
  state,
  exclude,
}: {
  state: any;
  exclude?: string[];
}) => {
  const dataInputDetail = JSON.parse(JSON.stringify(state));
  if (exclude && exclude.length > 0) {
    exclude.map((eachExclude) => {
      const eachExcludeClass = eachExclude.split(".");
      if (eachExcludeClass.length === 1) {
        dataInputDetail[eachExclude] = state[eachExclude as any];
      } else if (eachExcludeClass.length === 2) {
        dataInputDetail[eachExcludeClass[0]][eachExcludeClass[1]] =
          state[eachExcludeClass[0]][eachExcludeClass[1] as any];
      }
    });
  }

  return dataInputDetail;
};

export const handleUploadChangeImage = (e: any, oriState: ChangeParam) => {
  const dummyInput = handleCloneDataInput(oriState);
  const inputId = e.target.id;
  const itemId = inputId.split(".");
  if (e.target.files.length > 0) {
    const selectedFile = e.target.files[0];
    if (itemId.length === 1) dummyInput[inputId] = selectedFile;
    else if (itemId.length === 2)
      dummyInput[itemId[0]][itemId[1]] = selectedFile;
  } else {
    if (itemId.length === 1) dummyInput[inputId] = "";
    else if (itemId.length === 2) dummyInput[itemId[0]][itemId[1]] = "";
  }
  oriState.hook(dummyInput);
};

export const handleChangeInput = (e: any, oriState: ChangeParam) => {
  const dummyInput = handleCloneDataInput(oriState);
  const valueText = e.target.value;
  const inputId = e.target.id;
  const itemId = inputId.split(".");
  if (itemId.length === 1) {
    dummyInput[inputId] = valueText;
  } else if (itemId.length === 2) {
    dummyInput[itemId[0]][itemId[1]] = valueText;
  } else if (itemId.length === 3) {
    dummyInput[itemId[0]][itemId[1]][itemId[2]] = valueText;
  }

  oriState.hook(dummyInput);
};

export const renderModalInput = (
  item: DataInputComponent,
  ref: any,
  index: number,
  oriState: ChangeParam
) => {
  const label = item.label + (!item.optional ? "" : " (Optional)");
  const itemId = item.id.split(".");
  const dummyValue = handleCloneDataInput(oriState);

  let value: any;

  if (itemId.length === 1) {
    value = dummyValue[itemId[0]] ?? "";
  } else if (itemId.length === 2) {
    value = dummyValue[itemId[0]][itemId[1]];
  } else if (itemId.length === 3) {
    value = dummyValue[itemId[0]][itemId[1]][itemId[2]];
  }

  switch (item.type) {
    case "textInput":
    case "emailInput":
    case "passwordInput":
    case "numberInput":
    case "phoneInput":
      let itemType = "text";
      if (item.type === "numberInput") {
        itemType = "number";
      } else if (item.type === "phoneInput") {
        itemType = "mobile";
      } else if (item.type === "passwordInput") {
        itemType = "password";
      } else if (item.type === "emailInput") {
        itemType = "email";
      }

      return (
        <TextInput
          id={item.id}
          ref={item.optional ? {} : ref}
          key={index}
          value={value}
          label={label}
          subLabel={item.subLabel}
          containerClassName={item.class}
          type={itemType}
          placeholder={item.placeholder ?? ""}
          onChange={(e) => {
            handleChangeInput(e, oriState);
            if (item.onChange) {
              item.onChange(e, index);
            }
          }}
          disabled={item.disabled ?? false}
        />
      );
    case "textArea":
      return (
        <TextArea
          id={item.id}
          ref={item.optional ? {} : ref}
          key={index}
          value={value}
          label={label}
          containerClassName={item.class}
          placeholder={item.placeholder ?? ""}
          rows={4}
          onChange={(e) => {
            handleChangeInput(e, oriState);
            if (item.onChange) {
              item.onChange(e, index);
            }
          }}
          disabled={item.disabled ?? false}
        />
      );
    case "selectInput":
    case "multiSelectInput":
      const selectValue =
        value === "" || !value
          ? item.type === "multiSelectInput"
            ? []
            : ""
          : value;

      return (
        <Select
          id={item.id}
          ref={item.optional ? {} : ref}
          type={item.selectType ?? "default"}
          value={selectValue}
          label={label}
          containerClassName={item.class}
          options={item.options ?? []}
          disabled={item.disabled ?? false}
          onChange={(value: any) => {
            const e = {
              target: {
                id: item.id,
                value: value,
              },
            };
            handleChangeInput(e, oriState);
            if (item.onChange) {
              item.onChange(e, index);
            }
          }}
          onSearch={item.onSearch}
        />
      );
    case "addressInput":
      return (
        <Address
          id={item.id}
          ref={item.optional ? {} : ref}
          value={value ?? { lat: 0, lng: 0, name: "" }}
          label={label}
          className={item.class}
          onChange={(value: any) => {
            const e = {
              target: {
                id: item.id,
                value: value,
              },
            };
            handleChangeInput(e, oriState);
            if (item.onChange) {
              item.onChange(e, index);
            }
          }}
        />
      );

    case "dateInput":
      return (
        <InputDatePicker
          id={item.id}
          title={item.label}
          value={typeof value === "string" ? new Date(value) : value}
          disabled={item.disabled ?? false}
          ref={item.optional ? {} : ref}
          minDate={item.minDate ? new Date() : undefined}
          className={item.class}
          onChange={(id: string, value: Date | undefined) => {
            const e = {
              target: {
                id: id,
                value: value,
              },
            };
            handleChangeInput(e, oriState);
            if (item.onChange) {
              item.onChange(e, index);
            }
          }}
        />
      );
    case "toggleInput":
      return (
        <Toggle
          direction={item.direction ?? "left"}
          text={item.label}
          value={Boolean(value) ?? false}
          onClick={() => {
            const e = {
              target: {
                id: item.id,
                value: !Boolean(oriState.state[item.id]),
              },
            };
            handleChangeInput(e, oriState);
            if (item.onChange) {
              item.onChange(e, index);
            }
          }}
        />
      );
    default:
      return <>{item.render && item.render(item, index, ref)}</>;
  }
};
