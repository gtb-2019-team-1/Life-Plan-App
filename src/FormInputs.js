import React from "react"
const FormInputs = (props) => {
return (
  props.form_data.map((val, idx)=> {
    let name = `name-${idx}`, price = `price-${idx}`, deposit = `deposit-${idx}`
    return (
      <div key={idx}>
        <label htmlFor={name}>Name</label>
        <input type="text" name={name} data-id={idx} id={name} value={props.form_data[idx].name} className="name" />
        <label htmlFor={price}>Price</label>
        <input type="text" name={price} data-id={idx} id={price} value={props.form_data[idx].price} className="price" />
        <label htmlFor={deposit}>Deposit</label>
        <input type="text" name={deposit} data-id={idx} id={deposit} value={props.form_data[idx].deposit} className="deposit" />
      </div>
       )
     })
    )
}
export default FormInputs
