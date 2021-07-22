import React, {Component} from "react";
import FieldContext from "./FieldContext";

export interface IRules {
  required?: boolean
  pattern?: RegExp
  message?: string
}

interface IProps {
  name: string;
  label: string;
  trim?: boolean;
  message?: string;
  rules?: Array<IRules>;
  defaultValue?: any;
}

export default class Field extends Component<IProps> {

  private cancelRegister: any;
  static contextType = FieldContext;

  public constructor(props: IProps) {
    super(props);
  }
  // 绑定数据到子组件
  getControlled = () => {
    const {getFieldValue, setFieldsValue, validate, getError } = this.context
    const {name, trim, message} = this.props
    return {
      value: getFieldValue(name) || '',
      message: getError(name) || message,
      onChange: (event: React.ChangeEvent<HTMLInputElement>) => {
        let newVal = event.target?.value
        if (trim) {
          newVal = newVal?.replace(/\s/gi, '');
        }
        setFieldsValue({[name]: newVal})
      },
      onBlur: () => {
        validate([name])
        this.onStoreChange()
      }
    }
  }

  onStoreChange = () => {
    this.forceUpdate()
  }

  initialFormStore = () => {
    this.context.setFieldsValue({[this.props.name]: this.props.defaultValue || ""})
  }

  componentDidMount() {
    this.cancelRegister = this.context.registerField(this);
    this.initialFormStore()
  }

  componentWillUnmount() {
    if (this.cancelRegister) {
      this.cancelRegister()
    }
  }

  render() {
    const {children} = this.props;
    return React.cloneElement(children as any, this.getControlled());
  }
}