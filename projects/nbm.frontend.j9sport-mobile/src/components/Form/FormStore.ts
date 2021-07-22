export default class FormStore {

  private store: any;
  private fieldInstance: any[];
  private callbacks: any;

  constructor() {
    this.store = {};
    this.fieldInstance = [];
  }

  private updateFieldValue = (store: any) => {
    this.fieldInstance.forEach(instance => {
      const {name} = instance.props;
      Object.keys(store).forEach(key => {
        if (key === name) {
          instance.onStoreChange();
        }
      })
    })
  }

  clear = () => {
    for (let fieldName in this.store) {
     this.store[fieldName] = ''
    }
  }

  getFieldValue = (name: string) => {
    return this.store[name];
  }

  setFieldsValue = (newStore: any) => {
    this.store = {
      ...this.store,
      ...newStore
    };
    this.updateFieldValue(newStore)
    this.callbacks.onChange(this.store)
  }

  getError = (name: string) => {
    return this.store["error"] && this.store["error"][name]
  }

  getFieldsValue = () => {
    return this.store;
  }

  registerField = (field: any) => {
    this.fieldInstance.push(field);
    return () => {
      this.fieldInstance = this.fieldInstance.filter(i => i !== field);
      delete  this.store[field.props.name];
    }
  }

  setCallback = (callback: Function) => {
    this.callbacks = {
      ...this.callbacks,
      ...callback
    }
  }

  validate = (nameList?: string[]) => {
    let err = {} as any;
    this.fieldInstance.forEach(instance => {
      const {name, rules, label} = instance.props;
      let value = this.store[name];
      let rule = rules && rules[0];
      if (!rule || (nameList && nameList.length > 0 && !nameList.includes(name))) {
        return ;
      }
      if (rule.required && (value === undefined || value === "" || value === null)) {
        err = {
          ...err,
          [name]: `${label}不能为空`,
        }
        return ;
      }
      if (rule.pattern && !rule.pattern.test(value)){
        err = {
          ...err,
          [name]: rule.message,
        }
      }
    });
    this.store["error"] = {...err}
    this.updateFieldValue(err)

    return err;
  };

  submit = () => {
    let err = this.validate();

    if (Object.keys(err).length === 0) {
      this.callbacks.onFinish(this.store);
    }else if (Object.keys(err).length > 0) {
      this.updateFieldValue(err)
      this.callbacks.onFinishFailed(err)
    }
  }

  getForm = () => {
    return {
      setCallback: this.setCallback,
      submit: this.submit,
      validate: this.validate,
      getError: this.getError,
      registerField: this.registerField,
      getFieldValue: this.getFieldValue,
      getFieldsValue: this.getFieldsValue,
      setFieldsValue: this.setFieldsValue,
      clear: this.clear
    }
  }
}
